'use strict';

var _index = require('../index');

var _index2 = _interopRequireDefault(_index);

var _chai = require('chai');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var options = {
    blankVotes: 0,
    percentage: 3,
    mandates: 7
};

var parties = ['A', 'B', 'C', 'D', 'E'];
var votes = [340000, 280000, 160000, 60000, 15000];

var validResult = {
    numberOfVotes: 855000,
    minNumberOfVotes: 25650,
    parties: { A: 3, B: 3, C: 1, D: 0 }
};

var d = new _index2.default(votes, parties, options);

describe('[Dhondt][compute]', function () {

    it('[Sync]', function () {
        var result = d.compute();
        _chai.assert.deepEqual(result, validResult);
    });

    it('[Async][Callback]', function (done) {
        d.computeWithCallback(function (err, result) {
            if (err) {
                return done(err);
            }
            _chai.assert.deepEqual(result, validResult);
            done();
        });
    });

    it('[Async][Promise]', function (done) {
        d.computeWithPromise().then(function (result) {
            _chai.assert.deepEqual(result, validResult);
            done();
        }).catch(done);
    });
});