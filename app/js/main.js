var content = new ContentItem;

$("#recBtn").click(function(){
	if($(this).children().hasClass('record'))
		content.record();
	else
		content.stopRecord();
});

$(".content-items > button").click(function(){
	if($("#playBtn").children().hasClass('play'))
		content.selectContent(this);
});

$("#playBtn").click(function(){
	if($(this).children().hasClass('play')){
		content.play();
		$(this).children().removeClass('play');
		$(this).children().addClass('stop');
	} else {
		content.stop();
		$(this).children().removeClass('stop');
		$(this).children().addClass('play');
	}
});
