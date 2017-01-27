# dhondt
Simple NodeJS module to calculate mandates using D'Hondt method.

## Usage

```
	let Dhondt = require('dhondt');
	let votes = [30,3,9],
		names = ['A','B','C'];
		options = {
			mandates: 3,
			blankVotes: 1,
			percentage: 2.6
		};
	let result = Dhondt.compute(votes,names,options);
	console.log(result);
```
