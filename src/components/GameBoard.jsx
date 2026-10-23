import { IN_PROGRESS, WON } from '../game.js'

function GameBoard({
  game,
  computerTurn,
  isGameOver,
  statusMessage,
  onMove,
  onReset,
  onUndo,
}) {
  return (
    <div className={`game-card${isGameOver ? ' game-card-finished' : ''}`}>
      <div className="game-card-head">
        <div className="round-label">
          <span className={`player-token token-${game.currentPlayer.toLowerCase()}`}>
            {game.status === WON ? game.winner : game.currentPlayer}
          </span>
          <div>
            <p className="turn-caption">
              {isGameOver ? 'ROUND COMPLETE' : 'NOW PLAYING'}
            </p>
            <p className="turn-message" aria-live="polite">
              {statusMessage}
            </p>
          </div>
        </div>
        <span className="move-count">
          {String(game.moves.length).padStart(2, '0')}
          <span> / 09</span>
        </span>
      </div>

      <div className="board" role="group" aria-label="Tic Tac Toe board">
        {game.board.map((cell, index) => {
          const unavailable =
            cell !== null || game.status !== IN_PROGRESS || computerTurn
          const winningCell = game.winningCells.includes(index)

          return (
            <button
              className={[
                'board-cell',
                cell ? `cell-${cell.toLowerCase()}` : '',
                winningCell ? 'winning-cell' : '',
              ].filter(Boolean).join(' ')}
              type="button"
              key={index}
              disabled={unavailable}
              aria-label={`Row ${Math.floor(index / 3) + 1}, column ${(index % 3) + 1}${cell ? `, ${cell}` : ', empty'}`}
              onClick={() => onMove(game.currentPlayer, index)}
            >
              {cell && <span aria-hidden="true">{cell}</span>}
            </button>
          )
        })}
      </div>

      <div className="game-controls">
        <button
          className="button button-primary"
          type="button"
          onClick={onReset}
        >
          <span aria-hidden="true">↻</span>
          New game
        </button>
        <button
          className="button button-secondary"
          type="button"
          disabled={game.moves.length === 0 || isGameOver}
          onClick={onUndo}
        >
          <span aria-hidden="true">↶</span>
          Undo move
        </button>
      </div>
    </div>
  )
}

export default GameBoard
