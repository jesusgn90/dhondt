/* jshint esversion: 6 */
'use strict';

/**
 * D'hondt
 * @module dhondt-calculator
 */
{

    const calculateTotalVotes = (votes, blankVotes) => {
        let total = parseInt(blankVotes);

        for (let vote of votes) {
            total = parseInt(vote) + total;
        }

        return total;
    };

    const validateParties = (numberOfParties, minNumberOfVotes, votes, names, validatedVotes, validatedNames) => {
        let numberOfPartiesValidated = 0;

        for (let i = 0; i < numberOfParties; ++i) {
            if (votes[i] >= minNumberOfVotes) {
                validatedVotes[numberOfPartiesValidated] = votes[i];
                validatedNames[numberOfPartiesValidated] = names[i];
                numberOfPartiesValidated++;
            }
        }

        return numberOfPartiesValidated;
    };

    const newSeat = (votos, esc, num_par) => {

        let imax = 0, ct, max = 0;

        for (ct = 0; ct < num_par; ++ct) {
            if (max < (votos[ct] / (esc[ct] + 1))) {
                max = votos[ct] / (esc[ct] + 1);
                imax = ct;
            }
        }

        return imax;
    };

    const fillSeats = (mandates, seats, validatedVotes, numberOfPartiesValidated) => {
        let table = [];

        for (let i = 0; i < mandates; ++i) {
            seats[newSeat(validatedVotes, seats, numberOfPartiesValidated)]++;
            table.push(seats.slice());
        }

        return table;
    };

    const fillPartiesResult = (numberOfPartiesValidated, result, validatedNames, seats) => {
        for (let i = 0; i < numberOfPartiesValidated; ++i) {
            result.parties[validatedNames[i]] = seats[i];
        }
    };

    const fillResultVar = (numberOfVotes, minNumberOfVotes) => {
        return {
            numberOfVotes: numberOfVotes,
            minNumberOfVotes: minNumberOfVotes,
            parties: {}
        };
    };

    const calculateSeats = (votes, names, mandates, blankVotes, percentage) => {
        let numberOfParties = votes.length,
            numberOfVotes = calculateTotalVotes(votes, blankVotes),
            minNumberOfVotes = Math.ceil(numberOfVotes * percentage / 100),
            result = fillResultVar(numberOfVotes, minNumberOfVotes),
            seats, numberOfPartiesValidated, validatedVotes = [], validatedNames = [];

        numberOfPartiesValidated = validateParties(numberOfParties, minNumberOfVotes, votes, names, validatedVotes, validatedNames);

        seats = new Array(numberOfPartiesValidated).fill(0);

        let table = fillSeats(mandates, seats, validatedVotes, numberOfPartiesValidated);

        console.log(table);

        fillPartiesResult(numberOfPartiesValidated, result, validatedNames, seats);

        return result;
    };

    const checkParams = (votes, names, options) => {
        if (!(votes.constructor.toString().indexOf('Array') > -1) || !(names.constructor.toString().indexOf("Array") > -1)) {
            return new Error('Wrong params');
        }

        if (votes.length !== names.length) {
            return new Error('votes.length must to be equal to names.length');
        }

        if (typeof options !== 'object') {
            return new Error('Wrong options');
        }

        return false;
    };

    const compute = (votes, names, options) => {
        let error = checkParams(votes, names, options);
        if (!error) {
            return calculateSeats(votes, names, options.mandates, options.blankVotes, options.percentage);
        } else {
            console.log(error);
        }
    };

    const computeWithCallback = (votes, names, options, done) => {
        let error = checkParams(votes, names, options), result;
        result = calculateSeats(votes, names, options.mandates, options.blankVotes, options.percentage);
        done(error, result);
    };



    module.exports = {
        compute,
        computeWithCallback
    };

}
