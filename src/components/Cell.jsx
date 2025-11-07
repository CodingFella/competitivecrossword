
import './Cell.css'

function Cell({ clueNumber, isBlack, onClick }) {

  return (
    <>
      <div className={`cell ${isBlack ? "black-square" : ""}`} onClick={onClick}>
        {!isBlack && <div className="clueNumber">
          {clueNumber}
        </div>}
      </div >
    </>
  )
}

export default Cell
