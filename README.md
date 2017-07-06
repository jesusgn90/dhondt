# dhondt-calculator

[![https://img.shields.io/npm/v/dhondt-calculator.svg](https://img.shields.io/npm/v/dhondt-calculator.svg)](https://www.npmjs.com/package/dhondt-calculator)
[![https://img.shields.io/npm/dm/dhondt-calculator.svg](https://img.shields.io/npm/dm/dhondt-calculator.svg)](https://www.npmjs.com/package/dhondt-calculator)

Simple NodeJS module to calculate mandates using D'Hondt method.

## Important change since v1.0.8 

- Since v 1.0.8 was released, Dhondt works slightly different.
- Now, it uses ES6 class paradigm.
    - Now you must to create an instance.
- See details in this readme.
- Sorry about ES6 haters, but I love it!

## Install

```
	$ npm install dhondt-calculator --save
```

## Create an instance

```
    /* jshint esversion: 6 */

    /** This is the class require. */
    const DhontCalculator = require('dhondt-calculator');

    /** Some test params. */
    let votes = [30,3,9],
        names = ['A','B','C'],
        options = {
            mandates: 3,
            blankVotes: 1,
            percentage: 2.6
        };

    /** This is the instance. */
    const DhondtInstance = new DhontCalculator(votes,names,options);

```

## Usage with async+await (async)

Once you have created the instance, then:

```
    (async () => {
        try{
            let result = await DhondtInstance.computeWithPromise();
            console.log(result);
        } catch (err) {
            console.error(err);
        }
    })();
```

_Only ES7, Node 8+_

## Usage with callback (async)

Once you have created the instance, then:

```
	DhondtInstance.computeWithCallback((err,result) => {
		if(err){
		    console.error(err);
		} else {
		    console.log(result);
		}
	});
```


## Usage with promises (async)

Once you have created the instance, then:

```
	DhondtInstance.computeWithPromise()
	    .then((result) => console.log(result))
	    .catch((err) => console.log(err));
```

## Usage without callback (sync)

```
	let result = DhondtInstance.compute();
	
	console.log(result);
```

### Constructor Params

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


