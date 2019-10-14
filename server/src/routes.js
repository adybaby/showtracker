import * as Ctrl from './Controller';

module.exports = function routes(app) {
  // MONGO routes
  app.route('/addshow').get(Ctrl.addShow);
  app.route('/removeshow').get(Ctrl.removeShow);
  app.route('/shows').get(Ctrl.shows);

  // TVDB routes
  app.route('/findshow').get(Ctrl.findShows);
  app.route('/episodes').get(Ctrl.episodes);
  app.route('/banner').get(Ctrl.banner);
};
