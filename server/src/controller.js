import fileSystem from 'fs';
import request from 'request';
import Show from './model/show';
import BannerUrl from './model/bannerUrl';
import log from './Logger';

const tvdbUrls = JSON.parse(fileSystem.readFileSync('./tvdbroutes.json'));

// adding CORS global exceptiion because stupid Chrome doesn't allow localhost exceptions
const addCorsException = (res, req) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', req.method);
  res.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');
  res.set('Access-Control-Allow-Credentials', true);
};

const dbId = (userId, showId) => `${userId}_${showId}`;

// MONGO routes

export const addShow = (req, res) => {
  addCorsException(res, req);

  new Show({
    dbId: dbId(req.query.userId, req.query.showId),
    userId: req.query.userId,
    id: req.query.showId,
    name: req.query.showName,
  }).save((err, show) => {
    if (err) {
      log(err);
      res.send(err.message);
    } else {
      res.json(show);
    }
  });
};

export const removeShow = (req, res) => {
  addCorsException(res, req);

  Show.deleteOne(
    {
      dbId: dbId(req.query.userId, req.query.showId),
    },
    (err) => {
      if (err) {
        log(err);
        res.send(err);
      } else {
        res.json(req.query.showId);
      }
    },
  );
};

export const shows = (req, res) => {
  addCorsException(res, req);

  Show.find({ userId: req.query.userId }, (err, showList) => {
    if (err) {
      log(err);
      res.send(err.message);
    } else {
      res.json(showList);
    }
  });
};

// TVDB routes

const getBearerToken = async () => new Promise((resolve, reject) => {
  request.post(
    tvdbUrls.login,
    {
      json: {
        apikey: process.env.TVDB_API_KEY,
      },
    },
    (err, tvdbRes, body) => {
      if (err) {
        log(err);
        reject(err);
      } else {
        resolve(body.token);
      }
    },
  );
});

export const findShow = async (req, res) => {
  addCorsException(res, req);

  let bearerToken;
  try {
    bearerToken = await getBearerToken();
  } catch (err) {
    log(err);
    res.send(err.message);
  }

  request.get(
    tvdbUrls.search,
    {
      qs: {
        name: req.query.showName,
      },
      auth: {
        bearer: bearerToken,
      },
    },
    (err, tvdbRes) => {
      try {
        if (err) {
          log(err);
          res.send(err.message);
        } else {
          const results = JSON.parse(tvdbRes.body).data;
          if (typeof results === 'undefined') {
            res.json(tvdbRes);
          } else {
            res.json(
              results
                .filter(result => !result.seriesName.includes('403:'))
                .map(result => ({ id: result.id, name: result.seriesName })),
            );
          }
        }
      } catch (unknownErr) {
        log(unknownErr);
        res.send(`Unknown error : ${unknownErr}`);
      }
    },
  );
};

const episodeShortName = (season, episode) => `S${`0${season}`.slice(-2)}E${`0${episode}`.slice(-2)}`;

const episodeSummary = (episode, show) => ({
  showId: show.id,
  showName: show.name,
  key: show.id + episode.id,
  episodeName: episode.episodeName,
  shortName: episodeShortName(episode.airedSeason, episode.airedEpisodeNumber),
  airedEpisodeNumber: episode.airedEpisodeNumber,
  firstAired: episode.firstAired,
});

// eslint-disable-next-line max-len
const getEpisodesForShowByPage = async (show, page, bearerToken) => new Promise((resolve, reject) => {
  request.get(
    `${tvdbUrls.series}/${show.id}/episodes?page=${page}`,
    {
      auth: {
        bearer: bearerToken,
      },
    },
    (err, tvdbRes) => {
      try {
        if (err) reject(err);
        else {
          const returnedEpisodes = JSON.parse(tvdbRes.body).data;
          const results = [];

          if (typeof returnedEpisodes === 'undefined') {
            resolve([]);
          } else {
            for (const episode of returnedEpisodes) {
              if (episode.airedSeason !== 0) {
                results.push(episodeSummary(episode, show));
              }
            }
            resolve(results);
          }
        }
      } catch (unknownErr) {
        log(unknownErr);
        reject(Error(`Unknown error : ${unknownErr}`));
      }
    },
  );
});

const getEpisodesForShow = async (show, bearerToken) => {
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
      done = true;
    }
  } while (!done);
  return allEpisodes;
};

export const episodes = async (req, res) => {
  addCorsException(res, req);

  let bearerToken;
  try {
    bearerToken = await getBearerToken(res);
  } catch (err) {
    res.send(err.message);
  }

  const results = [];
  const showQuery = JSON.parse(req.query.shows);

  for (const show of showQuery) {
    try {
      // eslint-disable-next-line no-await-in-loop
      const episodesForThisShow = await getEpisodesForShow(show, bearerToken);
      results.push(...episodesForThisShow);
    } catch (err) {
      log(err);
    }
  }

  res.json(results);
};

const getBannerUrl = async (showId, bearerToken) => new Promise((resolve, reject) => {
  BannerUrl.findOne({ id: showId }, (err, res) => {
    try {
      if (err) reject(err);
      else if (res != null && typeof res.bannerUrl !== 'undefined') {
        resolve(res.bannerUrl);
      } else {
        request.get(
          `${tvdbUrls.series}/${showId}`,
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
                resolve('');
              } else {
                new BannerUrl({
                  id: showId,
                  bannerUrl,
                }).save((dbErr) => {
                  if (dbErr) {
                    const msg = `Could not add banner url to db ${dbErr.message}`;
                    log(msg);
                    reject(msg);
                  } else {
                    resolve(bannerUrl);
                  }
                });
              }
            }
          },
        );
      }
    } catch (unknownErr) {
      log(unknownErr);
      reject(Error(`Unknown error : ${unknownErr}`));
    }
  });
});

export const banner = (req, res) => {
  addCorsException(res, req);

  try {
    getBearerToken(res).then((bearerToken) => {
      getBannerUrl(req.query.showId, bearerToken)
        .then((bannerUrl) => {
          if (bannerUrl === '') {
            res.status(404).send(`No banner found for show ID ${req.query.showId}`);
          } else {
            res.contentType('jpeg');
            res.setHeader('content-disposition', 'attachment; filename=l316076-g.jpg');
            request(tvdbUrls.banner + bannerUrl).pipe(res);
          }
        })
        .catch((err) => {
          log(err);
          res.send(err.message);
        });
    });
  } catch (err) {
    log(err);
    res.send(err.message);
  }
};
