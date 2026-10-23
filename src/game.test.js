import assert from 'node:assert/strict'
import test from 'node:test'
import {
  appReducer,
  chooseComputerMove,
  COMPUTER,
  createAppState,
  createGame,
  DRAW,
  IN_PROGRESS,
  makeMove,
  TWO_PLAYER,
  undoMove,
  WON,
} from './game.js'

function play(game, moves) {
  return moves.reduce((current, cellIndex) => {
    const next = makeMove(current, current.currentPlayer, cellIndex)
    assert.ok(next, `Expected move at cell ${cellIndex} to be valid`)
    return next
  }, game)
}

test('accepts a valid move, records it, and switches turns', () => {
  const game = makeMove(createGame(), 'X', 0)

  assert.equal(game.board[0], 'X')
  assert.equal(game.currentPlayer, 'O')
  assert.deepEqual(game.moves, [{ player: 'X', cellIndex: 0 }])
})

test('rejects occupied, out-of-range, fractional, and wrong-player moves', () => {
  const game = makeMove(createGame(), 'X', 0)

  assert.equal(makeMove(game, 'O', 0), null)
  assert.equal(makeMove(game, 'O', 9), null)
  assert.equal(makeMove(game, 'O', 1.5), null)
  assert.equal(makeMove(game, 'X', 1), null)
  assert.equal(game.moves.length, 1)
})

test('detects wins across rows, columns, and both diagonals', () => {
  const wins = [
    [0, 3, 1, 4, 2],
    [0, 1, 3, 2, 6],
    [0, 1, 4, 2, 8],
    [2, 0, 4, 1, 6],
  ]

  for (const sequence of wins) {
    const game = play(createGame(), sequence)
    assert.equal(game.status, WON)
    assert.equal(game.winner, 'X')
    assert.equal(game.winningCells.length, 3)
  }
})

test('detects a draw when the board fills without a winner', () => {
  const game = play(createGame(), [0, 1, 2, 4, 3, 5, 7, 6, 8])

  assert.equal(game.status, DRAW)
  assert.equal(game.winner, null)
  assert.equal(game.board.every(Boolean), true)
})

test('rejects moves after a game is completed', () => {
  const game = play(createGame(), [0, 3, 1, 4, 2])

  assert.equal(makeMove(game, 'O', 5), null)
})

test('resets a game without changing the scoreboard', () => {
  const wonState = [0, 3, 1, 4, 2].reduce(
    (state, cellIndex) =>
      appReducer(state, {
        type: 'move',
        player: state.game.currentPlayer,
        cellIndex,
      }),
    createAppState(),
  )
  const resetState = appReducer(wonState, { type: 'reset-game' })

  assert.deepEqual(resetState.scoreboard, { X: 1, O: 0, draws: 0 })
  assert.deepEqual(resetState.game, createGame())
})

test('undoes only the latest move in two-player mode', () => {
  const game = play(createGame(TWO_PLAYER), [0, 4])
  const undone = undoMove(game)

  assert.equal(undone.board[0], 'X')
  assert.equal(undone.board[4], null)
  assert.equal(undone.currentPlayer, 'O')
  assert.equal(undone.moves.length, 1)
})

test('undoes the human and computer move pair in computer mode', () => {
  const game = play(createGame(COMPUTER), [0, 4, 8, 2])
  const undone = undoMove(game)

  assert.equal(undone.board[0], 'X')
  assert.equal(undone.board[4], 'O')
  assert.equal(undone.board[8], null)
  assert.equal(undone.board[2], null)
  assert.equal(undone.currentPlayer, 'X')
  assert.equal(undone.moves.length, 2)
})

test('undoes the opening human move while the computer is still thinking', () => {
  const game = makeMove(createGame(COMPUTER), 'X', 0)
  const undone = undoMove(game)

  assert.deepEqual(undone, createGame(COMPUTER))
})

test('updates each scoreboard result once and resets scores separately', () => {
  let state = createAppState()
  for (const cellIndex of [0, 3, 1, 4, 2]) {
    state = appReducer(state, {
      type: 'move',
      player: state.game.currentPlayer,
      cellIndex,
    })
  }

  assert.deepEqual(state.scoreboard, { X: 1, O: 0, draws: 0 })
  assert.equal(
    appReducer(state, { type: 'move', player: 'O', cellIndex: 5 }),
    state,
  )
  assert.deepEqual(
    appReducer(state, { type: 'reset-scoreboard' }).scoreboard,
    { X: 0, O: 0, draws: 0 },
  )
})

test('increments the draw count when the game ends in a draw', () => {
  let state = createAppState()
  for (const cellIndex of [0, 1, 2, 4, 3, 5, 7, 6, 8]) {
    state = appReducer(state, {
      type: 'move',
      player: state.game.currentPlayer,
      cellIndex,
    })
  }

  assert.equal(state.game.status, DRAW)
  assert.equal(state.scoreboard.draws, 1)
})

test('computer chooses a winning move before blocking an opponent', () => {
  assert.equal(chooseComputerMove(['O', 'O', null, 'X', 'X', null, null, null, null]), 2)
  assert.equal(chooseComputerMove(['X', 'X', null, null, 'O', null, null, null, null]), 2)
})

test('computer takes center, then a corner, then any available cell', () => {
  assert.equal(chooseComputerMove(Array(9).fill(null)), 4)
  assert.equal(chooseComputerMove(['X', null, null, null, 'O', null, null, null, null]), 2)
  assert.equal(chooseComputerMove(['X', 'O', 'X', 'O', 'X', null, 'O', 'X', 'O']), 5)
  assert.equal(chooseComputerMove(Array(9).fill('X')), null)
})

test('returns the current status unchanged for an invalid move', () => {
  const game = createGame()

  assert.equal(game.status, IN_PROGRESS)
  assert.equal(makeMove(game, 'O', 0), null)
})
