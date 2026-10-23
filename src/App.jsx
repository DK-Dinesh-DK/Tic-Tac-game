import { useCallback, useEffect, useReducer, useState } from 'react'
import {
  appReducer,
  chooseComputerMove,
  COMPUTER,
  createAppState,
  DRAW,
  IN_PROGRESS,
  TWO_PLAYER,
  WON,
} from './game.js'
import GameBoard from './components/GameBoard.jsx'
import GameModeSelector from './components/GameModeSelector.jsx'
import MoveHistory from './components/MoveHistory.jsx'
import ResultDialog from './components/ResultDialog.jsx'
import Scoreboard from './components/Scoreboard.jsx'
import SessionPrompt from './components/SessionPrompt.jsx'
import {
  clearSavedSession,
  loadSavedSession,
  saveSession,
} from './sessionStorage.js'
import './App.css'

function hasSessionProgress({ game, scoreboard }) {
  return (
    game.moves.length > 0 ||
    game.mode !== TWO_PLAYER ||
    scoreboard.X > 0 ||
    scoreboard.O > 0 ||
    scoreboard.draws > 0
  )
}

function App() {
  const [initialSession] = useState(loadSavedSession)
  const [state, dispatch] = useReducer(
    appReducer,
    initialSession.savedState ?? createAppState(),
  )
  const [sessionReady, setSessionReady] = useState(
    initialSession.status === 'none',
  )
  const [storageError, setStorageError] = useState(initialSession.error)
  const { game, scoreboard } = state
  const computerTurn =
    game.mode === COMPUTER &&
    game.currentPlayer === 'O' &&
    game.status === IN_PROGRESS
  const isGameOver = game.status !== IN_PROGRESS

  const updateState = useCallback((action) => {
    const nextState = appReducer(state, action)
    dispatch(action)

    if (!sessionReady) return

    try {
      if (hasSessionProgress(nextState)) {
        saveSession(nextState)
      } else {
        clearSavedSession()
      }
      setStorageError('')
    } catch (error) {
      setStorageError(error.message)
    }
  }, [dispatch, sessionReady, state])

  useEffect(() => {
    if (!sessionReady || !computerTurn) return undefined

    const timer = window.setTimeout(() => {
      const cellIndex = chooseComputerMove(game.board)
      if (cellIndex !== null) {
        updateState({ type: 'move', player: 'O', cellIndex })
      }
    }, 420)

    return () => window.clearTimeout(timer)
  }, [computerTurn, game.board, sessionReady, updateState])

  useEffect(() => {
    if (!sessionReady) return undefined

    if (!hasSessionProgress(state)) return undefined

    function confirmLeave(event) {
      try {
        saveSession(state)
      } catch (error) {
        setStorageError(error.message)
      }

      event.preventDefault()
      event.returnValue = ''
    }

    window.addEventListener('beforeunload', confirmLeave)
    return () => window.removeEventListener('beforeunload', confirmLeave)
  }, [game.mode, game.moves.length, scoreboard, sessionReady, state])

  function continueSavedSession() {
    setSessionReady(true)
  }

  function startFreshSession() {
    let nextState = appReducer(state, { type: 'reset-game' })
    nextState = appReducer(nextState, { type: 'reset-scoreboard' })
    dispatch({ type: 'reset-game' })
    dispatch({ type: 'reset-scoreboard' })

    try {
      clearSavedSession()
      setStorageError('')
    } catch (error) {
      try {
        saveSession(nextState)
        setStorageError('')
      } catch (saveError) {
        setStorageError(`${error.message} ${saveError.message}`)
      }
    }
    setSessionReady(true)
  }

  const statusMessage =
    game.status === WON
      ? game.mode === COMPUTER && game.winner === 'O'
        ? 'The computer wins this round.'
        : `Player ${game.winner} wins this round!`
      : game.status === DRAW
        ? 'A draw. Nicely played.'
        : computerTurn
          ? 'Computer is thinking…'
          : `Player ${game.currentPlayer}'s turn`

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="Tic Tac Toe home">
          <span className="brand-mark" aria-hidden="true">
            <span>X</span>
            <span>O</span>
          </span>
          <span>tic tac toe</span>
        </a>
        <span className="session-label">
          <span className="session-dot" />
          Local game session
        </span>
      </header>
      {storageError && (
        <p className="storage-notice" role="alert">
          {storageError}
        </p>
      )}

      <section className="game-layout" aria-label="Tic Tac Toe game">
        <div className="play-column">
          <div className="intro">
            <p className="eyebrow">THE CLASSIC, REIMAGINED</p>
            <h1>A little friendly<br />competition.</h1>
            <p className="intro-copy">
              Take turns, think ahead, and make your mark.
            </p>
          </div>

          <GameBoard
            game={game}
            computerTurn={computerTurn}
            isGameOver={isGameOver}
            statusMessage={statusMessage}
            onMove={(player, cellIndex) =>
              updateState({ type: 'move', player, cellIndex })
            }
            onReset={() => updateState({ type: 'reset-game' })}
            onUndo={() => updateState({ type: 'undo' })}
          />
          <GameModeSelector
            mode={game.mode}
            onSelect={(mode) => updateState({ type: 'set-mode', mode })}
          />
        </div>

        <aside className="side-column">
          <Scoreboard
            scoreboard={scoreboard}
            mode={game.mode}
            onReset={() => updateState({ type: 'reset-scoreboard' })}
          />
          <MoveHistory game={game} isGameOver={isGameOver} />
          <p className="friendly-note">
            <span aria-hidden="true">✳</span>
            Good games are made one move at a time.
          </p>
        </aside>
      </section>

      <footer className="page-footer">
        <span>Made for the love of the game.</span>
        <span>Play fair. Have fun.</span>
      </footer>

      <ResultDialog
        game={game}
        scoreboard={scoreboard}
        enabled={sessionReady}
        onPlayAgain={() => updateState({ type: 'reset-game' })}
      />
      <SessionPrompt
        status={sessionReady ? 'none' : initialSession.status}
        error={storageError}
        onContinue={continueSavedSession}
        onStartFresh={startFreshSession}
      />
    </main>
  )
}

export default App
