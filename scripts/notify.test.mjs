import test from 'node:test'
import assert from 'node:assert/strict'
import { getChanges } from './notify.mjs'

const sites = [{ id: 'a' }, { id: 'b' }, { id: 'c' }, { id: 'd' }]
const check = (id, ok) => ({ id, ok })

test('находит только переходы между доступным и недоступным состоянием', () => {
  const current = [check('a', false), check('b', true), check('c', true), check('d', false)]
  const previous = [check('a', true), check('b', false), check('c', true), check('d', false)]
  assert.deepEqual(getChanges(sites, current, previous).map(({ check: item }) => item.id), ['a', 'b'])
})

test('первую проверку и неизвестные сайты не считает изменением доступности', () => {
  assert.equal(getChanges(sites, [check('a', false)], []).length, 0)
  assert.equal(getChanges(sites, [check('unknown', false)], [check('unknown', true)]).length, 0)
})
