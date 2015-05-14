'use strict';

var client;
var fileQueue = [];
var i;
var start;
var end;
var file;
var config = configParams;
var done = true;
var filesdiv = document.getElementById('files');
kotrans.client.createClient({ host : config.host, path : config.path, port : config.port, no_streams : config.no_streams });

function stopEvent(event) {
	event.preventDefault();
	event.stopPropagation();
}

function drop(event) {
	stopEvent(event);
	for(i = 0; i < event.dataTransfer.files.length; ++i) {
		fileQueue.push(event.dataTransfer.files[i]);
	}
	startTransfer();
}

function startTransfer() {
	if(done && !file && fileQueue.length > 0) {
		console.log('sending file');
		done = false;
		file = fileQueue.shift();
		start = new Date().getTime();
		kotrans.client.sendFile(file, function() {
			end = new Date().getTime() - start;
			console.log('Took ' + (end / 1000) + 's at a rough estimate of ' + ((file.size / 1000000) / (end / 1000)).toPrecision(4) + 'MB/s');
			file = null;
			done = true;
			startTransfer();
		});
	}
}