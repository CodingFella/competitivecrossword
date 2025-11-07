import { useState, useEffect } from 'react'

import Cell from './Cell'
import './Crossword.css'

class Square {
  constructor(number, isBlack, storedLetter, isActive, isHighlighted) {
    this.number = number;
    this.isBlack = isBlack;
    this.storedLetter = storedLetter;
    this.isActive = isActive;
    this.isHighlighted = isHighlighted;
  }
}

function initializeGrid(gridLayout, width) {
  const grid = [];
  const NO_NUMBER = "";
  let clueNumber = 1;

  for (let i = 0; i < gridLayout.length; i++) {
    let square = new Square(NO_NUMBER, gridLayout[i] === ".", "", false, false);
    if ((i < width || i % 15 == 0 || grid[i - 1].isBlack || grid[i - width].isBlack) && gridLayout[i] !== ".") {
      square.number = clueNumber;
      clueNumber++;
    }
    grid.push(square);
  }

  return grid;
}

// removes active and highlight
function resetGrid(grid) {
  for (let g = 0; g < grid.length; g++) {
    grid[g].isActive = false;
    grid[g].isHighlighted = false;
  }

  return grid;
}

// logic for when user clicks on a cell
function select(grid, width, height, index, isAcross, setIsAcross) {
  if (grid[index].isBlack) {
    return grid;
  }

  let nextIsAcross = isAcross;

  if (grid[index].isActive) {
    nextIsAcross = !isAcross;
    setIsAcross(nextIsAcross);
  }


  grid = resetGrid(grid);
  grid[index].isActive = true;

  // set row to isHighlighted to true
  if (nextIsAcross) {
    let i = index;
    while (i == index || i >= 0 && (i % width) != width - 1 && !grid[i].isBlack) {
      grid[i].isHighlighted = true;
      i--;
    }

    let j = index;
    while (j == index || (j % width) != 0 && !grid[j].isBlack) {
      grid[j].isHighlighted = true;
      j++;
    }
  }
  // set column to isHighlighted to true
  else {
    let i = index;
    while ((i / width >= 0) && !grid[i].isBlack) {
      grid[i].isHighlighted = true;
      i -= width;
    }

    let j = index;
    while ((j / width < height) && !grid[j].isBlack) {
      grid[j].isHighlighted = true;
      j += width;
    }
  }

  // shallow copy
  const newGrid = Array.from(grid);
  return newGrid;
}

// get the current clue number associated with selected position
function currentClueNumber(grid, index, isAcross) {

}

function Crossword({ dimensions, gridLayout }) {
  const [grid, setGrid] = useState([])
  const [isAcross, setIsAcross] = useState(false);

  useEffect(() => {
    setGrid(initializeGrid(gridLayout, dimensions.width));
  }, [gridLayout, dimensions.width]);


  function handleCellClick(index) {
    setGrid(prevGrid => select(prevGrid, dimensions.width, dimensions.height, index, isAcross, setIsAcross));
  }

  return (
    <>
      <div className="crossword-container m-10 grid" style={{ gridTemplateColumns: `repeat(${dimensions.width}, minmax(0, 1fr))` }}>
        {grid.flat().map((cell, idx) => (
          <Cell
            key={idx}
            clueNumber={cell.number}
            isBlack={cell.isBlack}
            isActive={cell.isActive}
            isHighlighted={cell.isHighlighted}
            onClick={() => handleCellClick(idx)}
          />
        ))}
      </div>
    </>
  )
}

export default Crossword
