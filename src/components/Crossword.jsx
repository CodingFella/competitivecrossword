
import Cell from './Cell'
import './Crossword.css'

class Square {
  constructor(number, isBlack, storedLetter, isActive) {
    this.number = number;
    this.isBlack = isBlack;
    this.storedLetter = storedLetter;
    this.isActive = isActive;
  }
}

function parseGrid(gridLayout, width) {
  const grid = [];
  const NO_NUMBER = "";
  let clueNumber = 1;
  for (let i = 0; i < gridLayout.length; i++) {
    let square;
    if ((i < width || i % 15 == 0 || grid[i - 1].isBlack || grid[i - width].isBlack) && gridLayout[i] !== ".") {
      square = new Square(clueNumber, gridLayout[i] === ".", "", false);
      clueNumber++;
    } else {
      square = new Square(NO_NUMBER, gridLayout[i] === ".", "", false);
    }
    grid.push(square);
  }
  console.log(grid);
  return grid;
}

function Crossword({ dimensions, gridLayout }) {
  let grid = parseGrid(gridLayout, dimensions.width);

  function handleCellClick(index) {
    console.log(`Clicked cell at index ${index}`);
  }

  return (
    <>
      <div className="crossword-container m-10 grid" style={{ gridTemplateColumns: `repeat(${dimensions.width}, minmax(0, 1fr))` }}>
        {grid.flat().map((cell, idx) => (
          <Cell
            key={idx}
            clueNumber={cell.number}
            isBlack={cell.isBlack}
            onClick={() => handleCellClick(idx)}
          />
        ))}
      </div>
    </>
  )
}

export default Crossword
