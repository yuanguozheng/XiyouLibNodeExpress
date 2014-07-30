var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//var routes = require('./routes/index');
var users = require('./routes/user');
var books = require('./routes/book');
var news = require('./routes/news');
var others=require('./routes/other');

var app = express();

// view engine setup
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');

//app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));

//app.use('/', routes);
app.use('/user', users);
app.use('/book', books);
app.use('/news', news);
app.use('/other',others);

var uniResult = {
    Result: false,
    Detail: null
};

/// catch 404 and forward to error handler
app.use(function (req, res, next) {
    uniResult.Detail = 'NOT_FOUND';
    res.end(JSON.stringify(uniResult));
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    uniResult.Detail = err.message;
    res.end(JSON.stringify(uniResult));
});

module.exports = app;
