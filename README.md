# D'Hondt calculator

[![CircleCI](https://circleci.com/gh/jesusgn90/dhondt/tree/master.svg?style=svg)](https://circleci.com/gh/jesusgn90/dhondt/tree/master)
[![https://img.shields.io/npm/v/dhondt-calculator.svg](https://img.shields.io/npm/v/dhondt-calculator.svg)](https://www.npmjs.com/package/dhondt-calculator)
[![https://img.shields.io/npm/dm/dhondt-calculator.svg](https://img.shields.io/npm/dm/dhondt-calculator.svg)](https://www.npmjs.com/package/dhondt-calculator)

Node.js module to calculate mandates using the D'Hondt method.

## Install

```sh
$ yarn add dhondt-calculator@latest
```

## Test

```sh
$ yarn install
$ yarn test
```

## Create an instance

```js
/** This is the class require. */
const { Dhondt } = require('dhondt-calculator');

/** Some test params. */
const votes = [30, 3, 9];
const names = ['A', 'B', 'C'];
const options = {
    mandates: 3,
    blankVotes: 1,
    percentage: 2.6
};

/** This is the instance */
const dhondt = new Dhondt(votes, names, options);
```

## Usage with async+await (async)

Once you have created the instance, then:

```js
const result = await dhondt.computeWithPromise();
```

## Usage with callback (async)

Once you have created the instance, then:

```js
dhondt.computeWithCallback((err, result) => {});
```

## Usage with classic promises (async)

Once you have created the instance, then:

```js
dhondt.computeWithPromise()
  .then(result => {})
  .catch(error => {});
```

## Usage without callback (sync)

```js
const result = dhondt.compute();
```

### Constructor Params

- **votes** `number[]` the votes of each party.
- **names** `string[]` the names of the parties.
- **options** `{blankVotes: number, percentage: number, mandates: number}` the constructor options.

### Output

- If all went fine with the above example, it outputs:

```js
{
	numberOfVotes: 43,
	minNumberOfVotes: 2,
	parties: { A: 3, B: 0, C: 0 }
}
```