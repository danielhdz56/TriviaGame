# TriviaGame
### Overview
I created a Trivia game using JavaScript for the logic and jQuery to manipulate the HTML. This app is layed out with valid HTML and stylish CSS.
### Special Features 
* Instead of manually inputing questions and images I used AJAX to retrieve data from two API's.
#### Flickr API
* Images: The image that is rendered is based on the correct answer. I use Flickr's most popular algorithm. 
#### OpenTDB
* Trivia Questions: I use this API to access questions based on difficulty level, number of questions, and categories.
- - -
### Details
* The trivia game only shows one question until the player answers it or their time runs out.

* If the player selects the correct answer, they are shown a screen congratulating them for choosing the right option. After a few seconds, the next question is displayed -- this is done without user input.

* The scenario is similar for wrong answers and time-outs.

  * If the player runs out of time, the player is told that the time is up and the correct answer. After a few seconds the player is shown the next question.
  * If the player chooses the wrong answer, tell the player they selected the wrong option and then display the correct answer. Wait a few seconds, then show the next question.

* On the final screen, the number of correct answers, incorrect answers, and an option to restart the game (without reloading the page) is shown.
