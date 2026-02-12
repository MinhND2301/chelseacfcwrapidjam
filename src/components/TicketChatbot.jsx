import { useState, useRef, useEffect } from 'react'

const CHELSEA_CREST = 'https://upload.wikimedia.org/wikipedia/en/c/cc/Chelsea_FC.svg'

// Mock ticket database
const TICKET_DB = {
  matches: [
    { id: 'PL-BUR', comp: 'Premier League', home: 'Chelsea', away: 'Burnley', date: 'Sat 21 Feb 2026', time: '15:00', venue: 'Stamford Bridge', prices: { adult: 55, junior: 25, senior: 35, family: 120 }, availability: 'available', loyaltyRequired: 0 },
    { id: 'FAC-HUL', comp: 'FA Cup', home: 'Hull City', away: 'Chelsea', date: 'Fri 13 Feb 2026', time: '19:45', venue: 'The MKM Stadium', prices: { adult: 35, junior: 15, senior: 22, family: 80 }, availability: 'limited', loyaltyRequired: 3 },
    { id: 'PL-ARS', comp: 'Premier League', home: 'Arsenal', away: 'Chelsea', date: 'Sat 08 Mar 2026', time: '17:30', venue: 'Emirates Stadium', prices: { adult: 65, junior: 30, senior: 42, family: 140 }, availability: 'sold_out', loyaltyRequired: 12 },
    { id: 'PL-WOL', comp: 'Premier League', home: 'Chelsea', away: 'Wolves', date: 'Sat 15 Mar 2026', time: '15:00', venue: 'Stamford Bridge', prices: { adult: 50, junior: 22, senior: 32, family: 110 }, availability: 'available', loyaltyRequired: 0 },
    { id: 'UCL-PSG', comp: 'Champions League', home: 'Chelsea', away: 'PSG', date: 'Wed 19 Mar 2026', time: '20:00', venue: 'Stamford Bridge', prices: { adult: 75, junior: 35, senior: 48, family: 165 }, availability: 'limited', loyaltyRequired: 5 },
  ],
  membershipInfo: {
    types: [
      { name: 'True Blue', price: '25/year', benefits: 'Priority ticket access, loyalty points, exclusive merch discounts' },
      { name: 'Junior True Blue', price: '15/year', benefits: 'U16 priority access, birthday gift, matchday experiences' },
      { name: 'International Membership', price: '30/year', benefits: 'Overseas priority, travel packages, digital content' },
    ],
  },
  stadiumInfo: {
    sections: ['Matthew Harding Lower', 'Matthew Harding Upper', 'Shed End Lower', 'Shed End Upper', 'East Stand Lower', 'East Stand Upper', 'West Stand Lower', 'West Stand Upper'],
    facilities: 'Stamford Bridge has accessible seating, family areas, concourse food & drink, club shop, and the Chelsea Museum.',
    gettingThere: 'Nearest tube: Fulham Broadway (District Line), 5-min walk. Bus routes: 14, 211, 414. Limited parking at the ground.',
  },
  awayGuides: {
    'Hull City': 'The MKM Stadium, West Park, Hull HU3 6HU. Away section: North Stand Upper. Nearest station: Hull Paragon (15-min walk). Coach travel available via chelseafc.com/travel.',
    'Arsenal': 'Emirates Stadium, Holloway Road, London N7 7AJ. Away section: Clock End Lower. Nearest tube: Arsenal (Piccadilly Line). High demand - 12+ loyalty points required.',
  },
}

// Keyword matching engine
function getResponse(input) {
  const q = input.toLowerCase().trim()

  // Greetings
  if (/^(hi|hello|hey|yo|sup|howdy|good\s*(morning|afternoon|evening))/.test(q)) {
    return { text: "Hello! I'm the Chelsea FC Ticket Assistant. How can I help you today?\n\nI can help with:\n• Upcoming match tickets & prices\n• Ticket availability\n• Membership information\n• Stadium & travel info\n• Away match guides\n\nJust ask me anything!", type: 'greeting' }
  }

  // Thanks / goodbye
  if (/^(thanks|thank you|cheers|bye|goodbye|see ya|later)/.test(q)) {
    return { text: "You're welcome! Up the Chels! 💙 If you need anything else, just ask.", type: 'farewell' }
  }

  // List all matches / upcoming / fixtures
  if (/all (match|ticket|game|fixture)|upcoming|next (match|game)|fixture|what.*(match|game).*(available|coming|next)/.test(q)) {
    const lines = TICKET_DB.matches.map(m => {
      const status = m.availability === 'sold_out' ? '🔴 SOLD OUT' : m.availability === 'limited' ? '🟡 Limited' : '🟢 Available'
      return `**${m.comp}** — ${m.home} vs ${m.away}\n📅 ${m.date} at ${m.time}\n📍 ${m.venue}\n${status}${m.loyaltyRequired > 0 ? ` (${m.loyaltyRequired}+ loyalty pts)` : ''}`
    })
    return { text: `Here are the upcoming matches:\n\n${lines.join('\n\n')}`, type: 'matches' }
  }

  // Specific match lookup
  for (const m of TICKET_DB.matches) {
    const away = m.away.toLowerCase()
    const home = m.home.toLowerCase()
    if (q.includes(away) || (q.includes(home) && home !== 'chelsea')) {
      const status = m.availability === 'sold_out' ? '🔴 SOLD OUT' : m.availability === 'limited' ? '🟡 Limited availability' : '🟢 Available'
      const priceList = `Adult: £${m.prices.adult} | Junior: £${m.prices.junior} | Senior: £${m.prices.senior} | Family: £${m.prices.family}`
      let extra = ''
      if (m.availability === 'sold_out') extra = '\n\n⚠️ This match is currently sold out. Check chelseafc.com for returns or join the waiting list.'
      if (m.loyaltyRequired > 0) extra += `\n\n🎫 Requires ${m.loyaltyRequired}+ loyalty points to purchase.`
      return { text: `**${m.comp}: ${m.home} vs ${m.away}**\n📅 ${m.date} at ${m.time}\n📍 ${m.venue}\n\n**Status:** ${status}\n**Prices:** ${priceList}${extra}`, type: 'match-detail' }
    }
  }

  // Buy / purchase / book tickets
  if (/buy|purchase|book|order|get ticket|how.*(buy|get|purchase)/.test(q)) {
    return { text: "To buy tickets:\n\n1. **Log in** to your account at chelseafc.com/tickets\n2. **Select** the match you want\n3. **Choose** your seats and ticket type\n4. **Pay** via card or Apple/Google Pay\n\n💡 You need a **True Blue membership** for most matches. Big away games require loyalty points.\n\nWant me to check availability for a specific match? Just tell me the opponent!", type: 'how-to-buy' }
  }

  // Prices
  if (/price|cost|how much|£|expensive|cheap/.test(q)) {
    const lines = TICKET_DB.matches.filter(m => m.availability !== 'sold_out').map(m =>
      `**${m.home} vs ${m.away}** (${m.comp})\nAdult: £${m.prices.adult} | Junior: £${m.prices.junior} | Senior: £${m.prices.senior}`
    )
    return { text: `Here are ticket prices for available matches:\n\n${lines.join('\n\n')}\n\n💡 Family packs offer 4 tickets at a discount. Ask me about a specific match for full pricing!`, type: 'prices' }
  }

  // Membership
  if (/member|true blue|join|sign up|loyalty|points/.test(q)) {
    const lines = TICKET_DB.membershipInfo.types.map(t =>
      `**${t.name}** — £${t.price}\n${t.benefits}`
    )
    return { text: `Chelsea FC Memberships:\n\n${lines.join('\n\n')}\n\nMembership gives you priority ticket access and earns loyalty points for every match attended. Sign up at chelseafc.com/membership`, type: 'membership' }
  }

  // Stadium info
  if (/stadium|stamford|bridge|seat|section|facilities|accessible|disabled|family area/.test(q)) {
    return { text: `**Stamford Bridge**\nCapacity: 40,343\n\n**Sections:** ${TICKET_DB.stadiumInfo.sections.join(', ')}\n\n${TICKET_DB.stadiumInfo.facilities}\n\n**Getting There:** ${TICKET_DB.stadiumInfo.gettingThere}`, type: 'stadium' }
  }

  // Away guide
  if (/away|travel|coach|getting there|directions|how.*(get|travel).*to/.test(q)) {
    for (const [team, guide] of Object.entries(TICKET_DB.awayGuides)) {
      if (q.includes(team.toLowerCase())) {
        return { text: `**Away Guide: ${team}**\n\n${guide}`, type: 'away-guide' }
      }
    }
    return { text: `I have away guides for these matches:\n\n${Object.keys(TICKET_DB.awayGuides).map(t => `• **${t}**`).join('\n')}\n\nAsk me about a specific away match and I'll give you the travel details!`, type: 'away-guide' }
  }

  // Availability
  if (/available|availability|sold out|left|remaining|still.*(ticket|seat)/.test(q)) {
    const avail = TICKET_DB.matches.map(m => {
      const icon = m.availability === 'sold_out' ? '🔴' : m.availability === 'limited' ? '🟡' : '🟢'
      const label = m.availability === 'sold_out' ? 'Sold Out' : m.availability === 'limited' ? 'Limited' : 'Available'
      return `${icon} ${m.home} vs ${m.away} — **${label}**`
    })
    return { text: `Current ticket availability:\n\n${avail.join('\n')}\n\n🟢 Available — buy now\n🟡 Limited — hurry!\n🔴 Sold Out — check for returns`, type: 'availability' }
  }

  // Champions League
  if (/champions league|ucl|europe|psg|paris/.test(q)) {
    const ucl = TICKET_DB.matches.find(m => m.comp === 'Champions League')
    if (ucl) {
      const status = ucl.availability === 'limited' ? '🟡 Limited availability' : '🟢 Available'
      return { text: `**${ucl.comp}: ${ucl.home} vs ${ucl.away}**\n📅 ${ucl.date} at ${ucl.time}\n📍 ${ucl.venue}\n\n**Status:** ${status}\n**Prices:** Adult: £${ucl.prices.adult} | Junior: £${ucl.prices.junior} | Senior: £${ucl.prices.senior}\n\n🎫 Requires ${ucl.loyaltyRequired}+ loyalty points.\n⚡ Champions League tickets are in very high demand!`, type: 'match-detail' }
    }
  }

  // Refund / exchange
  if (/refund|exchange|cancel|return|swap/.test(q)) {
    return { text: "**Refund & Exchange Policy:**\n\n• Refunds are available up to **72 hours** before kick-off\n• Ticket exchanges can be made via the **Ticket Exchange platform**\n• Log in at chelseafc.com/tickets → My Tickets → Exchange/Refund\n• Processing takes 5-7 business days\n\nFor urgent issues, contact the Box Office: **+44 (0)207 386 7799**", type: 'policy' }
  }

  // Contact / help
  if (/contact|phone|email|call|box office|help desk|support/.test(q)) {
    return { text: "**Chelsea FC Box Office:**\n📞 +44 (0)207 386 7799\n📧 tickets@chelseafc.com\n🕐 Mon-Fri: 9am-5pm | Matchdays: 9am-kick off\n\n**Address:**\nChelsea FC, Stamford Bridge, Fulham Road, London SW6 1HS\n\nYou can also live chat at chelseafc.com/contact", type: 'contact' }
  }

  // Fallback
  return { text: "I'm not sure about that, but I can help with:\n\n• **\"upcoming matches\"** — see all fixtures\n• **\"burnley tickets\"** — info on a specific match\n• **\"prices\"** — ticket pricing\n• **\"how to buy\"** — purchase guide\n• **\"membership\"** — True Blue info\n• **\"stadium\"** — Stamford Bridge info\n• **\"away guide\"** — travel info for away matches\n• **\"availability\"** — what's still available\n• **\"refund\"** — refund & exchange policy\n• **\"contact\"** — Box Office details\n\nTry asking one of these!", type: 'help' }
}

// Quick action buttons
const QUICK_ACTIONS = [
  { label: 'Upcoming Matches', query: 'show me all upcoming matches' },
  { label: 'Ticket Prices', query: 'what are the ticket prices' },
  { label: 'How to Buy', query: 'how do I buy tickets' },
  { label: 'Membership', query: 'tell me about membership' },
  { label: 'Availability', query: 'what tickets are available' },
]

export default function TicketChatbot({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    { from: 'bot', text: "Hi there! I'm the Chelsea FC Ticket Assistant. How can I help you today?\n\nTap a quick option below or type your question!", time: new Date() },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEnd = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300)
    }
  }, [isOpen])

  const sendMessage = (text) => {
    if (!text.trim()) return
    const userMsg = { from: 'user', text: text.trim(), time: new Date() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsTyping(true)

    // Simulate typing delay
    setTimeout(() => {
      const response = getResponse(text)
      setMessages(prev => [...prev, { from: 'bot', text: response.text, type: response.type, time: new Date() }])
      setIsTyping(false)
    }, 600 + Math.random() * 800)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    sendMessage(input)
  }

  const handleQuickAction = (query) => {
    sendMessage(query)
  }

  const formatMessage = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br/>')
  }

  if (!isOpen) return null

  return (
    <div className="chatbot-overlay">
      <div className="chatbot-container">
        {/* Header */}
        <div className="chatbot-header">
          <div className="chatbot-header-left">
            <img src={CHELSEA_CREST} alt="Chelsea FC" className="chatbot-avatar" />
            <div>
              <div className="chatbot-name">Ticket Assistant</div>
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
              <div className="chat-bubble" dangerouslySetInnerHTML={{ __html: formatMessage(msg.text) }} />
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

        {/* Quick Actions */}
        {messages.length <= 1 && (
          <div className="chatbot-quick-actions">
            {QUICK_ACTIONS.map((a, i) => (
              <button key={i} className="quick-action-btn" onClick={() => handleQuickAction(a.query)}>{a.label}</button>
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
            placeholder="Ask about tickets..."
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
