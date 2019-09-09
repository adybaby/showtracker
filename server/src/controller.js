import fileSystem from 'fs';
import request from 'request';
import Show from './model';

const tvdbUrls = JSON.parse(fileSystem.readFileSync('./tvdbroutes.json'));

// adding CORS global exceptiion because stupid Chrome doesn't allow localhost exceptions
const addCorsException = (res, req) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', req.method);
  res.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');
  res.set('Access-Control-Allow-Credentials', true);
};

// MONGO routes

export const addShow = (req, res) => {
  addCorsException(res, req);

  new Show({ id: req.query.showId, name: req.query.showName }).save((err, show) => {
    if (err) {
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
      id: req.query.showId,
    },
    (err) => {
      if (err) {
        res.send(err);
      } else {
        res.json(req.query.showId);
      }
    },
  );
};

export const shows = (req, res) => {
  addCorsException(res, req);

  Show.find({}, (err, showList) => {
    if (err) {
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
      if (err) {
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
    },
  );
}

const episodeShortName = (season, episode) => `S${`0${season}`.slice(-2)}E${`0${episode}`.slice(-2)}`;

const episodeSummary = (episode, show) => ({
  showId: show.id,
  showName: show.name,
  key: episode.id,
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
        if (err) reject(err);
        else {
          const returnedEpisodes = JSON.parse(tvdbRes.body).data;
          const results = [];

          if (typeof returnedEpisodes === 'undefined') {
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
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e);
    }
  }

  res.json(results);
}

async function getBannerURL(queryId, bearerToken) {
  return new Promise((resolve, reject) => {
    request.get(
      `${tvdbUrls.series}/${queryId}`,
      {
        auth: {
          bearer: bearerToken,
        },
      },
      (err, tvdbRes) => {
        if (err) reject(err);
        else {
          resolve(tvdbUrls.banner + JSON.parse(tvdbRes.body).data.banner);
        }
      },
    );
  });
}

export function banner(req, res) {
  addCorsException(res, req);

  getBearerToken(res).then((bearerToken) => {
    getBannerURL(req.query.showId, bearerToken)
      .then((bannerURL) => {
        res.contentType('jpeg');
        res.setHeader('content-disposition', 'attachment; filename=l316076-g.jpg');
        request(bannerURL).pipe(res);
      })
      .catch((err) => {
        res.send(err.message);
      });
  });
}

export async function thumb(req, res) {
  addCorsException(res, req);

  // eslint-disable-next-line no-unused-vars
  let bearerToken;
  try {
    bearerToken = await getBearerToken(res);
  } catch (err) {
    res.send(err.message);
  }

  res.json('TBD');
}
