var express = require('express');
var session = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');
var session = require('client-sessions');
/**
 * Route Declaration
 */
var routes = require('./routes/index');
var login = require('./routes/login');
var logsearch = require('./routes/logsearch');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//PORT Setup
app.set('port', process.env.PORT || 3000);

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join("D:\\ATT\\BlackFlag\\Documents", 'public')));
//Session initiation
app.use(session({
	  cookieName: 'session',
	  secret: 'logparsersessionsecret',
	  duration: 30 * 60 * 1000,
	  activeDuration: 5 * 60 * 1000,
	}));

/**
 * URL Mapping Declaration
 */
app.use('/', routes);
app.get('/login', login.info);
app.get('/getLogin', login.validate);
app.get('/logSearchForm',logsearch.searchForm);
app.get('/logSearchFunction',logsearch.searchLogFunction);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


http.createServer(app).listen(app.get('port'), function() {
	console.log('Express server listening on port ' + app.get('port'));
});

module.exports = app;
