import Express from 'express';
import Mongoose from 'mongoose';
import bodyParser from 'body-parser';
import Routes from './routes';

const app = Express();
const port = process.env.PORT || 3000;

// mongoose instance connection url connection
Mongoose.Promise = global.Promise;
Mongoose.connect('mongodb://localhost:27017/showtracker', {
  useNewUrlParser: true,
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// importing route
Routes(app); // register the route

app.listen(port);
