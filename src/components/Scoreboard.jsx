import { COMPUTER } from '../game.js'

function Scoreboard({ scoreboard, mode, onReset }) {
  const canReset =
    scoreboard.X > 0 || scoreboard.O > 0 || scoreboard.draws > 0

  return (
    <section className="score-card" aria-labelledby="score-title">
      <div className="panel-heading">
        <div>
          <p className="section-kicker">THE TALLY</p>
          <h2 id="score-title">Scoreboard</h2>
        </div>
        <span className="trophy" aria-hidden="true">✳</span>
      </div>
      <div className="score-grid" aria-label="Session scoreboard">
        <div className="score-item">
          <span className="score-symbol score-x">X</span>
          <span className="score-name">Player X</span>
          <strong>{scoreboard.X}</strong>
        </div>
        <div className="score-item">
          <span className="score-symbol score-o">O</span>
          <span className="score-name">
            {mode === COMPUTER ? 'Computer' : 'Player O'}
          </span>
          <strong>{scoreboard.O}</strong>
        </div>
        <div className="score-item score-draws">
          <span className="draw-symbol">=</span>
          <span className="score-name">Draws</span>
          <strong>{scoreboard.draws}</strong>
        </div>
      </div>
      <button
        className="text-button"
        type="button"
        disabled={!canReset}
        onClick={onReset}
      >
        Reset scoreboard <span aria-hidden="true">↗</span>
      </button>
    </section>
  )
}

export default Scoreboard
