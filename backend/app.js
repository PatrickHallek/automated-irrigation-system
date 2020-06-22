import createError from 'http-errors';
import express, {
  json,
  urlencoded
} from 'express';
import {
  config
} from 'dotenv';
import {
  join
} from 'path';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

import indexRouter from './routes/index';

const app = express();

// Load envs
config({
  path: (__dirname, './.env')
});

// Mongoose Configs
mongoose.Promise = global.Promise;
const uri = process.env.MONGO_DB;
mongoose.connect(uri, {
    useMongoClient: true
  })
  .then(() => {
    console.log('Connection to database!')
  })
  .catch(() => {
    console.log('Connection to database failed!')
  })

// view engine setup
app.set('views', join(__dirname, 'views'));
app.set('view engine', 'jade');


// Enable Cors
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "*");
  next();
});

app.use(logger('dev'));
app.use(json());
app.use(urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});


// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.set('port', process.env.PORT || 3000)

app.listen(app.get('port'), () => {
  console.log(`Express server listening on port ${app.get('port')}`);
})

export default app;
