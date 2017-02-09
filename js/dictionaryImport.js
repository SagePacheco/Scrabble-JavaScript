self.addEventListener('message', function() {
	console.log("starting call");
	callDictionaryFile();
}, false);

function callDictionaryFile(){
	var xhr = new XMLHttpRequest();
	xhr.open('GET', '../txt/sorted2.txt');
	xhr.send(null);

	xhr.onreadystatechange = function () {
		if (xhr.readyState === 4) {
			if (xhr.status === 200) {
				console.log("successful call");
				processDictionary(xhr.responseText); // 'This is the returned text.'
			} else {
				console.log('Error: ' + xhr.status); // An error occurred during the request.
				console.log("another error")
			}
		}
	}
}

var dictionary = [];
function processDictionary(dictionaryPile){
	"use strict";
	var rawDictionary = dictionaryPile.split("\n");
	dictionary = rawDictionary.map(function(obj){
		return new ScrabbleWord(obj);
	});
	console.log("Dictionary Processed");
	self.postMessage(JSON.stringify(dictionary));
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