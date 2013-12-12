#!/usr/bin/env node --use_strict

var express = require('express');
var http = require('http');
var path = require('path');
var auth = require('./auth');
var controllers = {
	insta	: require('./insta'),
	index	: require('./controllers'),
	ajax	: require('./controllers/ajax')
};

var app = express();

// Proxied via Lighttpd+vhost
app.set('port', 2183);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);

if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', controllers.index);
app.get('/ajax', controllers.ajax);

http.createServer(app).listen(app.get('port'), function() {
  console.log('Instagram API demo server listening on port ' + app.get('port'));
});
