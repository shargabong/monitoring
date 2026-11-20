import { expect, it } from 'vitest'
import { sitesWord } from './plural'

it.each([
  [1, 'сайт'],
  [3, 'сайта'],
  [6, 'сайтов'],
  [11, 'сайтов'],
  [12, 'сайтов'],
  [21, 'сайт'],
  [24, 'сайта'],
  [111, 'сайтов'],
])('%i — %s', (count, word) => {
  expect(sitesWord(count)).toBe(word)
})
