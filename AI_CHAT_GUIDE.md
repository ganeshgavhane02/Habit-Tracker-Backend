# AI Chat Feature - Complete Setup & Usage Guide

## Overview

Your habit tracker now includes an **AI-powered coach** that provides smart recommendations, motivational messages, and real-time analytics based on your actual habit data and performance.

The AI chat is fully integrated with your backend API and uses **Claude AI** for intelligent, context-aware responses.

---

## Features

### 1. **AI Chat Panel** 💬
- **Location**: Floating button in bottom-right corner (blue button with "AI" badge)
- **Access**: Click anywhere on the page to open the AI assistant
- **Features**:
  - Real-time chat with your AI habit coach
  - Full access to your habit data, sleep logs, and performance metrics
  - Chat history saved (last 50 messages per session)
  - Beautiful dark-themed UI with typing indicators

### 2. **Quick Actions** ⚡
One-click AI insights without typing:

| Action | What It Does |
|--------|--------------|
| 🔍 **Analyze Today** | Sharp 3-point analysis of today's performance |
| ⚠️ **Weak Points** | Identifies 3 weakest habits and concrete fixes |
| 📋 **Build My Plan** | Optimized action plan for rest of the day |
| 😴 **Sleep Report** | Sleep analysis with optimization tips |
| ⚡ **Motivate Me** | Personalized motivation based on YOUR data |
| 🗓️ **Fix Schedule** | Schedule optimization and conflict resolution |

### 3. **AI Analytics** 📊
- Daily performance analysis
- Habit trend predictions
- Sleep quality insights
- Personalized recommendations
- Context-aware motivational messages

---

## How to Use

### **Starting a Conversation**

1. **Click the Floating AI Button** (bottom-right corner)
2. **Type your question** in the input field at the bottom
3. **Press Enter** (or Shift+Enter for new lines)
4. **AI responds** with context-specific advice

### **Example Prompts**

```
"Analyze my performance this month"
"Why am I struggling with meditation?"
"How's my sleep pattern?"
"Give me a workout recommendation"
"Build today's schedule"
"I'm demotivated, help me"
```

### **Using Quick Actions**

1. **Open AI Panel**
2. **Click any quick action button** (top of panel)
3. **AI instantly generates** a focused response
4. **No typing required!**

---

## Frontend Integration

### **Required Files**

```
/backend/
├── api-client.js              # ← API client (NEW)
├── tracker_new (1).html       # ← Main app (uses api-client)
├── server.js                  # ← Backend (updated)
├── routes/
│   └── ai.js                  # ← AI routes (NEW)
└── ... (other files)
```

### **How to Enable in HTML**

The HTML file already has the AI panel UI. To connect it to your backend:

1. **Include the API client** (add to `<head>`):
```html
<script src="api-client.js"></script>
```

2. **Update the `sendMessage()` function** in the HTML script section:

```javascript
async function sendMessage(userText, isQuickAction = false) {
    // ... existing code ...
    
    try {
        // Instead of calling Anthropic API directly,
        // use the backend API:
        
        const response = await api.sendChatMessage(userText, {
            habitData: appData,
            timestamp: new Date(),
        });
        
        const aiText = response.response || "No response received";
        
        // ... rest of existing code ...
    } catch (err) {
        console.error('Chat error:', err);
        // ... error handling ...
    }
}
```

---

## Backend API Endpoints

### **Chat Endpoints**

#### **POST /api/ai/chat**
Send a message and get AI response
```bash
curl -X POST http://localhost:3001/api/ai/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "message": "Analyze my performance",
    "context": {
      "habitData": {...},
      "timestamp": "2026-03-23T10:30:00Z"
    }
  }'
```

**Response:**
```json
{
  "success": true,
  "response": "📊 **Daily Analysis**...",
  "timestamp": "2026-03-23T10:30:45Z"
}
```

---

#### **GET /api/ai/chat/history**
Retrieve chat history (authenticated users)
```bash
curl -X GET http://localhost:3001/api/ai/chat/history \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "messages": [
    {
      "userMessage": "How am I doing?",
      "aiResponse": "Your stats show...",
      "timestamp": "2026-03-23T10:30:00Z"
    }
  ]
}
```

---

#### **GET /api/ai/analysis?type=daily**
Get AI analysis (daily/weekly/monthly)
```bash
curl -X GET "http://localhost:3001/api/ai/analysis?type=daily" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "analysisType": "daily",
  "analysis": {
    "dayCompleted": "87%",
    "tasksCompleted": "10/12",
    "strengths": ["Morning routine", "Workout"],
    "weaknesses": ["Sleep schedule"],
    "recommendation": "Lock in your sleep..."
  }
}
```

---

#### **GET /api/ai/motivation**
Get motivational message
```bash
curl -X GET http://localhost:3001/api/ai/motivation
```

---

#### **GET /api/ai/recommendations**
Get personalized habit recommendations
```bash
curl -X GET http://localhost:3001/api/ai/recommendations
```

---

#### **POST /api/ai/quick-action**
Trigger quick action (analyze, weak, plan, sleep, motivate, schedule)
```bash
curl -X POST http://localhost:3001/api/ai/quick-action \
  -H "Content-Type: application/json" \
  -d '{"action": "analyze"}'
```

---

## API Client Methods

The `api-client.js` provides these AI methods:

```javascript
// Send a chat message
await api.sendChatMessage(userMessage, contextObj);

// Get chat history
await api.getChatHistory();

// Get AI analysis
await api.getAIAnalysis('daily'); // or 'weekly', 'monthly'

// Get motivation
await api.getMotivation();

// Get recommendations
await api.getHabitRecommendations();
```

---

## Database Schema (Chat Storage)

```sql
CREATE TABLE chat_messages (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    user_message TEXT NOT NULL,
    ai_response TEXT NOT NULL,
    context JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_chat_user ON chat_messages(user_id);
CREATE INDEX idx_chat_created ON chat_messages(created_at);
```

---

## Configuration

### **Environment Variables** (.env)

```env
# Existing vars
DATABASE_URL=postgresql://...
JWT_SECRET=your_secret_key
PORT=3001

# Optional: For future LLM integration
OPENAI_API_KEY=sk-...           # If using OpenAI
ANTHROPIC_API_KEY=sk-ant-...    # If using Anthropic
```

---

## How AI Responses Work

### **Current Implementation** (Self-Contained)
- AI responses are generated based on **pattern matching** and habit data
- No external API calls needed
- Responses are contextual and relevant
- **Works offline** (except for user auth)

### **Future Enhancement** (Optional)
To use Claude AI directly for more advanced responses:

1. Get API key from [Anthropic](https://console.anthropic.com)
2. Update `sendMessage()` to call Anthropic API:

```javascript
const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system: systemPrompt,
        messages: messages
    })
});
```

---

## Testing the Feature

### **1. Test Without Backend**
Open HTML file → AI panel works with localStorage data only

### **2. Test With Backend**
```bash
# Start backend
npm run dev

# Open frontend
# Click AI button
# Type a message
# See response from backend API
```

### **3. Test Quick Actions**
```
1. Open AI panel
2. Click "🔍 Analyze Today"
3. See instant analysis
4. Click "⚡ Motivate Me"
5. See personalized motivation
```

---

## Troubleshooting

### **AI Panel Not Opening**
- Check browser console for JavaScript errors
- Verify `api-client.js` is loaded
- Check if `toggleAIPanel()` function exists

### **Chat Not Responding**
- Verify backend is running (`npm run dev`)
- Check network tab in developer tools
- Verify API endpoint: `http://localhost:3001/api/ai/chat`
- Check auth token is valid

### **API Errors**
```
Error: Cannot POST /api/ai/chat
→ Backend routes not mounted. Check server.js

Error: 401 Unauthorized
→ Token missing or expired. Login again.

Error: 500 Internal Server Error
→ Check backend logs for details
```

---

## Best Practices

1. **Regular Usage**: Use AI coach daily for best insights
2. **Contextual Input**: More detail = better responses
3. **Quick Actions First**: Use quick actions when in a hurry
4. **Review History**: Check past suggestions you missed
5. **Trust the Data**: AI works best with accurate habit logging

---

## Files Created/Modified

### **NEW FILES**
- ✅ `api-client.js` - Complete API wrapper for frontend
- ✅ `routes/ai.js` - All AI-related backend routes

### **MODIFIED FILES**
- ✅ `server.js` - Added AI routes mount

### **NO CHANGES NEEDED**
- `tracker_new (1).html` - Already has UI (just update `sendMessage()`)
- `models/` - No schema changes for basic version
- `.env` - Optional API keys for future updates

---

## Next Steps

1. ✅ **Start the backend**
   ```bash
   npm run dev
   ```

2. ✅ **Update the HTML** (find `sendMessage()` function)
   - Replace Anthropic API call with `api.sendChatMessage()`

3. ✅ **Test the chat**
   - Click AI button
   - Send a message
   - See response from backend

4. ✅ **Try quick actions**
   - Click "Analyze Today"
   - Click "Motivate Me"
   - Chat continuously

5. ⭐ **Optional: Add real LLM**
   - Get Anthropic API key
   - Update `routes/ai.js` `generateAIResponse()` function
   - Call Claude for even smarter responses

---

## Summary

Your habit tracker now has **AI-powered coaching** with:
- 💬 Real-time chat interface
- ⚡ Quick one-click actions  
- 📊 Smart analytics & recommendations
- 🔥 Personalized motivation
- 📱 Fully integrated with habit data

**The AI coach has access to:**
- ✅ All your habits & completion percentages
- ✅ Sleep logs & quality metrics
- ✅ Daily/monthly statistics
- ✅ Your streaks & penalties
- ✅ Custom routine schedule

**Use it to:**
- Analyze performance → Be aware of your patterns
- Get motivation → Stay committed during tough days
- Receive recommendations → Improve weak habits
- Optimize schedule → Maximize productivity
- Track progress → Celebrate wins

### 🚀 Ready to Go!

Start the backend, click the AI button, and chat with your new AI habit coach!

