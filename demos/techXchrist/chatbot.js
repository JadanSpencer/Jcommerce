/* ============================================================
   TECHASSIST AI — Chatbot with Interchange & Improved Logic
   ============================================================ */

   const CHAT_CONFIG = {
    API_KEY: 'YOUR_ANTHROPIC_API_KEY_HERE',
    MODEL: 'claude-sonnet-4-20250514',
    SYSTEM_PROMPT: `You are TechAssist, the helpful AI assistant for Jevon Clarke's technology repair and IT services business in Kingston, Jamaica. Jevon is both a certified IT professional with 12+ years of experience and an ordained minister at Grace Covenant Church.

SERVICES & APPROXIMATE PRICING (JMD):
- Computer Repair: from $3,500
- Mobile Device Repair: from $2,000
- Network Setup & WiFi: from $6,000
- IT Consulting & Remote Support: $4,000/hour
- Data Recovery: from $5,000
- Virus & Malware Removal: from $2,500
- CCTV Installation: custom quote

SERVICE AREA: Kingston, St. Andrew, Spanish Town, Portmore. Remote support island-wide.
TURNAROUND: Standard 24–72 hours. Complex 5–7 days. Same-day urgent available.
HOURS: Monday–Saturday, 8am–7pm.
CONTACT: Booking form or WhatsApp +1 (876) 555-0142.
PAYMENT: Cash (JMD/USD), bank transfer, mobile money (NCB, Scotiabank).
CERTIFICATIONS: CompTIA A+, Network+, Security+. Microsoft MCP. Google IT Support.
FAITH: Operates with Christian values. Welcomes prayer requests.

YOUR BEHAVIOR:
- Be warm, professional, and concise (2–4 sentences per response)
- Provide helpful estimates but always recommend the booking form for exact quotes
- If someone is anxious, offer a brief word of encouragement
- For prayer requests or faith questions, respond warmly
- Never overpromise; be honest about limitations
- If asked something completely outside your knowledge or services, respond with: "Apologies, but I cannot accommodate said query. However, I'd be happy to help with questions about Jevon's tech services, pricing, or availability. Is there anything tech-related I can assist with?"
- Suggest the booking form or WhatsApp for specific issues`
};

let chatHistory = [];
let isChatOpen = false;
let isBotTyping = false;

const QUICK_REPLIES = [
    'What are your prices?',
    'Service areas?',
    'How long does repair take?',
    'Can I get remote support?'
];

const GREETING = `Hello! I'm TechAssist, Jevon's AI helper. I can answer questions about services, pricing, and more. How can I help you today?`;

/* ============================================================
   INTERCHANGE LOGIC — WhatsApp ↔ Chatbot every 10 seconds
   ============================================================ */
let interchangeTimer = null;
let currentlyVisible = 'whatsapp'; // 'whatsapp' or 'chatbot'
let interchangePaused = false;

function initInterchange() {
    const waFloat = document.getElementById('waFloat');
    const chatFabWrap = document.getElementById('chatFabWrap');

    if (!waFloat || !chatFabWrap) return;

    // Initial state: WhatsApp visible, chatbot hidden
    waFloat.style.opacity = '1';
    waFloat.style.pointerEvents = 'auto';
    waFloat.style.transform = 'scale(1)';
    chatFabWrap.style.opacity = '0';
    chatFabWrap.style.pointerEvents = 'none';
    chatFabWrap.style.transform = 'scale(0.8)';
    currentlyVisible = 'whatsapp';

    startInterchangeTimer();
}

function startInterchangeTimer() {
    clearInterval(interchangeTimer);
    interchangeTimer = setInterval(() => {
        if (!interchangePaused) {
            swapButton();
        }
    }, 10000);
}

function swapButton() {
    const waFloat = document.getElementById('waFloat');
    const chatFabWrap = document.getElementById('chatFabWrap');
    if (!waFloat || !chatFabWrap) return;

    if (currentlyVisible === 'whatsapp') {
        // Fade out WhatsApp, fade in Chatbot
        waFloat.style.opacity = '0';
        waFloat.style.pointerEvents = 'none';
        waFloat.style.transform = 'scale(0.8)';
        chatFabWrap.style.opacity = '1';
        chatFabWrap.style.pointerEvents = 'auto';
        chatFabWrap.style.transform = 'scale(1)';
        currentlyVisible = 'chatbot';
    } else {
        // Fade out Chatbot, fade in WhatsApp
        chatFabWrap.style.opacity = '0';
        chatFabWrap.style.pointerEvents = 'none';
        chatFabWrap.style.transform = 'scale(0.8)';
        waFloat.style.opacity = '1';
        waFloat.style.pointerEvents = 'auto';
        waFloat.style.transform = 'scale(1)';
        currentlyVisible = 'whatsapp';
    }
}

function pauseInterchange() {
    interchangePaused = true;
}

function resumeInterchange() {
    interchangePaused = false;
    // Reset timer so it doesn't swap immediately after closing
    startInterchangeTimer();
}

/* ============================================================
   INIT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
    initInterchange();
    buildChatUI();
    attachChatEvents();
});

function buildChatUI() {
    const body = document.getElementById('chatBody');
    if (!body) return;
    appendBotMessage(GREETING);
    renderQuickReplies();
}

function attachChatEvents() {
    const fab = document.getElementById('chatFab');
    const win = document.getElementById('chatWindow');
    const closeBtn = document.getElementById('chatClose');
    const input = document.getElementById('chatInput');
    const sendBtn = document.getElementById('chatSend');

    if (!fab || !win) return;

    fab.addEventListener('click', () => toggleChat());
    if (closeBtn) closeBtn.addEventListener('click', () => toggleChat(false));
    if (sendBtn) sendBtn.addEventListener('click', handleSend);
    if (input) {
        input.addEventListener('keydown', e => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
            }
        });
    }
}

function toggleChat(forceState) {
    const win = document.getElementById('chatWindow');
    if (!win) return;
    isChatOpen = forceState !== undefined ? forceState : !isChatOpen;
    win.classList.toggle('open', isChatOpen);

    if (isChatOpen) {
        pauseInterchange();
        const input = document.getElementById('chatInput');
        if (input) setTimeout(() => input.focus(), 300);
    } else {
        resumeInterchange();
    }
}

/* ============================================================
   MESSAGING
   ============================================================ */
async function handleSend() {
    const input = document.getElementById('chatInput');
    const text = input?.value.trim();
    if (!text || isBotTyping) return;
    input.value = '';

    appendUserMessage(text);
    clearQuickReplies();

    if (CHAT_CONFIG.API_KEY === 'YOUR_ANTHROPIC_API_KEY_HERE') {
        showTyping();
        await sleep(900);
        hideTyping();
        appendBotMessage(getDemoResponse(text));
        return;
    }

    chatHistory.push({ role: 'user', content: text });
    showTyping();
    isBotTyping = true;

    try {
        const res = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': CHAT_CONFIG.API_KEY,
                'anthropic-version': '2023-06-01',
                'anthropic-dangerous-direct-browser-access': 'true'
            },
            body: JSON.stringify({
                model: CHAT_CONFIG.MODEL,
                max_tokens: 300,
                system: CHAT_CONFIG.SYSTEM_PROMPT,
                messages: chatHistory
            })
        });

        const data = await res.json();
        const reply = data.content?.[0]?.text || 'Apologies, but I cannot accommodate said query. I\'d be happy to help with questions about Jevon\'s tech services.';

        chatHistory.push({ role: 'assistant', content: reply });
        hideTyping();
        appendBotMessage(reply);

    } catch (err) {
        console.error('Chat error:', err);
        hideTyping();
        appendBotMessage('Apologies, but I cannot accommodate said query. Please use the booking form or contact Jevon directly on WhatsApp for assistance.');
    } finally {
        isBotTyping = false;
    }
}

function sendQuickReply(text) {
    const input = document.getElementById('chatInput');
    if (input) input.value = text;
    handleSend();
}

/* ============================================================
   DOM HELPERS
   ============================================================ */
function appendBotMessage(text) {
    const body = document.getElementById('chatBody');
    if (!body) return;
    const div = document.createElement('div');
    div.className = 'chat-msg bot';
    div.textContent = text;
    body.appendChild(div);
    scrollChat();
}

function appendUserMessage(text) {
    const body = document.getElementById('chatBody');
    if (!body) return;
    const div = document.createElement('div');
    div.className = 'chat-msg user';
    div.textContent = text;
    body.appendChild(div);
    scrollChat();
}

function showTyping() {
    const body = document.getElementById('chatBody');
    if (!body) return;
    const div = document.createElement('div');
    div.className = 'chat-msg bot typing';
    div.id = 'typingIndicator';
    div.innerHTML = '<span class="t-dot"></span><span class="t-dot"></span><span class="t-dot"></span>';
    body.appendChild(div);
    scrollChat();
}

function hideTyping() {
    document.getElementById('typingIndicator')?.remove();
}

function renderQuickReplies() {
    const qr = document.getElementById('quickReplies');
    if (!qr) return;
    qr.innerHTML = '';
    QUICK_REPLIES.forEach(q => {
        const btn = document.createElement('button');
        btn.className = 'quick-reply';
        btn.textContent = q;
        btn.onclick = () => sendQuickReply(q);
        qr.appendChild(btn);
    });
}

function clearQuickReplies() {
    const qr = document.getElementById('quickReplies');
    if (qr) qr.innerHTML = '';
}

function scrollChat() {
    const body = document.getElementById('chatBody');
    if (body) setTimeout(() => { body.scrollTop = body.scrollHeight; }, 50);
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

/* ============================================================
   DEMO RESPONSES (when API key not configured)
   ============================================================ */
function getDemoResponse(text) {
    const t = text.toLowerCase();

    if (t.includes('price') || t.includes('cost') || t.includes('how much')) {
        return 'Prices start from JMD $2,000 for mobile repairs, $3,500 for computer repairs, and $6,000 for network setup. Use the booking form for an exact quote tailored to your issue!';
    }
    if (t.includes('area') || t.includes('location') || t.includes('come to')) {
        return 'Jevon serves Kingston, St. Andrew, Spanish Town, and Portmore. Remote support is available island-wide via secure screen sharing.';
    }
    if (t.includes('how long') || t.includes('turnaround') || t.includes('time')) {
        return 'Most standard repairs are completed within 24–72 hours. Complex jobs like data recovery may take 5–7 days. Same-day urgent service is also available.';
    }
    if (t.includes('remote') || t.includes('online') || t.includes('anydesk')) {
        return 'Yes! Jevon provides remote support island-wide using secure tools like AnyDesk. Perfect for software issues, virus removal, and IT consulting.';
    }
    if (t.includes('data') || t.includes('recovery') || t.includes('lost files')) {
        return 'Data recovery starts from JMD $5,000. Jevon has a strong track record with crashed drives and accidentally deleted files. Book a consultation today.';
    }
    if (t.includes('prayer') || t.includes('pray') || t.includes('faith') || t.includes('god')) {
        return 'Jevon would be honoured to pray with you. You can include a prayer request when filling out the booking form. "Cast all your anxiety on Him because He cares for you." — 1 Peter 5:7';
    }
    if (t.includes('phone') || t.includes('mobile') || t.includes('screen') || t.includes('battery')) {
        return 'Mobile device repairs start from JMD $2,000. Screen replacements, battery swaps, charging port repairs — Jevon handles them all. Book online today.';
    }
    if (t.includes('network') || t.includes('wifi') || t.includes('internet') || t.includes('router')) {
        return 'Network setup and WiFi configuration starts from JMD $6,000. Small business networking, router setup, and cable runs are also available.';
    }
    if (t.includes('virus') || t.includes('malware') || t.includes('hack') || t.includes('security')) {
        return 'Virus and malware removal starts from JMD $2,500. Jevon is CompTIA Security+ certified and will make sure your system is fully protected.';
    }
    if (t.includes('book') || t.includes('appointment') || t.includes('schedule')) {
        return 'Head to the Book a Repair page to fill out the form — Jevon typically responds within 2–4 hours on weekdays. You can also WhatsApp him directly!';
    }
    if (t.includes('payment') || t.includes('pay') || t.includes('cash')) {
        return 'Jevon accepts cash (JMD and USD), bank transfer, and mobile money via NCB or Scotiabank. A deposit is required before major repair work begins.';
    }
    if (t.includes('weather') || t.includes('sport') || t.includes('recipe') || t.includes('movie') || t.includes('music') || t.includes('news') || t.includes('politics')) {
        return 'Apologies, but I cannot accommodate said query. I\'m specifically here to help with questions about Jevon\'s tech services, pricing, and availability. Is there anything tech-related I can assist with?';
    }
    return 'Great question! For the most accurate information, I\'d recommend using the booking form or WhatsApp Jevon directly. He responds quickly and will give you a personalised answer. Is there anything else I can help clarify?';
}