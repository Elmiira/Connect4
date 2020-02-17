import React, { useState } from 'react';
import { GAME_STATUS, PLAYER } from './constants';
import Disk from './Disk';
import './connect4.css';

export default function Connect4(props) {
  const [board, setBoard] = useState([...new Array(42)]);
  const [currentStatus, setCurrentStatus] = useState(GAME_STATUS.ONGOING);
  const [playerTurn, setPlayerTurn] = useState(PLAYER.ONE);

  const switchPlayerTurn = () =>
    playerTurn === PLAYER.ONE ? PLAYER.TWO : PLAYER.ONE;

  const getMarkingBoardStyle = player => {
    if (player === PLAYER.NONE) return 'no-Player';
    if (player === PLAYER.ONE) return 'player-color';
    if (player === PLAYER.TWO) return 'opponent-color';
  };

  const isFormWinningLine = miniBoard => {
    if (miniBoard.some(cell => cell === PLAYER.NONE)) return false;

    if (
      miniBoard[0] === miniBoard[1] &&
      miniBoard[1] === miniBoard[2] &&
      miniBoard[2] === miniBoard[3]
    ) {
      return miniBoard[0];
    }

    return false;
  };

  const checkHorizontalDirection = board => {
    for (let row = 0; row < 6; row++) {
      for (let column = 0; column < 5; column++) {
        const index = row * 7 + column;
        const boardSlice = board.slice(index, index + 4);
        const winningResult = isFormWinningLine(boardSlice);
        if (winningResult !== false) return winningResult;
      }
    }
    return false;
  };

  const checkVerticalDirection = board => {
    for (let column = 0; column < 7; column++) {
      for (let row = 0; row < 3; row++) {
        const index = row * 7 + column;
        const boardSlice = [
          board[index],
          board[index + 7],
          board[index + 7 * 2],
          board[index + 7 * 3],
        ];
        const winningResult = isFormWinningLine(boardSlice);
        if (winningResult !== false) return winningResult;
      }
    }
    return false;
  };

  const checkDiagonalDirection = board => {
    for (let row = 0; row <= 2; row++) {
      for (let column = 0; column < 7; column++) {
        const index = row * 7 + column;

        // diagonal down-left
        if (column >= 3) {
          const boardSlice = [
            board[index],
            board[index + 7 - 1],
            board[index + 7 * 2 - 2],
            board[index + 7 * 3 - 3],
          ];

          const winningResult = isFormWinningLine(boardSlice);
          if (winningResult !== false) return winningResult;
        }

        // diagonal down-right
        if (column <= 3) {
          const boardSlice = [
            board[index],
            board[index + 7 + 1],
            board[index + 7 * 2 + 2],
            board[index + 7 * 3 + 3],
          ];

          const winningResult = isFormWinningLine(boardSlice);
          if (winningResult !== false) return winningResult;
        }
      }
    }
    return false;
  };

  const getMovementPropagation = board => {
    const horizontalLineWinning = checkHorizontalDirection(board);
    if (horizontalLineWinning !== false) {
      return horizontalLineWinning;
    }
    const verticalLineWinning = checkVerticalDirection(board);
    if (verticalLineWinning !== false) {
      return verticalLineWinning;
    }
    const diagonalLineWinning = checkDiagonalDirection(board);
    if (diagonalLineWinning !== false) {
      return diagonalLineWinning;
    }
    if (board.some(cell => cell === PLAYER.NONE)) {
      return GAME_STATUS.ONGOING;
    }
    return GAME_STATUS.DRAW;
  };

  const findTopAvailableIndex = column => {
    for (let i = 35 + column; i >= 0; i -= 7) {
      if (board[i] === PLAYER.NONE) return i;
    }
    return -1;
  };

  const occupySpace = column => {
    const topSpace = findTopAvailableIndex(column);
    const newBoard = board.slice();
    newBoard[topSpace] = playerTurn;

    const newStatus = getMovementPropagation(newBoard);

    setBoard(newBoard);
    setPlayerTurn(switchPlayerTurn());
    setCurrentStatus(newStatus);
  };

  const handleDiskDropping = index => () => {
    if (currentStatus !== GAME_STATUS.ONGOING) return;
    const column = index % 7;
    occupySpace(column);
  };

  const getText = () => {
    switch (currentStatus) {
      case GAME_STATUS.ONGOING:
        return 'Game is ongoing';
      case GAME_STATUS.DRAW:
        return 'Game is draw';
      case GAME_STATUS.PLAYER_ONE_WIN:
        return 'Player one won!';
      case GAME_STATUS.PLAYER_TWO_WIN:
        return 'Player two won!';
      default:
        return;
    }
  };

  const GameStatus = () => <div className="game-status">{getText()}</div>;

  const Board = () => (
    <div className="board">
      {board.map((player, index) => (
        <Disk
          key={`disk${index}`}
          index={index}
          handleOnClick={handleDiskDropping}
          className={getMarkingBoardStyle(player)}
        />
      ))}
    </div>
  );

  return (
    <div className="container">
      <GameStatus />
      <Board />
    </div>
  );
}
