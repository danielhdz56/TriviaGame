window.onload = function() {
	$('#startButton').click(trivia.start);
	$('h4').click(trivia.guess)
}
var intervalId;
var countdownRunning = false;
var myToken;
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
		$('#triviaQA').show();
		$('.response').empty();
		countdownRunning = false;
		if(!countdownRunning) {
			$('#timer').html('Time Remaining: 30 Seconds');
			intervalId = setInterval(trivia.count, 1000);
		}
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
		for(i = 0; i<4; i++){
			//I first created a random number between 0 and the length of the answers array
			var randomIndex = Math.floor(Math.random() * answers.length);
			$('#'+i).html(answers[randomIndex]);
			//I also give it a data-answer attribute in order to check it against correct answer
			//I do that in the guess method of this object
			$('#'+i).attr('data-answer', answers[randomIndex]);	
			//I then get rid of that value i used from my answers array
			//When I do this the lenght of my array is one less
			//This means that when I loop through this again the randomIndex generated will be one less
			answers.splice(randomIndex, 1);			
		}
		//I splice the question again so I don't reuse it
		questions.splice(randomNumber, 1);
	},
	count: function() {
		trivia.time--;
		$('#timer').html('Time Remaining: ' + trivia.time + ' Seconds');
		if(trivia.time === 0) {
			clearInterval(intervalId);
			trivia.time = 30;
			$('#triviaQA').hide();
			$('#response').html('Out of Time');
			$('#responseMessage').html("The Correct Answer was: " + correct);
			intervalId = setInterval(trivia.ranoutTime, 5000);
		}
	},
	ranoutTime: function() {
		clearInterval(intervalId);
		trivia.start();

	},
	correctAnswer: function() {
		clearInterval(intervalId);
		trivia.start();
	},
	incorrectAnswer: function() {
		clearInterval(intervalId);
		trivia.start();
	},
	guess: function() {
		console.log(correct);
		//This makes sure that the countdown timer stops
		clearInterval(intervalId);
		$('#triviaQA').hide();
		countdownRunning = true;
		if($(this).attr('data-answer') === correct){
			$('#response').html('GENIUS');
			$('#responseMessage').html("I don't know how you do it");
			intervalId = setInterval(trivia.correctAnswer, 10000);
		}
		else{
			$('#response').html('Incorrect');
			$('#responseMessage').html("The correct answer was " + correct)
			intervalId = setInterval(trivia.incorrectAnswer, 10000);
		}
	}
};
// var flickr = {
// 	retrieve: function() {
// 		//The purpose of the session token is to not given the player the same questions once he has lost/won
// 		//This works by helping the server keep track of the questions that have already been requested
// 		var apiKey = "7c6549a01454c9b945a03306f1b05afe";
// 		$.get(requestApi, function(data) {
// 			myToken = data.token;
// 			token.pull();
// 		});
// 	},
// 	pull: function() {
// 		//I am using the session token load all the questions
// 		var useToken = "https://api.flickr.com/services/rest/?method=flickr.test.echo&name=value";
// 		$.get(useToken, function(data){
// 			console.log(data)
// 		});
// 	}
// }
// flickr.pull();
