import { useEffect, useRef } from 'react'

function SessionPrompt({ status, error, onContinue, onStartFresh }) {
  const dialogRef = useRef(null)
  const hasSavedSession = status === 'saved'

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (status !== 'none' && !dialog.open) {
      dialog.showModal()
    } else if (status === 'none' && dialog.open) {
      dialog.close()
    }
  }, [status])

  return (
    <dialog
      className="session-dialog"
      ref={dialogRef}
      aria-labelledby="session-title"
      onCancel={(event) => event.preventDefault()}
    >
      <div className="session-dialog-icon" aria-hidden="true">
        {hasSavedSession ? '↻' : '!'}
      </div>
      <p className="result-kicker">
        {hasSavedSession ? 'WELCOME BACK' : 'SESSION SETUP'}
      </p>
      <h2 id="session-title">
        {hasSavedSession
          ? 'Pick up where you left off?'
          : status === 'invalid'
            ? 'Start a fresh game?'
            : 'Start a new game?'}
      </h2>
      <p className="session-dialog-copy">
        {hasSavedSession
          ? 'Your last board, move history, and scoreboard are saved on this device.'
          : status === 'invalid'
            ? 'The previous save is damaged and cannot be restored. You can remove it and continue with a fresh session.'
            : 'Your progress and scoreboard will be saved in this browser as you play.'}
      </p>
      {error && (
        <p className="session-dialog-error" role="alert">
          {error}
        </p>
      )}
      <div className="session-dialog-actions">
        {hasSavedSession && (
          <button
            className="button button-primary"
            type="button"
            onClick={onContinue}
          >
            Continue saved game
          </button>
        )}
        <button
          className={`button ${hasSavedSession ? 'button-secondary' : 'button-primary'}`}
          type="button"
          onClick={onStartFresh}
        >
          {hasSavedSession ? 'Start fresh' : 'Start game'}
        </button>
      </div>
    </dialog>
  )
}

export default SessionPrompt
