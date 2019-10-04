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

async function getBearerToken() {
  return new Promise((resolve, reject) => {
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
}

export async function findShow(req, res) {
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
}

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

async function getEpisodesForShow(show, bearerToken) {
  return new Promise((resolve, reject) => {
    request.get(
      `${tvdbUrls.series}/${show.id}$/episodes`,
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
              log(err);
              reject(Error(`Could not find episodes for show ${show.id}`));
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
}

export async function episodes(req, res) {
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
}

async function getBannerUrl(showId, bearerToken) {
  return new Promise((resolve, reject) => {
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
}

export function banner(req, res) {
  addCorsException(res, req);

  try {
    getBearerToken(res).then((bearerToken) => {
      getBannerUrl(req.query.showId, bearerToken)
        .then((bannerUrl) => {
          if (bannerUrl === '') {
            res.status(404);
          }
          res.contentType('jpeg');
          res.setHeader('content-disposition', 'attachment; filename=l316076-g.jpg');
          request(tvdbUrls.banner + bannerUrl).pipe(res);
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
}

export async function thumb(req, res) {
  addCorsException(res, req);

  // eslint-disable-next-line no-unused-vars
  let bearerToken;
  try {
    bearerToken = await getBearerToken(res);
  } catch (err) {
    log(err);
    res.send(err.message);
  }

  res.json('TBD');
}
