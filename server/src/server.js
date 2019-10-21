import express from 'express';
import mongoose from 'mongoose';
import fileSystem from 'fs';
import bodyParser from 'body-parser';
import routes from './Routes';
import { tvdbInit } from './tvdb/TvDbInterface';

const app = express();
const port = process.env.PORT || 3000;

// env
const tvdbUrls = JSON.parse(fileSystem.readFileSync('./tvdbroutes.json'));
const tvdbApiKey = process.env.TVDB_API_KEY;
const mongoPwd = process.env.MONGO_ATLAS_PWD;

// mongo host
const mongoAtlasHost = `mongodb+srv://showtracker_default:${mongoPwd}@cluster0-svrfx.mongodb.net/test?retryWrites=true&w=majority`;

// tvdb init
tvdbInit(tvdbUrls, tvdbApiKey);

// mongoose instance connection url connection
mongoose.Promise = global.Promise;
mongoose.connect(mongoAtlasHost, {
  useNewUrlParser: true,
});
mongoose.set('useCreateIndex', true);

// bodyparser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// routes
routes(app);

// start
app.listen(port);
