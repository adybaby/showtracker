import fileSystem from 'fs';
import request from 'request';
import Show from './model';

const tvdbUrls = JSON.parse(fileSystem.readFileSync('./tvdbroutes.json'));

function addCorsExceptions(res) {
  // adding CORS global exceptiion because stupid Chrome doesn't allow localhost exceptions
  res.header('Access-Control-Allow-Origin', '*');
}

// MONGO routes

export function addShow(req, res) {
  addCorsExceptions(res);

  new Show(req.query).save((err, show) => {
    if (err) {
      res.send(err.message);
    } else {
      res.json(show);
    }
  });
}

export function removeShow(req, res) {
  addCorsExceptions(res);

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
}

async function getShowList() {

  console.log("getShowList  called");  
  
  return new Promise((resolve, reject) => {
    Show.find({}, (err, showList) => {
      if (err) {
        reject(err);
      } else {
        resolve(showList);
      }
    });
  });
}

export async function listShows(req, res) {
  addCorsExceptions(res);

  try {
    res.json(await getShowList());
  } catch (err) {
    res.send(err.message);
  }
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
  let bearerToken;

  addCorsExceptions(res);

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

async function getShowOrEpisodeInfo(queryId, options) {
  const bearerToken = await getBearerToken();

  return new Promise((resolve, reject) => {
    request.get(
      `${tvdbUrls.series}/${queryId}${options.provideEpisodeDetail ? '/episodes' : ''}`,
      {
        auth: {
          bearer: bearerToken,
        },
      },
      (err, tvdbRes) => {
        if (err) reject(err);
        else {
          resolve(JSON.parse(tvdbRes.body));
        }
      },
    );
  });
}

export async function showInfo(req, res) {
  addCorsExceptions(res);

  try {
    res.json(await getShowOrEpisodeInfo(req.query.id, { provideEpisodeDetail: false }));
  } catch (err) {
    res.send(err.message);
  }
}

export async function episodeInfo(req, res) {
  addCorsExceptions(res);

  try {
    res.json(await getShowOrEpisodeInfo(req.query.id, { provideEpisodeDetail: true }));
  } catch (err) {
    res.send(err.message);
  }
}

function makeEpisodeSummary(episode, showName) {
  const episodeSummary = {};
  episodeSummary.key = episode.id;
  episodeSummary.episodeName = episode.episodeName;
  episodeSummary.shortName = `S${`0${episode.airedSeason}`.slice(-2)}E${`0${
    episode.airedEpisodeNumber
  }`.slice(-2)}`;
  episodeSummary.airedEpisodeNumber = episode.airedEpisodeNumber;
  episodeSummary.firstAired = episode.firstAired;
  episodeSummary.showName = showName;
  return episodeSummary;
}

async function makeShowCalendar() {
  return new Promise(async (resolve, reject) => {
    try {
      const showList = await getShowList();
      let episodeList;
      const allEpisodes = [];

      for (const show of showList) {
        // eslint-disable-next-line no-await-in-loop
        episodeList = (await getShowOrEpisodeInfo(show.id, { provideEpisodeDetail: true })).data;
        for (const episode of episodeList) {
          if (episode.airedSeason !== 0) {
            allEpisodes.push(makeEpisodeSummary(episode, show.name));
          }
        }
      }

      allEpisodes.sort((a, b) => {
        const dateA = new Date(a.firstAired);
        const dateB = new Date(b.firstAired);

        return a.firstAired === b.firstAired
          ? a.airedEpisodeNumber - b.airedEpisodeNumber
          : dateA - dateB;
      });

      resolve(allEpisodes);
    } catch (err) {
      reject(err);
    }
  });
}

export async function getShowCalendar(req, res) {
  addCorsExceptions(res);

  console.log("getShowCalendar called");

  try {
    res.json(await makeShowCalendar(req.query.futureOnly));
  } catch (err) {
    res.send(err.message);
  }
}
