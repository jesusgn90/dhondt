# dhondt-calculator

Simple NodeJS module to calculate mandates using D'Hondt method.

## Install

```
	$ npm install dhondt-calculator --save
```

## Usage with callback (async)

```
    let Dhondt = require('dhondt-calculator');
    
    let votes = [30,3,9],
        names = ['A','B','C'],
        options = {
            mandates: 3,
            blankVotes: 1,
            percentage: 2.6
        };
        
	Dhondt.computeWithCallback(votes,names,options,(error,result) => {
		console.log(error,result);
	});
```

## Usage without callback (sync)

```
	let Dhondt = require('dhondt-calculator');
	
	let votes = [30,3,9],
		names = ['A','B','C'],
		options = {
			mandates: 3,
			blankVotes: 1,
			percentage: 2.6
		};
		
	let result = Dhondt.compute(votes,names,options);
	
	console.log(result);
```

### Params

* __votes__
	+ Array of integers.
	+ It is the votes of each party.
* __names__
	+ Array of strings.
	+ The names of the parties.
* __options__
	+ Object with three fields
		+ __mandates__ (integer), the mandates to distribute.
		+ __blankVotes__ (integer), blank votes.
		+ __percentage__ (float), barrier percentage.

### Output

* If all went fine with the above example, it outputs:

```
	{
		numberOfVotes: 43,
    	minNumberOfVotes: 2,
 		parties: { A: 3, B: 0, C: 0 } 
 	}
```

* else:

```
	An error realated to wrong params.
```


