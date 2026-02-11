import { useState, useEffect, useRef, useCallback } from 'react'
import TriviaGame from './components/TriviaGame'
import MemoryGame from './components/MemoryGame'
import GuessPlayer from './components/GuessPlayer'
import ScorePredictor from './components/ScorePredictor'

const CHELSEA_CREST = 'https://upload.wikimedia.org/wikipedia/en/c/cc/Chelsea_FC.svg'

// ===== Icons =====
const SearchIcon = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
const CloseIcon = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
const MenuIcon = () => <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
const ArrowRight = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
const ChevronLeft = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m15 18-6-6 6-6"/></svg>
const ChevronRight = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m9 18 6-6-6-6"/></svg>
const MapPin = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
const PlayBtn = () => <svg width="44" height="44" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
const PlaySmall = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="#034694"><polygon points="6 4 20 12 6 20 6 4"/></svg>

// ===== DATA =====
const heroSlides = [
  { tag: "Men's Team", title: 'Rosenior updates on Cucurella and highlights decisions that cost us', img: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=1600&q=80' },
  { tag: "Women's Team", title: 'Girma proud of how Chelsea stuck together through a tough period', img: 'https://images.unsplash.com/photo-1508098682722-e99c643e7f0b?w=1600&q=80' },
  { tag: 'Fan Zone', title: 'Test Your Blues Knowledge in the Fan Games Zone', img: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1600&q=80', internal: true },
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

const newsItems = [
  { tag: "Men's Team", title: 'Chelsea vs Leeds United', desc: 'Why are Chelsea and Leeds United rivals?', time: '10 Feb 26', img: 'https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=800&q=80', featured: true },
  { tag: 'Video', title: 'Chelsea vs Leeds', time: '12 Feb 26', img: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=600&q=80', video: true },
  { tag: "Men's Team", title: 'Joao Pedro on Leeds stalemate: "We are very frustrated"', time: '3 hours ago', img: 'https://images.unsplash.com/photo-1508098682722-e99c643e7f0b?w=600&q=80' },
  { tag: 'Video', title: 'Chelsea 2-2 Leeds Extended Highlights', time: '9 hours ago', img: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=600&q=80', video: true },
  { tag: "Men's Team", title: 'Match gallery: Blues left frustrated by Leeds', time: '7 hours ago', img: 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=600&q=80' },
  { tag: "Men's Team", title: 'Chelsea Diary: Cup ties and rivalries resumed', time: '09 Feb 26', img: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=600&q=80' },
]

const videoItems = [
  { title: 'Chelsea vs Leeds Full Match', time: '12 Feb 26', duration: '90:00', img: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=600&q=80' },
  { title: 'OTD: Willian nets dramatic late winner against Everton', time: '12 Feb 26', duration: '8:45', img: 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=600&q=80' },
  { title: 'Joao Pedro on Leeds stalemate', time: '3 hours ago', duration: '5:12', img: 'https://images.unsplash.com/photo-1508098682722-e99c643e7f0b?w=600&q=80' },
  { title: 'Chelsea 2-2 Leeds Extended Highlights', time: '9 hours ago', duration: '12:34', img: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=600&q=80' },
  { title: 'Rosenior reflects post-Leeds', time: '8 hours ago', duration: '8:22', img: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&q=80' },
]

const womensNews = [
  { tag: "Women's Team", title: 'Girma proud of how Chelsea stuck together through a tough period', time: '10 Feb 26', img: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=600&q=80' },
  { tag: "Women's Team", title: 'Club statement: Paul Green leaves Chelsea', time: '10 Feb 26', img: 'https://images.unsplash.com/photo-1551958219-acbc608c6377?w=600&q=80' },
  { tag: "Women's Team", title: 'Analysis: How Chelsea overcame in-form Tottenham', time: '10 Feb 26', img: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&q=80' },
  { tag: "Women's Team", title: 'Erin Cuthbert on reclaiming the Chelsea identity', time: '09 Feb 26', img: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=600&q=80' },
]

const academyNews = [
  { tag: 'Academy', title: 'FA Youth Cup: Chelsea U18 1-4 Man City U18', time: '10 Feb 26', img: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=600&q=80', video: true },
  { tag: 'Academy', title: 'PL2 Highlights: Chelsea U21 5-0 Blackburn U21', time: '08 Feb 26', img: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&q=80', video: true },
  { tag: 'Academy', title: 'REWIND | Chelsea U18 6-2 Man City U18 | FA Youth Cup 16-17', time: '10 Feb 26', img: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=600&q=80', video: true },
]

const tickets = [
  { comp: 'Premier League', title: 'Arsenal away', desc: "Ticket info for Chelsea's trip to the Emirates" },
  { comp: 'FA Cup', title: 'Hull City away', desc: 'Loyalty point update - FA Cup Fifth Round' },
  { comp: 'Premier League', title: 'Burnley at home', desc: 'Ticket info for Burnley at Stamford Bridge' },
]

// ===== Carousel Component =====
function HorizontalCarousel({ children, className = '' }) {
  const ref = useRef(null)
  const scroll = (dir) => {
    if (ref.current) ref.current.scrollBy({ left: dir * 340, behavior: 'smooth' })
  }
  return (
    <div className={`carousel-wrap ${className}`}>
      <div className="carousel-track" ref={ref}>{children}</div>
      <div className="carousel-arrows">
        <button className="carousel-arrow" onClick={() => scroll(-1)}><ChevronLeft /></button>
        <button className="carousel-arrow" onClick={() => scroll(1)}><ChevronRight /></button>
      </div>
    </div>
  )
}

// ===== Card Components =====
function NewsCard({ item }) {
  return (
    <article className="card">
      <div className="card-img-wrap">
        <img src={item.img} alt={item.title} loading="lazy" />
        {item.video && <div className="card-play"><PlaySmall /></div>}
      </div>
      <h3 className="card-title">{item.title}</h3>
      <div className="card-meta">
        <span className="card-tag">{item.tag}</span>
        <span className="card-time">{item.time}</span>
      </div>
    </article>
  )
}

function FeaturedCard({ item }) {
  return (
    <article className="featured-card">
      <a href="#" className="featured-link">
        <div className="featured-img-wrap">
          <img src={item.img} alt={item.title} loading="lazy" />
        </div>
        <div className="featured-text">
          <h2 className="featured-title">{item.desc || item.title}</h2>
          <div className="card-meta">
            <span className="card-tag">{item.tag}</span>
            <span className="card-time">{item.time}</span>
          </div>
        </div>
      </a>
    </article>
  )
}

function MatchCard({ match }) {
  const scores = match.score ? match.score.split('-') : null
  return (
    <div className="match-card">
      <div className="match-header">
        <span className="match-comp">{match.comp}</span>
        <span className="match-date">{match.date}</span>
      </div>
      <div className="match-body">
        <div className="match-team"><img src={match.home.crest} alt={match.home.name} /><span>{match.home.name}</span></div>
        <div className="match-result">
          {scores ? <span className="match-score-text">{match.score}</span> : <span className="match-kickoff">{match.time}</span>}
        </div>
        <div className="match-team"><img src={match.away.crest} alt={match.away.name} /><span>{match.away.name}</span></div>
      </div>
      <div className="match-footer">
        <span className="match-venue"><MapPin /> {match.venue}</span>
        <span className={`match-badge ${match.status === 'FT' ? 'badge-ft' : 'badge-upcoming'}`}>{match.status}</span>
      </div>
    </div>
  )
}

function VideoCard({ v }) {
  return (
    <article className="card">
      <div className="card-img-wrap video-thumb">
        <img src={v.img} alt={v.title} loading="lazy" />
        <div className="card-play"><PlaySmall /></div>
        <span className="video-dur">{v.duration}</span>
      </div>
      <h3 className="card-title">{v.title}</h3>
      <div className="card-meta">
        <span className="card-tag">Video</span>
        <span className="card-time">{v.time}</span>
      </div>
    </article>
  )
}

// ===== MAIN APP =====
export default function App() {
  const [loading, setLoading] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [matchTab, setMatchTab] = useState('mens')
  const [gameTab, setGameTab] = useState('trivia')
  const [statsAnimated, setStatsAnimated] = useState(false)
  const [statValues, setStatValues] = useState(stats.map(() => 0))
  const heroTimer = useRef(null)
  const statsRef = useRef(null)
  const searchRef = useRef(null)

  useEffect(() => { const t = setTimeout(() => setLoading(false), 1200); return () => clearTimeout(t) }, [])

  // Hero carousel
  useEffect(() => {
    heroTimer.current = setInterval(() => setCurrentSlide(s => (s + 1) % heroSlides.length), 5000)
    return () => clearInterval(heroTimer.current)
  }, [])
  const goSlide = useCallback(i => {
    clearInterval(heroTimer.current)
    setCurrentSlide(i)
    heroTimer.current = setInterval(() => setCurrentSlide(s => (s + 1) % heroSlides.length), 5000)
  }, [])

  // Stats
  useEffect(() => {
    if (!statsRef.current || statsAnimated) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setStatsAnimated(true)
        stats.forEach((s, idx) => {
          let c = 0; const step = s.count / 40
          const t = setInterval(() => {
            c += step
            if (c >= s.count) { setStatValues(p => { const n = [...p]; n[idx] = s.count; return n }); clearInterval(t) }
            else { setStatValues(p => { const n = [...p]; n[idx] = Math.floor(c); return n }) }
          }, 20)
        })
      }
    }, { threshold: 0.3 })
    obs.observe(statsRef.current)
    return () => obs.disconnect()
  }, [statsAnimated])

  useEffect(() => { if (searchOpen && searchRef.current) searchRef.current.focus() }, [searchOpen])
  useEffect(() => {
    const h = e => { if (e.key === 'Escape') { setSearchOpen(false); setMenuOpen(false) } }
    document.addEventListener('keydown', h); return () => document.removeEventListener('keydown', h)
  }, [])

  const scrollTo = id => { setMenuOpen(false); document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }) }

  const navItems = [
    { id: 'news-section', label: 'News' },
    { id: 'matches-section', label: 'Matches' },
    { id: 'videos-section', label: 'Videos' },
    { id: 'womens-section', label: "Women's Team" },
    { id: 'academy-section', label: 'Academy' },
    { id: 'games-section', label: 'Fan Games' },
    { id: 'tickets-section', label: 'Tickets' },
  ]

  const gameTabs = [
    { id: 'trivia', label: 'Trivia' },
    { id: 'memory', label: 'Memory' },
    { id: 'guess', label: 'Guess Player' },
    { id: 'predict', label: 'Predictor' },
  ]

  return (
    <>
      {/* Loader */}
      <div className={`loader ${!loading ? 'hide' : ''}`}>
        <img src={CHELSEA_CREST} alt="Chelsea FC" className="loader-crest" />
        <div className="loader-bar"><div className="loader-fill" /></div>
      </div>

      {/* Navbar - minimal like official site */}
      <header className="navbar">
        <a href="#" className="nav-brand" onClick={e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>
          <img src={CHELSEA_CREST} alt="Chelsea FC" />
        </a>
        <div className="nav-right">
          <button className="nav-icon" onClick={() => { setSearchOpen(!searchOpen); setMenuOpen(false) }} aria-label="Search"><SearchIcon /></button>
          <button className="nav-icon" onClick={() => { setMenuOpen(!menuOpen); setSearchOpen(false) }} aria-label="Menu">
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </header>

      {/* Search overlay */}
      {searchOpen && (
        <div className="search-drop">
          <div className="search-inner">
            <input ref={searchRef} type="text" placeholder="Search Chelsea FC..." className="search-field" />
            <button className="search-close" onClick={() => setSearchOpen(false)}><CloseIcon /></button>
          </div>
        </div>
      )}

      {/* Menu Drawer */}
      <div className={`menu-drawer ${menuOpen ? 'open' : ''}`}>
        <nav className="drawer-nav">
          {navItems.map(n => (
            <button key={n.id} className="drawer-link" onClick={() => scrollTo(n.id)}>{n.label}</button>
          ))}
          <a href="https://store.chelseafc.com" target="_blank" rel="noreferrer" className="drawer-link">Shop</a>
        </nav>
      </div>

      {/* Hero Carousel */}
      <section className="hero">
        {heroSlides.map((s, i) => (
          <div key={i} className={`hero-slide ${i === currentSlide ? 'active' : ''}`}>
            <img src={s.img} alt={s.title} className="hero-img" />
            <div className="hero-gradient" />
            <div className="hero-text">
              <h1>{s.title}</h1>
            </div>
          </div>
        ))}
        <div className="hero-dots">
          {heroSlides.map((_, i) => (
            <button key={i} className={`hero-dot ${i === currentSlide ? 'active' : ''}`} onClick={() => goSlide(i)} />
          ))}
        </div>
      </section>

      {/* Main Content */}
      <main>
        {/* Featured Story + News */}
        <section id="news-section" className="section section-white">
          <div className="container">
            <div className="section-head">
              <h2 className="section-title">Chelsea vs Leeds United <ArrowRight /></h2>
            </div>
            {newsItems[0] && <FeaturedCard item={newsItems[0]} />}
            <HorizontalCarousel>
              {newsItems.slice(1).map((item, i) => <NewsCard key={i} item={item} />)}
            </HorizontalCarousel>
          </div>
        </section>

        {/* Latest Videos */}
        <section className="section section-white">
          <div className="container">
            <div className="section-head">
              <h2 className="section-title">Latest Videos <ArrowRight /></h2>
            </div>
            <HorizontalCarousel>
              {videoItems.map((v, i) => <VideoCard key={i} v={v} />)}
            </HorizontalCarousel>
          </div>
        </section>

        {/* Shop Promo */}
        <section className="section section-promo">
          <div className="container">
            <div className="promo-banner">
              <div className="promo-content">
                <h2>Hailing the Year of the Horse!</h2>
                <p>Celebrate the lunar calendar with the pre-match top worn by Chelsea players ahead of our games.</p>
                <a href="https://store.chelseafc.com" target="_blank" rel="noreferrer" className="btn-primary">Shop Now</a>
              </div>
            </div>
          </div>
        </section>

        {/* Match Center */}
        <section id="matches-section" className="section section-white">
          <div className="container">
            <div className="section-head">
              <h2 className="section-title">Match Centre <ArrowRight /></h2>
            </div>
            <div className="tab-pills">
              {[['mens',"Men's"],['womens',"Women's"],['u21','U21s']].map(([k,l]) => (
                <button key={k} className={`pill ${matchTab === k ? 'active' : ''}`} onClick={() => setMatchTab(k)}>{l}</button>
              ))}
            </div>
            <div className="match-grid">
              {matchesData[matchTab]?.map((m, i) => <MatchCard key={i} match={m} />)}
            </div>
          </div>
        </section>

        {/* Women's Team News */}
        <section id="womens-section" className="section section-gray">
          <div className="container">
            <div className="section-head">
              <h2 className="section-title">Women&apos;s Team News <ArrowRight /></h2>
            </div>
            <HorizontalCarousel>
              {womensNews.map((item, i) => <NewsCard key={i} item={item} />)}
            </HorizontalCarousel>
          </div>
        </section>

        {/* Women's Team Videos */}
        <section id="videos-section" className="section section-gray">
          <div className="container">
            <div className="section-head">
              <h2 className="section-title">Women&apos;s Team Videos <ArrowRight /></h2>
            </div>
            <HorizontalCarousel>
              {videoItems.slice(0, 3).map((v, i) => <VideoCard key={i} v={v} />)}
            </HorizontalCarousel>
          </div>
        </section>

        {/* Academy */}
        <section id="academy-section" className="section section-white">
          <div className="container">
            <div className="section-head">
              <h2 className="section-title">Academy <ArrowRight /></h2>
            </div>
            <HorizontalCarousel>
              {academyNews.map((item, i) => <NewsCard key={i} item={item} />)}
            </HorizontalCarousel>
          </div>
        </section>

        {/* Stats */}
        <section className="stats-section" ref={statsRef}>
          <div className="container">
            <div className="stats-row">
              {stats.map((s, i) => (
                <div key={i} className="stat">
                  <span className="stat-num">{statValues[i]}</span>
                  <span className="stat-lbl">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Fan Games */}
        <section id="games-section" className="section section-white">
          <div className="container">
            <div className="section-head">
              <h2 className="section-title">Fan Games Zone</h2>
              <p className="section-sub">Test your Chelsea knowledge!</p>
            </div>
            <div className="tab-pills">
              {gameTabs.map(t => (
                <button key={t.id} className={`pill ${gameTab === t.id ? 'active' : ''}`} onClick={() => setGameTab(t.id)}>{t.label}</button>
              ))}
            </div>
            <div className="game-area">
              {gameTab === 'trivia' && <TriviaGame />}
              {gameTab === 'memory' && <MemoryGame />}
              {gameTab === 'guess' && <GuessPlayer />}
              {gameTab === 'predict' && <ScorePredictor />}
            </div>
          </div>
        </section>

        {/* Tickets */}
        <section id="tickets-section" className="section section-gray">
          <div className="container">
            <div className="section-head">
              <h2 className="section-title">Tickets <ArrowRight /></h2>
            </div>
            <div className="ticket-grid">
              {tickets.map((t, i) => (
                <div key={i} className="ticket-card">
                  <span className="ticket-comp">{t.comp}</span>
                  <h3>{t.title}</h3>
                  <p>{t.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Partners */}
        <section className="section section-white partners">
          <div className="container">
            <p className="partners-label">Principal Partners</p>
            <div className="partners-row">
              {[['Nike','https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg'],['FPT',''],['BingX','']].map(([n,logo]) => (
                <div key={n} className="partner">{logo ? <img src={logo} alt={n} /> : <span>{n}</span>}</div>
              ))}
            </div>
            <p className="partners-label">Official Partners</p>
            <div className="partners-row small">
              {['EA Sports','MSC Cruises','Carling','Rexona','Pegasus','Predator'].map(n => (
                <div key={n} className="partner"><span>{n}</span></div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer - Deep Chelsea blue */}
      <footer className="footer">
        <div className="container">
          <div className="footer-top">
            <img src={CHELSEA_CREST} alt="Chelsea FC" className="footer-crest" />
            <div className="footer-info">
              <strong>Chelsea Football Club</strong>
              <p>Stamford Bridge<br />Fulham Road<br />London<br />SW6 1HS</p>
            </div>
          </div>
          <div className="footer-social">
            {[['Facebook','https://www.facebook.com/ChelseaFC/','FB'],['Instagram','https://www.instagram.com/chelseafc/','IG'],['YouTube','https://www.youtube.com/chelseafc','YT'],['X','https://x.com/chelseafc','X'],['TikTok','https://www.tiktok.com/@chelseafc','TT']].map(([name,url,label]) => (
              <a key={name} href={url} target="_blank" rel="noreferrer" className="social-link" aria-label={name}>
                <span>{label}</span>
              </a>
            ))}
          </div>
          <hr className="footer-divider" />
          <div className="footer-links">
            {['About The Club','Contact Us & FAQs','Careers','The Shed','Official Store'].map(l => (
              <a key={l} href="#" className="footer-link">{l}</a>
            ))}
          </div>
          <div className="footer-bottom">
            <div className="footer-legal">
              {['Privacy Policy','Cookies Policy','Terms & Conditions','Modern Slavery Act'].map(l => (
                <a key={l} href="#">{l}</a>
              ))}
            </div>
            <p>&copy; 2026 Chelsea FC Fan Hub. Fan experience project.</p>
          </div>
        </div>
      </footer>
    </>
  )
}
