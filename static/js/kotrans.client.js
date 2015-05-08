 /**
 * kotrans.client.js
 * 
 * Client connection using BinaryJS
 * A reference to this js file AND client.config.js should be in your HTML/PHP
 * 
 * <script src="path/to/client.connection.js"></script>
 *
 * @author Sam Ko
 */

'use strict';

var kotrans = kotrans || {};

kotrans.client = (function () {
	
	//done signifies all file Chunks were transfered
	var Client2ServerFlag = {
		send: 'send',
		sendMul: 'sendMul',
		transferComplete: 'transferComplete'
	}
	
	//sent signifies that the file chunk was sent.
	var Server2ClientFlag = {
		sent: 'sent',
		updateClient: 'updateClient',
		commandComplete: 'commandComplete',
		error: 'error'
	}

	var file;

	//stores
	var fileChunks;
	var chunk_size = 4194304;

    var timeTook,
    	start;

    var clients;
    var clientids;
    var chunkNumber;
    var totalChunks;
    var sentChunks;
    var allTransferred;
	function createClient(options) {
		var i;
		var options = options || {};
		var host = options.host || 'localhost';
		var port = options.port || '9000';
		var streams = options.no_streams || 2;
		var path = options.path || '';

		// init
		clients = [];
		clientids = 0;
		allTransferred = false;
		sentChunks = 0;
		// init

		for(i = 0; i < streams; ++i) {
			clients.push(initClient(host, port, path));
		}
	}

	function initClient(host, port, path) {
		var client = new BinaryClient('ws://' + host + ':' + port + path);

		client.on('open', function() {
			client.pid = clientids++;
			console.log('client ' + client.pid + ' connected to server.');
		});

		client.on('stream', function(stream, meta) {
			if(meta.cmd === Server2ClientFlag.sent) {
				//console.log('client ' + client.pid + ' successfully transfered.');
				allTransferred = totalChunks === ++sentChunks;
				if(fileChunks.length === 0) {
					if(allTransferred) {
						client.send({}, {
							fileName : file.name,
							fileSize : file.size,
							cmd : Client2ServerFlag.transferComplete
						});
					}
				} else {
					var chunk = fileChunks.shift();
					client.send(chunk, {
						chunkName : file.name + '_' + chunkNumber++,
						chunkSize : chunk.size,
						fileSize : file.size,
						fileName : file.name,
						cmd : Client2ServerFlag.send
					});
				}
			} else if(meta.cmd === Server2ClientFlag.commandComplete) {
				finish();
			} else if(meta.cmd === Server2ClientFlag.updateClient) {
				//Will be sent the file name and the % compete
			}
		});

		client.on('close', function() {
			throw 'client ' + client.pid + ' closed unexpectedly.';
		});

		client.on('error', function(error) {
			throw error;
		});

		return client;
	}

	var callback;
	function sendFile(sendingFile, cbFun) {
		totalChunks = 0;
		sentChunks = 0;
		allTransferred = false;
		file = sendingFile;
		chunkNumber = 0;

		callback = callback || cbFun;
		initFile();
	}	

	function initFile() {
		start = new Date().getTime();
		console.log('Initializing file: '  + file.name);

		var currentSize = chunk_size;
		fileChunks = [];
		
		var i = 0;
		while (i < file.size) {
			//for the last chunk < chunk_size
			if (i + chunk_size > file.size) {
				fileChunks.push(file.slice(i));
				break;
			}
			fileChunks.push(file.slice(i, currentSize));
		
			i += chunk_size;
			currentSize += chunk_size;
		}
		totalChunks = fileChunks.length;
		send();
	}

	function send() {
		clients.forEach(function(client) {
			//console.log('client ' + client.pid + ' is attempting to transfer file ' + file.name + '_' + chunkNumber);
			var chunk = fileChunks.shift();
			client.send(chunk, {
				chunkName : file.name + '_' + chunkNumber++,
				chunkSize : chunk.size,
				fileSize : file.size,
				fileName : file.name,
				cmd : Client2ServerFlag.send
			});
		});
	}

	function finish() {
		if(callback) {
			callback();
		}
	}

	return {
		createClient: createClient,
		sendFile: sendFile
	}
})();
