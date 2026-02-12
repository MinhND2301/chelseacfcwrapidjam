import { useState, useEffect, useRef, useCallback } from 'react'
import TriviaGame from './components/TriviaGame'
import MemoryGame from './components/MemoryGame'
import GuessPlayer from './components/GuessPlayer'
import ScorePredictor from './components/ScorePredictor'
import TicketChatbot from './components/TicketChatbot'

const CHELSEA_CREST = 'https://upload.wikimedia.org/wikipedia/en/c/cc/Chelsea_FC.svg'

// ===== Verified Working Image URLs =====
const IMG = {
  stadium:  'https://images.unsplash.com/photo-1522778119026-d647f0596c20',
  football: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018',
  match:    'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d',
  crowd:    'https://images.unsplash.com/photo-1560272564-c83b66b1ad12',
  ball:     'https://images.unsplash.com/photo-1579952363873-27f3bade9f55',
  pitch:    'https://images.unsplash.com/photo-1553778263-73a83bab9b0c',
  fans:     'https://images.unsplash.com/photo-1517466787929-bc90951d0974',
  training: 'https://images.unsplash.com/photo-1551958219-acbc608c6377',
  celeb:    'https://images.unsplash.com/photo-1543326727-cf6c39e8f84c',
  action:   'https://images.unsplash.com/photo-1518091043644-c1d4457512c6',
  sport:    'https://images.unsplash.com/photo-1606925797300-0b35e9d1794e',
  fitness:  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b',
  field:    'https://images.unsplash.com/photo-1459865264687-595d652de67e',
}
const img = (key, w = 800) => `${IMG[key]}?w=${w}&q=80`

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
const TrophyIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>
const TrainIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="16" height="16" x="4" y="3" rx="2"/><path d="M4 11h16"/><path d="M12 3v8"/><path d="m8 19-2 3"/><path d="m18 22-2-3"/><path d="M8 15h0"/><path d="M16 15h0"/></svg>
const MusicIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>

// ===== DATA — Chelsea FC Women's Hub =====
const heroSlides = [
  { tag: 'WSL Champions', title: 'Chelsea Women — Seven-Time Champions', desc: 'The most dominant force in English women\'s football. Seven WSL titles and counting.', link: '#', img: img('stadium', 1600) },
  { tag: 'UWCL 2026', title: 'Road to European Glory', desc: 'Chelsea Women take on the continent\'s best — follow every step of the Champions League journey.', link: '#', img: img('football', 1600) },
  { tag: 'Fan Zone', title: 'Test Your Blues Knowledge!', desc: 'Play trivia, memory games, and more in our interactive Fan Games Zone!', link: '#', img: img('crowd', 1600), internal: true },
]

const stats = [
  { count: 7, label: 'WSL Titles' },
  { count: 5, label: "FA Women's Cups" },
  { count: 2, label: 'League Cups' },
  { count: 1, label: 'UWCL Final' },
]

const matchesData = {
  womens: [
    { comp: 'WSL', date: 'Sun 16 Feb', home: { name: 'Chelsea W', crest: CHELSEA_CREST }, away: { name: 'Man City W', crest: 'https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg' }, time: '14:00', venue: 'Kingsmeadow', status: 'Upcoming' },
    { comp: 'WSL', date: 'Sun 02 Mar', home: { name: 'Arsenal W', crest: 'https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg' }, away: { name: 'Chelsea W', crest: CHELSEA_CREST }, time: '12:30', venue: 'Emirates Stadium', status: 'Upcoming' },
    { comp: 'UWCL', date: 'Wed 12 Mar', home: { name: 'Chelsea W', crest: CHELSEA_CREST }, away: { name: 'Lyon', crest: 'https://upload.wikimedia.org/wikipedia/en/a/a3/Olympique_Lyonnais.svg' }, time: '20:00', venue: 'Stamford Bridge', status: 'Upcoming' },
    { comp: 'WSL', date: 'Sun 23 Mar', home: { name: 'Chelsea W', crest: CHELSEA_CREST }, away: { name: 'Spurs W', crest: 'https://upload.wikimedia.org/wikipedia/en/b/b4/Tottenham_Hotspur.svg' }, time: '14:00', venue: 'Kingsmeadow', status: 'Upcoming' },
  ],
  mens: [
    { comp: 'FA Cup', date: 'Fri 13 Feb', home: { name: 'Hull City', crest: 'https://upload.wikimedia.org/wikipedia/en/5/54/Hull_City_A.F.C._logo.svg' }, away: { name: 'Chelsea', crest: CHELSEA_CREST }, time: '19:45', venue: 'The MKM Stadium', status: 'Upcoming' },
    { comp: 'Premier League', date: 'Sat 21 Feb', home: { name: 'Chelsea', crest: CHELSEA_CREST }, away: { name: 'Burnley', crest: 'https://upload.wikimedia.org/wikipedia/en/6/62/Burnley_F.C._Logo.svg' }, time: '15:00', venue: 'Stamford Bridge', status: 'Upcoming' },
  ],
}

const allNews = [
  { featured: true, tag: "Women's", cat: 'womens', title: 'Girma proud of how Chelsea Women stuck together through a tough period', time: '10 Feb', img: img('fans', 800), link: '#' },
  { tag: "Women's", cat: 'womens', title: 'Sam Kerr returns to full training ahead of WSL run-in', time: '9 Feb', img: img('training'), link: '#' },
  { tag: "Women's", cat: 'womens', title: 'Analysis: How Chelsea overcame in-form Tottenham in WSL', time: '8 Feb', img: img('football'), link: '#' },
  { tag: "Women's", cat: 'womens', title: 'Lauren James named WSL Player of the Month for January', time: '7 Feb', img: img('ball'), link: '#' },
  { tag: "Women's", cat: 'womens', title: 'Macario on adapting to the WSL: "It\'s a different challenge"', time: '6 Feb', img: img('match'), link: '#' },
  { tag: "Women's", cat: 'womens', title: 'Erin Cuthbert on reclaiming the Chelsea identity', time: '5 Feb', img: img('pitch'), link: '#' },
  { tag: "Women's", cat: 'womens', title: 'UWCL Quarter-Final draw: Chelsea Women to face Lyon', time: '4 Feb', img: img('celeb'), link: '#' },
  { tag: "Women's", cat: 'womens', title: "Nusken's rise: From Eintracht Frankfurt to Chelsea star", time: '3 Feb', img: img('sport'), link: '#' },
  { tag: "Men's", cat: 'mens', title: 'Chelsea 2-2 Leeds United: Premier League match report', time: '10 Feb', img: img('stadium'), link: '#' },
  { tag: "Men's", cat: 'mens', title: 'OTD: Willian nets dramatic late winner against Everton', time: '10 Feb', img: img('action'), link: '#' },
]

const videoItems = [
  { title: 'Chelsea W 2-0 Spurs W | WSL Highlights', time: '10 Feb', duration: '8:45', img: img('fans') },
  { title: 'Girma Post-Match: "We\'re Getting Stronger"', time: '10 Feb', duration: '5:12', img: img('training') },
  { title: 'Behind the Scenes: Matchday at Kingsmeadow', time: '9 Feb', duration: '15:22', img: img('football') },
  { title: 'Top 10 Chelsea Women Goals of 2025', time: '8 Feb', duration: '10:30', img: img('celeb') },
  { title: 'Lauren James: Season So Far', time: '7 Feb', duration: '12:34', img: img('ball') },
  { title: 'Sam Kerr — The Road to Recovery', time: '6 Feb', duration: '11:15', img: img('sport') },
]

const PLAYERS = [
  { name: 'Sam Kerr', pos: 'Forward', number: 20, nation: 'Australia', flag: 'AUS', bio: 'World-class striker and Chelsea\'s talisman. Record goalscorer with incredible aerial ability.' },
  { name: 'Catarina Macario', pos: 'Midfielder', number: 10, nation: 'USA', flag: 'USA', bio: 'Creative playmaker with exceptional technical skills and vision.' },
  { name: 'Naomi Girma', pos: 'Defender', number: 4, nation: 'USA', flag: 'USA', bio: 'World\'s best defender — composed, dominant, and a leader from the back.' },
  { name: 'Lucy Bronze', pos: 'Defender', number: 2, nation: 'England', flag: 'ENG', bio: 'Ballon d\'Or winner. One of the greatest right-backs in football history.' },
  { name: 'Lauren James', pos: 'Forward', number: 16, nation: 'England', flag: 'ENG', bio: 'Explosive winger with mesmerising dribbling and a lethal finish.' },
  { name: 'Mayra Ramirez', pos: 'Forward', number: 9, nation: 'Colombia', flag: 'COL', bio: 'Clinical striker with pace and power. Record signing from Levante.' },
  { name: 'Sjoeke Nusken', pos: 'Midfielder', number: 8, nation: 'Germany', flag: 'GER', bio: 'Box-to-box dynamo with an eye for goal and tireless energy.' },
  { name: 'Johanna Rytting Kaneryd', pos: 'Forward', number: 7, nation: 'Sweden', flag: 'SWE', bio: 'Pacy winger with direct running and creative crossing ability.' },
  { name: 'Sonia Bompastor', pos: 'Manager', number: null, nation: 'France', flag: 'FRA', bio: 'Former Lyon legend, now leading Chelsea Women to new heights.' },
]

const CHANTS = [
  { name: 'Blue is the Colour', lyrics: '"Blue is the colour, football is the game, we\'re all together and winning is our aim..."', classic: true },
  { name: 'Carefree', lyrics: '"Carefree, wherever we may be, we are the famous CFC..."', classic: true },
  { name: 'Ten Men Went to Mow', lyrics: 'A Stamford Bridge classic — growing louder with every verse!', classic: false },
  { name: 'Chelsea Chelsea Chelsea!', lyrics: 'Simple, loud, and proud — the heartbeat of the Bridge.', classic: false },
  { name: 'Keep the Blue Flag Flying High', lyrics: '"Keep the blue flag flying high, Chelsea!"', classic: true },
]

const HONOURS = [
  { trophy: 'WSL Champions', count: 7, years: '2015, 2018, 2020, 2021, 2022, 2023, 2024' },
  { trophy: "FA Women's Cup", count: 5, years: '2015, 2018, 2021, 2022, 2023' },
  { trophy: 'League Cup', count: 2, years: '2020, 2021' },
  { trophy: 'UWCL Runner-Up', count: 1, years: '2021' },
]

const tickets = [
  { comp: 'WSL', title: 'Man City Women — Home', desc: 'Tickets for Chelsea Women vs Man City Women at Kingsmeadow' },
  { comp: 'UWCL', title: 'Lyon — Home', desc: 'Champions League Quarter-Final at Stamford Bridge' },
  { comp: 'WSL', title: 'Arsenal Women — Away', desc: 'Away ticket info for Chelsea Women at the Emirates' },
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

function PlayerCard({ player }) {
  const posColor = { Forward: 'var(--gold)', Midfielder: 'var(--blue-light)', Defender: '#22c55e', Goalkeeper: '#f97316', Manager: 'var(--text-2)' }
  return (
    <div className="player-card">
      <div className="player-card-top" style={{ borderColor: posColor[player.pos] || 'var(--blue)' }}>
        <div className="player-number">{player.number || ''}</div>
        <div className="player-pos-badge" style={{ background: posColor[player.pos] || 'var(--blue)' }}>{player.pos}</div>
      </div>
      <div className="player-card-body">
        <h3 className="player-name">{player.name}</h3>
        <span className="player-nation">{player.flag} {player.nation}</span>
        <p className="player-bio">{player.bio}</p>
      </div>
    </div>
  )
}

// ===== TAB VIEWS =====
function HomeView({ setTab, statValues, statsRef, setChatOpen }) {
  return (
    <>
      {/* Quick Stats — Women's Honours */}
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
        {/* Next Women's Match */}
        <div className="home-section">
          <div className="home-section-head">
            <h3>Next Women's Match</h3>
            <button className="link-btn" onClick={() => setTab('matchday')}>Matchday Guide <ArrowRight /></button>
          </div>
          <MatchCard match={matchesData.womens[0]} />
        </div>

        {/* Upcoming */}
        <div className="home-section">
          <div className="home-section-head">
            <h3>Coming Up</h3>
          </div>
          <MatchCard match={matchesData.womens[1]} />
        </div>
      </div>

      {/* Top News — Women's First */}
      <div className="home-section full">
        <div className="home-section-head">
          <h3>Top Stories</h3>
          <button className="link-btn" onClick={() => setTab('home')}>All News <ArrowRight /></button>
        </div>
        <div className="news-row">
          {allNews.filter(n => n.cat === 'womens').slice(0, 4).map((item, i) => <NewsCard key={i} item={item} />)}
        </div>
      </div>

      {/* Featured Videos — Women's */}
      <div className="home-section full">
        <div className="home-section-head">
          <h3>Featured Videos</h3>
        </div>
        <div className="video-row">
          {videoItems.slice(0, 3).map((v, i) => <VideoCard key={i} v={v} />)}
        </div>
      </div>

      {/* Tickets & Promo */}
      <div className="home-grid">
        <div className="home-section">
          <div className="home-section-head"><h3>Women's Tickets</h3></div>
          <div className="ticket-list">
            {tickets.map((t, i) => (
              <div key={i} className="ticket-row-item" onClick={() => setChatOpen(true)}>
                <div><span className="ticket-comp-sm">{t.comp}</span><span className="ticket-title-sm">{t.title}</span></div>
                <ArrowRight />
              </div>
            ))}
          </div>
        </div>
        <div className="home-section">
          <div className="promo-card">
            <span className="promo-label">Chelsea Women</span>
            <h3>Join Us at Kingsmeadow!</h3>
            <p>Support the seven-time WSL champions live. Affordable tickets for the whole family.</p>
            <button className="promo-cta" onClick={() => setChatOpen(true)}>Get Tickets <TicketIcon /></button>
          </div>
        </div>
      </div>
    </>
  )
}

function MatchdayView({ setChatOpen }) {
  return (
    <div className="tab-view">
      <div className="view-head">
        <h2>Matchday Guide</h2>
        <p className="view-subtitle">Everything you need for a great matchday experience</p>
      </div>

      {/* Upcoming Women's Matches */}
      <div className="matchday-section">
        <h3 className="section-title"><TicketIcon /> Upcoming Women's Matches</h3>
        <div className="match-grid">
          {matchesData.womens.map((m, i) => <MatchCard key={i} match={m} />)}
        </div>
        <button className="matchday-cta" onClick={() => setChatOpen(true)}>Buy Tickets via Chat Assistant</button>
      </div>

      {/* Getting to Kingsmeadow */}
      <div className="matchday-section">
        <h3 className="section-title"><TrainIcon /> Getting to Kingsmeadow</h3>
        <div className="info-grid">
          <div className="info-card">
            <h4>Address</h4>
            <p>Kingsmeadow, Jack Goodchild Way, Kingston upon Thames, KT1 3PB</p>
          </div>
          <div className="info-card">
            <h4>By Train</h4>
            <p>Nearest station: <strong>Norbiton</strong> (10-min walk). Also served by Kingston station (15-min walk).</p>
          </div>
          <div className="info-card">
            <h4>By Bus</h4>
            <p>Routes <strong>K1, K2, 131</strong> stop near the ground. Check TfL for live updates.</p>
          </div>
          <div className="info-card">
            <h4>Parking</h4>
            <p>Limited parking available. Public transport strongly recommended on matchdays.</p>
          </div>
        </div>
      </div>

      {/* Getting to Stamford Bridge (big matches) */}
      <div className="matchday-section">
        <h3 className="section-title"><MapPin /> Stamford Bridge (Big WSL / UWCL Matches)</h3>
        <div className="info-grid">
          <div className="info-card">
            <h4>Address</h4>
            <p>Stamford Bridge, Fulham Road, London SW6 1HS</p>
          </div>
          <div className="info-card">
            <h4>By Tube</h4>
            <p><strong>Fulham Broadway</strong> (District Line) — 5 minute walk to the ground.</p>
          </div>
          <div className="info-card">
            <h4>Facilities</h4>
            <p>Chelsea Megastore, Chelsea Museum, food courts, accessible seating, family areas in East Stand.</p>
          </div>
          <div className="info-card">
            <h4>Gates Open</h4>
            <p>90 minutes before kick-off. Have your digital ticket ready on the Chelsea FC app.</p>
          </div>
        </div>
      </div>

      {/* What to Expect */}
      <div className="matchday-section">
        <h3 className="section-title">What to Expect</h3>
        <div className="expect-list">
          <div className="expect-item"><span className="expect-icon">&#x1F3DF;&#xFE0F;</span><div><strong>Atmosphere</strong><p>Passionate fans, family-friendly environment, and incredible support for the Women{"'"}s team.</p></div></div>
          <div className="expect-item"><span className="expect-icon">&#x1F354;</span><div><strong>Food &amp; Drink</strong><p>Concourse refreshments available inside the ground, including hot food, snacks, and beverages.</p></div></div>
          <div className="expect-item"><span className="expect-icon">&#x1F4F1;</span><div><strong>Digital Tickets</strong><p>All tickets are digital — download the Chelsea FC app and have your ticket ready before arriving.</p></div></div>
          <div className="expect-item"><span className="expect-icon">&#x1F6CD;&#xFE0F;</span><div><strong>Merchandise</strong><p>Pick up Women{"'"}s team shirts, scarves, and more at the matchday pop-up shop.</p></div></div>
        </div>
      </div>

      {/* Chants */}
      <div className="matchday-section">
        <h3 className="section-title"><MusicIcon /> Matchday Chants</h3>
        <p className="section-desc">Learn the songs and sing along on matchday!</p>
        <div className="chants-grid">
          {CHANTS.map((c, i) => (
            <div key={i} className={`chant-card ${c.classic ? 'classic' : ''}`}>
              <div className="chant-name">{c.classic && <span className="chant-badge">Classic</span>}{c.name}</div>
              <p className="chant-lyrics">{c.lyrics}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function PlayersView() {
  return (
    <div className="tab-view">
      <div className="view-head">
        <h2>Players & Staff</h2>
        <p className="view-subtitle">Chelsea Women's Squad</p>
      </div>
      <div className="player-grid">
        {PLAYERS.map((p, i) => <PlayerCard key={i} player={p} />)}
      </div>
    </div>
  )
}

function AboutView() {
  return (
    <div className="tab-view">
      <div className="view-head">
        <h2>About Chelsea Women</h2>
      </div>

      {/* Honours */}
      <div className="about-section">
        <h3 className="section-title"><TrophyIcon /> Honours</h3>
        <div className="honours-grid">
          {HONOURS.map((h, i) => (
            <div key={i} className="honour-card">
              <span className="honour-count">{h.count}</span>
              <span className="honour-trophy">{h.trophy}</span>
              <span className="honour-years">{h.years}</span>
            </div>
          ))}
        </div>
      </div>

      {/* History */}
      <div className="about-section">
        <h3 className="section-title">Club History</h3>
        <div className="history-content">
          <p>Chelsea FC Women were founded in 1992 and have risen to become the dominant force in English women's football. Originally known as Chelsea Ladies, the team turned fully professional under the WSL era and haven't looked back.</p>
          <p>Under the legendary management of <strong>Emma Hayes</strong> (2012-2024), Chelsea won an unprecedented <strong>six consecutive WSL titles</strong>, five FA Women's Cups, and reached the <strong>UWCL Final in 2021</strong>. Hayes transformed the club from mid-table to European contenders.</p>
          <p>In 2024, <strong>Sonia Bompastor</strong> took charge — bringing her Lyon-winning pedigree to continue Chelsea's era of dominance. With world-class signings like <strong>Naomi Girma</strong> and <strong>Catarina Macario</strong>, the future is bright for the Blues.</p>
        </div>
      </div>

      {/* Past, Present, Future */}
      <div className="about-section">
        <h3 className="section-title">Past, Present, Future</h3>
        <div className="timeline-grid">
          <div className="timeline-card">
            <span className="timeline-era">Past</span>
            <h4>The Foundation Years</h4>
            <p>From humble beginnings in 1992 to the early WSL years. Icons like <strong>Eni Aluko</strong> and <strong>Katie Chapman</strong> laid the groundwork for what was to come.</p>
          </div>
          <div className="timeline-card active">
            <span className="timeline-era">Present</span>
            <h4>The Golden Era</h4>
            <p>Seven WSL titles, Champions League nights at the Bridge, and a squad full of global superstars. This is Chelsea Women's finest chapter — and it's still being written.</p>
          </div>
          <div className="timeline-card">
            <span className="timeline-era">Future</span>
            <h4>Global Ambition</h4>
            <p>With growing investment in women's football, a state-of-the-art Cobham training facility, and a packed Stamford Bridge on the horizon, the future is limitless.</p>
          </div>
        </div>
      </div>

      {/* Famous Songs */}
      <div className="about-section">
        <h3 className="section-title"><MusicIcon /> Songs & Anthems</h3>
        <div className="songs-list">
          <div className="song-item">
            <strong>Blue is the Colour (1972)</strong>
            <p>The most iconic Chelsea song, recorded for the League Cup Final. Still sung at every match by tens of thousands of fans.</p>
          </div>
          <div className="song-item">
            <strong>Carefree</strong>
            <p>An anthem of fearlessness — "Carefree, wherever we may be, we are the famous CFC." Born on the terraces, now known worldwide.</p>
          </div>
          <div className="song-item">
            <strong>Liquidator (The Harry J Allstars)</strong>
            <p>The instrumental that blasts out before every home kick-off. The moment the stadium erupts — pure matchday magic.</p>
          </div>
        </div>
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
  const [chatOpen, setChatOpen] = useState(false)
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
    { id: 'matchday', label: 'Matchday' },
    { id: 'players', label: 'Players' },
    { id: 'about', label: 'About' },
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
            <span className="logo-text">Chelsea <span className="logo-accent">Women</span></span>
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
            <input ref={searchRef} type="text" placeholder="Search Chelsea Women..." className="search-input" />
            <button className="icon-btn" onClick={() => setSearchOpen(false)}><CloseIcon /></button>
          </div>
        )}
      </header>

      {/* MOBILE MENU — outside navbar to avoid stacking context issues */}
      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-header">
          <button className="nav-logo" onClick={() => switchTab('home')}>
            <img src={CHELSEA_CREST} alt="Chelsea FC" className="logo-img" />
            <span className="logo-text">Chelsea <span className="logo-accent">Women</span></span>
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

      {/* HERO */}
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
          {tab === 'home' && <HomeView setTab={switchTab} statValues={statValues} statsRef={statsRef} setChatOpen={setChatOpen} />}
          {tab === 'matchday' && <MatchdayView setChatOpen={setChatOpen} />}
          {tab === 'players' && <PlayersView />}
          {tab === 'about' && <AboutView />}
          {tab === 'games' && <GamesView />}
        </div>
      </main>

      {/* FOOTER */}
      <footer className="footer">
        <div className="container">
          <div className="footer-inner">
            <div className="footer-brand">
              <img src={CHELSEA_CREST} alt="Chelsea FC" className="footer-crest" />
              <div>
                <strong>Chelsea FC Women's Hub</strong>
                <span>Kingsmeadow & Stamford Bridge, London</span>
              </div>
            </div>
            <div className="footer-links">
              {[['About','https://www.chelseafc.com/en/about-the-club'],['Contact','https://www.chelseafc.com/en/contact-us'],['Careers','https://www.chelseafc.com/en/careers'],['The Shed','https://theshed.chelseafc.com/bridge/']].map(([l,u]) => (
                <a key={l} href={u} target="_blank" rel="noreferrer">{l}</a>
              ))}
            </div>
            <div className="footer-social">
              {[['FB','https://www.facebook.com/ChelseaFCW/'],['IG','https://www.instagram.com/chelseafcw/'],['YT','https://www.youtube.com/chelseafc'],['X','https://x.com/chelseafcw'],['TT','https://www.tiktok.com/@chelseafc']].map(([l,u]) => (
                <a key={l} href={u} target="_blank" rel="noreferrer" className="social-pill">{l}</a>
              ))}
            </div>
          </div>
          <div className="footer-bottom">
            <div className="footer-legal">
              {['Privacy Policy','Cookies Policy','Terms & Conditions'].map(l => <a key={l} href="#">{l}</a>)}
            </div>
            <p>&copy; 2026 Chelsea FC Women's Hub. Fan experience project.</p>
          </div>
        </div>
      </footer>

      {/* TICKET CHATBOT */}
      <TicketChatbot isOpen={chatOpen} onClose={() => setChatOpen(false)} />
      {!chatOpen && (
        <button className="chatbot-fab" onClick={() => setChatOpen(true)} aria-label="Open Ticket Chat">
          <TicketIcon />
          <span className="fab-label">Tickets</span>
        </button>
      )}
    </>
  )
}
