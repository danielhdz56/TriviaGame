window.onload = function() {
	$('#startButton').click(trivia.start);
	$('h4').click(trivia.guess)
}
var intervalId;
var countdownRunning = false;
var myToken;
var firstQuestion = true;
var questions;
var correct;
var token = {
	retrieve: function() {
		//The purpose of the session token is to not given the player the same questions once he has lost/won
		//This works by helping the server keep track of the questions that have already been requested
		var requestToken = "https://opentdb.com/api_token.php?command=request";
		$.get(requestToken, function(data) {
			myToken = data.token;
			token.pull();
		});
	},
	pull: function() {
		//I am using the session token load all the questions
		var useToken = "https://opentdb.com/api.php?amount=50&category=9&difficulty=easy&type=multiple&token=" + myToken;
		$.get(useToken, function(data){
			questions = data.results;
			console.log(questions)
		});
	}
}
token.retrieve();
var trivia = {
	time: 30,
	start: function() {
		$('#initial').remove();
		countdownRunning: false;
		if(!countdownRunning) {
			$('#timer').html('Time Remaining: 30 Seconds');
			intervalId = setInterval(trivia.count, 1000);
		}
		//This allows me to only print this out if it is the first question
		if(firstQuestion){
			var randomNumber = Math.floor(Math.random()*questions.length);
			$('#triviaQuestion').html(questions[randomNumber].question);
			//Im going to load this array with all the answers
			var answers = [];
			//I am pushing this to a global variable so i can access it in the guess method
			correct = questions[randomNumber].correct_answer;
			answers.push(correct);
			//This loads all the incorrect answers into the array answers
			for(i = 0; i<questions[randomNumber].incorrect_answers.length;i++){
				answers.push(questions[randomNumber].incorrect_answers[i])
			}
			//This dynamically adds all the answers, incorrect and correct, to the document in a random order
			for(i = 0; i<answers.length; i++){
				$('#'+i).html(answers[i]);
				$('#'+i).attr('data-answer', answers[i]);				
			}
			questions.splice(randomNumber, 1);
		}
	},
	count: function() {
		trivia.time--;
		firstQuestion = false;
		$('#timer').html('Time Remaining: ' + trivia.time + ' Seconds');
		if(trivia.time === 0) {
			console.log(questions);
			clearInterval(intervalId);
			//By specifying the questions.length instead of an exact number I can still use this even when I remove a question from the array
			var randomNumber = Math.floor(Math.random()*questions.length);
			$('#triviaQuestion').html(questions[randomNumber].question);
			questions.splice(randomNumber, 1);
			trivia.time = 30;
			trivia.start();
		}
	},
	guess: function() {
		console.log($(this));
		console.log(correct);
		if($(this).attr('id') === '0'){
			console.log('Correct');
		}
		else{
			console.log('Incorrect');
		}
	}
};