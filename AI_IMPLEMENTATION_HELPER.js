/**
 * IMPLEMENTATION HELPER
 * How to Update Your HTML File to Use Backend AI Chat
 * 
 * Location: In tracker_new (1).html, find the sendMessage() function
 * (approximately line 4950+)
 */

// ============================================
// CURRENT CODE (Using Anthropic API directly)
// ============================================
// 
// async function sendMessage(userText, isQuickAction = false) {
//     // Remove welcome screen
//     const welcome = document.getElementById('aiWelcome');
//     if (welcome) welcome.remove();
//
//     const chatArea = document.getElementById('aiChatArea');
//     const sendBtn = document.getElementById('aiSendBtn');
//
//     // ... add user message UI ...
//
//     try {
//         // OLD CODE: Direct API call to Anthropic
//         const response = await fetch("https://api.anthropic.com/v1/messages", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//                 "anthropic-version": "2023-06-01",
//                 "x-api-key": ANTHROPIC_API_KEY
//             },
//             body: JSON.stringify({
//                 model: "claude-sonnet-4-20250514",
//                 max_tokens: 1000,
//                 system: systemPrompt,
//                 messages: messages
//             })
//         });
//     } catch (err) {
//         // ... error handling ...
//     }
// }


// ============================================
// NEW CODE (Using Backend API)
// ============================================

/**
 * Step 1: Make sure api-client.js is loaded in your HTML <head>
 * 
 * <script src="api-client.js"></script>
 * 
 * This creates a global 'api' object with all methods
 */

/**
 * Step 2: Replace the sendMessage() function with this version:
 */

async function sendMessage(userText, isQuickAction = false) {
    // Remove welcome screen
    const welcome = document.getElementById('aiWelcome');
    if (welcome) welcome.remove();

    const chatArea = document.getElementById('aiChatArea');
    const sendBtn = document.getElementById('aiSendBtn');

    // Add user message to UI
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    const userDiv = document.createElement('div');
    userDiv.className = 'ai-msg user';
    userDiv.innerHTML = `
        <div>
            <div class="ai-bubble">${escapeHtml(userText)}</div>
            <div class="ai-bubble-time">${timeStr}</div>
        </div>
        <div class="ai-avatar user-av">YOU</div>
    `;
    chatArea.appendChild(userDiv);

    // Add to history
    if (!window.aiChatHistory) window.aiChatHistory = [];
    aiChatHistory.push({ role: 'user', content: userText });

    // Add typing indicator
    const typingDiv = document.createElement('div');
    typingDiv.className = 'ai-msg claude';
    typingDiv.id = 'aiTyping';
    typingDiv.innerHTML = `
        <div class="ai-avatar claude">AI</div>
        <div class="ai-typing-indicator">
            <div class="ai-typing-dot"></div>
            <div class="ai-typing-dot"></div>
            <div class="ai-typing-dot"></div>
        </div>
    `;
    chatArea.appendChild(typingDiv);
    chatArea.scrollTop = chatArea.scrollHeight;

    sendBtn.disabled = true;

    try {
        // ===============================================
        // NEW: Call backend API instead of Anthropic
        // ===============================================

        // Build context from app data
        const contextData = buildAIContext();

        // Call backend API
        const response = await api.sendChatMessage(userText, {
            habitData: window.appData,
            contextSnapshot: contextData,
            timestamp: new Date().toISOString(),
        });

        const aiText = response.response || "Sorry, I couldn't process that. Please try again.";

        // Remove typing indicator
        document.getElementById('aiTyping')?.remove();

        // Format and display response
        const formattedText = formatAIResponse(aiText);

        const aiDiv = document.createElement('div');
        aiDiv.className = 'ai-msg claude';
        const replyTime = new Date();
        const replyTimeStr = `${replyTime.getHours().toString().padStart(2, '0')}:${replyTime.getMinutes().toString().padStart(2, '0')}`;
        aiDiv.innerHTML = `
            <div class="ai-avatar claude">AI</div>
            <div>
                <div class="ai-bubble">${formattedText}</div>
                <div class="ai-bubble-time">${replyTimeStr} · Warrior AI Coach</div>
            </div>
        `;
        chatArea.appendChild(aiDiv);

        // Add to history
        aiChatHistory.push({ role: 'assistant', content: aiText });

        // Keep history manageable
        if (aiChatHistory.length > 50) {
            aiChatHistory = aiChatHistory.slice(-50);
        }

        // ===============================================
        // END OF NEW CODE
        // ===============================================

    } catch (err) {
        console.error('Chat Error:', err);

        document.getElementById('aiTyping')?.remove();

        const errDiv = document.createElement('div');
        errDiv.className = 'ai-msg claude';
        errDiv.innerHTML = `
            <div class="ai-avatar claude">AI</div>
            <div class="ai-bubble" style="border-color: rgba(255,61,87,0.4); color: #ff8080;">
                ⚠️ Connection error. Make sure the backend is running:
                <br>
                <code style="background: rgba(0,0,0,0.3); padding: 4px; border-radius: 4px; display: block; margin-top: 6px;">npm run dev</code>
                <br>
                <em style="font-size:0.75rem; color: #4a6a8a; display: block; margin-top: 6px;">${err.message}</em>
            </div>
        `;
        chatArea.appendChild(errDiv);
    }

    sendBtn.disabled = false;
    chatArea.scrollTop = chatArea.scrollHeight;
}

/**
 * Step 3: Make sure these helper functions exist in your HTML
 * (They should already be there, but verify:)
 */

function formatAIResponse(text) {
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/`(.*?)`/g, '<code>$1</code>')
        .replace(/^- (.+)$/gm, '<li>$1</li>')
        .replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>')
        .replace(/\n\n/g, '</p><p>')
        .replace(/\n/g, '<br>')
        .replace(/^/, '<p>').replace(/$/, '</p>')
        .replace(/<p><\/p>/g, '');
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(text));
    return div.innerHTML;
}

function buildAIContext() {
    // This function should already exist in your HTML
    // It builds a snapshot of user's habit data
    if (!window.appData) return "No data available yet.";

    const today = new Date().getDate();
    const todayWd = new Date().getDay();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    const todayTasks = window.appData.habitsRegular.filter(h => !h.freq || h.freq.includes(todayWd));
    const doneTasks = todayTasks.filter(h => h.days[today] === 1).map(h => h.name);
    const missedTasks = todayTasks.filter(h => h.days[today] === 2).map(h => h.name);
    const pendingTasks = todayTasks.filter(h => h.days[today] === 0).map(h => h.name);

    return `
WARRIOR PROTOCOL - DATA SNAPSHOT
Date: ${days[todayWd]}, Day ${today}

TODAY'S SUMMARY:
✅ Done (${doneTasks.length}): ${doneTasks.join(', ') || 'None yet'}
❌ Missed (${missedTasks.length}): ${missedTasks.join(', ') || 'None'}
⏳ Pending (${pendingTasks.length}): ${pendingTasks.join(', ') || 'None'}

ACTIVE HABITS: ${window.appData.habitsRegular.length}
XP LEVEL: ${window.appData.warriorExp || 0} XP
    `.trim();
}

// ============================================
// QUICK ACTIONS UPDATE
// ============================================

/**
 * The quickAction() function can also be updated:
 */

async function quickAction(type) {
    const prompts = {
        analyze: `Based on my routine data, give me a sharp 3-point analysis: what I'm doing well, what needs attention, and one action for the next 30 minutes.`,
        weak: `Identify my 3 weakest habits and give ONE concrete fix for each I can implement TODAY.`,
        plan: `Build me an optimized action plan for the rest of today.`,
        sleep: `Analyze my sleep data and give me 3 optimization tips.`,
        motivate: `Give me a powerful, personal motivation message based on my actual performance.`,
        schedule: `Identify conflicts in my daily routine and suggest optimizations.`
    };

    const userMsg = prompts[type];
    sendMessage(userMsg, true);

    // Alternative: Call quick-action endpoint directly
    // const response = await api.request('/ai/quick-action', {
    //     method: 'POST',
    //     body: JSON.stringify({ action: type })
    // });
    // Then display response...
}

// ============================================
// INITIALIZATION
// ============================================

/**
 * Step 4: In your HTML init() function, add this line to verify connection:
 */

async function initAIChat() {
    try {
        // Test backend connection
        const health = await api.healthCheck();
        console.log('✅ Backend connected:', health);

        // Initialize variables
        window.aiChatHistory = [];

        // Optional: Load chat history for authenticated users
        if (api.isAuthenticated()) {
            try {
                const history = await api.getChatHistory();
                window.aiChatHistory = history.messages || [];
            } catch (err) {
                console.log('No chat history found (first session)');
            }
        }

    } catch (err) {
        console.warn('Backend not available. AI will work offline.', err);
    }
}

// Call this during init
// initAIChat();

// ============================================
// SUMMARY OF CHANGES
// ============================================

/*
WHAT CHANGED:
✅ Old: Anthropic API called directly from browser
✅ New: Backend handles all AI logic

BENEFITS:
✅ No API key exposure in browser
✅ All chat history stored server-side
✅ Better context with server-side data
✅ Easy to swap AI provider (OpenAI, local LLM, etc.)
✅ Cost control (batch requests, rate limiting)

WHAT TO DO:
1. Include <script src="api-client.js"></script> in HTML head
2. Replace sendMessage() function with new version above
3. Run backend: npm run dev
4. Test by clicking AI button and sending message

TESTING:
- Message should be sent to: http://localhost:3001/api/ai/chat
- Response should appear after typing animation
- Check browser DevTools → Network tab to see requests
- Check browser Console for any errors
*/
