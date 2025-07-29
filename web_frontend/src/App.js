import React, { useState } from 'react';
import './App.css';

// ---------- Utility functions ----------
/**
 * Calculates the winner of the Tic Tac Toe board.
 * @param {Array} squares - The board squares.
 * @returns {(string|null|{winner:string, line:number[]})}
 */
// PUBLIC_INTERFACE
function calculateWinner(squares) {
  const lines = [
    [0,1,2],[3,4,5],[6,7,8], // rows
    [0,3,6],[1,4,7],[2,5,8], // cols
    [0,4,8],[2,4,6] // diags
  ];
  for (let i=0; i<lines.length; i++) {
    const [a,b,c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[b] === squares[c]) {
      return { winner: squares[a], line: lines[i] };
    }
  }
  return null;
}

// ---------- Board Component ----------
function Board({ squares, winningLine, onClick, disabled }) {
  // PUBLIC_INTERFACE
  function renderSquare(i) {
    const highlight = winningLine && winningLine.includes(i);
    return (
      <button
        key={i}
        className={`ttt-square${highlight ? ' ttt-win' : ''}`}
        onClick={() => onClick(i)}
        disabled={squares[i] || disabled}
        aria-label={`Cell ${i}`}
      >
        {squares[i]}
      </button>
    );
  }

  return (
    <div className="ttt-board">
      {[0,1,2].map(r =>
        <div key={r} className="ttt-row">
          {[0,1,2].map(c => renderSquare(r*3 + c))}
        </div>
      )}
    </div>
  );
}

// ---------- Main App ----------
/**
 * The root interactive Tic Tac Toe application.
 * Features:
 * - 2-player local play
 * - Game reset
 * - Highlight winning combination
 * - Minimalistic score tracking
 * - Responsive, clean UI
 */
// PUBLIC_INTERFACE
function App() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [scores, setScores] = useState({X: 0, O: 0});
  const winnerObj = calculateWinner(squares);
  const winner = winnerObj ? winnerObj.winner : null;
  const draw = !winner && squares.every(Boolean);

  // Handle a move
  // PUBLIC_INTERFACE
  function handleClick(i) {
    if (squares[i] || winner) return;
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';
    setSquares(nextSquares);
    setXIsNext(!xIsNext);

    // If resulting move causes win, increment score
    const testWinner = calculateWinner(nextSquares);
    if (testWinner) {
      setScores(s => ({
        ...s,
        [testWinner.winner]: s[testWinner.winner] + 1
      }));
    }
  }

  // Reset board for new game, but keep scores
  // PUBLIC_INTERFACE
  function handleReset() {
    setSquares(Array(9).fill(null));
    setXIsNext(winner === 'O'); // Loser goes first or alternate
  }

  // Reset everything (scores and game)
  // PUBLIC_INTERFACE
  function handleFullReset() {
    setSquares(Array(9).fill(null));
    setScores({X:0, O:0});
    setXIsNext(true);
  }

  // Status message
  let status;
  if (winner) {
    status = `Winner: ${winner}`;
  } else if (draw) {
    status = "It's a draw!";
  } else {
    status = `Next: ${xIsNext ? 'X' : 'O'}`;
  }

  return (
    <div className="ttt-app">
      <header className="ttt-header">
        <h1 className="ttt-title">Tic Tac Toe</h1>
        <div className="ttt-scoreboard">
          <span className="ttt-score ttt-score-x">
            X: {scores.X}
          </span>
          <span className="ttt-score ttt-score-o">
            O: {scores.O}
          </span>
        </div>
      </header>
      <div className="ttt-board-container">
        <Board
          squares={squares}
          winningLine={winnerObj ? winnerObj.line : []}
          onClick={handleClick}
          disabled={!!winner || draw}
        />
      </div>
      <div className="ttt-status">{status}</div>
      <div className="ttt-controls">
        <button className="ttt-btn" onClick={handleReset} aria-label="Reset board">
          New Round
        </button>
        <button className="ttt-btn ttt-btn-secondary" onClick={handleFullReset} aria-label="Reset scores and board">
          Reset All
        </button>
      </div>
      <footer className="ttt-footer">
        <span className="ttt-footer-text">
          Minimal Tic Tac Toe | <a href="https://reactjs.org/" target="_blank" rel="noopener noreferrer">React</a> Demo
        </span>
      </footer>
    </div>
  );
}

export default App;
