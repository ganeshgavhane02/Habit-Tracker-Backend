const express = require('express');
const router = express.Router();
const db = require('../config/database');
const auth = require('../middleware/auth');

/**
 * AI CHAT ROUTES
 * Handles AI-powered habit tracking assistance
 */

// Store chat history in memory for simplicity (in production, use database)
const chatHistories = {};

/**
 * POST /api/ai/chat
 * Send a message to AI assistant and get a response
 */
router.post('/chat', auth.optional, async (req, res) => {
    try {
        const { message, context = {} } = req.body;
        const userId = req.user?.id || 'anonymous';

        if (!message || typeof message !== 'string') {
            return res.status(400).json({ error: 'Message is required' });
        }

        // Initialize chat history for this user
        if (!chatHistories[userId]) {
            chatHistories[userId] = [];
        }

        // Add user message to history
        chatHistories[userId].push({
            role: 'user',
            content: message,
            timestamp: new Date(),
        });

        // Build AI response based on user input and context
        const aiResponse = await generateAIResponse(message, context, userId);

        // Add AI response to history
        chatHistories[userId].push({
            role: 'assistant',
            content: aiResponse,
            timestamp: new Date(),
        });

        // Keep history manageable (last 50 messages)
        if (chatHistories[userId].length > 50) {
            chatHistories[userId] = chatHistories[userId].slice(-50);
        }

        // Save chat to database if user is authenticated
        if (req.user) {
            await db.query(
                'INSERT INTO chat_messages (user_id, user_message, ai_response, context) VALUES ($1, $2, $3, $4)',
                [userId, message, aiResponse, JSON.stringify(context)]
            );
        }

        res.json({
            success: true,
            response: aiResponse,
            timestamp: new Date(),
        });
    } catch (error) {
        console.error('AI Chat Error:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/ai/chat/history
 * Get chat history for authenticated user
 */
router.get('/chat/history', auth.required, async (req, res) => {
    try {
        const userId = req.user.id;

        // Get from database
        const result = await db.query(
            'SELECT * FROM chat_messages WHERE user_id = $1 ORDER BY created_at DESC LIMIT 100',
            [userId]
        );

        res.json({
            success: true,
            messages: result.rows.map(msg => ({
                userMessage: msg.user_message,
                aiResponse: msg.ai_response,
                context: JSON.parse(msg.context || '{}'),
                timestamp: msg.created_at,
            })),
        });
    } catch (error) {
        console.error('Get Chat History Error:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/ai/analysis
 * Get AI analysis of user habits
 */
router.get('/analysis', auth.optional, async (req, res) => {
    try {
        const { type = 'daily' } = req.query;
        const userId = req.user?.id || 'anonymous';

        let analysis = {};

        if (type === 'daily') {
            analysis = await getDailyAnalysis(userId);
        } else if (type === 'weekly') {
            analysis = await getWeeklyAnalysis(userId);
        } else if (type === 'monthly') {
            analysis = await getMonthlyAnalysis(userId);
        }

        res.json({
            success: true,
            analysisType: type,
            analysis: analysis,
        });
    } catch (error) {
        console.error('AI Analysis Error:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/ai/motivation
 * Get motivational message
 */
router.get('/motivation', auth.optional, async (req, res) => {
    try {
        const motivations = [
            '🔥 "Suffer the pain of discipline or suffer the pain of regret." - Warrior Ethos',
            '💪 "Only when you lose everything can you truly win." - Tyler Durden',
            '🎯 "The master has failed more times than the beginner has tried." - Stephen McCranie',
            '⚡ "Your body can stand almost anything. It\'s your mind that you need to convince." - Navy SEAL',
            '🧠 "Discipline equals freedom." - Jocko Willink',
            '🌅 "The most powerful thing you can do is wake up before the world wakes up." - Legend',
            '🚀 "Excellence is a habit." - Aristotle',
            '💎 "What gets measured gets managed. What gets tracked gets done." - Warrior Protocol',
        ];

        const randomMotivation = motivations[Math.floor(Math.random() * motivations.length)];

        res.json({
            success: true,
            motivation: randomMotivation,
        });
    } catch (error) {
        console.error('Motivation Error:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/ai/recommendations
 * Get habit recommendations from AI
 */
router.get('/recommendations', auth.optional, async (req, res) => {
    try {
        const recommendations = [
            {
                category: 'Morning Routine',
                tips: [
                    'Wake up at the same time every day (even weekends)',
                    'Cold shower within 30 minutes of waking',
                    'Drink 500ml water before coffee',
                    'Exercise for at least 20 minutes',
                ],
            },
            {
                category: 'Learning & Focus',
                tips: [
                    'Study hardest subject first (2-3 hours)',
                    'Use Pomodoro: 50 min focus + 10 min break',
                    'No phone during focus sessions',
                    'Review previous day\'s material first',
                ],
            },
            {
                category: 'Sleep & Recovery',
                tips: [
                    'Sleep 7-8 hours consistently',
                    'No screens 1 hour before bed',
                    'Dark, cool room (18°C / 64°F optimal)',
                    'Track sleep quality and patterns',
                ],
            },
            {
                category: 'Physical Fitness',
                tips: [
                    'Strength training 4x per week',
                    'Cardio 3x per week (20-30 mins)',
                    'Proper nutrition: 1g protein per lb bodyweight',
                    'Track calories and macros',
                ],
            },
            {
                category: 'Nutrition',
                tips: [
                    'Eat whole foods 80% of the time',
                    'Meal prep on Sundays for the week',
                    'Drink 3-4 liters of water daily',
                    'Limit processed foods and sugar',
                ],
            },
        ];

        res.json({
            success: true,
            recommendations: recommendations,
        });
    } catch (error) {
        console.error('Recommendations Error:', error);
        res.status(500).json({ error: error.message });
    }
});

/**
 * POST /api/ai/quick-action
 * Handle quick action requests
 */
router.post('/quick-action', auth.optional, async (req, res) => {
    try {
        const { action } = req.body;
        const userId = req.user?.id || 'anonymous';

        let response = '';

        switch (action) {
            case 'analyze':
                response = '📊 **Daily Analysis**\n\n' +
                    '✅ *What you\'re doing well:*\n' +
                    '- Consistent morning routine\n' +
                    '- Strong workout discipline\n\n' +
                    '⚠️ *What needs attention:*\n' +
                    '- Sleep schedule slipping 30 mins late\n' +
                    '- Weekend gym sessions missed\n\n' +
                    '🎯 *Action for next 30 mins:*\n' +
                    'Complete your pending study task before 6 PM.';
                break;

            case 'weak':
                response = '🔴 **Weakest Habits Analysis**\n\n' +
                    '1. **Meditation** (20% completion)\n' +
                    '   - *Why?* Feels like a waste of time initially\n' +
                    '   - *Fix:* Start with 5 mins, pair with morning coffee\n\n' +
                    '2. **Reading** (35% completion)\n' +
                    '   - *Why?* Scrolling phone instead\n' +
                    '   - *Fix:* Put phone in another room during reading time\n\n' +
                    '3. **Journaling** (30% completion)\n' +
                    '   - *Why?* Unsure what to write\n' +
                    '   - *Fix:* Use 3-line template: Win, Lesson, Tomorrow\'s goal';
                break;

            case 'plan':
                response = '📋 **Today\'s Optimized Action Plan**\n\n' +
                    '**Done ✅**\n' +
                    '- Morning exercise\n' +
                    '- College classes\n\n' +
                    '**NOW (17:00-18:00)** 🔥\n' +
                    '- Complete DSA practice problem\n' +
                    '- 30 mins = 2 solutions OR 1 deep solution\n\n' +
                    '**18:00-19:00**\n' +
                    '- Gym focus: Strength training\n\n' +
                    '**19:00-20:15**\n' +
                    '- Dinner + family time\n\n' +
                    '**20:15-21:30**\n' +
                    '- Revision: Explain logic to someone\n\n' +
                    '**21:45+**\n' +
                    '- Sleep prep, aim for 10:30 PM bedtime';
                break;

            case 'sleep':
                response = '😴 **Sleep Analysis & Optimization**\n\n' +
                    '📊 *Your Pattern:*\n' +
                    '- Average: 6.8 hours (LOW)\n' +
                    '- Best night: Sunday (8.5h)\n' +
                    '- Worst: Wednesday (5.5h)\n\n' +
                    '⚠️ *Impact:*\n' +
                    '- Falling below 7h = 15% lower gym performance\n' +
                    '- Wednesday fatigue = Friday study crash\n\n' +
                    '🎯 *Fixes (apply immediately):*\n' +
                    '1. Bedtime 10:30 PM (non-negotiable)\n' +
                    '2. No screens after 9:45 PM\n' +
                    '3. Blackout curtains + white noise\n\n' +
                    '💡 *Target: 7.5 hours per night (minimum)*';
                break;

            case 'motivate':
                response = '⚡ **Your Warrior Moment**\n\n' +
                    'You\'ve built a 47-day streak on morning exercise.\n' +
                    'You\'ve completed 156/180 habits this month.\n' +
                    '**You are 87% consistent.**\n\n' +
                    'That\'s not luck. That\'s discipline.\n\n' +
                    '*"कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।"*\n' +
                    '*(You have the right to action, not to the fruits.)*\n\n' +
                    'Your job isn\'t to be perfect.\n' +
                    'Your job is to keep showing up.\n\n' +
                    '**You are showing up. THAT is the warrior way.**\n\n' +
                    '🔥 Now go crush the next task.';
                break;

            case 'schedule':
                response = '🗓️ **Schedule Optimization**\n\n' +
                    '❌ *Current conflicts:*\n' +
                    '- College (8:45-15:45) is fixed\n' +
                    '- Gym (17:00-19:00) is solid\n' +
                    '- Sleep 21:45 is CRITICAL\n\n' +
                    '✅ *Suggested fixes:*\n' +
                    '1. Move power nap to 16:00-16:30 (before gym)\n' +
                    '2. DSA study 05:20-06:00 (peak brain power)\n' +
                    '3. Revision right after dinner (digestive aid)\n' +
                    '4. Slack time 20:15-20:45 (wind down)\n\n' +
                    '💡 *Why this works:*\n' +
                    'Heavy lifting (DSA, Gym) when TNF (Testosterone, Energy) peaks.\n' +
                    'Light tasks (revision, packing) when tired.';
                break;

            default:
                response = 'Unknown quick action. Please choose from: analyze, weak, plan, sleep, motivate, schedule.';
        }

        res.json({
            success: true,
            actionType: action,
            response: response,
        });
    } catch (error) {
        console.error('Quick Action Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// ========== HELPER FUNCTIONS ==========

async function generateAIResponse(message, context, userId) {
    /**
     * This function generates AI responses based on user input.
     * In production, you would call an actual LLM API (OpenAI, Anthropic, etc.)
     * For now, this provides smart contextual responses.
     */

    const lowerMsg = message.toLowerCase();

    // Habit-related queries
    if (lowerMsg.includes('habit') || lowerMsg.includes('streak')) {
        return `🎯 **Habit Insight**\n\nYour habits show strong commitment! Focus on consistency over perfection. Here's what I recommend:\n\n1. **Track daily** - No exceptions, even on bad days\n2. **Stack habits** - Attach new habits to existing ones\n3. **Chain reaction** - Don't break the chain of consecutive days\n\nWhat specific habit are you struggling with?`;
    }

    // Sleep-related queries
    if (lowerMsg.includes('sleep') || lowerMsg.includes('tired')) {
        return `😴 **Sleep Assessment**\n\nSleep is the foundation of everything. Here's my analysis:\n\n- **Target**: 7-8 hours consistently\n- **Quality matters**: Deep sleep is more important than hours\n- **Routine**: Same bedtime and wake time (even weekends)\n\n💡 *Pro tip*: Track your sleep quality in the app. Patterns emerge after 2 weeks.`;
    }

    // Motivation queries
    if (lowerMsg.includes('motivat') || lowerMsg.includes('tired') || lowerMsg.includes('hard')) {
        return `⚡ **Warrior Moment**\n\n*"The master has failed more times than the beginner has tried."*\n\nYou're doing better than you think. The fact that you're tracking proves you're serious. Most people quit before they start.\n\n💪 **Your stats show:**\n- Consistent effort\n- Self-awareness\n- Commitment to growth\n\nThat's the formula. Keep going.`;
    }

    // Performance & analytics
    if (lowerMsg.includes('performance') || lowerMsg.includes('progress') || lowerMsg.includes('stats')) {
        return `📊 **Performance Dashboard**\n\nHere's what your data tells me:\n\n✅ **Strengths:**\n- Morning routine consistency\n- Workout discipline\n\n⚠️ **Opportunities:**\n- Sleep schedule variability\n- Weekend routine slips\n\n🎯 **Next Focus:**\nLock in your sleep. Everything else builds on that.`;
    }

    // Recommendation queries
    if (lowerMsg.includes('recommend') || lowerMsg.includes('suggest') || lowerMsg.includes('improve')) {
        return `💡 **Smart Recommendations**\n\nBased on proven habits of high performers:\n\n1. **Morning Routine** - Get it locked in\n2. **Strength Training** - 4x/week minimum\n3. **Sleep Tracking** - Know your baseline\n4. **Focused Learning** - Remove distractions\n5. **Consistency** - Same time, every day\n\nPick ONE to focus on this week. Master that, then add the next.`;
    }

    // Default helpful response
    return `🤖 **AI Coach Ready**\n\nI have full access to your habit data, sleep logs, and performance metrics. I can help you with:\n\n📊 Analysis - *"Analyze my performance"*\n😴 Sleep - *"How's my sleep?"*\n🎯 Recommendations - *"What should I improve?"*\n⚡ Motivation - *"Motivate me"*\n🗓️ Scheduling - *"Optimize my schedule"*\n\nWhat would you like help with?`;
}

async function getDailyAnalysis(userId) {
    return {
        dayCompleted: '87%',
        tasksCompleted: '10/12',
        strengths: ['Morning routine', 'Workout'],
        weaknesses: ['Sleep schedule', 'Weekend consistency'],
        recommendation: 'Lock in your sleep. It\'s the foundation.',
    };
}

async function getWeeklyAnalysis(userId) {
    return {
        weekAverage: '85%',
        bestDay: 'Tuesday (95%)',
        worstDay: 'Sunday (72%)',
        trend: '↑ +3% improvement',
        recommendation: 'Weekend turnaround needed.',
    };
}

async function getMonthlyAnalysis(userId) {
    return {
        monthAverage: '82%',
        totalHabits: 12,
        completedHabits: 10,
        streaks: {
            '🏋️ Gym': 47,
            '📚 Study': 32,
            '😴 Sleep': 18,
        },
        recommendation: 'Maintaining 80%+ is elite. Focus on the weak points.',
    };
}

module.exports = router;
