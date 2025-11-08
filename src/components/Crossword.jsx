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

// Initializes grid and places letters and black squares according to gridLayout
function initializeGrid(gridLayout, width) {
  const grid = [];
  const NO_NUMBER = "";
  let clueNumber = 1;

  for (let i = 0; i < gridLayout.length; i++) {
    let square = new Square(NO_NUMBER, gridLayout[i] === ".", gridLayout[i] === "-" ? "" : gridLayout[i], false, false);
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


// Moves index up if not edge or black squares connected to edge and returns final position
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
        return index;
      }
      scout -= width;
    }
    index = scout;
    setIndex(index);
  }
  setGrid(prevGrid =>
    select(prevGrid, width, height, index, isAcross)
  );
  return index;
}

// Moves index right if not edge or black squares connected to edge and returns final position
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

// Moves index down if not edge or black squares connected to edge and returns final position
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
        return index;
      }

      scout += width;

    }
    index = scout;
    setIndex(index);
  }
  setGrid(prevGrid =>
    select(prevGrid, width, height, index, isAcross)
  );
  return index;
}

// Moves index left if not edge or black squares connected to edge and returns final position
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
  if (event.key === "Tab") {
    event.preventDefault();

  }
  else if (event.key === "Backspace") {
    if (grid[index].storedLetter != "") {
      grid[index].storedLetter = "";
    }
    else if (isAcross && index % width != 0 && !grid[index - 1].isBlack) {
      grid[moveLeft(isAcross, setIsAcross, index, setIndex, grid, setGrid, width, height)].storedLetter = "";
    }
    else if (!isAcross && Math.floor(index / width) != 0 && !grid[index - width].isBlack) {
      grid[moveUp(isAcross, setIsAcross, index, setIndex, grid, setGrid, width, height)].storedLetter = "";
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
    event.preventDefault();
    setIsAcross(prevIsAcross => {
      const newDirection = !prevIsAcross;

      setGrid(prevGrid =>
        select(prevGrid, width, height, index, newDirection)
      );

      return newDirection;
    });
  }
  else if (isAlphanumericChar(event.key)) {
    grid[index].storedLetter = event.key.toUpperCase();

    // horizontal typing
    if (isAcross) {
      if (index < width * height && !grid[index + 1].isBlack) {
        moveRight(isAcross, setIsAcross, index, setIndex, grid, setGrid, width, height);
      }
    }
    // vertical typing
    else {
      if (index < width * (height - 1) && !grid[index + width].isBlack) {
        moveDown(isAcross, setIsAcross, index, setIndex, grid, setGrid, width, height);
      }
    }
  }

  const newGrid = Array.from(grid);
  return newGrid;
}

// Saves current progress. Key is userId-puzzleId
const saveUserProgress = async (userId, puzzleId, currentGridState) => {
  const formData = new URLSearchParams();
  formData.append('user_id', userId);
  formData.append('puzzle_id', puzzleId);
  formData.append('grid_state', currentGridState);

  try {
    const response = await fetch('http://localhost:8000/save_progress.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (result.success) {
      console.log('Progress saved:', result.message);
    } else {
      console.error('Save failed on server:', result.message);
    }

  } catch (error) {
    console.error('Error saving progress:', error);
  }
};

// Loads current progress
const loadUserProgress = async (userId, puzzleId) => {
  const baseUrl = 'http://localhost:8000/load_progress.php';
  const url = `${baseUrl}?user_id=${userId}&puzzle_id=${puzzleId}`;

  try {
    const response = await fetch(url, {
      method: 'GET'
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // The response is expected to be JSON: { success: true, grid_state: "C_A_T..." }
    const result = await response.json();

    if (result.success) {
      if (result.grid_state) {
        console.log('Progress loaded successfully.');
        return result.grid_state;
      } else {
        console.log('Progress loaded, but no saved state found.');
        return null;
      }
    } else {
      console.error('Load failed on server:', result.message);
      return null;
    }

  } catch (error) {
    console.error('Error loading progress:', error);
    return null;
  }
};

function Crossword() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [grid, setGrid] = useState([])
  const [isAcross, setIsAcross] = useState(true);
  const [index, setIndex] = useState(0);


  const userId = 123;
  const puzzleId = 456;

  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })



  // Get progress
  useEffect(() => {
    const fetchProgress = async () => {
      const puzzleResponse = await fetch("http://localhost:8000/test.php");
      const data = await puzzleResponse.json();

      const { grid, width, height } = data;

      setDimensions({ width, height });

      const savedState = await loadUserProgress(userId, puzzleId);
      if (savedState) {
        // Load saved state
        const initialGrid = initializeGrid(savedState, width);
        setGrid(select(initialGrid, width, height, 0, true, setIsAcross));
        setIndex(0);
        setIsAcross(true);
      } else {
        // No saved state, make blank grid
        const initialGrid = initializeGrid(grid, width);
        setGrid(select(initialGrid, width, height, 0, true, setIsAcross));
        setIndex(0);
        setIsAcross(true);
      }
      setIsInitialized(true);
    };

    fetchProgress();
  }, [userId, puzzleId]);


  // Save progress
  useEffect(() => {
    if (!isInitialized) {
      return;
    }
    const gridStateString = grid.map(square => square.storedLetter === "" ? "-" : square.storedLetter).join('');
    saveUserProgress(userId, puzzleId, gridStateString);
  }, [grid]);


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
