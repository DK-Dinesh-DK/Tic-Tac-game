import assert from 'node:assert/strict'
import test from 'node:test'
import { createAppState, makeMove, TWO_PLAYER } from './game.js'
import { parseSavedSession } from './sessionStorage.js'

function createSavedSession() {
  const initial = createAppState()
  const game = makeMove(initial.game, 'X', 4)
  return {
    version: 1,
    game,
    scoreboard: { X: 2, O: 1, draws: 3 },
  }
}

test('restores a valid game and scoreboard from saved JSON', () => {
  const saved = createSavedSession()
  const restored = parseSavedSession(JSON.stringify(saved))

  assert.deepEqual(restored, {
    game: saved.game,
    scoreboard: saved.scoreboard,
  })
})

test('rejects malformed or unsupported saved sessions', () => {
  assert.throws(() => parseSavedSession('{not json'), SyntaxError)
  assert.throws(() => parseSavedSession(JSON.stringify({ version: 2 })))
})

test('rejects a save whose board does not match its move history', () => {
  const saved = createSavedSession()
  saved.game.board[0] = 'O'

  assert.throws(() => parseSavedSession(JSON.stringify(saved)), /does not match/)
})

test('rejects move history that tries to play after a completed game', () => {
  let game = createAppState().game
  for (const cellIndex of [0, 3, 1, 4, 2]) {
    game = makeMove(game, game.currentPlayer, cellIndex)
  }
  const saved = {
    version: 1,
    game: {
      ...game,
      moves: [...game.moves, { player: 'O', cellIndex: 5 }],
    },
    scoreboard: { X: 1, O: 0, draws: 0 },
  }

  assert.throws(() => parseSavedSession(JSON.stringify(saved)), /inconsistent/)
})

test('restores a saved computer mode', () => {
  const initial = createAppState()
  const saved = {
    version: 1,
    game: makeMove({ ...initial.game, mode: 'computer' }, 'X', 4),
    scoreboard: initial.scoreboard,
  }

  const restored = parseSavedSession(JSON.stringify(saved))
  assert.equal(restored.game.mode, 'computer')
  assert.notEqual(restored.game.mode, TWO_PLAYER)
})
