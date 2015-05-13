'use strict';

var fs = require('fs');
var util = require('util');
var path = require('path');
var exec = require('child_process').exec;
var http = require('http');
var https = require('https')
var Config = require('./config/app.config');
var express = require('express');
var app = express();
// var BinaryServer = require('binaryjs').BinaryServer;
var BinaryServer;
var kotrans = require('kotrans');
var port = Config.port;
var privateKey = fs.readFileSync('./private.pem', 'utf8');
var publicKey = fs.readFileSync('./server.crt', 'utf8');

var credentials = {
	key : privateKey,
	cert : publicKey
};

app.use(express.static(path.join(__dirname, 'static')));

app.use(function(req, res) {
	console.log(req.secure);
})

app.post('/sendData', function(req, res) {

});
var server = http.createServer(app).listen(port + 1);
var secureServer = https.createServer(credentials, app).listen(port);

kotrans.createServer({ server: secureServer, route : Config.path, directory : Config.allowed_directory }, function() { 
	console.log('Web server listening on secure port ' + port);
});