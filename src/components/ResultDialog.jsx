import { useEffect, useRef } from 'react'
import { COMPUTER, DRAW, IN_PROGRESS } from '../game.js'

function ResultDialog({ game, scoreboard, onPlayAgain }) {
  const dialogRef = useRef(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (game.status !== IN_PROGRESS && !dialog.open) {
      dialog.showModal()
    } else if (game.status === IN_PROGRESS && dialog.open) {
      dialog.close()
    }
  }, [game.status])

  const isDraw = game.status === DRAW
  const computerWon = game.mode === COMPUTER && game.winner === 'O'
  const title = isDraw
    ? "It's a draw!"
    : computerWon
      ? 'Computer wins!'
      : `Player ${game.winner} wins!`
  const description = isDraw
    ? 'A well-played round by both sides.'
    : computerWon
      ? 'The computer takes this round.'
      : `Player ${game.winner} takes this round.`
  const roundScore = isDraw
    ? `${scoreboard.draws} draw${scoreboard.draws === 1 ? '' : 's'}`
    : `${game.winner} · ${scoreboard[game.winner]} win${scoreboard[game.winner] === 1 ? '' : 's'}`

  function handlePlayAgain() {
    dialogRef.current?.close()
    onPlayAgain()
  }

  return (
    <dialog
      className="result-dialog"
      ref={dialogRef}
      aria-labelledby="result-title"
      aria-describedby="result-description"
    >
      <div className={`result-banner ${isDraw ? 'result-banner-draw' : `result-banner-${game.winner?.toLowerCase()}`}`}>
        <span className="result-spark result-spark-left" aria-hidden="true">✦</span>
        <span className="result-emblem" aria-hidden="true">
          {isDraw ? '=' : game.winner}
        </span>
        <span className="result-spark result-spark-right" aria-hidden="true">✦</span>
      </div>
      <p className="result-kicker">ROUND COMPLETE</p>
      <h2 id="result-title">{title}</h2>
      <p className="result-description" id="result-description">{description}</p>

      <div className="result-stats" aria-label="Round details">
        <div className="result-stat">
          <span>GAME MODE</span>
          <strong>{game.mode === COMPUTER ? 'Vs computer' : 'Two players'}</strong>
        </div>
        <div className="result-stat">
          <span>TOTAL MOVES</span>
          <strong>{game.moves.length} of 9</strong>
        </div>
        <div className="result-stat">
          <span>ROUND SCORE</span>
          <strong>{roundScore}</strong>
        </div>
      </div>

      <div className="result-actions">
        <button
          className="button button-primary result-play-again"
          type="button"
          onClick={handlePlayAgain}
        >
          <span aria-hidden="true">↻</span>
          Play again
        </button>
        <form method="dialog">
          <button className="button button-secondary result-close" type="submit">
            Close
          </button>
        </form>
      </div>
    </dialog>
  )
}

export default ResultDialog
