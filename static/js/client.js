'use strict';

var client;
var fileQueue = [];
var i;
var start;
var end;
var file;
var config = configParams;
var done = true;
client = kotrans.client.createClient({ host : config.host, path : config.path, port : config.port, no_streams : config.no_streams });
client.on('stream', function(stream, meta) {
	console.log(meta.percent);
	if(meta.cmd === 'updateClient') {
		$('#progress' + file.name.split('.').join('_')).width(meta.percent.toPrecision(4) * 100 + '%');
	}
});

function stopEvent(event) {
	event.preventDefault();
	event.stopPropagation();
}

function drop(event) {
	stopEvent(event);
	for(i = 0; i < event.dataTransfer.files.length; ++i) {
		fileQueue.push(event.dataTransfer.files[i]);
		$('#output').append('<pre>Received dropped file ' + event.dataTransfer.files[i].name + '</pre>');
		$('#fileQueue').append('<pre id="queue' + event.dataTransfer.files[i].name.split('.').join('_') + '">' + event.dataTransfer.files[i].name + '</pre>');
	}
	startTransfer();
}

function startTransfer() {
	if(done && !file && fileQueue.length > 0) {
		done = false;
		file = fileQueue.shift();
		$('#output').append('<pre>Transferring file ' + file.name + '. Please wait...</pre>');
		$('#output').append('<div class="progress success"><span id="progress' + file.name.split('.').join('_') + '" class="meter"></span></div>');
		$('#progress' + file.name.split('.').join('_')).width(0 + '%');
		$('#queue' + file.name.split('.').join('_')).remove();
		start = new Date().getTime();
		kotrans.client.sendFile(file, function() {
			end = new Date().getTime() - start;
			$('#output').append('<pre>Done transferring file ' + file.name + '.</pre>')
			$('#output').append('<pre>This took ' + (end / 1000) + 's at a rough estimate of ' + ((file.size / 1000000) / (end / 1000)).toPrecision(4) + 'MB/s</pre>');
			file = null;
			done = true;
			startTransfer();
		});
	}
}