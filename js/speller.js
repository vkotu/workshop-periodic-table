export default {
	check,
	lookup,
};

var elements;
var symbols = {};

await loadPeriodicTable();


// ****************************

async function loadPeriodicTable() {
	elements = await (await fetch("periodic-table.json")).json();
	for(let element of elements){
		symbols[element.symbol.toLowerCase()] = element;
	}
}
function findCandidates(inputWord) {
	var oneLetterSymbols = [];
	var twoLetterSymbols = [];
	// collect one letter words 
	for(let i=0; i < inputWord.length; i++) {
		if(inputWord[i] in symbols &&
			!oneLetterSymbols.includes(inputWord[i])
		) {
			oneLetterSymbols.push(inputWord[i]);
		}

			// collect two-letter candidates
		if(i<= (inputWord.length -2)) {
			let two = inputWord.slice(i, i+2);
			if(two in symbols && !twoLetterSymbols.includes(two)) {
				twoLetterSymbols.push(two)
			}
		}
	}
	return [...twoLetterSymbols, ...oneLetterSymbols];
}

function spellWord(candidates, charsLeft) {
	if(charsLeft.length ===0 ){
		return [];
	}else {
		if(charsLeft.length >=2 ){
			let two = charsLeft.slice(0,2);
			let rest = charsLeft.slice(2);
			// found match?
			if(candidates.includes(two)){
				//more chars left?
				if(rest.length>0){
					let result = spellWord(candidates, rest);
					if(result.join("") === rest){
						return [two, ...result];
					}
				}else{
					return [two];
				}
			}
		}

		if(charsLeft.length >=1) {
			let one = charsLeft[0];
			let rest = charsLeft.slice(1);
			if(candidates.includes(one)){
				//more chars left?
				if(rest.length>0){
					let result = spellWord(candidates, rest);
					if(result.join("") === rest){
						return [one, ...result];
					}
				}else{
					return [one];
				}
			}
		}
	}
	return [];
}

function check(inputWord) {
	const candidates = findCandidates(inputWord);
	return spellWord(candidates, inputWord);
}

function lookup(elementSymbol) {
	return symbols[elementSymbol];
}
