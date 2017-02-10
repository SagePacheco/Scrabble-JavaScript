var dictionary = [];
var dictionaryLoaded = false;
self.addEventListener('message', function(event) {
	if (!dictionaryLoaded){
		dictionary = JSON.parse(event.data);
		console.log("Dictionary loaded on worker");
		self.postMessage("dictionary loaded");
		dictionaryLoaded = true;
	} else {
		var inputObject = JSON.parse(event.data);
		bestWordFinder(inputObject);
	}
}, false);

function canBeSpelled(dictionaryObject, comparisonObject){
    var dictionaryMap = dictionaryObject.uniqueLetterMap;
    var comparisonMap = comparisonObject.uniqueLetterMap;
    for (var currentLetter in dictionaryMap){
    	if (typeof comparisonMap[currentLetter] === 'undefined' ||  dictionaryMap[currentLetter] > comparisonMap[currentLetter]) {
        	return false;
        }
	}
	return true;
};

function bestWordFinder(inputObject){
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
		bestWord = JSON.stringify(bestWord);
		self.postMessage(bestWord);
	} else {
		self.postMessage(null)
	}
};