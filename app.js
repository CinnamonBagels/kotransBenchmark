'use strict';

var fs = require('fs');
var util = require('util');
var path = require('path');
var exec = require('child_process').exec;
var http = require('http');
var Config = require('./config/app.config');
var express = require('express');
var app = express();
// var BinaryServer = require('binaryjs').BinaryServer;
var BinaryServer;
var kotrans = require('kotrans');
var port = Config.port;

app.use(express.static(path.join(__dirname, 'static')));

app.get('/', function(req, res) {
});

app.post('/sendData', function(req, res) {

});
var server = http.createServer(app).listen(port);

kotrans.createServer({server: server, route : Config.path, directory : Config.allowed_directory }, function() { 
	console.log('Web server listening on port ' + port);
});