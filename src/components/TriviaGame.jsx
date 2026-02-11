import { useState, useCallback } from 'react'

const allQuestions = [
  { q: "In which year was Chelsea Football Club founded?", o: ["1900","1905","1910","1895"], c: 1, e: "Chelsea FC was founded on 10 March 1905 at The Rising Sun pub." },
  { q: "Who is Chelsea's all-time top scorer?", o: ["Didier Drogba","Frank Lampard","Bobby Tambling","Kerry Dixon"], c: 1, e: "Frank Lampard holds the record with 211 goals for Chelsea." },
  { q: "In which year did Chelsea win their first Champions League title?", o: ["2008","2010","2012","2015"], c: 2, e: "Chelsea won the Champions League in 2012, beating Bayern Munich on penalties." },
  { q: "What is the capacity of Stamford Bridge?", o: ["38,000","40,341","42,055","45,000"], c: 1, e: "Stamford Bridge has a capacity of approximately 40,341." },
  { q: "Which manager led Chelsea to their first Premier League title in 2004-05?", o: ["Claudio Ranieri","Jose Mourinho","Carlo Ancelotti","Avram Grant"], c: 1, e: "Jose Mourinho guided Chelsea to their first Premier League title." },
  { q: "What is Chelsea's nickname?", o: ["The Royals","The Lions","The Blues","The Stamford"], c: 2, e: "Chelsea are known as 'The Blues' due to their iconic blue home kit." },
  { q: "Who scored the winning penalty in the 2012 Champions League final?", o: ["Frank Lampard","Didier Drogba","Fernando Torres","Juan Mata"], c: 1, e: "Didier Drogba scored the decisive penalty to win Chelsea's first Champions League." },
  { q: "How many Premier League titles has Chelsea won?", o: ["4","5","6","7"], c: 2, e: "Chelsea have won 6 Premier League titles." },
  { q: "Which Chelsea person was known as 'The Special One'?", o: ["John Terry","Jose Mourinho","Gianfranco Zola","Dennis Wise"], c: 1, e: "Manager Jose Mourinho called himself 'The Special One' at his first Chelsea press conference." },
  { q: "In which year did Chelsea win the Club World Cup?", o: ["2012","2019","2021","2022"], c: 3, e: "Chelsea won the FIFA Club World Cup in February 2022, beating Palmeiras." },
  { q: "Who was Chelsea's captain during the 2012 Champions League triumph?", o: ["Frank Lampard","John Terry","Didier Drogba","Ashley Cole"], c: 1, e: "John Terry was Chelsea's captain, though he was suspended for the final." },
  { q: "Which Chelsea legend wore the number 25 shirt?", o: ["Gianfranco Zola","Eden Hazard","Didier Drogba","Ruud Gullit"], c: 0, e: "Gianfranco Zola wore the iconic number 25 shirt." },
  { q: "How many FA Cups has Chelsea won?", o: ["6","7","8","9"], c: 2, e: "Chelsea have won the FA Cup 8 times." },
]

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[a[i], a[j]] = [a[j], a[i]] }
  return a
}

export default function TriviaGame() {
  const [questions, setQuestions] = useState(() => shuffle(allQuestions).slice(0, 10))
  const [idx, setIdx] = useState(0)
  const [score, setScore] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [selected, setSelected] = useState(-1)
  const [done, setDone] = useState(false)

  const q = questions[idx]

  const handleAnswer = useCallback((i) => {
    if (answered) return
    setAnswered(true)
    setSelected(i)
    if (i === q.c) setScore(s => s + 1)
  }, [answered, q])

  const next = useCallback(() => {
    if (idx < 9) {
      setIdx(i => i + 1)
      setAnswered(false)
      setSelected(-1)
    } else {
      setDone(true)
    }
  }, [idx])

  const restart = useCallback(() => {
    setQuestions(shuffle(allQuestions).slice(0, 10))
    setIdx(0)
    setScore(0)
    setAnswered(false)
    setSelected(-1)
    setDone(false)
  }, [])

  const getMessage = () => {
    if (score >= 9) return "Legendary! You're a true Chelsea encyclopedia!"
    if (score >= 7) return "Excellent! You really know your Blues!"
    if (score >= 5) return "Good effort! A solid Chelsea fan!"
    if (score >= 3) return "Not bad, but there's room to improve!"
    return "Time to brush up on your Chelsea history!"
  }

  if (done) {
    return (
      <div className="trivia-container">
        <div className="trivia-result" style={{ display: 'block' }}>
          <h3>Quiz Complete!</h3>
          <div className="trivia-final-score"><span className="big-score">{score}</span><span>/10</span></div>
          <p>{getMessage()}</p>
          <button className="trivia-restart-btn" onClick={restart}>Play Again</button>
        </div>
      </div>
    )
  }

  return (
    <div className="trivia-container">
      <div className="trivia-header">
        <div className="trivia-progress">
          <div className="trivia-progress-bar" style={{ width: `${((idx + 1) / 10) * 100}%` }} />
        </div>
        <div className="trivia-stats">
          <span>Question {idx + 1}/10</span>
          <span>Score: {score}</span>
        </div>
      </div>
      <div className="trivia-question"><h3>{q.q}</h3></div>
      <div className="trivia-options">
        {q.o.map((opt, i) => (
          <button key={i} className={`trivia-option ${answered ? 'disabled' : ''} ${answered && i === q.c ? 'correct' : ''} ${answered && i === selected && i !== q.c ? 'wrong' : ''}`}
            onClick={() => handleAnswer(i)}>{opt}</button>
        ))}
      </div>
      {answered && (
        <div className={`trivia-feedback show ${selected === q.c ? 'correct' : 'wrong'}`}>
          {selected === q.c ? 'Correct! ' : 'Wrong! '}{q.e}
        </div>
      )}
      {answered && <button className="trivia-next-btn" onClick={next}>{idx < 9 ? 'Next Question' : 'See Results'}</button>}
    </div>
  )
}
