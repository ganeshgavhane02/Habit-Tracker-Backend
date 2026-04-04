/**
 * HabitTrackerAPI - Complete API Client for Frontend-Backend Communication
 * Handles authentication, habits, analytics, and AI chat features
 */

class HabitTrackerAPI {
    constructor(baseUrl = 'http://localhost:3001/api') {
        this.baseUrl = baseUrl;
        this.token = localStorage.getItem('auth_token');
    }

    /**
     * SET AUTH TOKEN
     */
    setToken(token) {
        this.token = token;
        localStorage.setItem('auth_token', token);
    }

    getToken() {
        return this.token;
    }

    isAuthenticated() {
        return !!this.token;
    }

    clearToken() {
        this.token = null;
        localStorage.removeItem('auth_token');
    }

    /**
     * HELPER: Make HTTP requests with auth headers
     */
    async request(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers,
        };

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        const config = {
            ...options,
            headers,
        };

        const response = await fetch(url, config);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || `API Error: ${response.status}`);
        }

        return data;
    }

    // ========== AUTHENTICATION ==========

    /**
     * Register a new user
     */
    async register(email, password, name = 'User') {
        return this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ email, password, name }),
        });
    }

    /**
     * Login user
     */
    async login(email, password) {
        const response = await this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });

        if (response.token) {
            this.setToken(response.token);
        }

        return response;
    }

    /**
     * Get current user profile
     */
    async getProfile() {
        return this.request('/users/profile');
    }

    /**
     * Update user profile
     */
    async updateProfile(profileData) {
        return this.request('/users/profile', {
            method: 'PUT',
            body: JSON.stringify(profileData),
        });
    }

    /**
     * Logout user
     */
    logout() {
        this.clearToken();
        return Promise.resolve();
    }

    // ========== HABITS ==========

    /**
     * Get all habits for user
     */
    async getHabits() {
        return this.request('/habits');
    }

    /**
     * Get a single habit by ID
     */
    async getHabit(habitId) {
        return this.request(`/habits/${habitId}`);
    }

    /**
     * Create a new habit
     */
    async createHabit(habitData) {
        return this.request('/habits', {
            method: 'POST',
            body: JSON.stringify(habitData),
        });
    }

    /**
     * Update an existing habit
     */
    async updateHabit(habitId, habitData) {
        return this.request(`/habits/${habitId}`, {
            method: 'PUT',
            body: JSON.stringify(habitData),
        });
    }

    /**
     * Delete a habit
     */
    async deleteHabit(habitId) {
        return this.request(`/habits/${habitId}`, {
            method: 'DELETE',
        });
    }

    /**
     * Log habit completion for today
     */
    async logHabitCompletion(habitId, status = 'done') {
        return this.request(`/habits/${habitId}/log`, {
            method: 'POST',
            body: JSON.stringify({ status }),
        });
    }

    /**
     * Get habit completion logs
     */
    async getHabitLogs(habitId) {
        return this.request(`/habits/${habitId}/logs`);
    }

    // ========== ANALYTICS ==========

    /**
     * Get dashboard analytics
     */
    async getDashboardAnalytics() {
        return this.request('/analytics/dashboard');
    }

    /**
     * Get habit trends
     */
    async getHabitTrends(habitId) {
        return this.request(`/analytics/trends/${habitId}`);
    }

    /**
     * Get sleep analytics
     */
    async getSleepAnalytics() {
        return this.request('/analytics/sleep');
    }

    /**
     * Log sleep data
     */
    async logSleep(hours, quality = 'normal', notes = '') {
        return this.request('/analytics/sleep', {
            method: 'POST',
            body: JSON.stringify({ hours, quality, notes }),
        });
    }

    // ========== DATA SYNC ==========

    /**
     * Sync local localStorage data to backend
     */
    async syncLocalDataToBackend(appData) {
        return this.request('/sync', {
            method: 'POST',
            body: JSON.stringify({ data: appData }),
        });
    }

    /**
     * Get synced data from backend
     */
    async getBackendData() {
        return this.request('/sync');
    }

    // ========== AI CHAT ==========

    /**
     * Send message to AI chat (server-side AI processing)
     */
    async sendChatMessage(userMessage, context = {}) {
        return this.request('/ai/chat', {
            method: 'POST',
            body: JSON.stringify({
                message: userMessage,
                context: context,
            }),
        });
    }

    /**
     * Get AI chat history
     */
    async getChatHistory() {
        return this.request('/ai/chat/history');
    }

    /**
     * Get AI analysis for habit data
     */
    async getAIAnalysis(analysisType = 'daily') {
        return this.request(`/ai/analysis?type=${analysisType}`);
    }

    /**
     * Get motivational message from AI
     */
    async getMotivation() {
        return this.request('/ai/motivation');
    }

    /**
     * Get habit recommendations from AI
     */
    async getHabitRecommendations() {
        return this.request('/ai/recommendations');
    }

    // ========== UTILITY ==========

    /**
     * Health check endpoint
     */
    async healthCheck() {
        return this.request('/health');
    }
}

// Create global instance
const api = new HabitTrackerAPI();
