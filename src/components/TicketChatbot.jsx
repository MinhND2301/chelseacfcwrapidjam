import { useState, useRef, useEffect } from 'react'

const CHELSEA_CREST = 'https://upload.wikimedia.org/wikipedia/en/c/cc/Chelsea_FC.svg'
const QR_IMAGE = '/assets/qr-payment.png'

// ===== Mock Data =====
const MATCHES = [
  { id: 'WSL-MCI', comp: 'WSL', team: 'Man City', home: 'Chelsea Women', away: 'Man City Women', date: 'Sun 16 Feb 2026', time: '14:00', venue: 'Kingsmeadow', prices: { adult: 18, junior: 5, senior: 12, family: 40 }, availability: 'available', loyalty: 0, women: true },
  { id: 'WSL-ARS', comp: 'WSL', team: 'Arsenal', home: 'Arsenal Women', away: 'Chelsea Women', date: 'Sun 02 Mar 2026', time: '12:30', venue: 'Emirates Stadium', prices: { adult: 22, junior: 8, senior: 15, family: 50 }, availability: 'limited', loyalty: 2, women: true },
  { id: 'UWCL-LYO', comp: 'UWCL', team: 'Lyon', home: 'Chelsea Women', away: 'Olympique Lyonnais', date: 'Wed 12 Mar 2026', time: '20:00', venue: 'Stamford Bridge', prices: { adult: 25, junior: 8, senior: 16, family: 55 }, availability: 'limited', loyalty: 1, women: true },
  { id: 'WSL-TOT', comp: 'WSL', team: 'Tottenham', home: 'Chelsea Women', away: 'Tottenham Women', date: 'Sun 23 Mar 2026', time: '14:00', venue: 'Kingsmeadow', prices: { adult: 18, junior: 5, senior: 12, family: 40 }, availability: 'available', loyalty: 0, women: true },
  { id: 'PL-BUR', comp: 'Premier League', team: 'Burnley', home: 'Chelsea', away: 'Burnley', date: 'Sat 21 Feb 2026', time: '15:00', venue: 'Stamford Bridge', prices: { adult: 55, junior: 25, senior: 35, family: 120 }, availability: 'available', loyalty: 0, women: false },
  { id: 'FAC-HUL', comp: 'FA Cup', team: 'Hull City', home: 'Hull City', away: 'Chelsea', date: 'Fri 13 Feb 2026', time: '19:45', venue: 'The MKM Stadium', prices: { adult: 35, junior: 15, senior: 22, family: 80 }, availability: 'limited', loyalty: 3, women: false },
  { id: 'PL-ARS', comp: 'Premier League', team: 'Arsenal', home: 'Arsenal', away: 'Chelsea', date: 'Sat 08 Mar 2026', time: '17:30', venue: 'Emirates Stadium', prices: { adult: 65, junior: 30, senior: 42, family: 140 }, availability: 'sold_out', loyalty: 12, women: false },
  { id: 'UCL-PSG', comp: 'Champions League', team: 'PSG', home: 'Chelsea', away: 'PSG', date: 'Wed 19 Mar 2026', time: '20:00', venue: 'Stamford Bridge', prices: { adult: 75, junior: 35, senior: 48, family: 165 }, availability: 'limited', loyalty: 5, women: false },
]

const PLAYERS = [
  { name: 'Sam Kerr', pos: 'Forward', number: 20, nation: 'Australia' },
  { name: 'Catarina Macario', pos: 'Midfielder', number: 10, nation: 'USA' },
  { name: 'Naomi Girma', pos: 'Defender', number: 4, nation: 'USA' },
  { name: 'Lucy Bronze', pos: 'Defender', number: 2, nation: 'England' },
  { name: 'Lauren James', pos: 'Forward', number: 16, nation: 'England' },
  { name: 'Mayra Ramirez', pos: 'Forward', number: 9, nation: 'Colombia' },
  { name: 'Sjoeke Nusken', pos: 'Midfielder', number: 8, nation: 'Germany' },
  { name: 'Johanna Rytting Kaneryd', pos: 'Forward', number: 7, nation: 'Sweden' },
]

// ===== Response Engine =====
function getResponse(input) {
  const q = input.toLowerCase().trim()

  // Greetings
  if (/^(hi|hello|hey|yo|sup|howdy|good\s*(morning|afternoon|evening))/.test(q)) {
    return {
      text: "Hello! Welcome to the Chelsea FC Women's Hub. I'm your Ticket & Matchday Assistant.\n\nHow can I help you today?",
      suggestions: ['Women\'s matches', 'Buy tickets', 'Meet the players', 'Matchday guide', 'About Chelsea Women'],
    }
  }

  // Thanks / bye
  if (/^(thanks|thank you|cheers|bye|goodbye|see ya|great|perfect)/.test(q)) {
    return {
      text: "You're welcome! Up the Chels! 💙\n\nAnything else I can help with?",
      suggestions: ['Women\'s matches', 'Buy tickets', 'Matchday guide'],
    }
  }

  // ===== WOMEN'S MATCHES =====
  if (/women.*(match|game|ticket|fixture)|wsl|uwcl|women.*(upcoming|next)|kingsmeadow/.test(q)) {
    const wm = MATCHES.filter(m => m.women)
    const lines = wm.map(m => {
      const s = m.availability === 'sold_out' ? '🔴 Sold Out' : m.availability === 'limited' ? '🟡 Limited' : '🟢 Available'
      return `**${m.comp}** — ${m.home} vs ${m.away}\n📅 ${m.date} at ${m.time}\n📍 ${m.venue} | ${s}`
    })
    return {
      text: `**Chelsea Women — Upcoming Matches:**\n\n${lines.join('\n\n')}`,
      suggestions: ['Buy women\'s ticket', 'Man City tickets', 'Lyon tickets', 'Men\'s matches', 'Matchday guide'],
    }
  }

  // ===== ALL MATCHES / UPCOMING =====
  if (/all (match|ticket|game|fixture)|upcoming|next (match|game)|fixture|what.*(match|game).*(available|coming|next)/.test(q)) {
    const lines = MATCHES.map(m => {
      const s = m.availability === 'sold_out' ? '🔴 Sold Out' : m.availability === 'limited' ? '🟡 Limited' : '🟢 Available'
      return `**${m.comp}** — ${m.home} vs ${m.away}\n📅 ${m.date} | ${s}`
    })
    return {
      text: `**All Upcoming Matches:**\n\n${lines.join('\n\n')}`,
      suggestions: ['Women\'s matches', 'Men\'s matches', 'Buy tickets', 'Ticket prices'],
    }
  }

  // ===== MEN'S MATCHES =====
  if (/men.*(match|game|ticket|fixture)|premier league|men.*(upcoming|next)/.test(q)) {
    const mm = MATCHES.filter(m => !m.women)
    const lines = mm.map(m => {
      const s = m.availability === 'sold_out' ? '🔴 Sold Out' : m.availability === 'limited' ? '🟡 Limited' : '🟢 Available'
      return `**${m.comp}** — ${m.home} vs ${m.away}\n📅 ${m.date} at ${m.time}\n📍 ${m.venue} | ${s}`
    })
    return {
      text: `**Chelsea Men — Upcoming Matches:**\n\n${lines.join('\n\n')}`,
      suggestions: ['Buy ticket', 'Burnley tickets', 'PSG tickets', 'Women\'s matches'],
    }
  }

  // ===== SPECIFIC MATCH LOOKUP =====
  for (const m of MATCHES) {
    const team = m.team.toLowerCase()
    if (q.includes(team)) {
      const s = m.availability === 'sold_out' ? '🔴 SOLD OUT' : m.availability === 'limited' ? '🟡 Limited availability' : '🟢 Available'
      const prices = `Adult: £${m.prices.adult} | Junior: £${m.prices.junior} | Senior: £${m.prices.senior} | Family: £${m.prices.family}`
      let extra = ''
      if (m.availability === 'sold_out') extra = '\n\n⚠️ Currently sold out. Check for returns on chelseafc.com.'
      if (m.loyalty > 0) extra += `\n🎫 Requires ${m.loyalty}+ loyalty points.`
      const buyable = m.availability !== 'sold_out'
      return {
        text: `**${m.comp}: ${m.home} vs ${m.away}**\n📅 ${m.date} at ${m.time}\n📍 ${m.venue}\n\n**Status:** ${s}\n**Prices:** ${prices}${extra}`,
        suggestions: buyable
          ? [`Buy ${m.team} ticket`, 'Other matches', 'Matchday guide', 'How to get there']
          : ['Other matches', 'Women\'s matches', 'Membership info'],
      }
    }
  }

  // ===== BUY TICKET FLOW =====
  if (/buy|purchase|book|order|get ticket/.test(q)) {
    // Check if they specified a match
    for (const m of MATCHES) {
      if (q.includes(m.team.toLowerCase()) && m.availability !== 'sold_out') {
        return {
          text: `Great choice! Let's get you tickets for **${m.home} vs ${m.away}**.\n\n📅 ${m.date} at ${m.time}\n📍 ${m.venue}\n\n**Select your ticket type:**`,
          suggestions: [
            `Adult ticket £${m.prices.adult}`,
            `Junior ticket £${m.prices.junior}`,
            `Senior ticket £${m.prices.senior}`,
            `Family pack £${m.prices.family}`,
          ],
          matchContext: m.id,
        }
      }
    }
    // Generic buy prompt
    const available = MATCHES.filter(m => m.availability !== 'sold_out')
    return {
      text: "Which match would you like to buy tickets for?\n\n**Available matches:**",
      suggestions: available.map(m => `${m.team} tickets`),
    }
  }

  // ===== TICKET TYPE SELECTED → SHOW QR =====
  if (/adult ticket|junior ticket|senior ticket|family pack|confirm.*purchase|pay now/.test(q)) {
    const priceMatch = q.match(/£(\d+)/)
    const price = priceMatch ? priceMatch[1] : '??'
    return {
      text: `**Order Confirmed!** 🎉\n\nTicket: ${q.replace(/£\d+/, '').trim()}\nTotal: **£${price}**\n\nScan the QR code below to complete your payment:`,
      showQR: true,
      suggestions: ['Buy another ticket', 'Women\'s matches', 'Matchday guide', 'Thank you'],
    }
  }

  // ===== PLAYERS =====
  if (/player|squad|team|roster|who plays|lineup|staff/.test(q)) {
    const lines = PLAYERS.map(p => `**${p.name}** (#${p.number}) — ${p.pos} | ${p.nation}`)
    return {
      text: `**Chelsea Women — Key Players:**\n\n${lines.join('\n')}`,
      suggestions: ['Sam Kerr info', 'Lauren James info', 'Buy tickets', 'About Chelsea Women'],
    }
  }

  // Individual player
  for (const p of PLAYERS) {
    if (q.includes(p.name.toLowerCase().split(' ')[1]?.toLowerCase() || '___')) {
      return {
        text: `**${p.name}** 🏟️\n\n🔢 #${p.number} | ${p.pos}\n🌍 ${p.nation}\n\n${p.name} is a key part of the Chelsea Women squad, bringing world-class talent and experience to every match.`,
        suggestions: ['Meet more players', 'Women\'s matches', 'Buy tickets'],
      }
    }
  }

  // ===== MATCHDAY GUIDE =====
  if (/matchday|match day|guide|getting there|directions|travel|how.*(get|travel)|kingsmeadow|stamford bridge|parking|transport/.test(q)) {
    return {
      text: "**Women's Matchday Guide — Kingsmeadow** 🏟️\n\n📍 **Address:** Kingsmeadow, Jack Goodchild Way, Kingston upon Thames, KT1 3PB\n\n🚂 **Getting There:**\n• Nearest station: Norbiton (10-min walk)\n• Bus routes: K1, K2, 131\n• Limited parking — public transport recommended\n\n🕐 **Gates open** 90 mins before kick-off\n🍔 **Food & Drink** available inside the ground\n📱 **Tickets** on your Chelsea FC app — have your digital ticket ready\n\n🎵 **Matchday Chants:**\n• \"Blue is the Colour\" — the classic!\n• \"Carefree\" — sung loud and proud\n• \"Chelsea, Chelsea, Chelsea!\" — simple and powerful",
      suggestions: ['Buy tickets', 'Women\'s matches', 'Stamford Bridge info', 'About Chelsea Women'],
    }
  }

  // ===== ABOUT CHELSEA WOMEN =====
  if (/about.*women|history.*women|honours|chelsea women|women.*history|chelsea.*wom/.test(q)) {
    return {
      text: "**About Chelsea FC Women** 💙\n\n🏆 **Honours:**\n• WSL Champions: 2015, 2017-18, 2019-20, 2020-21, 2021-22, 2022-23, 2023-24\n• FA Women's Cup: 2015, 2018, 2021, 2022, 2023\n• League Cup: 2020, 2021\n\n📖 **The Story:**\nChelsea Women have become the dominant force in English women's football. Under Emma Hayes' legacy, the team won 6 consecutive WSL titles and continues to compete at the highest level in Europe.\n\n🏟️ **Home Ground:** Kingsmeadow, Kingston upon Thames\n🧢 **Iconic Players:** Sam Kerr, Fran Kirby, Ji So-yun, Millie Bright",
      suggestions: ['Meet the players', 'Women\'s matches', 'Buy tickets', 'Matchday guide'],
    }
  }

  // ===== MEMBERSHIP =====
  if (/member|true blue|join|sign up|loyalty|points/.test(q)) {
    return {
      text: "**Chelsea FC Memberships:**\n\n🔵 **True Blue** — £25/year\nPriority ticket access, loyalty points, exclusive discounts\n\n🔵 **Junior True Blue** — £15/year\nU16 priority, birthday gift, matchday experiences\n\n🌍 **International** — £30/year\nOverseas priority, travel packages, digital content\n\n💡 Membership earns loyalty points for every match — needed for high-demand fixtures!\n\nSign up: chelseafc.com/membership",
      suggestions: ['Buy tickets', 'Women\'s matches', 'Matchday guide'],
    }
  }

  // ===== PRICES =====
  if (/price|cost|how much|£|expensive|cheap/.test(q)) {
    const lines = MATCHES.filter(m => m.availability !== 'sold_out').map(m =>
      `**${m.home} vs ${m.away}** (${m.comp})\nAdult: £${m.prices.adult} | Junior: £${m.prices.junior} | Family: £${m.prices.family}`
    )
    return {
      text: `**Ticket Prices — Available Matches:**\n\n${lines.join('\n\n')}`,
      suggestions: ['Buy tickets', 'Women\'s matches', 'Availability'],
    }
  }

  // ===== AVAILABILITY =====
  if (/available|availability|sold out|left|remaining|still.*(ticket|seat)/.test(q)) {
    const lines = MATCHES.map(m => {
      const icon = m.availability === 'sold_out' ? '🔴' : m.availability === 'limited' ? '🟡' : '🟢'
      const label = m.availability === 'sold_out' ? 'Sold Out' : m.availability === 'limited' ? 'Limited' : 'Available'
      return `${icon} ${m.home} vs ${m.away} — **${label}**`
    })
    return {
      text: `**Ticket Availability:**\n\n${lines.join('\n')}`,
      suggestions: ['Buy tickets', 'Women\'s matches', 'Membership info'],
    }
  }

  // ===== STADIUM =====
  if (/stadium|stamford|bridge|seat|section|facilities/.test(q)) {
    return {
      text: "**Stamford Bridge** 🏟️\nCapacity: 40,343\n\nSections: Matthew Harding, Shed End, East Stand, West Stand (all Lower & Upper)\n\n♿ Accessible seating available\n👨‍👩‍👧‍👦 Family areas in East Stand\n🍔 Concourse food & drink\n🛍️ Chelsea Megastore\n🏛️ Chelsea Museum\n\n**Getting There:** Fulham Broadway (District Line), 5-min walk",
      suggestions: ['Buy tickets', 'Matchday guide', 'Women\'s matches'],
    }
  }

  // ===== REFUND =====
  if (/refund|exchange|cancel|return|swap/.test(q)) {
    return {
      text: "**Refund & Exchange Policy:**\n\n• Refunds available up to **72 hours** before kick-off\n• Exchanges via the **Ticket Exchange platform**\n• Log in: chelseafc.com/tickets → My Tickets\n• Processing: 5-7 business days\n\n📞 Box Office: +44 (0)207 386 7799",
      suggestions: ['Buy tickets', 'Contact us', 'Women\'s matches'],
    }
  }

  // ===== CONTACT =====
  if (/contact|phone|email|call|box office|help|support/.test(q)) {
    return {
      text: "**Chelsea FC Box Office:**\n📞 +44 (0)207 386 7799\n📧 tickets@chelseafc.com\n🕐 Mon-Fri: 9am-5pm | Matchdays: 9am-kick off\n\n📍 Stamford Bridge, Fulham Road, London SW6 1HS",
      suggestions: ['Buy tickets', 'Women\'s matches', 'Matchday guide'],
    }
  }

  // ===== CHANTS =====
  if (/chant|song|sing|carefree|blue is the colour/.test(q)) {
    return {
      text: "**Chelsea Matchday Chants** 🎵\n\n🔵 **Blue is the Colour**\n\"Blue is the colour, football is the game, we're all together and winning is our aim...\"\n\n🔵 **Carefree**\n\"Carefree, wherever we may be, we are the famous CFC...\"\n\n🔵 **Ten Men Went to Mow**\nA Stamford Bridge classic — growing louder with every verse!\n\n🔵 **Chelsea Chelsea Chelsea!**\nSimple, loud, and proud.",
      suggestions: ['Matchday guide', 'About Chelsea Women', 'Buy tickets'],
    }
  }

  // ===== FALLBACK =====
  return {
    text: "I'm not sure about that, but I can help with lots of things! Try one of these:",
    suggestions: ['Women\'s matches', 'Buy tickets', 'Meet the players', 'Matchday guide', 'About Chelsea Women', 'Ticket prices', 'Membership info', 'Contact us'],
  }
}

// ===== Component =====
export default function TicketChatbot({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    {
      from: 'bot',
      text: "Welcome to the **Chelsea FC Women's Hub**! 💙\n\nI'm your Ticket & Matchday Assistant. I can help you with match tickets, player info, matchday guides, and more.\n\nWhat would you like to know?",
      suggestions: ['Women\'s matches', 'Buy tickets', 'Meet the players', 'Matchday guide', 'About Chelsea Women'],
      time: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEnd = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  useEffect(() => {
    if (isOpen && inputRef.current) setTimeout(() => inputRef.current?.focus(), 300)
  }, [isOpen])

  const sendMessage = (text) => {
    if (!text.trim()) return
    setMessages(prev => [...prev, { from: 'user', text: text.trim(), time: new Date() }])
    setInput('')
    setIsTyping(true)
    setTimeout(() => {
      const res = getResponse(text)
      setMessages(prev => [...prev, { from: 'bot', text: res.text, suggestions: res.suggestions, showQR: res.showQR, time: new Date() }])
      setIsTyping(false)
    }, 500 + Math.random() * 700)
  }

  const handleSubmit = (e) => { e.preventDefault(); sendMessage(input) }

  const fmt = (text) => text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>')

  if (!isOpen) return null

  // Get last bot message suggestions
  const lastBotMsg = [...messages].reverse().find(m => m.from === 'bot')
  const suggestions = (!isTyping && lastBotMsg?.suggestions) || []

  return (
    <div className="chatbot-overlay">
      <div className="chatbot-container">
        {/* Header */}
        <div className="chatbot-header">
          <div className="chatbot-header-left">
            <img src={CHELSEA_CREST} alt="Chelsea FC" className="chatbot-avatar" />
            <div>
              <div className="chatbot-name">Women's Hub Assistant</div>
              <div className="chatbot-status">Online</div>
            </div>
          </div>
          <button className="chatbot-close" onClick={onClose} aria-label="Close chat">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>

        {/* Messages */}
        <div className="chatbot-messages">
          {messages.map((msg, i) => (
            <div key={i} className={`chat-msg ${msg.from}`}>
              {msg.from === 'bot' && <img src={CHELSEA_CREST} alt="" className="chat-msg-avatar" />}
              <div>
                <div className="chat-bubble" dangerouslySetInnerHTML={{ __html: fmt(msg.text) }} />
                {msg.showQR && (
                  <div className="chat-qr">
                    <img src={QR_IMAGE} alt="Payment QR Code" className="qr-image" />
                    <span className="qr-caption">Scan to pay — Chelsea FC Payment</span>
                  </div>
                )}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="chat-msg bot">
              <img src={CHELSEA_CREST} alt="" className="chat-msg-avatar" />
              <div className="chat-bubble typing">
                <span className="typing-dot" /><span className="typing-dot" /><span className="typing-dot" />
              </div>
            </div>
          )}
          <div ref={messagesEnd} />
        </div>

        {/* Persistent Suggestions */}
        {suggestions.length > 0 && (
          <div className="chatbot-suggestions">
            {suggestions.map((s, i) => (
              <button key={i} className="suggestion-btn" onClick={() => sendMessage(s)}>{s}</button>
            ))}
          </div>
        )}

        {/* Input */}
        <form className="chatbot-input-area" onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask about tickets, players..."
            className="chatbot-input"
          />
          <button type="submit" className="chatbot-send" disabled={!input.trim()}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="m22 2-7 20-4-9-9-4z"/><path d="m22 2-10 10"/></svg>
          </button>
        </form>
      </div>
    </div>
  )
}
