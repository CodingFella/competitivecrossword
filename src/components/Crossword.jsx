import { useState, useEffect, useCallback } from 'react'

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
function select(grid, width, height, index, isAcross) {
  if (grid[index].isBlack) {
    return grid;
  }

  grid = resetGrid(grid);
  grid[index].isActive = true;

  // set row to isHighlighted to true
  if (isAcross) {
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
function currentClueNumber(grid, width, height, index, isAcross) {

}

// movement

function moveUp(isAcross, setIsAcross, index, setIndex, grid, setGrid, width, height) {
  if (isAcross) {
    isAcross = false;
    setIsAcross(isAcross);
  }
  else {
    let scout = index;
    scout -= width;
    if (scout < 0) {
      scout += width;
    }
    while (grid[scout].isBlack) {
      if (scout / width < 1) {
        return;
      }
      scout -= width;
    }
    index = scout;
    setIndex(index);
  }
  setGrid(prevGrid =>
    select(prevGrid, width, height, index, isAcross)
  );
}

function moveRight(isAcross, setIsAcross, index, setIndex, grid, setGrid, width, height) {
  if (!isAcross) {
    isAcross = true;
    setIsAcross(isAcross);
  }
  else {
    let scout = index;
    scout++;
    if (scout % width == 0) {
      scout--;
    }
    while (grid[scout].isBlack) {
      if (scout % width == 0) {
        return;
      }
      scout++;
    }
    index = scout;
    setIndex(index);
  }
  setGrid(prevGrid =>
    select(prevGrid, width, height, index, isAcross)
  );
}

function moveDown(isAcross, setIsAcross, index, setIndex, grid, setGrid, width, height) {
  if (isAcross) {
    isAcross = false;
    setIsAcross(isAcross);
  }
  else {
    let scout = index;
    scout += width;
    if (scout >= width * height) {
      scout -= width;
    }
    while (grid[scout].isBlack) {
      if (scout >= width * (height - 1)) {
        return;
      }

      scout += width;

    }
    index = scout;
    setIndex(index);
  }
  setGrid(prevGrid =>
    select(prevGrid, width, height, index, isAcross)
  );
}

function moveLeft(isAcross, setIsAcross, index, setIndex, grid, setGrid, width, height) {
  if (!isAcross) {
    isAcross = true;
    setIsAcross(isAcross);
  }
  else {
    let scout = index;
    scout--;
    if ((scout + width) % width == width - 1) {
      scout++;
    }
    while (grid[scout].isBlack) {
      if (scout % width == 0) {
        return index;
      }
      scout--;
    }
    index = scout;
    setIndex(index);
  }
  setGrid(prevGrid =>
    select(prevGrid, width, height, index, isAcross)
  );

  return index;
}


// checks if string is length 1 and is alphanumeric
function isAlphanumericChar(str) {
  return str.length == 1 && /^[a-zA-Z0-9]+$/.test(str);
}

// handles key presses
function handleKeyboardInput(grid, width, height, index, setIndex, isAcross, setIsAcross, setGrid, event) {
  if (event.key === "Backspace") {
    if (grid[index].storedLetter != "") {
      grid[index].storedLetter = "";
    }
    else {
      grid[moveLeft(isAcross, setIsAcross, index, setIndex, grid, setGrid, width, height)].storedLetter = "";
    }
  }
  else if (event.key === "ArrowUp") {
    event.preventDefault();
    moveUp(isAcross, setIsAcross, index, setIndex, grid, setGrid, width, height);
  }
  else if (event.key === "ArrowRight") {
    event.preventDefault();
    moveRight(isAcross, setIsAcross, index, setIndex, grid, setGrid, width, height);
  }
  else if (event.key === "ArrowDown") {
    event.preventDefault();
    moveDown(isAcross, setIsAcross, index, setIndex, grid, setGrid, width, height);
  }
  else if (event.key === "ArrowLeft") {
    event.preventDefault();
    moveLeft(isAcross, setIsAcross, index, setIndex, grid, setGrid, width, height);
  }
  else if (event.key === " ") {
    // Use the functional update form for isAcross
    setIsAcross(prevIsAcross => {
      const newDirection = !prevIsAcross;

      // Now, update the grid using the correct new direction
      setGrid(prevGrid =>
        select(prevGrid, width, height, index, newDirection)
      );

      return newDirection; // Return the new state value for React to update isAcross
    });


  }
  else if (isAlphanumericChar(event.key)) {
    grid[index].storedLetter = event.key.toUpperCase();

    if (isAcross) {
      if (index < width * height && !grid[index + 1].isBlack) {
        moveRight(isAcross, setIsAcross, index, setIndex, grid, setGrid, width, height);
      }
    }
  }

  const newGrid = Array.from(grid);
  return newGrid;
}

function Crossword({ dimensions, gridLayout }) {
  const [grid, setGrid] = useState([])
  const [isAcross, setIsAcross] = useState(true);
  const [index, setIndex] = useState(0);

  // Initialization
  useEffect(() => {
    const isGridLayoutEmpty = Object.keys(gridLayout).length === 0;

    if (isGridLayoutEmpty || !dimensions.width) {
      // Data is not ready yet, so we exit early.
      return;
    }

    const initialGrid = initializeGrid(gridLayout, dimensions.width);
    setGrid(select(initialGrid, dimensions.width, dimensions.height, 0, true, setIsAcross));
  }, [gridLayout, dimensions.width]);


  function handleCellClick(idx) {
    let newIndex = idx;
    setIndex(newIndex);

    let nextIsAcross = isAcross;
    if (grid[newIndex].isActive) {
      nextIsAcross = !isAcross;
      setIsAcross(nextIsAcross);
    }

    setGrid(prevGrid => select(prevGrid, dimensions.width, dimensions.height, newIndex, nextIsAcross, setIsAcross));
  }

  const handleGlobalKeyDown = ((event) => {
    setGrid(prevGrid => handleKeyboardInput(
      prevGrid, dimensions.width, dimensions.height, index, setIndex, isAcross, setIsAcross, setGrid, event));
  });

  useEffect(() => {
    document.addEventListener('keydown', handleGlobalKeyDown);

    return () => {
      document.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, [handleGlobalKeyDown]);

  return (
    <>
      <div className="crossword-container m-10 grid" style={{ gridTemplateColumns: `repeat(${dimensions.width}, minmax(0, 1fr))` }}>
        {grid.flat().map((cell, idx) => (
          <Cell
            key={idx}
            clueNumber={cell.number}
            storedLetter={cell.storedLetter}
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
