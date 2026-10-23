import { DRAW, WON } from '../game.js'

function MoveHistory({ game, isGameOver }) {
  return (
    <section className="history-card" aria-labelledby="history-title">
      <div className="panel-heading history-heading">
        <div>
          <p className="section-kicker">THIS ROUND</p>
          <h2 id="history-title">Move history</h2>
        </div>
        <span className="history-total">{game.moves.length} MOVES</span>
      </div>

      {game.moves.length === 0 ? (
        <div className="empty-history">
          <span className="empty-history-icon" aria-hidden="true">↘</span>
          <p>Your moves will show up here.</p>
          <span>Make the first move to get started.</span>
        </div>
      ) : (
        <ol className="move-list" aria-live="polite">
          {[...game.moves].reverse().map((move, reverseIndex) => {
            const moveNumber = game.moves.length - reverseIndex
            return (
              <li className="move-row" key={`${moveNumber}-${move.cellIndex}`}>
                <span className="move-number">
                  {String(moveNumber).padStart(2, '0')}
                </span>
                <span className={`history-token history-${move.player.toLowerCase()}`}>
                  {move.player}
                </span>
                <span className="move-player">
                  {move.player === 'O' && game.mode === 'computer'
                    ? 'Computer'
                    : `Player ${move.player}`}
                </span>
                <span className="move-position">
                  R{Math.floor(move.cellIndex / 3) + 1} · C{(move.cellIndex % 3) + 1}
                </span>
              </li>
            )
          })}
        </ol>
      )}
      <div className="history-footer">
        <span className={`status-indicator${isGameOver ? ' status-complete' : ''}`} />
        {game.status === WON
          ? `Player ${game.winner} takes the round`
          : game.status === DRAW
            ? 'Round ended in a draw'
            : 'Round in progress'}
      </div>
    </section>
  )
}

export default MoveHistory
