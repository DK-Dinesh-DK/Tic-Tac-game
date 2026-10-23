# Tic Tac Toe

A responsive, browser-based Tic Tac Toe game built with React and Vite. Play a
local two-player match or challenge a computer opponent, review the moves, and
keep a session scoreboard.

## Tech stack

- React
- Vite
- JavaScript (ES modules)
- Node.js built-in test runner

This version is a React-only application. It does not require Angular or a
.NET service.

## Features

- 3 × 3 board with turn validation and highlighted winning cells
- Two-player and computer modes
- Computer opponent that wins when possible, blocks an immediate win, then
  prefers the center, a corner, and any remaining cell
- Current-game move history with row and column positions
- Undo one move in two-player mode or the human/computer move pair in computer
  mode
- Session scoreboard for X wins, O wins, and draws
- Separate new-game and reset-scoreboard actions
- Responsive layout and keyboard-accessible controls

## Run locally

Requirements: Node.js 20.19+ or 22.12+.

```sh
npm ci
npm run dev
```

Open the local URL printed by Vite in your browser. No backend setup or
environment variables are required.

## Tests and checks

```sh
npm test
npm run lint
npm run build
```

The game-logic tests cover valid and invalid moves, turn changes, row/column/
diagonal wins, draws, completed-game moves, reset behavior, undo by mode,
scoreboard updates, and the computer move priorities.

## Design decisions and assumptions

- Game state and the session scoreboard are held in React memory. Reloading the
  page starts a fresh game and scoreboard.
- The computer always plays O; the human plays X.
- A game mode change starts a fresh board but keeps the scoreboard.
- Undo follows clarification Option A: it is disabled after a win or draw, so
  completed scores cannot be reversed.
- Resetting a game keeps the scoreboard; resetting the scoreboard does not
  clear the current game.
- Because this requested implementation uses React only, the suggested REST
  API and server-owned state are intentionally not implemented. The browser
  owns the game rules and score for the current page session.

## AI-assisted development notes

The supplied assignment was used to extract the user-facing requirements,
game rules, undo behavior, computer strategy, tests, and documentation needs.
The implementation was reviewed against those requirements and uses pure game
logic functions with unit tests, plus React for rendering and interaction.

## Limitations and future improvements

- Scores do not persist across page reloads or synchronize across browsers.
- There is no server API, database, online multiplayer, or player-name
  management.
- Future work could add persistence, multiplayer, configurable difficulty, and
  a backend if those become requirements.
