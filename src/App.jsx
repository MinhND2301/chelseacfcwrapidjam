import { useState, useEffect, useRef, useCallback } from 'react'
import TriviaGame from './components/TriviaGame'
import MemoryGame from './components/MemoryGame'
import GuessPlayer from './components/GuessPlayer'
import ScorePredictor from './components/ScorePredictor'

const CHELSEA_CREST = 'https://upload.wikimedia.org/wikipedia/en/c/cc/Chelsea_FC.svg'

// ===== Icons =====
const SearchIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
const CloseIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
const ChevronLeft = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
const ChevronRight = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg>
const MapPin = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
const PlayIcon = () => <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
const SmallPlayIcon = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
const ArrowRight = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg>
const TicketIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M13 5v2"/><path d="M13 17v2"/><path d="M13 11v2"/></svg>
const ExternalIcon = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>

// ===== DATA =====
const heroSlides = [
  { tag: "Latest Result", title: 'Chelsea 2-2 Leeds United', desc: 'Joao Pedro on the stalemate: "We are very frustrated"', link: 'https://www.chelseafc.com/en/news/article/joao-pedro-on-leeds-stalemate-we-are-very-frustrated', img: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=1600&q=80' },
  { tag: "Women's Team", title: 'Girma: We Stuck Together', desc: 'Naomi Girma proud of how Chelsea stuck together - Blues defeat Spurs 2-0', link: 'https://www.chelseafc.com/en/news/article/girma-proud-of-how-chelsea-stuck-together-through-a-tough-period', img: 'https://images.unsplash.com/photo-1508098682722-e99c643e7f0b?w=1600&q=80' },
  { tag: 'Fan Zone', title: 'Test Your Blues Knowledge', desc: 'Play trivia, memory games, and more in our interactive Fan Games Zone!', link: '#', img: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1600&q=80', internal: true },
]

const stats = [
  { count: 6, label: 'League Titles' }, { count: 2, label: 'Champions League' },
  { count: 8, label: 'FA Cups' }, { count: 5, label: 'League Cups' }, { count: 2, label: 'Europa League' },
]

const matchesData = {
  mens: [
    { comp: 'Premier League', date: 'Tue 10 Feb', home: { name: 'Chelsea', crest: CHELSEA_CREST }, away: { name: 'Leeds Utd', crest: 'https://upload.wikimedia.org/wikipedia/en/5/54/Leeds_United_F.C._crest.svg' }, score: '2-2', venue: 'Stamford Bridge', status: 'FT' },
    { comp: 'FA Cup', date: 'Fri 13 Feb', home: { name: 'Hull City', crest: 'https://upload.wikimedia.org/wikipedia/en/5/54/Hull_City_A.F.C._logo.svg' }, away: { name: 'Chelsea', crest: CHELSEA_CREST }, time: '19:45', venue: 'The MKM Stadium', status: 'Upcoming' },
    { comp: 'Premier League', date: 'Sat 21 Feb', home: { name: 'Chelsea', crest: CHELSEA_CREST }, away: { name: 'Burnley', crest: 'https://upload.wikimedia.org/wikipedia/en/6/62/Burnley_F.C._Logo.svg' }, time: '15:00', venue: 'Stamford Bridge', status: 'Upcoming' },
  ],
  womens: [
    { comp: 'WSL', date: 'Sun 08 Feb', home: { name: 'Spurs', crest: 'https://upload.wikimedia.org/wikipedia/en/b/b4/Tottenham_Hotspur.svg' }, away: { name: 'Chelsea', crest: CHELSEA_CREST }, score: '0-2', venue: 'Brisbane Road', status: 'FT' },
  ],
  u21: [
    { comp: 'PL2', date: 'Sat 08 Feb', home: { name: 'Chelsea U21', crest: CHELSEA_CREST }, away: { name: 'Blackburn U21', crest: 'https://upload.wikimedia.org/wikipedia/en/0/0f/Blackburn_Rovers.svg' }, score: '5-0', venue: 'Cobham', status: 'FT' },
    { comp: 'FA Youth Cup', date: 'Mon 09 Feb', home: { name: 'Chelsea U18', crest: CHELSEA_CREST }, away: { name: 'Man City U18', crest: 'https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg' }, score: '1-4', venue: 'Cobham', status: 'FT' },
  ],
}

const allNews = [
  { featured: true, tag: "Men's", cat: 'mens', title: 'Joao Pedro on Leeds stalemate: "We are very frustrated"', time: 'an hour ago', img: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800&q=80', link: '#' },
  { tag: "Men's", cat: 'mens', title: 'Match gallery: Blues left frustrated by Leeds', time: '7h ago', img: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=600&q=80', link: '#' },
  { tag: "Men's", cat: 'mens', title: 'Rosenior updates on Cucurella and highlights decisions that cost us', time: '9h ago', img: 'https://images.unsplash.com/photo-1508098682722-e99c643e7f0b?w=600&q=80', link: '#' },
  { tag: "Men's", cat: 'mens', title: 'OTD: Willian nets dramatic late winner against Everton', time: '1h ago', img: 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=600&q=80', link: '#' },
  { tag: "Men's", cat: 'mens', title: 'Chelsea Diary: Cup ties and rivalries resumed', time: '09 Feb', img: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=600&q=80', link: '#' },
  { tag: 'History', cat: 'mens', title: 'Why are Chelsea and Leeds United rivals?', time: '10 Feb', img: 'https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=600&q=80', link: '#' },
  { tag: "Women's", cat: 'womens', title: 'Girma proud of how Chelsea stuck together through a tough period', time: '10 Feb', img: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=800&q=80', link: '#' },
  { tag: "Women's", cat: 'womens', title: 'Club statement: Paul Green leaves Chelsea', time: '10 Feb', img: 'https://images.unsplash.com/photo-1551958219-acbc608c6377?w=600&q=80', link: '#' },
  { tag: "Women's", cat: 'womens', title: 'Analysis: How Chelsea overcame in-form Tottenham', time: '10 Feb', img: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&q=80', link: '#' },
  { tag: "Women's", cat: 'womens', title: 'Erin Cuthbert on reclaiming the Chelsea identity', time: '09 Feb', img: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=600&q=80', link: '#' },
  { tag: 'Academy', cat: 'academy', title: 'FA Youth Cup: Chelsea U18 1-4 Man City U18', time: '10 Feb', img: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=600&q=80', link: '#', video: true },
  { tag: 'Academy', cat: 'academy', title: 'FA Youth Cup report: Chelsea 1-4 Manchester City', time: '10 Feb', img: 'https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=600&q=80', link: '#' },
  { tag: 'Academy', cat: 'academy', title: 'PL2 Highlights: Chelsea U21 5-0 Blackburn U21', time: '08 Feb', img: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&q=80', link: '#', video: true },
]

const videoItems = [
  { title: 'Chelsea 2-2 Leeds | Extended Highlights', time: '7h ago', duration: '12:34', img: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=600&q=80' },
  { title: 'Chelsea 2-2 Leeds | Highlights', time: '8h ago', duration: '5:12', img: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=600&q=80' },
  { title: 'Rosenier reflects post-Leeds', time: '8h ago', duration: '8:45', img: 'https://images.unsplash.com/photo-1508098682722-e99c643e7f0b?w=600&q=80' },
  { title: 'BTS: Tottenham', time: '10 Feb', duration: '15:22', img: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&q=80' },
  { title: 'Top 10 Goals vs Leeds!', time: '10 Feb', duration: '10:30', img: 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=600&q=80' },
  { title: 'Memorable moments vs Leeds', time: '10 Feb', duration: '11:15', img: 'https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=600&q=80' },
]

const tickets = [
  { comp: 'Premier League', title: 'Arsenal away', desc: "Ticket info for Chelsea's trip to the Emirates" },
  { comp: 'FA Cup', title: 'Hull City away', desc: 'Loyalty point update - FA Cup Fifth Round' },
  { comp: 'Premier League', title: 'Burnley at home', desc: 'Ticket info for Burnley at Stamford Bridge' },
]

// ===== SMALL COMPONENTS =====
function NewsCard({ item }) {
  return (
    <article className={`news-card ${item.featured ? 'news-featured' : ''}`}>
      <div className="news-img-wrap">
        <img src={item.img} alt={item.title} className="news-img" loading="lazy" />
        {item.featured && <div className="news-img-overlay" />}
        {item.video && <div className="video-badge"><SmallPlayIcon /> Video</div>}
      </div>
      <div className="news-body">
        <span className={`news-tag tag-${item.cat || 'default'}`}>{item.tag}</span>
        <h3 className="news-title">{item.title}</h3>
        <span className="news-time">{item.time}</span>
      </div>
      <a href={item.link} className="card-link" target="_blank" rel="noreferrer" aria-label={item.title} />
    </article>
  )
}

function MatchCard({ match }) {
  const scores = match.score ? match.score.split('-') : null
  return (
    <div className="match-card">
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
            <><span className="score">{scores[0]}</span><span className="score-div">-</span><span className="score">{scores[1]}</span></>
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

function VideoCard({ v }) {
  return (
    <article className="video-card">
      <div className="video-thumb">
        <img src={v.img} alt={v.title} className="video-img" loading="lazy" />
        <div className="video-play"><PlayIcon /></div>
        <span className="video-duration">{v.duration}</span>
      </div>
      <div className="video-info"><h3>{v.title}</h3><span className="video-meta">{v.time}</span></div>
    </article>
  )
}

// ===== TAB VIEWS =====
function HomeView({ setTab, statValues, statsRef }) {
  return (
    <>
      {/* Quick Stats */}
      <div className="stats-bar" ref={statsRef}>
        {stats.map((s, i) => (
          <div key={i} className="stat-item">
            <span className="stat-number">{statValues[i]}</span>
            <span className="stat-label">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Quick Sections */}
      <div className="home-grid">
        {/* Latest Match */}
        <div className="home-section">
          <div className="home-section-head">
            <h3>Latest Result</h3>
            <button className="link-btn" onClick={() => setTab('matches')}>All Matches <ArrowRight /></button>
          </div>
          <MatchCard match={matchesData.mens[0]} />
        </div>

        {/* Next Match */}
        <div className="home-section">
          <div className="home-section-head">
            <h3>Next Match</h3>
          </div>
          <MatchCard match={matchesData.mens[1]} />
        </div>
      </div>

      {/* Top News */}
      <div className="home-section full">
        <div className="home-section-head">
          <h3>Top Stories</h3>
          <button className="link-btn" onClick={() => setTab('news')}>All News <ArrowRight /></button>
        </div>
        <div className="news-row">
          {allNews.slice(0, 4).map((item, i) => <NewsCard key={i} item={item} />)}
        </div>
      </div>

      {/* Featured Videos */}
      <div className="home-section full">
        <div className="home-section-head">
          <h3>Featured Videos</h3>
          <button className="link-btn" onClick={() => setTab('videos')}>All Videos <ArrowRight /></button>
        </div>
        <div className="video-row">
          {videoItems.slice(0, 3).map((v, i) => <VideoCard key={i} v={v} />)}
        </div>
      </div>

      {/* Tickets & Shop */}
      <div className="home-grid">
        <div className="home-section">
          <div className="home-section-head"><h3>Ticket News</h3></div>
          <div className="ticket-list">
            {tickets.map((t, i) => (
              <div key={i} className="ticket-row-item">
                <div><span className="ticket-comp-sm">{t.comp}</span><span className="ticket-title-sm">{t.title}</span></div>
                <ArrowRight />
              </div>
            ))}
          </div>
        </div>
        <div className="home-section">
          <div className="promo-card">
            <span className="promo-label">Chelsea Store</span>
            <h3>Hailing the Year of the Horse!</h3>
            <p>Pre-match top worn by Chelsea players ahead of our games.</p>
            <a href="https://store.chelseafc.com" target="_blank" rel="noreferrer" className="promo-cta">Shop Now <ExternalIcon /></a>
          </div>
        </div>
      </div>
    </>
  )
}

function MatchesView() {
  const [sub, setSub] = useState('mens')
  return (
    <div className="tab-view">
      <div className="view-head">
        <h2>Matches</h2>
        <a href="https://www.chelseafc.com/en/fixtures" target="_blank" rel="noreferrer" className="link-btn">Full Fixtures <ExternalIcon /></a>
      </div>
      <div className="sub-tabs">
        {[['mens',"Men's"],['womens',"Women's"],['u21','U21s']].map(([k,l]) => (
          <button key={k} className={`sub-tab ${sub === k ? 'active' : ''}`} onClick={() => setSub(k)}>{l}</button>
        ))}
      </div>
      <div className="match-grid">
        {matchesData[sub]?.map((m, i) => <MatchCard key={i} match={m} />)}
      </div>
    </div>
  )
}

function NewsView() {
  const [filter, setFilter] = useState('all')
  const filtered = filter === 'all' ? allNews : allNews.filter(n => n.cat === filter)
  return (
    <div className="tab-view">
      <div className="view-head">
        <h2>News</h2>
        <a href="https://www.chelseafc.com/en/news/latest-news-all" target="_blank" rel="noreferrer" className="link-btn">chelseafc.com <ExternalIcon /></a>
      </div>
      <div className="sub-tabs">
        {[['all','All'],['mens',"Men's"],['womens',"Women's"],['academy','Academy']].map(([k,l]) => (
          <button key={k} className={`sub-tab ${filter === k ? 'active' : ''}`} onClick={() => setFilter(k)}>{l}</button>
        ))}
      </div>
      <div className="news-grid-clean">
        {filtered.map((item, i) => <NewsCard key={i} item={item} />)}
      </div>
    </div>
  )
}

function VideosView() {
  return (
    <div className="tab-view">
      <div className="view-head">
        <h2>Videos</h2>
        <a href="https://www.chelseafc.com/en/news/topic?id=6IMpcaedw0EtH8EHOZ13ZW" target="_blank" rel="noreferrer" className="link-btn">All Videos <ExternalIcon /></a>
      </div>
      <div className="video-grid-clean">
        {videoItems.map((v, i) => <VideoCard key={i} v={v} />)}
      </div>
    </div>
  )
}

function GamesView() {
  const [game, setGame] = useState('trivia')
  const gameTabs = [
    { id: 'trivia', label: 'Trivia' },
    { id: 'memory', label: 'Memory' },
    { id: 'guess', label: 'Guess Player' },
    { id: 'predict', label: 'Predictor' },
  ]
  return (
    <div className="tab-view">
      <div className="view-head">
        <h2>Fan Games</h2>
        <p className="view-subtitle">Test your Chelsea knowledge!</p>
      </div>
      <div className="sub-tabs">
        {gameTabs.map(t => (
          <button key={t.id} className={`sub-tab ${game === t.id ? 'active' : ''}`} onClick={() => setGame(t.id)}>{t.label}</button>
        ))}
      </div>
      <div className="game-area">
        {game === 'trivia' && <TriviaGame />}
        {game === 'memory' && <MemoryGame />}
        {game === 'guess' && <GuessPlayer />}
        {game === 'predict' && <ScorePredictor />}
      </div>
    </div>
  )
}

// ===== MAIN APP =====
export default function App() {
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('home')
  const [searchOpen, setSearchOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [statsAnimated, setStatsAnimated] = useState(false)
  const [statValues, setStatValues] = useState(stats.map(() => 0))
  const heroTimer = useRef(null)
  const statsRef = useRef(null)
  const searchRef = useRef(null)

  // Loader
  useEffect(() => { const t = setTimeout(() => setLoading(false), 1200); return () => clearTimeout(t) }, [])

  // Hero carousel
  useEffect(() => {
    heroTimer.current = setInterval(() => setCurrentSlide(s => (s + 1) % heroSlides.length), 6000)
    return () => clearInterval(heroTimer.current)
  }, [])
  const goSlide = useCallback((i) => {
    clearInterval(heroTimer.current)
    setCurrentSlide(i)
    heroTimer.current = setInterval(() => setCurrentSlide(s => (s + 1) % heroSlides.length), 6000)
  }, [])

  // Stats counter
  useEffect(() => {
    if (!statsRef.current || statsAnimated) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setStatsAnimated(true)
        stats.forEach((s, idx) => {
          let cur = 0; const step = s.count / 40
          const t = setInterval(() => {
            cur += step
            if (cur >= s.count) { setStatValues(p => { const n = [...p]; n[idx] = s.count; return n }); clearInterval(t) }
            else { setStatValues(p => { const n = [...p]; n[idx] = Math.floor(cur); return n }) }
          }, 20)
        })
      }
    }, { threshold: 0.3 })
    obs.observe(statsRef.current)
    return () => obs.disconnect()
  }, [statsAnimated, tab])

  // Search focus + escape
  useEffect(() => { if (searchOpen && searchRef.current) searchRef.current.focus() }, [searchOpen])
  useEffect(() => {
    const h = e => { if (e.key === 'Escape') { setSearchOpen(false); setMenuOpen(false) } }
    document.addEventListener('keydown', h); return () => document.removeEventListener('keydown', h)
  }, [])

  // Scroll to top on tab change
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }) }, [tab])

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'matches', label: 'Matches' },
    { id: 'news', label: 'News' },
    { id: 'videos', label: 'Videos' },
    { id: 'games', label: 'Games' },
  ]

  const switchTab = (id) => { setTab(id); setMenuOpen(false) }

  return (
    <>
      {/* LOADER */}
      <div className={`loader ${!loading ? 'hidden' : ''}`}>
        <img src={CHELSEA_CREST} alt="Chelsea FC" className="loader-crest" />
        <div className="loader-bar"><div className="loader-fill" /></div>
      </div>

      {/* NAVBAR */}
      <header className="navbar">
        <div className="nav-inner">
          <button className="nav-logo" onClick={() => switchTab('home')}>
            <img src={CHELSEA_CREST} alt="Chelsea FC" className="logo-img" />
            <span className="logo-text">Chelsea <span className="logo-accent">FC</span></span>
          </button>
          <nav className="nav-tabs desktop-nav">
            {navItems.map(n => (
              <button key={n.id} className={`nav-tab ${tab === n.id ? 'active' : ''}`} onClick={() => switchTab(n.id)}>{n.label}</button>
            ))}
            <a href="https://store.chelseafc.com" target="_blank" rel="noreferrer" className="nav-tab nav-tab-ext">Shop <ExternalIcon /></a>
          </nav>
          <div className="nav-right">
            <button className="icon-btn" onClick={() => setSearchOpen(!searchOpen)} aria-label="Search"><SearchIcon /></button>
            <button className={`hamburger ${menuOpen ? 'active' : ''}`} onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu"><span/><span/><span/></button>
          </div>
        </div>
        {searchOpen && (
          <div className="search-bar">
            <input ref={searchRef} type="text" placeholder="Search Chelsea FC..." className="search-input" />
            <button className="icon-btn" onClick={() => setSearchOpen(false)}><CloseIcon /></button>
          </div>
        )}
      </header>

      {/* MOBILE MENU — outside navbar to avoid stacking context issues */}
      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-header">
          <button className="nav-logo" onClick={() => switchTab('home')}>
            <img src={CHELSEA_CREST} alt="Chelsea FC" className="logo-img" />
            <span className="logo-text">Chelsea <span className="logo-accent">FC</span></span>
          </button>
          <button className="mobile-close" onClick={() => setMenuOpen(false)}><CloseIcon /></button>
        </div>
        <nav className="mobile-menu-nav">
          {navItems.map(n => (
            <button key={n.id} className={`mobile-menu-item ${tab === n.id ? 'active' : ''}`} onClick={() => switchTab(n.id)}>{n.label}</button>
          ))}
          <a href="https://store.chelseafc.com" target="_blank" rel="noreferrer" className="mobile-menu-item ext">Shop <ExternalIcon /></a>
        </nav>
      </div>

      {/* HERO - compact, always visible */}
      <section className="hero">
        <div className="hero-carousel">
          {heroSlides.map((s, i) => (
            <div key={i} className={`hero-slide ${i === currentSlide ? 'active' : ''}`}>
              <div className="hero-bg" style={{ backgroundImage: `url(${s.img})` }} />
              <div className="hero-overlay" />
              <div className="hero-content">
                <span className="hero-tag">{s.tag}</span>
                <h1>{s.title}</h1>
                <p>{s.desc}</p>
                {s.internal ? (
                  <button className="hero-cta" onClick={() => switchTab('games')}>Play Now</button>
                ) : (
                  <a href={s.link} className="hero-cta" target="_blank" rel="noreferrer">Read More</a>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="hero-dots">
          {heroSlides.map((_, i) => (
            <button key={i} className={`dot ${i === currentSlide ? 'active' : ''}`} onClick={() => goSlide(i)} />
          ))}
        </div>
        <button className="hero-arr hero-arr-l" onClick={() => goSlide((currentSlide - 1 + heroSlides.length) % heroSlides.length)}><ChevronLeft /></button>
        <button className="hero-arr hero-arr-r" onClick={() => goSlide((currentSlide + 1) % heroSlides.length)}><ChevronRight /></button>
      </section>

      {/* MAIN CONTENT AREA */}
      <main className="content">
        <div className="container">
          {tab === 'home' && <HomeView setTab={switchTab} statValues={statValues} statsRef={statsRef} />}
          {tab === 'matches' && <MatchesView />}
          {tab === 'news' && <NewsView />}
          {tab === 'videos' && <VideosView />}
          {tab === 'games' && <GamesView />}
        </div>
      </main>

      {/* FOOTER - compact */}
      <footer className="footer">
        <div className="container">
          <div className="footer-inner">
            <div className="footer-brand">
              <img src={CHELSEA_CREST} alt="Chelsea FC" className="footer-crest" />
              <div>
                <strong>Chelsea Football Club</strong>
                <span>Stamford Bridge, London SW6 1HS</span>
              </div>
            </div>
            <div className="footer-links">
              {[['About','https://www.chelseafc.com/en/about-the-club'],['Contact','https://www.chelseafc.com/en/contact-us'],['Careers','https://www.chelseafc.com/en/careers'],['The Shed','https://theshed.chelseafc.com/bridge/']].map(([l,u]) => (
                <a key={l} href={u} target="_blank" rel="noreferrer">{l}</a>
              ))}
            </div>
            <div className="footer-social">
              {[['FB','https://www.facebook.com/ChelseaFC/'],['IG','https://www.instagram.com/chelseafc/'],['YT','https://www.youtube.com/chelseafc'],['X','https://x.com/chelseafc'],['TT','https://www.tiktok.com/@chelseafc']].map(([l,u]) => (
                <a key={l} href={u} target="_blank" rel="noreferrer" className="social-pill">{l}</a>
              ))}
            </div>
          </div>
          <div className="footer-bottom">
            <div className="footer-legal">
              {['Privacy Policy','Cookies Policy','Terms & Conditions'].map(l => <a key={l} href="#">{l}</a>)}
            </div>
            <p>&copy; 2026 Chelsea FC Fan Hub. Fan experience project.</p>
          </div>
        </div>
      </footer>
    </>
  )
}
