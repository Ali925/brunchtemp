var ContentItem = function() {
	var self = this;
	
  this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
	
	this.mediaRecorder = null;
	
	this.audioChunks = [];
	
	this.audioSources = {};
	
	this.timer = null;
	
	navigator.getUserMedia = navigator.getUserMedia ||
                         navigator.webkitGetUserMedia ||
                         navigator.mozGetUserMedia;
	
	this.currentContent = null;
	
	var record = function(){
		
		if (navigator.getUserMedia) {
			 console.log('getUserMedia supported.');
			 navigator.getUserMedia (
					// constraints - only audio needed for this app
					{
						 audio: true
					},

					// Success callback
					function(stream) {
							$('#timer').html("00:00:00");
							$(".content-items > button").removeClass('active');
							self.currentContent = null;
							document.getElementsByClassName('content-title')[0].innerHTML = '';
							self.mediaRecorder = new MediaRecorder(stream);
							self.mediaRecorder.start();
							$("#recBtn > i").removeClass('record');
							$("#recBtn > i").addClass('stop');
							console.log(self.mediaRecorder.state);
							console.log("recorder started");
							self.timer = $('#timer').stopwatch({format: '{MM}:{ss}'}).stopwatch('start');
							self.mediaRecorder.ondataavailable = function(e) {
								self.audioChunks.push(e.data);
							}
					},

					// Error callback
					function(err) {
						 console.log('The following gUM error occured: ' + err);
					}
			 );
		} else {
			 console.log('getUserMedia not supported on your browser!');
		}
							
	};
	
	var stopRecord = function(){
		var soundClips = document.querySelector('.content-items');
		self.mediaRecorder.stop();
  	console.log(self.mediaRecorder.state);
  	console.log(self.audioChunks);
		
		self.mediaRecorder.onstop = function(e) {
			console.log("recorder stopped");

			var clipName = prompt('Enter a name for your sound clip');

			var clipContainer = document.createElement('button');
			
			var audio = document.createElement('audio');
			
			self.timer.stopwatch('toggle');
			self.audioSources[clipName] = {timer: $('#timer').html()};
			self.timer.stopwatch('reset');
			$('#timer').html("00:00:00");

			clipContainer.classList.add("ui", "primary", "basic", "button");
			clipContainer.innerHTML = clipName;
			
			audio.setAttribute('controls', '');

			clipContainer.appendChild(audio);
			soundClips.appendChild(clipContainer);

			var blob = new Blob(self.audioChunks, { 'type' : 'audio/ogg; codecs=opus' });
			self.audioChunks = [];
			var audioURL = window.URL.createObjectURL(blob);
			audio.src = audioURL;
			
			self.audioSources[clipName].content = audio;
			
			clipContainer.dataset.title = clipName;
			
			$("#recBtn > i").removeClass('stop');
			$("#recBtn > i").addClass('record');
			
			$(".content-items > button").click(function(){
				if($("#playBtn").children().hasClass('play'))
					self.selectContent(this);
			});
			
		}
	};
	
	this.selectContent = function(button){
		
		if(!$(button).hasClass('active')){
			$(".content-items > button").removeClass('active');
			$(button).addClass('active');
		}
		
		var currentTitle = $(button).data('title');
		
		var contentTitle = document.getElementsByClassName('content-title')[0];
		
		self.currentContent = self.audioSources[currentTitle].content;
		$("#timer").html(self.audioSources[currentTitle].timer);
		contentTitle.innerHTML = currentTitle;

	};
	
	var play = function(){
		self.currentContent.play();
		
		self.currentContent.onended = function(){
			$("#playBtn").children().removeClass('stop');
			$("#playBtn").children().addClass('play');
		};
	};
	
	var stop = function(){
		self.currentContent.pause();
		self.currentContent.currentTime = 0;
	};
	
	return {
		record: record,
		stopRecord: stopRecord,
		selectContent: self.selectContent,
		play: play,
		stop: stop
	};
};