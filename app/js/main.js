$(document).ready(function() {
	$("#langs").change(function(){
		$(".nav-lang-btn").text($("#langs option:selected").text());
	});
});