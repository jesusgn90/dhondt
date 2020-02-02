import { Dhondt, Result } from '../../../src'

const options = {
  blankVotes: 0,
  percentage: 3,
  mandates: 7,
}

const parties = ['A', 'B', 'C', 'D', 'E']
const votes = [340000, 280000, 160000, 60000, 15000]

const validResult = {
  numberOfVotes: 855000,
  minNumberOfVotes: 25650,
  parties: { A: 3, B: 3, C: 1, D: 0 },
}

const d = new Dhondt(votes, parties, options)

describe('dhondt', () => {
  it('sync', () => {
    expect(d.compute()).toEqual(validResult)
  })

  it('callback', done => {
    d.computeWithCallback((err: Error, result: Result) => {
      if (err) {
        return done(err)
      }
      expect(result).toEqual(validResult)
      done()
    })
  })

  it('async', async () => {
    expect(await d.computeWithPromise()).toEqual(validResult)
  })
})
