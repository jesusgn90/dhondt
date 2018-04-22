import Dhondt     from '../index'
import { assert } from 'chai'

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

const d = new Dhondt(votes, parties, options);

describe('[Dhondt][compute]', () => {

    it('[Sync]', () => {
        const result = d.compute();
        assert.deepEqual(result, validResult);
    });

    it('[Async][Callback]', done => {
        d.computeWithCallback((err, result) => {
            if (err) {
                return done(err);
            }
            assert.deepEqual(result, validResult);
            done();
        });
    });

    it('[Async][Promise]', done => {
        d.computeWithPromise()
        .then(result => {
            assert.deepEqual(result, validResult);
            done();
        })
        .catch(done)
    });

});