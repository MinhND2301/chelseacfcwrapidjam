import { useState, useEffect, useRef, useCallback } from 'react'

const allPlayers = [
  { name: "Cole Palmer", number: 20, clues: ["Born in Manchester, England","Joined Chelsea in 2023 from Man City","Won Young Player of the Year in 2024","Known for ice-cold penalty technique","Wears the number 20 shirt"], options: ["Cole Palmer","Noni Madueke","Enzo Fernandez","Nicolas Jackson"] },
  { name: "Enzo Fernandez", number: 8, clues: ["Argentine international","Won the World Cup in 2022","Chelsea's record signing","Midfielder who wears number 8","Previously played for Benfica"], options: ["Moises Caicedo","Enzo Fernandez","Conor Gallagher","Romeo Lavia"] },
  { name: "Reece James", number: 24, clues: ["Academy graduate from Cobham","Born in London, England","Club captain and right-back","Known for his powerful crossing","Wears the number 24 shirt"], options: ["Ben Chilwell","Malo Gusto","Reece James","Marc Cucurella"] },
  { name: "Nicolas Jackson", number: 15, clues: ["Born in Gambia, Africa","Signed from Villarreal","Chelsea's main striker","Known for his pace and movement","Wears the number 15 shirt"], options: ["Christopher Nkunku","Nicolas Jackson","Joao Pedro","Armando Broja"] },
  { name: "Moises Caicedo", number: 25, clues: ["Ecuadorian international","Signed from Brighton in 2023","Defensive midfielder","One of the most expensive transfers ever","Wears the number 25 shirt"], options: ["Enzo Fernandez","Romeo Lavia","Moises Caicedo","Lesley Ugochukwu"] },
  { name: "Robert Sanchez", number: 1, clues: ["Spanish goalkeeper","Signed from Brighton","Chelsea's number 1","Born in Cartagena, Spain","Tall shot-stopper at 6'5\""], options: ["Djordje Petrovic","Robert Sanchez","Kepa Arrizabalaga","Marcus Bettinelli"] },
  { name: "Noni Madueke", number: 11, clues: ["Born in London, England","Previously played in the Eredivisie","Winger who wears number 11","Joined from PSV Eindhoven","Known for his dribbling skills"], options: ["Mykhailo Mudryk","Noni Madueke","Raheem Sterling","Pedro Neto"] },
  { name: "Marc Cucurella", number: 3, clues: ["Spanish left-back","Known for his distinctive curly hair","Won Euro 2024 with Spain","Signed from Brighton","Wears the number 3 shirt"], options: ["Ben Chilwell","Marc Cucurella","Ian Maatsen","Levi Colwill"] },
]

function shuffle(arr) {
  const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[a[i], a[j]] = [a[j], a[i]] }; return a
}

export default function GuessPlayer() {
  const [players, setPlayers] = useState(() => shuffle(allPlayers).slice(0, 5))
  const [round, setRound] = useState(0)
  const [score, setScore] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [selected, setSelected] = useState('')
  const [shownClues, setShownClues] = useState(0)
  const [done, setDone] = useState(false)
  const clueTimer = useRef(null)

  const player = players[round]
  const options = player ? shuffle(player.options) : []

  useEffect(() => {
    if (!player || answered) return
    setShownClues(1)
    let count = 1
    clueTimer.current = setInterval(() => {
      count++
      if (count > player.clues.length) { clearInterval(clueTimer.current); return }
      setShownClues(count)
    }, 2000)
    return () => clearInterval(clueTimer.current)
  }, [round, answered, player])

  const handleAnswer = useCallback((name) => {
    if (answered) return
    setAnswered(true)
    setSelected(name)
    clearInterval(clueTimer.current)
    setShownClues(player.clues.length)
    if (name === player.name) setScore(s => s + 1)
  }, [answered, player])

  const next = useCallback(() => {
    if (round < 4) {
      setRound(r => r + 1)
      setAnswered(false)
      setSelected('')
      setShownClues(0)
    } else {
      setDone(true)
    }
  }, [round])

  const restart = useCallback(() => {
    setPlayers(shuffle(allPlayers).slice(0, 5))
    setRound(0)
    setScore(0)
    setAnswered(false)
    setSelected('')
    setShownClues(0)
    setDone(false)
  }, [])

  if (done) {
    return (
      <div className="guess-container">
        <div className="guess-result" style={{ display: 'block' }}>
          <h3>Game Over!</h3>
          <p>You scored <strong>{score}</strong>/5</p>
          <button className="guess-restart-btn" onClick={restart}>Play Again</button>
        </div>
      </div>
    )
  }

  return (
    <div className="guess-container">
      <div className="guess-header">
        <span>Score: <strong>{score}</strong></span>
        <span>Round: <strong>{round + 1}</strong>/5</span>
      </div>
      <div className="guess-clue-area">
        <div className="guess-jersey">
          <div className="jersey-shape">
            <span className="jersey-number">{answered ? player.number : '?'}</span>
          </div>
        </div>
        <div className="guess-clues">
          {shownClues === 0 && <p className="guess-instruction">Clues will appear one by one...</p>}
          {player.clues.slice(0, shownClues).map((c, i) => (
            <div key={i} className="guess-clue-item">{c}</div>
          ))}
        </div>
      </div>
      <div className="guess-options">
        {options.map(opt => (
          <button key={opt} className={`guess-option ${answered ? 'disabled' : ''} ${answered && opt === player.name ? 'correct' : ''} ${answered && opt === selected && opt !== player.name ? 'wrong' : ''}`}
            onClick={() => handleAnswer(opt)}>{opt}</button>
        ))}
      </div>
      {answered && (
        <div className="guess-feedback" style={{ color: selected === player.name ? '#22c55e' : '#ef4444' }}>
          {selected === player.name ? `Correct! It's ${player.name}!` : `Wrong! It was ${player.name}!`}
        </div>
      )}
      {answered && <button className="guess-next-btn" onClick={next}>{round < 4 ? 'Next Player' : 'See Results'}</button>}
    </div>
  )
}
