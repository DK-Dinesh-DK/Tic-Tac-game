import {
  COMPUTER,
  createGame,
  DRAW,
  IN_PROGRESS,
  makeMove,
  TWO_PLAYER,
  WON,
} from './game.js'

export const SESSION_STORAGE_KEY = 'tic-tac-game-session'

function isNonNegativeInteger(value) {
  return Number.isInteger(value) && value >= 0
}

export function parseSavedSession(raw) {
  const saved = JSON.parse(raw)
  const game = saved?.game
  const scoreboard = saved?.scoreboard

  if (
    saved?.version !== 1 ||
    !game ||
    ![TWO_PLAYER, COMPUTER].includes(game.mode) ||
    !Array.isArray(game.moves) ||
    game.moves.length > 9 ||
    !scoreboard ||
    !isNonNegativeInteger(scoreboard.X) ||
    !isNonNegativeInteger(scoreboard.O) ||
    !isNonNegativeInteger(scoreboard.draws)
  ) {
    throw new Error('Saved game data is incomplete or unsupported.')
  }

  let replayedGame = createGame(game.mode)
  for (const move of game.moves) {
    if (
      !move ||
      !['X', 'O'].includes(move.player) ||
      !Number.isInteger(move.cellIndex)
    ) {
      throw new Error('Saved move history is invalid.')
    }

    replayedGame = makeMove(replayedGame, move.player, move.cellIndex)
    if (!replayedGame) {
      throw new Error('Saved move history is inconsistent.')
    }
  }

  if (
    replayedGame.status !== game.status ||
    replayedGame.currentPlayer !== game.currentPlayer ||
    replayedGame.winner !== game.winner ||
    JSON.stringify(replayedGame.board) !== JSON.stringify(game.board) ||
    JSON.stringify(replayedGame.winningCells) !== JSON.stringify(game.winningCells)
  ) {
    throw new Error('Saved game state does not match its move history.')
  }

  if (
    game.status !== IN_PROGRESS &&
    game.status !== WON &&
    game.status !== DRAW
  ) {
    throw new Error('Saved game status is invalid.')
  }

  return { game: replayedGame, scoreboard }
}

function describeStorageError(action, error) {
  const detail = error instanceof Error ? ` ${error.message}` : ''
  return `Could not ${action} game data in this browser.${detail}`
}

export function loadSavedSession() {
  let raw
  try {
    raw = window.localStorage.getItem(SESSION_STORAGE_KEY)
  } catch (error) {
    return {
      status: 'unavailable',
      error: describeStorageError('read', error),
    }
  }

  if (raw === null) return { status: 'none', savedState: null, error: '' }

  try {
    return {
      status: 'saved',
      savedState: parseSavedSession(raw),
      error: '',
    }
  } catch (error) {
    const detail = error instanceof Error ? error.message : 'Unknown data error.'
    return {
      status: 'invalid',
      savedState: null,
      error: `Previous game data could not be restored. ${detail}`,
    }
  }
}

export function saveSession(state) {
  try {
    window.localStorage.setItem(
      SESSION_STORAGE_KEY,
      JSON.stringify({ version: 1, ...state }),
    )
  } catch (error) {
    throw new Error(describeStorageError('save', error), { cause: error })
  }
}

export function clearSavedSession() {
  try {
    window.localStorage.removeItem(SESSION_STORAGE_KEY)
  } catch (error) {
    throw new Error(describeStorageError('clear', error), { cause: error })
  }
}
