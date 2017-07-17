window.onload = function() {
	$('.difficulty').click(options.difficulty);
	$('.questions').click(options.questions);
	$('.categories').click(options.category);
	$('#startButton').click(trivia.start);
	$('.choice').click(trivia.guess);
	$('#resetButton').click(trivia.reset);
	$('.difficulty, .questions, .categories').hover(
		function(){
			$(this).addClass('hoverSelection');
		},
		function(){
			$(this).removeClass('hoverSelection');
		}
	);
	$('.choice').hover(
		function(){
			$(this).addClass('hoverChoices');
		}, function(){
			$(this).removeClass('hoverChoices');
		}
	);
}
var difficulty;
//This holds all the questions obtained from the object
var triviaQuestions;
//This holds the number of questions the user picks
var questions;
var numberOfQuestions = [5, 15, 25, 50];
var possibilities = 96;
var progressCategories;
var possibleCategories;
var lastCategory;
var errorResponseCategories;
var category;
var intervalId;
var countdownRunning = false;
var myToken;
var correct;
var userCorrect = 0;
var userIncorrect = 0;
var userTotal;
var searchText;
var apiurl;
var apiurlSize;
var myresult;
var difficultySetting = {
	easy: {
		5: [],
		15: [],
		25: [],
		50: []
	},
	medium: {
		5: [],
		15: [],
		25: [],
		50: []
	},
	hard: {
		5: [],
		15: [],
		25: [],
		50: []
	}
};


function checker(difficulty, number, category){
	var useToken = "https://opentdb.com/api.php"
	+ "?amount=" + number
	+ "&category=" + category
	+ "&difficulty=" + difficulty
	+ "&type=multiple";
	$.ajax({
		method: "GET",
		url: useToken,
		success: function(data) {
	        triviaQuestions = data.results;
	        if(data.response_code!==0){
	        	difficultySetting[difficulty][number].push(category);
	        }
	        possibilities--;
	        //update progress bar
	        progressCategories = (1-(possibilities/96))*100;
	        progressCategories = Math.round(progressCategories);
	       	$(".progress-bar").attr("aria-valuenow", progressCategories);
			$(".progress-bar").attr("style", "width: " + progressCategories + "%");
	        if(possibilities === 0) {
	        	$('#progress').hide();
	        	$('#numberOfQuestions').show();
	        }
	    }
	});
}
var options = {
	difficulty: function() {
		difficulty = $(this).attr('id');
		$('#difficulty').hide();
		$('#progress').show();
		for (i=0; i<numberOfQuestions.length; i++){
			for (j=9; j<33; j++) {
			checker(difficulty, numberOfQuestions[i], j);
			}
		}
	},
	questions: function() {
		questions = $(this).attr('data');
		$('#numberOfQuestions').hide();
		$('#category').show();
		errorResponseCategories = difficultySetting[difficulty][questions];
		for (i=0; i<errorResponseCategories.length; i++){
			$('#' + errorResponseCategories[i]).parent().hide();
		}
		possibleCategories = $('#category').find('.col-xs-6:visible').children();
		console.log(possibleCategories)
		if (possibleCategories.length%2 === 1){
			lastCategory = possibleCategories[possibleCategories.length - 1];
			$(lastCategory).parent().removeClass("col-xs-6");
			$(lastCategory).parent().addClass("col-xs-12");
		}
		for(i=0; i<possibleCategories.length; i++){
			if(i%4 === 0){
				$(possibleCategories[i]).addClass('green');
			}
			else if(i%4 === 1){
				$(possibleCategories[i]).addClass('skyblue');
			}
			else if(i%4 === 2){
				$(possibleCategories[i]).addClass('yellow');
			}
			else {
				$(possibleCategories[i]).addClass('softred');
			}
		}
	},
	category: function() {
		category = $(this).attr('id');
		$(lastCategory).parent().removeClass("col-xs-12");
		$(lastCategory).parent().addClass("col-xs-6");
		$(possibleCategories).removeClass('green skyblue yellow softred');
		$('#category').hide();
		token.pull();
	}
};
var token = {
	retrieve: function() {
		//The purpose of the session token is to not given the player the same questions once he has lost/won
		//This works by helping the server keep track of the questions that have already been requested
		var requestToken = "https://opentdb.com/api_token.php?command=request";
		$.get(requestToken, function(data) {
			myToken = data.token;
		});
	},
	pull: function() {
		//I am using the session token load all the questions
		var useToken = "https://opentdb.com/api.php"
		+ "?amount=" + questions
		+ "&category=" + category
		+ "&difficulty=" + difficulty
		+ "&type=multiple"
		+ "&token=" + myToken;
		$.get(useToken, function(data){
			console.log(data);
			questions = data.results;
			console.log(questions)
		});
		$('#initial').show();
	}
}
token.retrieve();
var trivia = {
	time: 30,
	start: function() {
		if (questions.length === 0) {
			trivia.endScreen();
		}
		else {
			trivia.time = 30;
			$('#initial').hide();
			$('#triviaQA').show();
			$('.response').empty();
			$('#guessResponse').hide();
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
			flickr.retrieve();
		}
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
			flickr.show();
			intervalId = setInterval(trivia.ranoutTime, 5000);
		}
	},
	ranoutTime: function() {
		clearInterval(intervalId);
		userIncorrect++;
		trivia.start();
	},
	correctAnswer: function() {
		clearInterval(intervalId);
		userCorrect++;
		trivia.start();
	},
	incorrectAnswer: function() {
		clearInterval(intervalId);
		userIncorrect++;
		trivia.start();
	},
	guess: function() {
		//This makes sure that the countdown timer stops
		clearInterval(intervalId);
		$('#triviaQA').hide();
		countdownRunning = true;
		if($(this).attr('data-answer') === correct){
			$('#response').html('GENIUS');
			$('#responseMessage').html("I don't know how you do it");
			intervalId = setInterval(trivia.correctAnswer, 1000);
		}
		else{
			$('#response').html('Incorrect');
			$('#responseMessage').html("The correct answer was " + correct);
			intervalId = setInterval(trivia.incorrectAnswer, 1000);
		}
		flickr.show();
	},
	endScreen: function() {
		userTotal = userCorrect + userIncorrect;
		$('#guessResponse').hide();
		$('#gameOver').show();
		$('#correctScore').html("Total correct questions: " + userCorrect);
		$('#incorrectScore').html("Total incorrect questions: " + userIncorrect);
		$('#totalScore').html("Total questions answered: " + userTotal);
	},
	reset: function() {
		$('#difficulty').show();
		$('#timer').empty();
		$('#gameOver').hide();
		userCorrect = 0;
		userIncorrect = 0;
		possibilities = 96;
		progressCategories = 0;
		errorResponseCategories = [];
		$(".progress-bar").attr("aria-valuenow", 0);
		$(".progress-bar").attr("style", "width: 0%");
	}
};
var flickr = {
	//I wrote it like this for readibility 
	retrieve: function() {
		//This accounts for spacing in the correct answer.
		searchText = correct.replace(/&#(\d{0,4});/g, function(fullStr, str) { return String.fromCharCode(str); });
		searchText = escape(searchText);
		console.log(searchText);
		apiurl = "https://api.flickr.com/services/rest/"
		+ "?method=flickr.photos.search"
		+ "&api_key=7c6549a01454c9b945a03306f1b05afe"
		+ "&text="
		+ searchText
		+ "&sort=relevance"
		//This makes sure I keep it as close to pg rated as I can
		+ "&safe_search=1"
		//This allows me to grab everything but screenshots
		+ "&content_type=6"
		//This allows me to not grab video
		+ "&media=photos"
		//Although I only want one image, I grab 10.
		//I do that because when I filter for pictures with a width of 500px I might not get a picture
		//This occurs when the most relevant picture is smaller than 500px
		//Flickrs api doesn't have a method of doing this
		+ "&per_page=10"
		+ "&format=json"
		+ "&nojsoncallback=1";
		console.log(searchText);
		console.log(apiurl);
		flickr.pull();
	},
	pull: function(){
		$.get(apiurl, function(json){
			//the each method allows me to adjust each one of the objects in the apiurl array
			//Because I called for 10 there are 10 to account for
			//This is what the i does
			$.each(json.photos.photo, function(i, myresult){
				apiurlSize = "https://api.flickr.com/services/rest/"
				+ "?method=flickr.photos.getSizes"
				+ "&api_key=7c6549a01454c9b945a03306f1b05afe"
				+ "&photo_id="
				//This grabs each object and calls on its id property
				+ myresult.id
				+ "&format=json"
				+ "&nojsoncallback=1";
				//I then get the 10 apiurlSize strings
				$.get(apiurlSize, function(size){
					//for each one of them I check whether or not they have a size of 500
					$.each(size.sizes.size, function(i, myresultSize){
						//if they do then i'll use the src property of that object and set it as my src attribute for my image
						//this is technically replacing the image over and over again until there isn't one left
						//so if there are 10 relevant pictures that have a size of 500px, then i'll change the src image 10 times
						//the last image being the one the client sees
						if(myresultSize.width ==500) {
							$('#responseImg').attr('src', myresultSize.source);
						}
					})
				})
			});
		});
	},
	show: function() {
		$('#guessResponse').show();
	}
};