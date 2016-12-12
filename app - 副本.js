var express = require('express');
var  bodyParser  =  require('body-parser');
var path = require('path');
var favicon = require('serve-favicon');
var fs = require('fs');  
var logger = require('morgan');
var cookieParser = require('cookie-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
var movie = require('./routes/movie');
var adminMovie = require('./routes/admin/movie');
var pachong = require('./routes/admin/pachong');

// var http = require('http');
// var ejs = require('ejs');
// var SessionStore = require("session-mongoose")(express);

var app = express();

var accessLog = fs.createWriteStream('../access.log', {flags : 'a'});  
var errorLog = fs.createWriteStream('../error.log', {flags : 'a'});  

// view engine setup
app.set('views', path.join(__dirname, 'views'));
// app.register('.html', require('ejs'));
app.engine('.html', require('ejs').renderFile);
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev')); //打印到控制台
app.use(logger('combined', {stream : accessLog}));      //打印到log日志 
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// 增加bobyParser 支持
app.use(bodyParser.json({
  limit:   '1mb'
}));   //body-parser 解析json格式数据
app.use(bodyParser.urlencoded({             //此项必须在 bodyParser.json 下面,为参数编码
  extended:  true
}));
app.use('/', routes);
app.get('/home', function(req, res, next) {
  res.render('home', {
    title: 'Express'
  });
});
app.use('/users', users);
app.use('/admin/movie', movie.movie)
app.use('/admin/pachong', pachong)

app.get('/movie/add', movie.movieAdd); //增加
app.post('/movie/add', movie.doMovieAdd); //提交
app.get('/movie/:name', movie.movieAdd); //编辑查询
app.get('/movie/json/:name', movie.movieJSON); //JSON数据


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

module.exports = app;