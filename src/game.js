export const TWO_PLAYER = 'two-player'
export const COMPUTER = 'computer'
export const IN_PROGRESS = 'in-progress'
export const WON = 'won'
export const DRAW = 'draw'

const WINNING_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
]

export function createGame(mode = TWO_PLAYER) {
  return {
    board: Array(9).fill(null),
    currentPlayer: 'X',
    mode,
    status: IN_PROGRESS,
    winner: null,
    winningCells: [],
    moves: [],
  }
}

function getResult(board) {
  const winningLine = WINNING_LINES.find(([a, b, c]) =>
    board[a] && board[a] === board[b] && board[a] === board[c],
  )

  if (winningLine) {
    return { status: WON, winner: board[winningLine[0]], winningCells: winningLine }
  }

  if (board.every(Boolean)) {
    return { status: DRAW, winner: null, winningCells: [] }
  }

  return { status: IN_PROGRESS, winner: null, winningCells: [] }
}

export function makeMove(game, player, cellIndex) {
  if (
    game.status !== IN_PROGRESS ||
    player !== game.currentPlayer ||
    !Number.isInteger(cellIndex) ||
    cellIndex < 0 ||
    cellIndex > 8 ||
    game.board[cellIndex]
  ) {
    return null
  }

  const board = [...game.board]
  board[cellIndex] = player

  return {
    ...game,
    board,
    ...getResult(board),
    currentPlayer: player === 'X' ? 'O' : 'X',
    moves: [...game.moves, { player, cellIndex }],
  }
}

export function undoMove(game) {
  if (game.status !== IN_PROGRESS || game.moves.length === 0) return game

  const moveCount = game.mode === COMPUTER ? Math.min(2, game.moves.length) : 1
  const remainingMoves = game.moves.slice(0, -moveCount)
  let restoredGame = createGame(game.mode)

  for (const move of remainingMoves) {
    restoredGame = makeMove(restoredGame, move.player, move.cellIndex)
  }

  return restoredGame
}

export function chooseComputerMove(board) {
  const available = board
    .map((cell, index) => (cell === null ? index : -1))
    .filter((index) => index !== -1)

  if (available.length === 0) return null

  for (const player of ['O', 'X']) {
    for (const cellIndex of available) {
      const trialBoard = [...board]
      trialBoard[cellIndex] = player
      if (getResult(trialBoard).status === WON) return cellIndex
    }
  }

  if (board[4] === null) return 4

  const corner = [0, 2, 6, 8].find((index) => board[index] === null)
  return corner ?? available[0]
}

export function appReducer(state, action) {
  switch (action.type) {
    case 'move': {
      const game = makeMove(state.game, action.player, action.cellIndex)
      if (!game) return state

      const scoreboard = { ...state.scoreboard }
      if (game.status === WON) scoreboard[game.winner] += 1
      if (game.status === DRAW) scoreboard.draws += 1

      return { ...state, game, scoreboard }
    }
    case 'undo':
      return { ...state, game: undoMove(state.game) }
    case 'reset-game':
      return { ...state, game: createGame(state.game.mode) }
    case 'set-mode':
      if (action.mode === state.game.mode) return state
      return { ...state, game: createGame(action.mode) }
    case 'reset-scoreboard':
      return { ...state, scoreboard: { X: 0, O: 0, draws: 0 } }
    default:
      return state
  }
}

export function createAppState() {
  return {
    game: createGame(),
    scoreboard: { X: 0, O: 0, draws: 0 },
  }
}
