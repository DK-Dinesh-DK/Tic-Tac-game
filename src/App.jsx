import { useEffect, useReducer } from 'react'
import {
  appReducer,
  chooseComputerMove,
  COMPUTER,
  createAppState,
  DRAW,
  IN_PROGRESS,
  WON,
} from './game.js'
import GameBoard from './components/GameBoard.jsx'
import GameModeSelector from './components/GameModeSelector.jsx'
import MoveHistory from './components/MoveHistory.jsx'
import ResultDialog from './components/ResultDialog.jsx'
import Scoreboard from './components/Scoreboard.jsx'
import './App.css'

function App() {
  const [state, dispatch] = useReducer(appReducer, undefined, createAppState)
  const { game, scoreboard } = state
  const computerTurn =
    game.mode === COMPUTER &&
    game.currentPlayer === 'O' &&
    game.status === IN_PROGRESS
  const isGameOver = game.status !== IN_PROGRESS

  useEffect(() => {
    if (!computerTurn) return undefined

    const timer = window.setTimeout(() => {
      const cellIndex = chooseComputerMove(game.board)
      if (cellIndex !== null) {
        dispatch({ type: 'move', player: 'O', cellIndex })
      }
    }, 420)

    return () => window.clearTimeout(timer)
  }, [computerTurn, game.board])

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
              dispatch({ type: 'move', player, cellIndex })
            }
            onReset={() => dispatch({ type: 'reset-game' })}
            onUndo={() => dispatch({ type: 'undo' })}
          />
          <GameModeSelector
            mode={game.mode}
            onSelect={(mode) => dispatch({ type: 'set-mode', mode })}
          />
        </div>

        <aside className="side-column">
          <Scoreboard
            scoreboard={scoreboard}
            mode={game.mode}
            onReset={() => dispatch({ type: 'reset-scoreboard' })}
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
        onPlayAgain={() => dispatch({ type: 'reset-game' })}
      />
    </main>
  )
}

export default App
