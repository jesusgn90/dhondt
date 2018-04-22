import 'babel-core/register'
import 'babel-polyfill'

export default class Dhondt {
    /**
     * Class constructor.
     * @param votes
     * @param names
     * @param options
     */
    constructor(votes, names, options) {
        this._votes   = votes;
        this._names   = names;
        this._options = options;
    }

    get votes() {
        return this._votes;
    }

    get names() {
        return this._names;
    }

    get options() {
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
            total += parseInt(vote);
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

        let imax = 0;
        let max  = 0;

        for (let ct = 0; ct < num_par; ++ct) {
            if (max < (votes[ct] / (esc[ct] + 1))) {
                max  = votes[ct] / (esc[ct] + 1);
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
     */
    fillSeats(mandates, seats, validatedVotes, numberOfPartiesValidated) {
        for (let i = 0; i < mandates; ++i) {
            seats[this.newSeat(validatedVotes, seats, numberOfPartiesValidated)]++;
        }
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
            numberOfVotes   : numberOfVotes,
            minNumberOfVotes: minNumberOfVotes,
            parties         : {}
        };
    }

    /**
     *
     * @return {{numberOfVotes: *, minNumberOfVotes: *, parties: {}}}
     */
    calculateSeats() {
        const numberOfParties          = this.votes.length;
        const numberOfVotes            = this.calculateTotalVotes(this.votes, this.options.blankVotes);
        const minNumberOfVotes         = Math.ceil(numberOfVotes * this.options.percentage / 100);
        const result                   = this.fillResultVar(numberOfVotes, minNumberOfVotes);
        const validatedVotes           = [];
        const validatedNames           = [];
        const numberOfPartiesValidated = this.validateParties(numberOfParties, minNumberOfVotes, this.votes, this.names, validatedVotes, validatedNames);
        const seats                    = new Array(numberOfPartiesValidated).fill(0);

        this.fillSeats(this.options.mandates, seats, validatedVotes, numberOfPartiesValidated);
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
        
        } else if (this.votes.length !== this.names.length) {
        
            return new Error('votes.length must to be equal to names.length');
        
        } else if (typeof this.options !== 'object') {
            
            return new Error('Wrong options');
        
        }

        return false;
    }

    /**
     *
     * @return {{numberOfVotes: *, minNumberOfVotes: *, parties: {}}}
     */
    compute() {
        const error = this.checkParams();
        if (!error) {
            return this.calculateSeats();
        } 
        console.log(error);
    }

    /**
     *
     * @param done
     */
    computeWithCallback(done) {
        const error  = this.checkParams();
        const result = this.calculateSeats();
        done(error, result);
    }

    /**
     *
     * @return {*|promise}
     */
    async computeWithPromise() {
        try{
            const error = this.checkParams();

            return error ? 
                   Promise.reject(error) :
                   await this.calculateSeats();

        } catch(error) {
            return Promise.reject(error)
        }
    }
}