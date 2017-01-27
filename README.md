# dhondt-calculator
Simple NodeJS module to calculate mandates using D'Hondt method.

## Install

```
	$ npm install dhondt-calculator --save
```

## Usage

```
	let Dhondt = require('dhondt-calculator');
	let votes = [30,3,9],
		names = ['A','B','C'];
		options = {
			mandates: 3,
			blankVotes: 1,
			percentage: 2.6
		};
	let result = Dhondt.compute(votes,names,options);
	console.log(result);
	/* 
		{ 
			numberOfVotes: 43,
     		minNumberOfVotes: 2,
 	 		parties: { A: 3, B: 0, C: 0 } 
 	 	}
 	*/ 	 

```
