// JavaScript Document

var processedDictionary = [];
$.get('txt/sorted2.txt', function(data) {
  "use strict";
  var rawDictionary = data.split("\n");
  processedDictionary = rawDictionary.map(function(obj){
	  return new scrabbleWord(obj);
  });
  console.log("Dictionary Processed");
}, 'text');

var scoreMap = {
	"a" : 1,
	"b" : 3,
	"c" : 3,
	"d" : 2,
	"e" : 1,
	"f" : 4,
	"g" : 2,
	"h" : 4,
	"i" : 1,
	"j" : 8,
	"k" : 5,
	"l" : 1,
	"m" : 3,
	"n" : 1,
	"o" : 1,
	"p" : 3,
	"q" : 10,
	"r" : 1,
	"s" : 1,
	"t" : 1,
	"u" : 1,
	"v" : 4,
	"w" : 4,
	"x" : 8,
	"y" : 4,
	"z" : 10
};

function scrabbleWord(letters) {
	"use strict";
	this.letters = letters.trim();
	this.returnLetters = function(){
			console.log(this.letters);
	};
	
	this.canBeSpelled = function(comparison){
		
		// Build Unique Letter Array
		var uniqueLetterArray = [];
		var uniqueLetters = "";
		for (var i = 0; i < this.letters.length; i++){
			var currentLetter = this.letters[i];
			if (typeof uniqueLetterArray[currentLetter] !== 'undefined') {
				uniqueLetterArray[currentLetter]++;
			} else {
				uniqueLetterArray[currentLetter] = 1;
				uniqueLetters += currentLetter;
			}
		}
		
		// Iterate comparison characters
		for (var i = 0; i < comparison.length; i++){
			var currentLetter = comparison[i];
			if (typeof uniqueLetterArray[currentLetter] !== 'undefined' && uniqueLetterArray[currentLetter] !== 0) {
				uniqueLetterArray[currentLetter]--;
			} 
		}
		
		var lettersNeeded = 0;
		for (var i = 0; i < uniqueLetters.length; i++){
			var currentLetter = uniqueLetters[i];
			lettersNeeded += uniqueLetterArray[currentLetter];
		}
		
		if (lettersNeeded <= 0){
//			console.log("comparing " + comparison + " and " + this.letters);
//			console.log("Returning true");
			return true;
		} else {
//			console.log("comparing " + comparison + " and " + this.letters);
//			console.log("Returning false");
			return false;
		}
	};
	
	this.getScore = function(){
		var score = 0;
		for (var i = 0; i < this.letters.length; i++){
			var currentLetter = this.letters[i];
			score += scoreMap[currentLetter];
		}
		return score;
	};
}

 var bestWordFinder = function(userInput){
	"use strict";
	var bestWord = "",
		bestScore = 0;
	for (var i = 0; i < processedDictionary.length; i++){
		if(processedDictionary[i].letters.length <= userInput.length){
			if(processedDictionary[i].canBeSpelled(userInput)){
//				console.log(processedDictionary[i].letters + " can be spelled");
				var wordScore = processedDictionary[i].getScore();
				if(wordScore > bestScore){
					bestWord = processedDictionary[i];
					bestScore = wordScore;
				}
			}
		} else {
			console.log("Checked " + i + " words");
			break;
		}
	}
	if (bestWord !== ""){
		return bestWord.letters;
	} else {
		return null;
	}
	 
 };

var responseBlock = $("#responseBlock");
$("#letters").on('input', function(){
	"use strict";
	var userInput = $("#letters").val();
	if(userInput.length < 15){
		var t0 = performance.now();
		var bestWord = bestWordFinder(userInput);
		var t1 = performance.now();
		console.log("Finding the word took " + (t1 - t0) + " milliseconds.");
		var tileBuilder = "";
			if(bestWord !== null){
				for(var i = 0; i < bestWord.length; i++){
					var currentLetter = bestWord[i];
					tileBuilder +=
					"<div class='scrabbleTile'>" +
					"<p class='tileLetter'>" +
					currentLetter + 
					"</p><p class='tileScore'>" +
					scoreMap[currentLetter] +
					"</p></div>";
				}
				responseBlock.html(tileBuilder);
			} else {
				responseBlock.html("<h2>No words yet</h2>");
			}
	}
});