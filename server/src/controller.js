import fileSystem from 'fs';
import request from 'request';
import Show from './model';

const tvdbUrls = JSON.parse(fileSystem.readFileSync('./tvdbroutes.json'));

// adding CORS global exceptiion because stupid Chrome doesn't allow localhost exceptions
const addCorsException = res => res.header('Access-Control-Allow-Origin', '*');

// MONGO routes

export const addShow = (req, res) => {
  addCorsException(res);

  new Show(req.query).save((err, show) => {
    if (err) {
      res.send(err.message);
    } else {
      res.json(show);
    }
  });
};

export const removeShow = (req, res) =>{
  addCorsException(res);

  Show.deleteOne(
    {
      id: req.query.id,
    },
    (err) => {
      if (err) {
        res.send(err);
      } else {
        res.json(req.query.id);
      }
    },
  );
};

export async function listShows(req, res) {
  addCorsException(res);

  Show.find({}, (err, showList) => {
    if (err) {
      res.send(err.message);
    } else {
      res.json(showList);
    }
  });
}

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
  addCorsException(res);

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
        name: req.query.name,
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
          const shows = results
            .filter(result => !result.seriesName.includes('403:'))
            .map(result => ({ id: result.id, name: result.seriesName }));
          res.json(shows);
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
          const episodes = [];
          const episodesRes = JSON.parse(tvdbRes.body).data;

          if (typeof episodesRes === 'undefined') {
            reject(Error(`Could not find episodes for show ${show.id}`));
          } else {
            for (const episode of episodesRes) {
              if (episode.airedSeason !== 0) {
                episodes.push(episodeSummary(episode, show));
              }
            }
            resolve(episodes);
          }
        }
      },
    );
  });
}

export async function getEpisodes(req, res) {
  addCorsException(res);

  let bearerToken;
  try {
    bearerToken = await getBearerToken(res);
  } catch (err) {
    res.send(err.message);
  }

  const episodes = [];
  const shows = JSON.parse(req.query.shows);

  for (const show of shows) {
    try {
      // eslint-disable-next-line no-await-in-loop
      const episodesForThisShow = await getEpisodesForShow(show, bearerToken);
      episodes.push(...episodesForThisShow);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e);
    }
  }

  res.json(episodes);
}
