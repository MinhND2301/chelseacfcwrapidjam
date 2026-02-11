import { useState } from 'react'

export default function ScorePredictor() {
  const [home, setHome] = useState(0)
  const [away, setAway] = useState(0)
  const [scorer, setScorer] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const submit = () => setSubmitted(true)
  const reset = () => { setHome(0); setAway(0); setScorer(''); setSubmitted(false) }

  return (
    <div className="predict-container">
      {!submitted ? (
        <>
          <h3 className="predict-title">Predict the Score</h3>
          <p className="predict-subtitle">How will the next match end?</p>
          <div className="predict-match">
            <div className="predict-team">
              <img src="https://upload.wikimedia.org/wikipedia/en/5/54/Hull_City_A.F.C._logo.svg" alt="Hull City" className="predict-crest" />
              <span>Hull City</span>
            </div>
            <div className="predict-scores">
              <div className="predict-score-input">
                <button className="score-btn" onClick={() => setHome(Math.max(0, home - 1))}>-</button>
                <span className="predict-score-val">{home}</span>
                <button className="score-btn" onClick={() => setHome(Math.min(9, home + 1))}>+</button>
              </div>
              <span className="predict-vs">vs</span>
              <div className="predict-score-input">
                <button className="score-btn" onClick={() => setAway(Math.max(0, away - 1))}>-</button>
                <span className="predict-score-val">{away}</span>
                <button className="score-btn" onClick={() => setAway(Math.min(9, away + 1))}>+</button>
              </div>
            </div>
            <div className="predict-team">
              <img src="https://upload.wikimedia.org/wikipedia/en/c/cc/Chelsea_FC.svg" alt="Chelsea" className="predict-crest" />
              <span>Chelsea</span>
            </div>
          </div>
          <div className="predict-extras">
            <div className="predict-field">
              <label>First Goalscorer</label>
              <select className="predict-select" value={scorer} onChange={e => setScorer(e.target.value)}>
                <option value="">Select player...</option>
                {['Cole Palmer','Nicolas Jackson','Joao Pedro','Noni Madueke','Christopher Nkunku','Enzo Fernandez','Moises Caicedo','Pedro Neto'].map(p => (
                  <option key={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>
          <button className="predict-submit" onClick={submit}>Submit Prediction</button>
        </>
      ) : (
        <div className="predict-submitted" style={{ display: 'block' }}>
          <div className="predict-check">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          </div>
          <h3>Prediction Submitted!</h3>
          <p>Hull City {home} - {away} Chelsea{scorer ? ` | First Scorer: ${scorer}` : ''}</p>
          <button className="predict-reset" onClick={reset}>Make Another Prediction</button>
        </div>
      )}
    </div>
  )
}
