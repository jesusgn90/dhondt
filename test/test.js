const Dhondt = require('../main');
const assert = require('chai').assert;

const options = {
    blankVotes: 0,
    percentage: 3,
    mandates  : 7
};

const parties = ['A', 'B', 'C', 'D', 'E'];
const votes   = [340000, 280000, 160000, 60000, 15000];

const validResult = {
    numberOfVotes   : 855000,
    minNumberOfVotes: 25650,
    parties         : {A: 3, B: 3, C: 1, D: 0}
};

let d = new Dhondt(votes, parties, options);

describe('Main calculate function', () => {

    it('Sync mode', () => {
        let result = d.compute();
        assert.deepEqual(result, validResult);
    });

    it('Async mode', (done) => {
        d.computeWithCallback((err, result) => {
            if (err) {
                return done(err);
            }
            assert.deepEqual(result, validResult);
            done();
        });
    });

    it('Async/Await mode', (done) => {
        d.computeWithPromise()
            .then((result) => {
                assert.deepEqual(result, validResult);
                done();
            });
    });

});