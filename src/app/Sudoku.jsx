import React, { useState } from "react";

const initialGrid = [
  [5, 3, 0, 0, 7, 0, 0, 0, 0],
  [6, 0, 0, 1, 9, 5, 0, 0, 0],
  [0, 9, 8, 0, 0, 0, 0, 6, 0],
  [8, 0, 0, 0, 6, 0, 0, 0, 3],
  [4, 0, 0, 8, 0, 3, 0, 0, 1],
  [7, 0, 0, 0, 2, 0, 0, 0, 6],
  [0, 6, 0, 0, 0, 0, 2, 8, 0],
  [0, 0, 0, 4, 1, 9, 0, 0, 5],
  [0, 0, 0, 0, 8, 0, 0, 7, 9],
];

const isSafe = (grid, row, col, num) => {
  for (let x = 0; x < 9; x++) {
    if (
      grid[row][x] === num ||
      grid[x][col] === num ||
      grid[3 * Math.floor(row / 3) + Math.floor(x / 3)][
        3 * Math.floor(col / 3) + (x % 3)
      ] === num
    ) {
      return false;
    }
  }
  return true;
};

const solveSudoku = (grid) => {
  let emptyPos = findEmptyPosition(grid);
  if (!emptyPos) return true;

  const [row, col] = emptyPos;
  for (let num = 1; num <= 9; num++) {
    if (isSafe(grid, row, col, num)) {
      grid[row][col] = num;
      if (solveSudoku(grid)) return true;
      grid[row][col] = 0;
    }
  }
  return false;
};

const findEmptyPosition = (grid) => {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] === 0) return [row, col];
    }
  }
  return null;
};

function Sudoku() {
  const [grid, setGrid] = useState(initialGrid);

  const handleChange = (row, col, value) => {
    const newGrid = grid.map((row) => row.slice());
    newGrid[row][col] = parseInt(value) || 0;
    setGrid(newGrid);
  };

  const handleSolve = () => {
    const newGrid = grid.map((row) => row.slice());
    if (solveSudoku(newGrid)) {
      setGrid(newGrid);
    } else {
      alert("No solution found!");
    }
  };

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(9, 40px)" }}>
        {grid.map((row, rowIndex) =>
          row.map((value, colIndex) => (
            <input
              key={`${rowIndex}-${colIndex}`}
              type="number"
              value={value === 0 ? "" : value}
              min="1"
              max="9"
              onChange={(e) => handleChange(rowIndex, colIndex, e.target.value)}
              style={{
                width: "40px",
                height: "40px",
                textAlign: "center",
                border: "1px solid black",
              }}
            />
          ))
        )}
      </div>
      <button onClick={handleSolve}>Solve Sudoku</button>
    </div>
  );
}

export default Sudoku;
