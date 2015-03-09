'use strict';

(function($, undefined) {
	$(document).ready(function() {
		var client;
		var fileQueue = [];
		var i;
		client = kotrans.client.createClient();

		function stopEvent(event) {
			event.preventDefault();
			event.stopPropagation();
		}

		function createProgressBar() {
			$('#information').prepend('<div class="progress">\
	  <span class="meter"></span>\
	</div>');
		}

		// client.on('stream', function(data) {
		// 	if(data.percent) {
		// 		$('.meter').css('width', data.percent);
		// 		$('.meter').text(data.percent);
		// 	}
		// });

		$('#drop-box').on('drop', function(event) {
			stopEvent(event);
			for(i = 0; i < event.originalEvent.dataTransfer.files.length; ++i) {
				fileQueue.push(event.originalEvent.dataTransfer.files[i]);
			}

			fileQueue.forEach(function(file) {
				createProgressBar();
			})

			console.log(fileQueue);
			kotrans.client.sendFile(fileQueue.shift(), '');

		});

		$('#drop-box').on('dragenter', function(event) {
			stopEvent(event);
		});

		$('#drop-box').on('dragover', function(event) {
			stopEvent(event);
		});

		// client.on('open', function() {
		// 	fileQueue = [];
		// 	console.log('Client stuf stuf here');
		// });

		// client.on('stream', function(stream, meta) {

		// });

		// client.on('close', function() {
		// 	console.log('client closed');
		// })	
	});
})(jQuery);