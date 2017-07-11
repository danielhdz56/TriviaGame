$('#startButton').on('click', function(){
	$('#initial').remove();
	trivia.start();
});
var intervalId;
var countdownRunning = false;

var trivia = {
	time: 30,
	start: function() {
		countdownRunning: false;
		if(!countdownRunning) {
			$('#timer').html('Time Remaining: 30 Seconds');
			intervalId = setInterval(trivia.count, 1000);
   			//The first step is to request a session token fromt the API i'm using
   			var requestToken = "https://opentdb.com/api_token.php?command=request";
   			$.get(requestToken, function(data) {
   				var token = data.token;
   				console.log(token);				
   				//Now I want to use the session token
   				var useToken = "https://opentdb.com/api.php?amount=10&token=" + token;
   				$.get(useToken, function(data){
   					console.log(data.results[0]);
   				});
   			});
		}
	},
	count: function() {
		trivia.time--;
		$('#timer').html('Time Remaining: ' + trivia.time + ' Seconds');
		if(trivia.time === 0) {
			clearInterval(intervalId);
			console.log("newQuestion");
			trivia.time = 30;
			trivia.start();
		}
	}
};