export interface Result {
  numberOfVotes: number;
  minNumberOfVotes: number;
  parties: any;
}

interface Options {
  blankVotes: number;
  percentage: number;
  mandates: number;
}

export class Dhondt {
  private _votes: number[]
  private _names: string[]
  private _options: Options

  constructor(votes: number[], names: string[], options: Options) {
    this._votes = votes
    this._names = names
    this._options = options
  }

  get votes(): number[] {
    return this._votes
  }

  set votes(votes: number[]) {
    this._votes = [...votes]
  }

  get names(): string[] {
    return this._names
  }

  set names(names: string[]) {
    this._names = [...names]
  }

  get options(): Options {
    return this._options
  }

  set options(options: Options) {
    this._options = { ...options }
  }

  calculateTotalVotes(votes: number[], blankVotes: number): number {
    let total = blankVotes

    for (const vote of votes) {
      total += vote
    }

    return total
  }

  validateParties(
    numberOfParties: number,
    minNumberOfVotes: number,
    votes: number[],
    names: string[],
    validatedVotes: number[],
    validatedNames: string[]
  ): number {
    let validatedParties = 0

    for (let i = 0; i < numberOfParties; ++i) {
      if (votes[i] >= minNumberOfVotes) {
        validatedVotes[validatedParties] = votes[i]
        validatedNames[validatedParties] = names[i]
        validatedParties++
      }
    }

    return validatedParties
  }

  newSeat(
    validatedVotes: number[],
    seats: number[],
    validatedParties: number
  ): number {
    let imax = 0
    let max = 0

    for (let ct = 0; ct < validatedParties; ++ct) {
      if (max < validatedVotes[ct] / (seats[ct] + 1)) {
        max = validatedVotes[ct] / (seats[ct] + 1)
        imax = ct
      }
    }

    return imax
  }

  fillSeats(
    mandates: number,
    seats: number[],
    validatedVotes: number[],
    validatedParties: number
  ): void {
    let i
    for (i = 0; i < mandates; ++i) {
      seats[this.newSeat(validatedVotes, seats, validatedParties)]++
    }
  }

  fillPartiesResult(
    validatedVotes: number,
    result: Result,
    validatedNames: string[],
    seats: number[]
  ): void {
    let i
    for (i = 0; i < validatedVotes; ++i) {
      result.parties[validatedNames[i]] = seats[i]
    }
  }

  fillResultVar(numberOfVotes: number, minNumberOfVotes: number): Result {
    return {
      numberOfVotes,
      minNumberOfVotes,
      parties: {},
    }
  }

  calculateSeats(): Result {
    const numberOfParties = this.votes.length
    const numberOfVotes = this.calculateTotalVotes(
      this.votes,
      this.options.blankVotes
    )
    const minNumberOfVotes = Math.ceil(
      (numberOfVotes * this.options.percentage) / 100
    )
    const result = this.fillResultVar(numberOfVotes, minNumberOfVotes)
    const validatedVotes: number[] = []
    const validatedNames: string[] = []
    const numberOfPartiesValidated = this.validateParties(
      numberOfParties,
      minNumberOfVotes,
      this.votes,
      this.names,
      validatedVotes,
      validatedNames
    )

    const seats = new Array(numberOfPartiesValidated).fill(0)

    this.fillSeats(
      this.options.mandates,
      seats,
      validatedVotes,
      numberOfPartiesValidated
    )

    this.fillPartiesResult(
      numberOfPartiesValidated,
      result,
      validatedNames,
      seats
    )

    return result
  }

  checkParams(): Error | boolean {
    if (
      !this.votes.constructor.toString().includes('Array') ||
      !this.names.constructor.toString().includes('Array')
    ) {
      return new Error('Wrong params')
    } else if (this.votes.length !== this.names.length) {
      return new Error('votes.length must to be equal to names.length')
    } else if (typeof this.options !== 'object') {
      return new Error('Wrong options')
    }

    return false
  }

  compute(): Result | Error {
    const error = this.checkParams()
    if (!error) {
      return this.calculateSeats()
    }
    throw error
  }

  computeWithCallback(done: Function): void {
    const error = this.checkParams()
    const result = this.calculateSeats()
    done(error, result)
  }

  async computeWithPromise(): Promise<Result> {
    const error = this.checkParams()
    if (error) {
      throw error
    }
    return this.calculateSeats()
  }
}
