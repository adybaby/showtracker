import fileSystem from 'fs';
import request from 'request';
import * as db from './mongo/MongoInterface';
import * as tvdb from './tvdb/TvDbInterface';
import log from './util/Logger';

const tvdbUrls = JSON.parse(fileSystem.readFileSync('./tvdbroutes.json'));

// CORS

const addCorsException = (res, req) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', req.method);
  res.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');
  res.set('Access-Control-Allow-Credentials', true);
};

// MONGO

export const addShow = (req, res) => {
  addCorsException(res, req);

  db.addShow(req.query.showId, req.query.showName, req.query.userId)
    .then(show => res.json(show))
    .catch((err) => {
      log(err);
      res.send(err.message);
    });
};

export const removeShow = (req, res) => {
  addCorsException(res, req);

  db.removeShow(req.query.showId, req.query.userId)
    .then(showId => res.json(showId))
    .catch((err) => {
      log(err);
      res.send(err.message);
    });
};

export const shows = (req, res) => {
  addCorsException(res, req);

  db.getShows(req.query.userId)
    .then(showList => res.json(showList))
    .catch((err) => {
      log(err);
      res.send(err.message);
    });
};

// TVDB

export const findShows = (req, res) => {
  addCorsException(res, req);

  tvdb
    .findShows(req.query.showName)
    .then(showList => res.json(showList))
    .catch((err) => {
      log(err);
      res.send(err.message);
    });
};

export const episodes = (req, res) => {
  addCorsException(res, req);

  tvdb
    .getEpisodes(JSON.parse(req.query.shows))
    .then(episodeList => res.json(episodeList))
    .catch((err) => {
      log(err);
      res.send(err.message);
    });
};

export const banner = (req, res) => {
  addCorsException(res, req);

  tvdb
    .getBannerUrl(req.query.showId)
    .then((bannerUrl) => {
      res.contentType('jpeg');
      res.setHeader('content-disposition', 'attachment; filename=l316076-g.jpg');
      request(tvdbUrls.banner + bannerUrl).pipe(res);
    })
    .catch((err) => {
      res.send(err.message);
    });
};
