import { expect, test } from 'vitest'
import { minutesDisplaying, timeDisplay } from './index'

/**
 * Test conversion of seconds to minutes format.
 */
test('100 secs in minutes', () => {
  const seconds: number = 100
  const expectedOutput: string = '01:40'
  expect(minutesDisplaying(seconds)).toBe(expectedOutput)
})

/**
 * Test conversion of larger number of seconds to minutes format.
 */
test('1000 secs in minutes', () => {
  const seconds: number = 1000
  const expectedOutput: string = '16:40'
  expect(minutesDisplaying(seconds)).toBe(expectedOutput)
})

/**
 * Test the timeDisplay function with a specific timestamp.
 */
test('use timeDisplay', () => {
  const timestamp: number = 1000
  const expectedOutput: string = '02:00, 1/1/1970'
  expect(timeDisplay(timestamp)).toBe(expectedOutput)
})
