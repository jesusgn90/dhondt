/* jshint esversion: 6 */


/**
 * D'hondt
 * @module dhondt-calculator
 */
(function () {

    function compute(votes, names, options) {
        let error = checkParams(votes,names,options);
        if(!error){
            return calculateSeats(votes, names, options.mandates, options.blankVotes, options.percentage);
        }else{
            console.log(error);
        }
    }
    function checkParams(votes,names,options){
        if(!(votes.constructor.toString().indexOf("Array") > -1) || !(names.constructor.toString().indexOf("Array") > -1)) return new Error('Wrong params');
        if(votes.length !== names.length) return new Error('votes.length must to be equal to names.length');
        if(typeof options !== 'object') return new Error('Wrong options');
        return false;
    }

    function calculateTotalVotes(votes, blankVotes) {
        let total = parseInt(blankVotes);
        for (let i = 0, len = votes.length; i < len; ++i) {
            total = parseInt(votes[i]) + total;
        }
        return total;
    }

    function validateParties(numberOfParties, minNumberOfVotes, votes, names, validatedVotes, validatedNames) {
        let numberOfPartiesValidated = 0;
        for (let i = 0; i < numberOfParties; ++i) {
            if (votes[i] >= minNumberOfVotes) {
                validatedVotes[numberOfPartiesValidated] = votes[i];
                validatedNames[numberOfPartiesValidated] = names[i];
                numberOfPartiesValidated++;
            }
        }
        return numberOfPartiesValidated;
    }

    function newSeat(votos, esc, num_par) {
        let imax = 0, ct, max = 0;
        for (ct = 0; ct < num_par; ++ct) {
            if (max < (votos[ct] / (esc[ct] + 1))) {
                max = votos[ct] / (esc[ct] + 1);
                imax = ct;
            }
        }
        return imax;
    }

    function fillSeats(mandates, seats, validatedVotes, numberOfPartiesValidated) {
        let table = [];
        for (let i = 0; i < mandates; ++i) {
            seats[newSeat(validatedVotes, seats, numberOfPartiesValidated)]++;
            table.push(seats.slice());
        }
        return table;
    }

    function fillPartiesResult(numberOfPartiesValidated, result, validatedNames, seats) {
        for (let i = 0; i < numberOfPartiesValidated; ++i) {
            result.parties[validatedNames[i]] = seats[i];
        }
    }

    function calculateSeats(votes, names, mandates, blankVotes, percentage) {
        let numberOfParties = votes.length,
            numberOfVotes = calculateTotalVotes(votes, blankVotes),
            minNumberOfVotes = Math.ceil(numberOfVotes * percentage / 100),
            result = fillResultVar(numberOfVotes,minNumberOfVotes),
            seats, numberOfPartiesValidated, validatedVotes = [], validatedNames = [];

        numberOfPartiesValidated = validateParties(numberOfParties, minNumberOfVotes, votes, names, validatedVotes, validatedNames);
        seats = new Array(numberOfPartiesValidated).fill(0);
        let table = fillSeats(mandates, seats, validatedVotes, numberOfPartiesValidated);
        fillPartiesResult(numberOfPartiesValidated, result, validatedNames, seats);
        return result;
    }
    function fillResultVar(numberOfVotes,minNumberOfVotes){
        return {
            numberOfVotes: numberOfVotes,
                minNumberOfVotes: minNumberOfVotes,
            parties: {}
        };
    }
    module.exports = {
        compute: compute
    };
})();
