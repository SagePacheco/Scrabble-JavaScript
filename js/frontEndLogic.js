// JavaScript Document
var timeStamp1,
	timeStamp2,
	inputObject,
	dictionaryWorker,
	workerDictionaryLoaded = false,
	$responseBlock = $("#responseBlock"),
	scoreMap = {
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

if (typeof(Worker) !== "undefined") {
    dictionaryWorker = new Worker("js/wordFinder.js");
    dictionaryWorker.onmessage = function(event){
    	if (workerDictionaryLoaded){
	    	timeStamp2 = performance.now();
	    	console.log("Finding the word took " + (timeStamp2 - timeStamp1) + " milliseconds.");
	    	var bestWord = JSON.parse(event.data);
	    	updateBestWordUI(bestWord);
	    } else {
	    	workerDictionaryLoaded = true;
	    	console.log("Ready to go");
	    	$('#loaderScreen').fadeOut();
	    }
    };
} else {
	console.log("No Worker support");
    // Sorry! No Web Worker support..
};

$.get('txt/sorted2.txt', function(data) {
	"use strict";
	var dictionary = [];
	var rawDictionary = data.split("\n");
	dictionary = rawDictionary.map(function(obj){
		return new ScrabbleWord(obj);
	});
	console.log("Dictionary Processed");
	dictionary = JSON.stringify(dictionary);
	dictionaryWorker.postMessage(dictionary);
}, 'text');

$("#letters").on('input', function(){
	"use strict";
    var userInput = $("#letters").val().toLowerCase();
    inputObject = new ScrabbleWord(userInput);
    if(userInput.length < 15){
        bestWordWorker(inputObject);
    }
});

function bestWordWorker(inputObject){
	timeStamp1 = performance.now();
	inputObject = JSON.stringify(inputObject);
	dictionaryWorker.postMessage(inputObject);
}

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

function updateBestWordUI(bestWord){
	var tileBuilder = "";
	if(bestWord !== null){
	    for(var i = 0; i < bestWord.letters.length; i++){
	        var currentLetter = bestWord.letters[i];
	        tileBuilder +=
	        "<div class='scrabbleTile'>" +
	        "<p class='tileLetter'>" +
	        currentLetter.toUpperCase() + 
	        "</p><p class='tileScore'>" +
	        scoreMap[currentLetter.toLowerCase()] +
	        "</p></div>";
	    }
	    $responseBlock.html(tileBuilder);
	} else {
	    $responseBlock.html("<h2>No words yet</h2>");
	}
}

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