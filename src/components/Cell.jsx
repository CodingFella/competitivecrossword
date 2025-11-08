
import './Cell.css'

function Cell({ clueNumber, storedLetter, isBlack, isActive, isHighlighted, onClick }) {

  return (
    <>
      <div className={`cell${isBlack ? " black-square" : ""}${isActive ? " active-square" : ""}${isHighlighted ? " highlighted-square" : ""}`} onClick={onClick}>
        {!isBlack && <div className="clueNumber">
          {clueNumber}
        </div>}

        {!isBlack && <div className="storedLetter">
          {storedLetter}
        </div>}
      </div >
    </>
  )
}

export default Cell
