import { useState, useRef, useCallback, useEffect } from 'react'

const icons = [
  { emoji: '🦁', label: 'Chelsea Lion' }, { emoji: '⚽', label: 'Football' },
  { emoji: '🏆', label: 'Trophy' }, { emoji: '🔵', label: 'Blue' },
  { emoji: '👕', label: 'Jersey' }, { emoji: '🥅', label: 'Goal' },
  { emoji: '🏟️', label: 'Stadium' }, { emoji: '⭐', label: 'Star' },
]

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[a[i], a[j]] = [a[j], a[i]] }
  return a
}

export default function MemoryGame() {
  const [cards, setCards] = useState(() => shuffle([...icons, ...icons]).map((c, i) => ({ ...c, id: i, flipped: false, matched: false })))
  const [flipped, setFlipped] = useState([])
  const [moves, setMoves] = useState(0)
  const [matched, setMatched] = useState(0)
  const [seconds, setSeconds] = useState(0)
  const [locked, setLocked] = useState(false)
  const [started, setStarted] = useState(false)
  const [complete, setComplete] = useState(false)
  const timer = useRef(null)

  useEffect(() => {
    if (started && !complete) {
      timer.current = setInterval(() => setSeconds(s => s + 1), 1000)
    }
    return () => clearInterval(timer.current)
  }, [started, complete])

  const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`

  const handleClick = useCallback((idx) => {
    if (locked || cards[idx].flipped || cards[idx].matched) return
    if (!started) setStarted(true)

    const newCards = [...cards]
    newCards[idx].flipped = true
    setCards(newCards)

    const newFlipped = [...flipped, idx]
    setFlipped(newFlipped)

    if (newFlipped.length === 2) {
      setMoves(m => m + 1)
      setLocked(true)
      const [a, b] = newFlipped
      if (cards[a].emoji === cards[b].emoji) {
        setTimeout(() => {
          const mc = [...newCards]
          mc[a].matched = true
          mc[b].matched = true
          setCards(mc)
          const newMatched = matched + 1
          setMatched(newMatched)
          setFlipped([])
          setLocked(false)
          if (newMatched === 8) {
            clearInterval(timer.current)
            setComplete(true)
          }
        }, 300)
      } else {
        setTimeout(() => {
          const mc = [...newCards]
          mc[a].flipped = false
          mc[b].flipped = false
          setCards(mc)
          setFlipped([])
          setLocked(false)
        }, 800)
      }
    }
  }, [cards, flipped, locked, started, matched])

  const restart = useCallback(() => {
    clearInterval(timer.current)
    setCards(shuffle([...icons, ...icons]).map((c, i) => ({ ...c, id: i, flipped: false, matched: false })))
    setFlipped([])
    setMoves(0)
    setMatched(0)
    setSeconds(0)
    setLocked(false)
    setStarted(false)
    setComplete(false)
  }, [])

  return (
    <div className="memory-container">
      <div className="memory-header">
        <div className="memory-stats">
          <span>Moves: <strong>{moves}</strong></span>
          <span>Pairs: <strong>{matched}</strong>/8</span>
          <span>Time: <strong>{formatTime(seconds)}</strong></span>
        </div>
        <button className="memory-restart" onClick={restart}>New Game</button>
      </div>
      {!complete ? (
        <div className="memory-grid">
          {cards.map((card, i) => (
            <div key={card.id} className={`memory-card ${card.flipped ? 'flipped' : ''} ${card.matched ? 'matched' : ''}`} onClick={() => handleClick(i)}>
              <div className="memory-card-inner">
                <div className="memory-card-front" />
                <div className="memory-card-back">
                  <span className="card-emoji">{card.emoji}</span>
                  <span className="card-label">{card.label}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="memory-complete" style={{ display: 'block' }}>
          <h3>Congratulations!</h3>
          <p>You matched all pairs in <strong>{moves}</strong> moves and <strong>{formatTime(seconds)}</strong>!</p>
          <button className="memory-restart" onClick={restart}>Play Again</button>
        </div>
      )}
    </div>
  )
}
