import request from 'request';
import * as db from '../mongo/MongoInterface';

let urls;
let apiKey;
let bearerToken;

export const tvdbInit = (tvdbUrls, tvdbApiKey) => {
  urls = tvdbUrls;
  apiKey = tvdbApiKey;
};

const checkBearerToken = () => new Promise((resolve, reject) => {
  if (typeof bearerToken !== 'undefined') {
    resolve(bearerToken);
  } else {
    request.post(
      urls.login,
      {
        json: {
          apikey: apiKey,
        },
      },
      (err, tvdbRes, body) => {
        if (err) {
          reject(err);
        } else {
          bearerToken = body.token;
          resolve(bearerToken);
        }
      },
    );
  }
});

// SHOWS

export const findShows = showName => new Promise((resolve, reject) => {
  checkBearerToken()
    .then(() => {
      request.get(
        urls.search,
        {
          qs: {
            name: showName,
          },
          auth: {
            bearer: bearerToken,
          },
        },
        (err, tvdbRes) => {
          try {
            if (err) {
              reject(err);
            } else {
              const results = JSON.parse(tvdbRes.body).data;
              if (typeof results === 'undefined') {
                resolve(tvdbRes);
              } else {
                resolve(
                  results
                    .filter(result => !result.seriesName.includes('403:'))
                    .map(result => ({ id: result.id, name: result.seriesName })),
                );
              }
            }
          } catch (unknownErr) {
            reject(unknownErr);
          }
        },
      );
    })
    .catch((err) => {
      reject(err);
    });
});

// EPISODES

const getEpisodesForShowByPage = (show, page) => new Promise((resolve, reject) => {
  request.get(
    `${urls.series}/${show.id}/episodes?page=${page}`,
    {
      auth: {
        bearer: bearerToken,
      },
    },
    (err, tvdbRes) => {
      try {
        if (err) {
          reject(err);
        } else {
          const returnedEpisodes = JSON.parse(tvdbRes.body).data;
          const results = [];
          if (typeof returnedEpisodes !== 'undefined') {
            for (const episode of returnedEpisodes) {
              if (episode.airedSeason !== 0) {
                results.push({
                  showId: show.id,
                  showName: show.name,
                  key: show.id + episode.id,
                  episodeName: episode.episodeName,
                  shortName: `S${`0${episode.airedSeason}`.slice(
                    -2,
                  )}E${`0${episode.airedEpisodeNumber}`.slice(-2)}`,
                  airedEpisodeNumber: episode.airedEpisodeNumber,
                  firstAired: episode.firstAired,
                });
              }
            }
          }
          resolve(results);
        }
      } catch (unknownErr) {
        reject(Error(`Unknown error : ${unknownErr}`));
      }
    },
  );
});

const getEpisodesForShow = show => new Promise(async (resolve, reject) => {
  let done = false;
  let page = 1;
  const allEpisodes = [];
  do {
    try {
      // eslint-disable-next-line no-await-in-loop
      const episodesForThisShow = await getEpisodesForShowByPage(show, page, bearerToken);
      if (episodesForThisShow.length === 0) {
        done = true;
      } else {
        allEpisodes.push(...episodesForThisShow);
        if (episodesForThisShow.length < 50) {
          done = true;
        } else {
          page += 1;
        }
      }
    } catch (err) {
      reject(err);
    }
  } while (!done);
  resolve(allEpisodes);
});

export const getEpisodes = shows => new Promise((resolve, reject) => {
  checkBearerToken()
    .then(() => {
      const episodesForShows = [];

      for (const show of shows) {
        episodesForShows.push(getEpisodesForShow(show, bearerToken));
      }

      Promise.all(episodesForShows)
        .then((returnedEpisodes) => {
          const episodes = [];
          for (const episodesForShow of returnedEpisodes) {
            episodes.push(...episodesForShow);
          }
          resolve(episodes);
        })
        .catch((err) => {
          reject(err);
        });
    })
    .catch((unknownErr) => {
      reject(unknownErr);
    });
});

// BANNER

export const getBannerUrl = showId => new Promise((resolve, reject) => {
  db.getBannerUrl(showId)
    .then((res) => {
      if (res != null && typeof res.bannerUrl !== 'undefined') {
        resolve(res.bannerUrl);
      } else {
        request.get(
          `${urls.series}/${showId}`,
          {
            auth: {
              bearer: bearerToken,
            },
          },
          (tvdbErr, tvdbRes) => {
            if (tvdbErr) {
              reject(tvdbErr);
            } else {
              const bannerUrl = JSON.parse(tvdbRes.body).data.banner;
              if (bannerUrl === '') {
                reject(new Error(`No banner found for show ID ${showId}`));
              } else {
                db.addBannerUrl(showId, bannerUrl)
                  .then(() => resolve(bannerUrl))
                  .catch(err => reject(err));
              }
            }
          },
        );
      }
    })
    .catch(err => reject(err));
});
