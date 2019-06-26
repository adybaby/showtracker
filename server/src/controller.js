import fileSystem from 'fs';
import request from 'request';
import Show from './model';

const tvdbUrls = JSON.parse(fileSystem.readFileSync('./tvdbroutes.json'));

// MONGO routes

export function addShow(req, res) {
  new Show(req.query).save((err, show) => {
    if (err) {
      res.send(err.message);
    } else {
      res.json(show);
    }
  });
}

export function removeShow(req, res) {
  Show.deleteOne(
    {
      id: req.query.id,
    },
    (err) => {
      if (err) {
        res.send(err);
      } else {
        res.json({ message: `Show ${req.query.id} removed` });
      }
    },
  );
}

async function getShowList() {
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
        res.send(tvdbRes);
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
  try {
    res.json(await getShowOrEpisodeInfo(req.query.id, { provideEpisodeDetail: true }));
  } catch (err) {
    res.send(err.message);
  }
}

export async function episodeInfo(req, res) {
  try {
    res.json(await getShowOrEpisodeInfo(req.query.id, { provideEpisodeDetail: true }));
  } catch (err) {
    res.send(err.message);
  }
}

function makeEpisodeSummary(episode, showName) {
  const episodeSummary = {};
  episodeSummary.id = episode.id;
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

      /* eslint-disable no-await-in-loop */
      for (const show of showList) {
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
  try {
    res.json(await makeShowCalendar());
  } catch (err) {
    res.send(err.message);
  }
}

/**
  this version groups and sorts shows, but i'm not sure the client will need it

  async function getShowCalendar() {
  return new Promise(async (resolve, reject) => {
    try {
      const showList = await getShowList();
      var episodeList, episodeSummary;
      var allEpisodes = [];
      var episodesGroupedByDate = {};

      var allEpisodesIndex =0;

      for (const show of showList) {
        episodeList = (await getShowOrEpisodeInfo(show.id, true)).data;
        for (const episode of episodeList) {
          if (episode.airedSeason != "0") {
            episodeSummary = makeEpisodeSummary(episode, show.name);

            if (
               episodesGroupedByDate[episodeSummary.firstAired] ==
              null
            ) {
              episodesGroupedByDate[episodeSummary.firstAired] = allEpisodesIndex;
              allEpisodes[allEpisodesIndex++] = [episodeSummary];
            } else {
              allEpisodes[episodesGroupedByDate[episodeSummary.firstAired]].push(episodeSummary);
            }
          }
        }
      }

      //sort the date list
      allEpisodes.sort((a, b) => {
        var dateA = new Date(a[0].firstAired),
          dateB = new Date(b[0].firstAired);
       return dateA - dateB;
      });

      //sort the episodes in the date list
      for(var episodesOnThisDay of allEpisodes)
      {
        episodesOnThisDay.sort((a, b) => {
          var dateA = new Date(a.firstAired),
            dateB = new Date(b.firstAired);

          return a.firstAired === b.firstAired
            ? a.airedEpisodeNumber - b.airedEpisodeNumber
           : dateA - dateB;
        });
      }

      resolve(allEpisodes);
    } catch (err) {
      reject(err);
    }
  });
} */
