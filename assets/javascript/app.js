$('#startButton').on('click', function(){
	$('#initial').remove();
	trivia.token();
});
var intervalId;
var countdownRunning = false;
var myToken;
var counter = 0;
var questions;

var trivia = {
	time: 5,
	token: function() {
		//The purpose of the session token is to not given the player the same questions once he has lost/won
		//This works by helping the server keep track of the questions that have already been requested
		var requestToken = "https://opentdb.com/api_token.php?command=request";
		$.get(requestToken, function(data) {
			myToken = data.token;
			trivia.pull();
			trivia.start();
		});
	},
	pull: function() {
		//I am using the session token load all the questions
		var useToken = "https://opentdb.com/api.php?amount=50&category=9&difficulty=easy&type=multiple&token=" + myToken;
		$.get(useToken, function(data){
			questions = data.results;
			console.log(questions);
		});
	},
	start: function() {
		countdownRunning: false;
		if(!countdownRunning) {
			$('#timer').html('Time Remaining: 5 Seconds');
			intervalId = setInterval(trivia.count, 1000);	
		}
	},
	count: function() {
		trivia.time--;
		$('#timer').html('Time Remaining: ' + trivia.time + ' Seconds');
		if(trivia.time === 0) {
			clearInterval(intervalId);
			//By specifying the questions.length instead of an exact number I can still use this even when I remove a question from the array
			var randomNumber = Math.floor(Math.random()*questions.length);
			console.log(questions[randomNumber]);
			questions.splice(randomNumber, 1);
			console.log(questions);
			trivia.time = 5;
			trivia.start();
		}
	}
};