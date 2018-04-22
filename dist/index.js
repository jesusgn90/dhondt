'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

require('babel-core/register');

require('babel-polyfill');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Dhondt = function () {
    /**
     * Class constructor.
     * @param votes
     * @param names
     * @param options
     */
    function Dhondt(votes, names, options) {
        (0, _classCallCheck3.default)(this, Dhondt);

        this._votes = votes;
        this._names = names;
        this._options = options;
    }

    (0, _createClass3.default)(Dhondt, [{
        key: 'calculateTotalVotes',


        /**
         *
         * @param votes
         * @param blankVotes
         * @return {Number}
         */
        value: function calculateTotalVotes(votes, blankVotes) {
            var total = parseInt(blankVotes);

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = votes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var vote = _step.value;

                    total += parseInt(vote);
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
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

    }, {
        key: 'validateParties',
        value: function validateParties(numberOfParties, minNumberOfVotes, votes, names, validatedVotes, validatedNames) {
            var numberOfPartiesValidated = 0;

            for (var i = 0; i < numberOfParties; ++i) {
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

    }, {
        key: 'newSeat',
        value: function newSeat(votes, esc, num_par) {

            var imax = 0;
            var max = 0;

            for (var ct = 0; ct < num_par; ++ct) {
                if (max < votes[ct] / (esc[ct] + 1)) {
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
         */

    }, {
        key: 'fillSeats',
        value: function fillSeats(mandates, seats, validatedVotes, numberOfPartiesValidated) {
            for (var i = 0; i < mandates; ++i) {
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

    }, {
        key: 'fillPartiesResult',
        value: function fillPartiesResult(numberOfPartiesValidated, result, validatedNames, seats) {
            for (var i = 0; i < numberOfPartiesValidated; ++i) {
                result.parties[validatedNames[i]] = seats[i];
            }
        }

        /**
         *
         * @param numberOfVotes
         * @param minNumberOfVotes
         * @return {{numberOfVotes: *, minNumberOfVotes: *, parties: {}}}
         */

    }, {
        key: 'fillResultVar',
        value: function fillResultVar(numberOfVotes, minNumberOfVotes) {
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

    }, {
        key: 'calculateSeats',
        value: function calculateSeats() {
            var numberOfParties = this.votes.length;
            var numberOfVotes = this.calculateTotalVotes(this.votes, this.options.blankVotes);
            var minNumberOfVotes = Math.ceil(numberOfVotes * this.options.percentage / 100);
            var result = this.fillResultVar(numberOfVotes, minNumberOfVotes);
            var validatedVotes = [];
            var validatedNames = [];
            var numberOfPartiesValidated = this.validateParties(numberOfParties, minNumberOfVotes, this.votes, this.names, validatedVotes, validatedNames);
            var seats = new Array(numberOfPartiesValidated).fill(0);

            this.fillSeats(this.options.mandates, seats, validatedVotes, numberOfPartiesValidated);
            this.fillPartiesResult(numberOfPartiesValidated, result, validatedNames, seats);

            return result;
        }

        /**
         *
         * @return {*}
         */

    }, {
        key: 'checkParams',
        value: function checkParams() {
            if (!this.votes.constructor.toString().includes('Array') || !this.names.constructor.toString().includes('Array')) {

                return new Error('Wrong params');
            } else if (this.votes.length !== this.names.length) {

                return new Error('votes.length must to be equal to names.length');
            } else if ((0, _typeof3.default)(this.options) !== 'object') {

                return new Error('Wrong options');
            }

            return false;
        }

        /**
         *
         * @return {{numberOfVotes: *, minNumberOfVotes: *, parties: {}}}
         */

    }, {
        key: 'compute',
        value: function compute() {
            var error = this.checkParams();
            if (!error) {
                return this.calculateSeats();
            }
            console.log(error);
        }

        /**
         *
         * @param done
         */

    }, {
        key: 'computeWithCallback',
        value: function computeWithCallback(done) {
            var error = this.checkParams();
            var result = this.calculateSeats();
            done(error, result);
        }

        /**
         *
         * @return {*|promise}
         */

    }, {
        key: 'computeWithPromise',
        value: function () {
            var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
                var error;
                return _regenerator2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.prev = 0;
                                error = this.checkParams();

                                if (!error) {
                                    _context.next = 6;
                                    break;
                                }

                                _context.t0 = Promise.reject(error);
                                _context.next = 9;
                                break;

                            case 6:
                                _context.next = 8;
                                return this.calculateSeats();

                            case 8:
                                _context.t0 = _context.sent;

                            case 9:
                                return _context.abrupt('return', _context.t0);

                            case 12:
                                _context.prev = 12;
                                _context.t1 = _context['catch'](0);
                                return _context.abrupt('return', Promise.reject(_context.t1));

                            case 15:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this, [[0, 12]]);
            }));

            function computeWithPromise() {
                return _ref.apply(this, arguments);
            }

            return computeWithPromise;
        }()
    }, {
        key: 'votes',
        get: function get() {
            return this._votes;
        }
    }, {
        key: 'names',
        get: function get() {
            return this._names;
        }
    }, {
        key: 'options',
        get: function get() {
            return this._options;
        }
    }]);
    return Dhondt;
}();

exports.default = Dhondt;