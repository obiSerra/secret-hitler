#!/usr/bin/env node

var express = require('express');
//var path = require('path');
var app = express();
var http = require('http').createServer(app);

var Utils = require.main.require('./tools/utils');

var portNumber = process.env.PORT || 36001;

app.use(express.static('public'));
//app.use('/public', express.static(path.join(__dirname)))
require('./connect/io')(http);

http.listen(portNumber);

if (Utils.TESTING) {
	console.log('Secret Hitler TEST SERVER on port ' + portNumber);
}

