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
var secure = Config.secure;
if(!Config.key && Config.secure) {
	throw 'You did not set your Server Key';
	process.exit();
}

if(!Config.cert && Config.secure) {
	throw 'You did not set your Server certificate';
	process.exit();
}

var privateKey = secure ? fs.readFileSync(Config.key, 'utf8') : '';
var publicKey = secure ? fs.readFileSync(Config.cert, 'utf8') : '';

var credentials = {
	key : privateKey,
	cert : publicKey
};

app.use(express.static(path.join(__dirname, 'static')));

app.use(function(req, res) {
});

var info;
info = secure ? 'secure ' : 'unsecure ';

app.post('/sendData', function(req, res) {

});
var server = secure ? https.createServer(credentials, app).listen(port) : http.createServer(app).listen(port);

kotrans.createServer({ server: server, path : Config.path, directory : Config.allowed_directory }, function() { 
	console.log('Web server listening on ' + info + 'port ' + port);
});