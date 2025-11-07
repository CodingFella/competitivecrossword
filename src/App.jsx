import { useState, useEffect } from 'react'
import './App.css'
import Crossword from './components/Crossword'
import Clues from './components/Clues'

function App() {

  const [clues, setClues] = useState([]);
  const [gridLayout, setGridLayout] = useState("");
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    fetch("http://localhost:8000/test.php")
      .then((res) => res.json())
      .then((data) => {
        setClues(data.clues);
        setGridLayout(data.solution)
        setDimensions({ width: data.width, height: data.height });
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <>
      <div>
        <Crossword dimensions={dimensions} gridLayout={gridLayout} />
      </div>
      <Clues />
    </>
  )
}

export default App
