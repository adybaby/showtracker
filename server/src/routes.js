import * as Ctrl from './Controller';

module.exports = function routes(app) {
  // MONGO routes

  // addShow reqd params = showId, showName, userId
  app.route('/addshow').get(Ctrl.addShow);

  // removeshow reqd params = showId, userId
  app.route('/removeshow').get(Ctrl.removeShow);

  // shows reqd params = userId
  app.route('/shows').get(Ctrl.shows);

  // TVDB routes

  // findshow reqd params = showName
  app.route('/findshow').get(Ctrl.findShows);

  // episodes reqd params = shows as [{id, name}]
  // e.g. shows=[{"id":"1","name":"My Show"},{"id":"2","name":"My Show 2"}]
  app.route('/episodes').get(Ctrl.episodes);

  // banner reqd params = showId
  app.route('/banner').get(Ctrl.banner);
};
