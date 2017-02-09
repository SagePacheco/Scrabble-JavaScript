// JavaScript Document


var dictionary = [];
$.get('txt/sorted2.txt', function(data) {
	 "use strict";
	 var rawDictionary = data.split("\n");
	 dictionary = rawDictionary.map(function(obj){
	     return new ScrabbleWord(obj);
	 });
	 console.log("Dictionary Processed");
}, 'text');

// var dictionary;
// $.getJSON('txt/dictionary.json', function(json) {
//     dictionary = json;
//     console.log("Dictionary Loaded");
// });

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

function ScrabbleWord(letters) {
	"use strict";
	this.letters = letters.trim();
    this.wordSize = this.letters.length;
    this.wordScore = 0;
    this.uniqueLetterMap = {};
    this.uniqueLetters = "";
    this.mapLetters = function(){
        // Build Unique Letter Array
		for (var i = 0; i < this.wordSize; i++){
			var currentLetter = this.letters[i];
            this.wordScore += scoreMap[currentLetter];
			if (typeof this.uniqueLetterMap[currentLetter] !== 'undefined') {
				this.uniqueLetterMap[currentLetter]++;
			} else {
				this.uniqueLetterMap[currentLetter] = 1;
				this.uniqueLetters += currentLetter;
			}
		}
    }
    this.mapLetters();
}

var canBeSpelled = function(dictionaryObject, comparisonObject){
    var dictionaryMap = dictionaryObject.uniqueLetterMap;
    var comparisonMap = comparisonObject.uniqueLetterMap;
    for (var currentLetter in dictionaryMap){
    	if (typeof comparisonMap[currentLetter] === 'undefined' ||  dictionaryMap[currentLetter] > comparisonMap[currentLetter]) {
        	return false;
        }
	}
	return true;
};

 var bestWordFinder = function(inputObject){
	"use strict";
	var bestWord = "",
		bestScore = 0;
	for (var i = 0; i < dictionary.length; i++){
		if(dictionary[i].wordSize <= inputObject.wordSize){
			if(canBeSpelled(dictionary[i], inputObject)){
				var currentWordScore = dictionary[i].wordScore;
				if(currentWordScore > bestScore){
					bestWord = dictionary[i];
					bestScore = currentWordScore;
				}
			}
		} else {
			console.log("Checked " + i + " words");
			break;
		}
	}
	if (bestWord !== ""){
		return bestWord.letters.toUpperCase();
	} else {
		return null;
	}
	 
 };

var inputObject,
	$responseBlock = $("#responseBlock");
$("#letters").on('input', function(){
	"use strict";
        var userInput = $("#letters").val();
        inputObject = new ScrabbleWord(userInput);
        if(userInput.length < 15){
            var t0 = performance.now();
            var bestWord = bestWordFinder(inputObject);
            console.log("Best word is " + bestWord);
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
                        scoreMap[currentLetter.toLowerCase()] +
                        "</p></div>";
                    }
                    $responseBlock.html(tileBuilder);
                } else {
                    $responseBlock.html("<h2>No words yet</h2>");
                }
        }   
});

function testEfficiency(){
    var t0 = performance.now();
    var inputObject = new ScrabbleWord("aeoiuodopoieoi");
    inputObject.mapLetters();
    var bestWord = bestWordFinder(inputObject);
    var t1 = performance.now();
    var duration = t1 - t0;
    var lowBenchMark = 120;
    var highBenchMark = 150;
    console.log("Finding the word took " + duration + " milliseconds.");
    if(duration < lowBenchMark){console.log("Efficiency has improved");}
    else if(duration >= lowBenchMark && duration <= highBenchMark){
        console.log("Efficiency is the same");
    } else {
        console.log("Efficiency is worse");
    }
}