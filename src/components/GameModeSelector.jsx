import { COMPUTER, TWO_PLAYER } from '../game.js'

function GameModeSelector({ mode, onSelect }) {
  return (
    <div className="mode-card">
      <div>
        <p className="section-kicker">CHOOSE YOUR GAME</p>
        <p className="mode-description">Same board, your kind of match.</p>
      </div>
      <div className="mode-switch" role="group" aria-label="Game mode">
        <button
          type="button"
          className={mode === TWO_PLAYER ? 'mode-active' : ''}
          aria-pressed={mode === TWO_PLAYER}
          onClick={() => onSelect(TWO_PLAYER)}
        >
          <span aria-hidden="true">♙♙</span>
          Two players
        </button>
        <button
          type="button"
          className={mode === COMPUTER ? 'mode-active' : ''}
          aria-pressed={mode === COMPUTER}
          onClick={() => onSelect(COMPUTER)}
        >
          <span aria-hidden="true">✦</span>
          vs computer
        </button>
      </div>
    </div>
  )
}

export default GameModeSelector
