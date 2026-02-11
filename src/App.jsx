import { useState, useEffect, useRef, useCallback } from 'react'
import TriviaGame from './components/TriviaGame'
import MemoryGame from './components/MemoryGame'
import GuessPlayer from './components/GuessPlayer'
import ScorePredictor from './components/ScorePredictor'

const CHELSEA_CREST = 'https://upload.wikimedia.org/wikipedia/en/c/cc/Chelsea_FC.svg'

// ===== SVG Icons =====
const SearchIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
const CloseIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
const ChevronLeft = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
const ChevronRight = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg>
const ChevronUp = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m18 15-6-6-6 6"/></svg>
const MapPin = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
const PlayIcon = () => <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
const SmallPlayIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
const TicketIcon = () => <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M13 5v2"/><path d="M13 17v2"/><path d="M13 11v2"/></svg>

// ===== DATA =====
const heroSlides = [
  { tag: "Men's Team", title: 'Chelsea 2-2 Leeds United', desc: 'Joao Pedro on the stalemate: "We are very frustrated" - Blues held at Stamford Bridge in a fiery Premier League encounter', link: 'https://www.chelseafc.com/en/news/article/joao-pedro-on-leeds-stalemate-we-are-very-frustrated', img: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=1600&q=80' },
  { tag: "Women's Team", title: 'Girma: We Stuck Together', desc: 'Naomi Girma proud of how Chelsea stuck together through a tough period - Blues defeat Spurs 2-0 in style', link: 'https://www.chelseafc.com/en/news/article/girma-proud-of-how-chelsea-stuck-together-through-a-tough-period', img: 'https://images.unsplash.com/photo-1508098682722-e99c643e7f0b?w=1600&q=80' },
  { tag: 'Interactive', title: 'Fan Games Zone', desc: 'Test your Chelsea knowledge with our interactive trivia, memory games, player guessing challenges and more!', link: '#games', img: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1600&q=80', internal: true },
]

const stats = [
  { count: 6, label: 'League Titles' }, { count: 2, label: 'Champions League' },
  { count: 8, label: 'FA Cups' }, { count: 5, label: 'League Cups' }, { count: 2, label: 'Europa League' },
]

const matchesData = {
  mens: [
    { comp: 'Premier League', date: 'Tue 10 Feb 2026', home: { name: 'Chelsea', crest: CHELSEA_CREST }, away: { name: 'Leeds Utd', crest: 'https://upload.wikimedia.org/wikipedia/en/5/54/Leeds_United_F.C._crest.svg' }, score: '2-2', venue: 'Stamford Bridge', status: 'FT' },
    { comp: 'FA Cup', date: 'Fri 13 Feb 2026', home: { name: 'Hull City', crest: 'https://upload.wikimedia.org/wikipedia/en/5/54/Hull_City_A.F.C._logo.svg' }, away: { name: 'Chelsea', crest: CHELSEA_CREST }, time: '19:45', venue: 'The MKM Stadium', status: 'Upcoming' },
    { comp: 'Premier League', date: 'Sat 21 Feb 2026', home: { name: 'Chelsea', crest: CHELSEA_CREST }, away: { name: 'Burnley', crest: 'https://upload.wikimedia.org/wikipedia/en/6/62/Burnley_F.C._Logo.svg' }, time: '15:00', venue: 'Stamford Bridge', status: 'Upcoming' },
  ],
  womens: [
    { comp: 'WSL', date: 'Sun 08 Feb 2026', home: { name: 'Spurs', crest: 'https://upload.wikimedia.org/wikipedia/en/b/b4/Tottenham_Hotspur.svg' }, away: { name: 'Chelsea', crest: CHELSEA_CREST }, score: '0-2', venue: 'Brisbane Road', status: 'FT' },
  ],
  u21: [
    { comp: 'PL2', date: 'Sat 08 Feb 2026', home: { name: 'Chelsea U21', crest: CHELSEA_CREST }, away: { name: 'Blackburn U21', crest: 'https://upload.wikimedia.org/wikipedia/en/0/0f/Blackburn_Rovers.svg' }, score: '5-0', venue: 'Cobham Training Ground', status: 'FT' },
    { comp: 'FA Youth Cup', date: 'Mon 09 Feb 2026', home: { name: 'Chelsea U18', crest: CHELSEA_CREST }, away: { name: 'Man City U18', crest: 'https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg' }, score: '1-4', venue: 'Cobham Training Ground', status: 'FT' },
  ],
}

const newsItems = [
  { featured: true, tag: "Men's Team", title: 'Joao Pedro on Leeds stalemate: "We are very frustrated"', time: 'an hour ago', img: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800&q=80', link: 'https://www.chelseafc.com/en/news/article/joao-pedro-on-leeds-stalemate-we-are-very-frustrated' },
  { tag: "Men's Team", title: 'Match gallery: Blues left frustrated by Leeds', time: '7 hours ago', img: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=600&q=80', link: 'https://www.chelseafc.com/en/news/article/match-gallery-blues-left-frustrated-by-leeds' },
  { tag: "Men's Team", title: 'Rosenior updates on Cucurella and highlights decisions that cost us', time: '9 hours ago', img: 'https://images.unsplash.com/photo-1508098682722-e99c643e7f0b?w=600&q=80', link: 'https://www.chelseafc.com/en/news/article/rosenior-updates-on-cucurella-and-highlights-decisions-that-cost-us' },
  { tag: "Men's Team", title: 'OTD: Willian nets dramatic late winner against Everton', time: 'an hour ago', img: 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=600&q=80', link: 'https://www.chelseafc.com/en/video/-the-atmosphere-at-the-stadium-after-that-goal-was-crazy-----fiv-dwnni1aje' },
  { tag: "Men's Team", title: 'Chelsea Diary: Cup ties and rivalries resumed', time: '09 Feb 26', img: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=600&q=80', link: 'https://www.chelseafc.com/en/news/article/chelsea-diary-cup-ties-and-rivalries-resumed' },
  { tag: 'History', title: 'Why are Chelsea and Leeds United rivals?', time: '10 Feb 26', img: 'https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=600&q=80', link: 'https://www.chelseafc.com/en/news/article/chelsea-vs-leeds---anatomy-of-a-rivalry0' },
]

const videoItems = [
  { title: 'Chelsea 2-2 Leeds | Extended Highlights', time: '7 hours ago', duration: '12:34', img: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=600&q=80', link: 'https://www.chelseafc.com/en/video/extended-chelsea-2-2-leeds-10-02-25' },
  { title: 'Chelsea 2-2 Leeds | Highlights', time: '8 hours ago', duration: '5:12', img: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=600&q=80', link: 'https://www.chelseafc.com/en/video/highlights-chelsea-2-2-leeds-10-02-26' },
  { title: 'Rosenior reflects post-Leeds', time: '8 hours ago', duration: '8:45', img: 'https://images.unsplash.com/photo-1508098682722-e99c643e7f0b?w=600&q=80', link: 'https://www.chelseafc.com/en/video/rosenior-reflects-post-leeds-10-02-26' },
  { title: 'BTS: Tottenham', time: '10 Feb 26', duration: '15:22', img: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&q=80', link: 'https://www.chelseafc.com/en/video/bts-tottenham-08-02-26' },
  { title: 'Top 10 Goals vs Leeds!', time: '10 Feb 26', duration: '10:30', img: 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=600&q=80', link: 'https://www.chelseafc.com/en/video/top-10-goals-v-leeds' },
  { title: 'Memorable moments vs Leeds', time: '10 Feb 26', duration: '11:15', img: 'https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=600&q=80', link: 'https://www.chelseafc.com/en/video/memorable-moments-vs-leeds' },
]

const womensNews = [
  { featured: true, tag: "Women's Team", tagClass: 'tag-womens', title: 'Girma proud of how Chelsea stuck together through a tough period', time: '10 Feb 26', img: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=800&q=80', link: 'https://www.chelseafc.com/en/news/article/girma-proud-of-how-chelsea-stuck-together-through-a-tough-period' },
  { tag: "Women's Team", tagClass: 'tag-womens', title: 'Club statement: Paul Green leaves Chelsea', time: '10 Feb 26', img: 'https://images.unsplash.com/photo-1551958219-acbc608c6377?w=600&q=80', link: 'https://www.chelseafc.com/en/news/article/club-statement-paul-green-leaves-chelsea' },
  { tag: "Women's Team", tagClass: 'tag-womens', title: 'Analysis: How Chelsea overcame in-form Tottenham', time: '10 Feb 26', img: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&q=80', link: 'https://www.chelseafc.com/en/news/article/analysis-how-chelsea-overcame-in-form-tottenham' },
  { tag: "Women's Team", tagClass: 'tag-womens', title: 'Erin Cuthbert on reclaiming the Chelsea identity in Spurs win', time: '09 Feb 26', img: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=600&q=80', link: 'https://www.chelseafc.com/en/news/article/erin-cuthbert-on-reclaiming-the-chelsea-identity-in-spurs-win' },
  { tag: "Women's Team", tagClass: 'tag-womens', title: 'Sandy Baltimore so happy to be a Blue', time: '09 Feb 26', img: 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=600&q=80', link: 'https://www.chelseafc.com/en/news/article/sandy-baltimore-so-happy-to-be-a-blue' },
]

const academyNews = [
  { tag: 'Video', tagClass: 'tag-academy', title: 'FA Youth Cup Highlights: Chelsea U18 1-4 Man City U18', time: '10 Feb 26', img: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=600&q=80', video: true, link: 'https://www.chelseafc.com/en/video/fa-youth-cup-highlights-chelsea-u18-1-4-man-city-u18-09-02-26' },
  { tag: 'U18s', tagClass: 'tag-academy', title: 'FA Youth Cup report: Chelsea 1-4 Manchester City', time: '10 Feb 26', img: 'https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=600&q=80', link: 'https://www.chelseafc.com/en/news/article/fa-youth-cup-report-chelsea-1-4-manchester-city' },
  { tag: 'Video', tagClass: 'tag-academy', title: 'PL2 Highlights: Chelsea U21 5-0 Blackburn U21', time: '08 Feb 26', img: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&q=80', video: true, link: 'https://www.chelseafc.com/en/video/chelsea-u21-5-0-blackburn-u21-or-highlights-or-pl2-2025-26' },
  { tag: 'Video', tagClass: 'tag-academy', title: 'REWIND | Chelsea U18 6-2 (agg) Man City U18 | FA Youth Cup 2016-17', time: '10 Feb 26', img: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=600&q=80', video: true, link: 'https://www.chelseafc.com/en/video/rewind-or-chelsea-u18-6-2-agg-man-city-u18-or-fa-youth-cup-2016-17-090226' },
]

const tickets = [
  { comp: 'Premier League', title: 'Arsenal away', desc: "Ticket information for Chelsea's trip to the Emirates", link: 'https://www.chelseafc.com/en/news/article/premier-league-ticket-news-arsenal-away-2025-26' },
  { comp: 'FA Cup', title: 'Hull City away', desc: 'Loyalty point update for members - FA Cup Fifth Round', link: 'https://www.chelseafc.com/en/news/article/fa-cup-ticket-news-hull-away' },
  { comp: 'Premier League', title: 'Burnley at home', desc: 'Ticket information for Burnley at Stamford Bridge', link: 'https://www.chelseafc.com/en/news/article/premier-league-ticket-news-burnley-at-home' },
]

// ===== COMPONENTS =====

function NewsCard({ item, className = '' }) {
  return (
    <article className={`news-card ${item.featured ? 'news-featured' : ''} ${className}`}>
      <div className="news-img-wrap">
        <img src={item.img} alt={item.title} className="news-img" loading="lazy" />
        {item.featured && <div className="news-img-overlay" />}
        {item.video && <div className="video-badge"><SmallPlayIcon /></div>}
      </div>
      <div className="news-body">
        <span className={`news-tag ${item.tagClass || ''}`}>{item.tag}</span>
        <h3 className="news-title">{item.title}</h3>
        <span className="news-time">{item.time}</span>
      </div>
      <a href={item.link} className="card-link" target="_blank" rel="noreferrer" aria-label="Read article" />
    </article>
  )
}

function MatchCard({ match }) {
  const scores = match.score ? match.score.split('-') : null
  return (
    <div className={`match-card ${!match.score ? 'upcoming' : ''}`}>
      <div className="match-meta">
        <span className="match-comp">{match.comp}</span>
        <span className="match-date">{match.date}</span>
      </div>
      <div className="match-teams">
        <div className="match-team">
          <img src={match.home.crest} alt={match.home.name} className="team-crest" />
          <span>{match.home.name}</span>
        </div>
        <div className="match-score">
          {scores ? (
            <><span className="score">{scores[0]}</span><span className="score-divider">-</span><span className="score">{scores[1]}</span></>
          ) : (
            <span className="match-time">{match.time}</span>
          )}
        </div>
        <div className="match-team">
          <img src={match.away.crest} alt={match.away.name} className="team-crest" />
          <span>{match.away.name}</span>
        </div>
      </div>
      <div className="match-venue"><MapPin /> {match.venue}</div>
      <span className={`match-status ${match.status === 'FT' ? 'ft' : 'upcoming-badge'}`}>{match.status}</span>
    </div>
  )
}

// ===== MAIN APP =====
export default function App() {
  const [loading, setLoading] = useState(true)
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [activeSection, setActiveSection] = useState('hero')
  const [matchTab, setMatchTab] = useState('mens')
  const [gameTab, setGameTab] = useState('trivia')
  const [showBackTop, setShowBackTop] = useState(false)
  const [statsAnimated, setStatsAnimated] = useState(false)
  const [statValues, setStatValues] = useState(stats.map(() => 0))
  const heroTimer = useRef(null)
  const statsRef = useRef(null)
  const searchInputRef = useRef(null)

  // Loader
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1800)
    return () => clearTimeout(t)
  }, [])

  // Scroll handler
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
      setShowBackTop(window.scrollY > 500)

      const sections = document.querySelectorAll('section[id]')
      for (const sec of sections) {
        const top = sec.offsetTop - 120
        const bottom = top + sec.offsetHeight
        if (window.scrollY >= top && window.scrollY < bottom) {
          setActiveSection(sec.id)
          break
        }
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Hero carousel auto
  useEffect(() => {
    heroTimer.current = setInterval(() => {
      setCurrentSlide(s => (s + 1) % heroSlides.length)
    }, 6000)
    return () => clearInterval(heroTimer.current)
  }, [])

  const goSlide = useCallback((i) => {
    clearInterval(heroTimer.current)
    setCurrentSlide(i)
    heroTimer.current = setInterval(() => {
      setCurrentSlide(s => (s + 1) % heroSlides.length)
    }, 6000)
  }, [])

  // Stats counter animation
  useEffect(() => {
    if (!statsRef.current) return
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !statsAnimated) {
        setStatsAnimated(true)
        stats.forEach((s, idx) => {
          let current = 0
          const step = s.count / 60
          const timer = setInterval(() => {
            current += step
            if (current >= s.count) {
              setStatValues(prev => { const n = [...prev]; n[idx] = s.count; return n })
              clearInterval(timer)
            } else {
              setStatValues(prev => { const n = [...prev]; n[idx] = Math.floor(current); return n })
            }
          }, 16)
        })
      }
    }, { threshold: 0.5 })
    obs.observe(statsRef.current)
    return () => obs.disconnect()
  }, [statsAnimated])

  // Focus search input when opened
  useEffect(() => {
    if (searchOpen && searchInputRef.current) searchInputRef.current.focus()
  }, [searchOpen])

  // Escape key
  useEffect(() => {
    const handler = e => { if (e.key === 'Escape') { setSearchOpen(false); setMenuOpen(false) } }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  const scrollToSection = (id) => {
    setMenuOpen(false)
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  const navLinks = [
    { id: 'hero', label: 'Home' }, { id: 'matches', label: 'Matches' }, { id: 'news', label: 'News' },
    { id: 'videos', label: 'Videos' }, { id: 'womens', label: "Women's" }, { id: 'academy', label: 'Academy' },
    { id: 'games', label: 'Games', special: true }, { id: 'tickets', label: 'Tickets' },
  ]

  const gameTabs = [
    { id: 'trivia', label: 'Chelsea Trivia', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg> },
    { id: 'memory', label: 'Memory Match', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="2"/><path d="M12 2v20"/><path d="M2 12h20"/></svg> },
    { id: 'guess', label: 'Guess the Player', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
    { id: 'predict', label: 'Score Predictor', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20V10"/><path d="M18 20V4"/><path d="M6 20v-4"/></svg> },
  ]

  return (
    <>
      {/* LOADER */}
      <div className={`loader ${!loading ? 'hidden' : ''}`}>
        <div className="loader-badge"><img src={CHELSEA_CREST} alt="Chelsea FC" /></div>
        <div className="loader-bar"><div className="loader-bar-fill" /></div>
        <p className="loader-text">Loading The Blues Experience...</p>
      </div>

      {/* NAVBAR */}
      <header className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-container">
          <a href="#" className="nav-logo" onClick={e => { e.preventDefault(); scrollToSection('hero') }}>
            <img src={CHELSEA_CREST} alt="Chelsea FC" className="logo-img" />
            <span className="logo-text">CHELSEA <span className="logo-accent">FC</span></span>
          </a>
          <nav className={`nav-links ${menuOpen ? 'open' : ''}`}>
            {navLinks.map(l => (
              <a key={l.id} href={`#${l.id}`} className={`nav-link ${l.special ? 'nav-link-special' : ''} ${activeSection === l.id ? 'active' : ''}`}
                onClick={e => { e.preventDefault(); scrollToSection(l.id) }}>{l.label}</a>
            ))}
            <a href="https://store.chelseafc.com" className="nav-link" target="_blank" rel="noreferrer">Shop</a>
          </nav>
          <div className="nav-actions">
            <button className="nav-btn search-btn" onClick={() => setSearchOpen(!searchOpen)} aria-label="Search"><SearchIcon /></button>
            <button className={`nav-btn menu-btn ${menuOpen ? 'active' : ''}`} onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu"><span /><span /><span /></button>
          </div>
        </div>
        <div className={`search-overlay ${searchOpen ? 'active' : ''}`}>
          <div className="search-container">
            <input ref={searchInputRef} type="text" className="search-input" placeholder="Search Chelsea FC..." />
            <button className="search-close" onClick={() => setSearchOpen(false)}><CloseIcon /></button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section id="hero" className="hero-section">
        <div className="hero-carousel">
          {heroSlides.map((slide, i) => (
            <div key={i} className={`hero-slide ${i === currentSlide ? 'active' : ''}`}>
              <div className="hero-bg" style={{ backgroundImage: `url(${slide.img})` }} />
              <div className="hero-overlay" />
              <div className="hero-content">
                <span className="hero-tag">{slide.tag}</span>
                <h1>{slide.title}</h1>
                <p>{slide.desc}</p>
                {slide.internal ? (
                  <a href="#games" className="hero-cta" onClick={e => { e.preventDefault(); scrollToSection('games') }}>Play Now</a>
                ) : (
                  <a href={slide.link} className="hero-cta" target="_blank" rel="noreferrer">Read More</a>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="hero-nav">
          {heroSlides.map((_, i) => (
            <button key={i} className={`hero-nav-btn ${i === currentSlide ? 'active' : ''}`} onClick={() => goSlide(i)} />
          ))}
        </div>
        <button className="hero-arrow hero-prev" onClick={() => goSlide((currentSlide - 1 + heroSlides.length) % heroSlides.length)}><ChevronLeft /></button>
        <button className="hero-arrow hero-next" onClick={() => goSlide((currentSlide + 1) % heroSlides.length)}><ChevronRight /></button>
        <div className="scroll-indicator">
          <div className="scroll-mouse"><div className="scroll-wheel" /></div>
          <span>Scroll to explore</span>
        </div>
      </section>

      {/* STATS */}
      <div className="stats-bar" ref={statsRef}>
        <div className="stats-container">
          {stats.map((s, i) => (
            <div key={i} className="stat-item">
              <span className="stat-number">{statValues[i]}</span>
              <span className="stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* MATCHES */}
      <section id="matches" className="section matches-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Match Center</h2>
            <a href="https://www.chelseafc.com/en/fixtures" className="section-link" target="_blank" rel="noreferrer">Full Fixtures <ChevronRight /></a>
          </div>
          <div className="match-tabs">
            {[['mens',"Men's"],['womens',"Women's"],['u21','Under-21s']].map(([k,l]) => (
              <button key={k} className={`match-tab ${matchTab === k ? 'active' : ''}`} onClick={() => setMatchTab(k)}>{l}</button>
            ))}
          </div>
          <div className="match-cards">
            {matchesData[matchTab]?.map((m, i) => <MatchCard key={i} match={m} />)}
          </div>
        </div>
      </section>

      {/* NEWS */}
      <section id="news" className="section news-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Latest News</h2>
            <a href="https://www.chelseafc.com/en/news/latest-news-all" className="section-link" target="_blank" rel="noreferrer">All News <ChevronRight /></a>
          </div>
          <div className="news-grid">
            {newsItems.map((item, i) => <NewsCard key={i} item={item} />)}
          </div>
        </div>
      </section>

      {/* VIDEOS */}
      <section id="videos" className="section videos-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Latest Videos</h2>
            <a href="https://www.chelseafc.com/en/news/topic?id=6IMpcaedw0EtH8EHOZ13ZW" className="section-link" target="_blank" rel="noreferrer">All Videos <ChevronRight /></a>
          </div>
          <div className="video-grid">
            {videoItems.map((v, i) => (
              <article key={i} className="video-card">
                <div className="video-thumb">
                  <img src={v.img} alt={v.title} className="video-img" loading="lazy" />
                  <div className="video-play"><PlayIcon /></div>
                  <span className="video-duration">{v.duration}</span>
                </div>
                <div className="video-info">
                  <h3>{v.title}</h3>
                  <span className="video-meta">{v.time}</span>
                </div>
                <a href={v.link} className="card-link" target="_blank" rel="noreferrer" aria-label="Watch video" />
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* WOMEN'S */}
      <section id="womens" className="section womens-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Women&apos;s Team</h2>
            <a href="https://www.chelseafc.com/en/news/latest-women-news" className="section-link" target="_blank" rel="noreferrer">All Women&apos;s News <ChevronRight /></a>
          </div>
          <div className="news-grid womens-grid">
            {womensNews.map((item, i) => <NewsCard key={i} item={item} />)}
          </div>
        </div>
      </section>

      {/* ACADEMY */}
      <section id="academy" className="section academy-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Academy</h2>
            <a href="https://www.chelseafc.com/en/news/academy-news-video" className="section-link" target="_blank" rel="noreferrer">All Academy News <ChevronRight /></a>
          </div>
          <div className="academy-grid">
            {academyNews.map((item, i) => <NewsCard key={i} item={item} />)}
          </div>
        </div>
      </section>

      {/* GAMES */}
      <section id="games" className="section games-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Fan Games Zone</h2>
            <p className="section-subtitle">Test your Chelsea knowledge and have fun!</p>
          </div>
          <div className="game-tabs">
            {gameTabs.map(t => (
              <button key={t.id} className={`game-tab ${gameTab === t.id ? 'active' : ''}`} onClick={() => setGameTab(t.id)}>
                {t.icon} {t.label}
              </button>
            ))}
          </div>
          <div className={`game-panel ${gameTab === 'trivia' ? 'active' : ''}`}><TriviaGame /></div>
          <div className={`game-panel ${gameTab === 'memory' ? 'active' : ''}`}><MemoryGame /></div>
          <div className={`game-panel ${gameTab === 'guess' ? 'active' : ''}`}><GuessPlayer /></div>
          <div className={`game-panel ${gameTab === 'predict' ? 'active' : ''}`}><ScorePredictor /></div>
        </div>
      </section>

      {/* TICKETS */}
      <section id="tickets" className="section tickets-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Ticket News</h2>
            <a href="https://www.chelseafc.com/en/news/topic?id=3qNZvE9oK0bzw9z7duh2f" className="section-link" target="_blank" rel="noreferrer">All Ticket News <ChevronRight /></a>
          </div>
          <div className="ticket-grid">
            {tickets.map((t, i) => (
              <article key={i} className="ticket-card">
                <div className="ticket-icon"><TicketIcon /></div>
                <span className="ticket-comp">{t.comp}</span>
                <h3>{t.title}</h3>
                <p>{t.desc}</p>
                <a href={t.link} className="ticket-link" target="_blank" rel="noreferrer">Learn More</a>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* SHOP PROMO */}
      <section className="section shop-promo">
        <div className="container">
          <div className="shop-banner">
            <div className="shop-text">
              <span className="shop-label">Chelsea Store</span>
              <h2>Hailing the Year of the Horse!</h2>
              <p>Celebrate the lunar calendar beginning a new cycle with the pre-match top which will be worn by Chelsea players ahead of our games.</p>
              <a href="https://store.chelseafc.com/en/c-13607?_s=bm-FI-PSC-CFC-ContentCard-YOTH" className="shop-cta" target="_blank" rel="noreferrer">Shop Now</a>
            </div>
            <div className="shop-img-area"><div className="shop-badge-glow" /></div>
          </div>
        </div>
      </section>

      {/* PARTNERS */}
      <section className="section partners-section">
        <div className="container">
          <h3 className="partners-title">Principal Partners</h3>
          <div className="partners-grid principal">
            <a href="https://www.nike.com/gb/" className="partner-logo" target="_blank" rel="noreferrer"><img src="https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg" alt="Nike" /></a>
            <a href="https://fptsoftware.com/fpt-chelseafc" className="partner-logo" target="_blank" rel="noreferrer"><div className="partner-text-logo">FPT</div></a>
            <a href="https://bingx.com/en?ch=bm_cfc" className="partner-logo" target="_blank" rel="noreferrer"><div className="partner-text-logo">BingX</div></a>
          </div>
          <h3 className="partners-title">Official Partners</h3>
          <div className="partners-grid official">
            {[['EA Sports','https://www.ea.com/en/games/ea-sports-fc/fc-25'],['MSC','https://www.msccruises.co.uk/'],['Carling','https://www.carling.com'],['Rexona','https://rexona.com/'],['Pegasus','https://www.flypgs.com/en'],['Predator','https://www.predatorenergydrink.com']].map(([n,u]) => (
              <a key={n} href={u} className="partner-logo" target="_blank" rel="noreferrer"><div className="partner-text-logo small">{n}</div></a>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="container">
          <div className="footer-top">
            <div className="footer-brand">
              <img src={CHELSEA_CREST} alt="Chelsea FC" className="footer-logo" />
              <div className="footer-club-info">
                <h4>Chelsea Football Club</h4>
                <p>Stamford Bridge<br />Fulham Road<br />London SW6 1HS</p>
              </div>
            </div>
            <div className="footer-links-grid">
              <div className="footer-col">
                <h5>Club</h5>
                <a href="https://www.chelseafc.com/en/about-the-club" target="_blank" rel="noreferrer">About The Club</a>
                <a href="https://www.chelseafc.com/en/contact-us" target="_blank" rel="noreferrer">Contact Us &amp; FAQs</a>
                <a href="https://www.chelseafc.com/en/careers" target="_blank" rel="noreferrer">Careers</a>
              </div>
              <div className="footer-col">
                <h5>Teams</h5>
                <a href="https://www.chelseafc.com/en/news/category/mens-team" target="_blank" rel="noreferrer">Men&apos;s Team</a>
                <a href="https://www.chelseafc.com/en/news/category/womens-team" target="_blank" rel="noreferrer">Women&apos;s Team</a>
                <a href="https://www.chelseafc.com/en/news/academy-news-video" target="_blank" rel="noreferrer">Academy</a>
              </div>
              <div className="footer-col">
                <h5>Fan Zone</h5>
                <a href="#games" onClick={e => { e.preventDefault(); scrollToSection('games') }}>Games</a>
                <a href="https://theshed.chelseafc.com/bridge/" target="_blank" rel="noreferrer">The Shed</a>
                <a href="https://store.chelseafc.com" target="_blank" rel="noreferrer">Official Store</a>
              </div>
            </div>
            <div className="footer-social">
              <h5>Follow Chelsea</h5>
              <div className="social-icons">
                {[['Facebook','https://www.facebook.com/ChelseaFC/',<svg key="fb" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>],
                  ['Instagram','https://www.instagram.com/chelseafc/',<svg key="ig" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/></svg>],
                  ['YouTube','https://www.youtube.com/chelseafc',<svg key="yt" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z"/></svg>],
                  ['X','https://x.com/chelseafc',<svg key="x" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>],
                  ['TikTok','https://www.tiktok.com/@chelseafc',<svg key="tt" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.72a8.2 8.2 0 0 0 4.78 1.53V6.8a4.82 4.82 0 0 1-1.02-.11z"/></svg>],
                ].map(([name, url, icon]) => (
                  <a key={name} href={url} target="_blank" rel="noreferrer" className="social-icon" aria-label={name}>{icon}</a>
                ))}
              </div>
            </div>
          </div>
          <div className="footer-app">
            <p>Get unrivalled access with the Chelsea Official App</p>
            <div className="app-buttons">
              <a href="https://chelseafc.onelink.me/1WUW/id1x1kng" target="_blank" rel="noreferrer" className="app-btn">App Store</a>
              <a href="https://chelseafc.onelink.me/1WUW/03ey3mli" target="_blank" rel="noreferrer" className="app-btn">Google Play</a>
            </div>
          </div>
          <div className="footer-bottom">
            <div className="footer-legal-links">
              {[['Privacy Policy','/en/privacy-policy'],['Cookies Policy','/en/cookies-policy'],['Terms & Conditions','/en/terms-and-conditions'],['Modern Slavery Act','/en/modern-slavery-act']].map(([l,u]) => (
                <a key={l} href={`https://www.chelseafc.com${u}`} target="_blank" rel="noreferrer">{l}</a>
              ))}
            </div>
            <p className="footer-copyright">&copy; 2026 Chelsea FC Fan Hub. All content belongs to Chelsea Football Club. This is a fan experience project.</p>
          </div>
        </div>
      </footer>

      {/* BACK TO TOP */}
      <button className={`back-to-top ${showBackTop ? 'visible' : ''}`} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Back to top"><ChevronUp /></button>
    </>
  )
}
