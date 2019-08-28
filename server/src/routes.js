import * as Ctrl from './controller';

module.exports = function routes(app) {
  // MONGO routes
  app.route('/addshow').get(Ctrl.addShow);
  app.route('/removeshow').get(Ctrl.removeShow);
  app.route('/listShows').get(Ctrl.listShows);

  // TVDB routes
  app.route('/findshow').get(Ctrl.findShow);
  app.route('/getEpisodes').get(Ctrl.getEpisodes);
};
