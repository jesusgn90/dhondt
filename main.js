/* jshint esversion: 6 */
const Q = require('q');

class Dhondt {
    /**
     * Class constructor.
     * @param votes
     * @param names
     * @param options
     */
    constructor(votes, names, options) {
        this._votes = votes;
        this._names = names;
        this._options = options;
    }

    get votes(){
        return this._votes;
    }

    get names(){
        return this._names;
    }

    get options(){
        return this._options;
    }

    /**
     *
     * @param votes
     * @param blankVotes
     * @return {Number}
     */
    calculateTotalVotes(votes, blankVotes) {
        let total = parseInt(blankVotes);

        for (let vote of votes) {
            total = parseInt(vote) + total;
        }

        return total;
    }

    /**
     *
     * @param numberOfParties
     * @param minNumberOfVotes
     * @param votes
     * @param names
     * @param validatedVotes
     * @param validatedNames
     * @return {number}
     */
    validateParties(numberOfParties, minNumberOfVotes, votes, names, validatedVotes, validatedNames) {
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

    /**
     *
     * @param votes
     * @param esc
     * @param num_par
     * @return {number}
     */
    newSeat(votes, esc, num_par) {

        let imax = 0, ct, max = 0;

        for (ct = 0; ct < num_par; ++ct) {
            if (max < (votes[ct] / (esc[ct] + 1))) {
                max = votes[ct] / (esc[ct] + 1);
                imax = ct;
            }
        }

        return imax;
    }

    /**
     *
     * @param mandates
     * @param seats
     * @param validatedVotes
     * @param numberOfPartiesValidated
     * @return {Array}
     */
    fillSeats(mandates, seats, validatedVotes, numberOfPartiesValidated) {
        let table = [];

        for (let i = 0; i < mandates; ++i) {
            seats[this.newSeat(validatedVotes, seats, numberOfPartiesValidated)]++;
            table.push(seats.slice());
        }

        return table;
    }

    /**
     *
     * @param numberOfPartiesValidated
     * @param result
     * @param validatedNames
     * @param seats
     */
    fillPartiesResult(numberOfPartiesValidated, result, validatedNames, seats) {
        for (let i = 0; i < numberOfPartiesValidated; ++i) {
            result.parties[validatedNames[i]] = seats[i];
        }
    }

    /**
     *
     * @param numberOfVotes
     * @param minNumberOfVotes
     * @return {{numberOfVotes: *, minNumberOfVotes: *, parties: {}}}
     */
    fillResultVar(numberOfVotes, minNumberOfVotes) {
        return {
            numberOfVotes: numberOfVotes,
            minNumberOfVotes: minNumberOfVotes,
            parties: {}
        };
    }

    /**
     *
     * @return {{numberOfVotes: *, minNumberOfVotes: *, parties: {}}}
     */
    calculateSeats() {
        let numberOfParties = this.votes.length;
        let numberOfVotes = this.calculateTotalVotes(this.votes, this.options.blankVotes);
        let minNumberOfVotes = Math.ceil(numberOfVotes * this.options.percentage / 100);
        let result = this.fillResultVar(numberOfVotes, minNumberOfVotes);
        let seats, numberOfPartiesValidated, validatedVotes = [], validatedNames = [];

        numberOfPartiesValidated = this.validateParties(numberOfParties, minNumberOfVotes, this.votes, this.names, validatedVotes, validatedNames);

        seats = new Array(numberOfPartiesValidated).fill(0);

        let table = this.fillSeats(this.options.mandates, seats, validatedVotes, numberOfPartiesValidated);

        this.fillPartiesResult(numberOfPartiesValidated, result, validatedNames, seats);

        return result;
    }

    /**
     *
     * @return {*}
     */
    checkParams() {
        if (!(this.votes.constructor.toString().includes('Array')) ||
            !(this.names.constructor.toString().includes('Array'))) {
            return new Error('Wrong params');
        }

        if (this.votes.length !== this.names.length) {
            return new Error('votes.length must to be equal to names.length');
        }

        if (typeof this.options !== 'object') {
            return new Error('Wrong options');
        }
        return false;
    }

    /**
     *
     * @return {{numberOfVotes: *, minNumberOfVotes: *, parties: {}}}
     */
    compute() {
        let error = this.checkParams();
        if (!error) {
            return this.calculateSeats();
        } else {
            console.log(error);
        }
    }

    /**
     *
     * @param done
     */
    computeWithCallback(done) {
        let error = this.checkParams(), result;
        result = this.calculateSeats();
        done(error, result);
    }

    /**
     *
     * @return {*|promise}
     */
    computeWithPromise() {
        let promise = Q.defer();
        let error = this.checkParams(), result;
        if (error) {
            promise.reject(error);
        } else {
            result = this.calculateSeats();
            promise.resolve(result);
        }
        return promise.promise;
    }
}
module.exports = Dhondt;