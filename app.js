'use strict';

var fs = require('fs');
var util = require('util');
var path = require('path');
var exec = require('child_process').exec;
var http = require('http');
var Config = require('./config/app.config');
var express = require('express');
var app = express();
var BinaryServer = require('binaryjs').BinaryServer;
var kotrans = require('kotrans');
var port = Config.PORTDEV;

app.use(express.static(path.join(__dirname, 'static')));

app.get('/', function(req, res) {
});

kotrans.createServer({server: app, port: 8443}, function() { console.log('woo!')});