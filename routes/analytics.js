const express = require('express');
const Habit = require('../models/Habit');
const SleepLog = require('../models/SleepLog');
const { auth } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(auth);

// Get user dashboard analytics
router.get('/dashboard', async (req, res) => {
    try {
        const userId = req.user.id;

        // Get habits with their stats
        const habits = await Habit.findByUserId(userId);
        const habitStats = await Promise.all(
            habits.map(async (habit) => {
                const stats = await Habit.getStats(habit.id, userId, 30);
                return {
                    habit: habit.name,
                    ...stats
                };
            })
        );

        // Get sleep statistics
        const sleepStats = await SleepLog.getStats(userId, 30);
        const sleepQualityDist = await SleepLog.getQualityDistribution(userId, 30);

        // Calculate overall completion rate
        const totalHabits = habitStats.length;
        const avgCompletionRate = totalHabits > 0
            ? habitStats.reduce((sum, stat) => sum + parseFloat(stat.completion_rate || 0), 0) / totalHabits
            : 0;

        // Get current streak (simplified - longest streak in last 30 days)
        let currentStreak = 0;
        const today = new Date();
        for (let i = 0; i < 30; i++) {
            const checkDate = new Date(today);
            checkDate.setDate(today.getDate() - i);

            const completedHabits = habitStats.filter(stat => {
                // This is a simplified check - in reality you'd check logs for each date
                return parseFloat(stat.completion_rate || 0) > 50;
            }).length;

            if (completedHabits > 0) {
                currentStreak++;
            } else {
                break;
            }
        }

        // Get today's habits breakdown
        const todayStr = new Date().toISOString().split('T')[0];
        let todayCompleted = 0;
        let todayTotal = 0;
        const todayBreakdown = {};

        for (const habit of habits) {
            todayTotal++;
            const logs = await Habit.getLogs(habit.id, userId, todayStr, todayStr);
            if (logs.length > 0 && logs[0].status === 'completed') {
                todayCompleted++;
                todayBreakdown[habit.name] = true;
            }
        }

        // Calculate sleep hours average
        const avgSleepHours = sleepStats.avg_hours ? parseFloat(sleepStats.avg_hours) : 0;

        // Build weekly summary
        const weeklySummary = buildWeeklySummary(habits, userId);

        res.json({
            success: true,
            data: {
                totalHabits,
                avgCompletionRate: Math.round(avgCompletionRate * 100) / 100,
                currentStreak,
                sleepStats: {
                    avgHours: avgSleepHours,
                    totalNights: sleepStats.total_nights || 0,
                    qualityDistribution: sleepQualityDist
                },
                habitStats,
                dailyBreakdown: {
                    completed: todayCompleted,
                    total: todayTotal,
                    percentage: todayTotal > 0 ? Math.round((todayCompleted / todayTotal) * 100) : 0
                },
                weeklySummary,
                consistencyScore: Math.round(avgCompletionRate)
            }
        });
    } catch (error) {
        console.error('Dashboard analytics error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch dashboard analytics'
        });
    }
});

// Get habit trends over time
router.get('/habits/trends', async (req, res) => {
    try {
        const userId = req.user.id;
        const days = parseInt(req.query.days) || 90;

        const habits = await Habit.findByUserId(userId);
        const trends = [];

        for (const habit of habits) {
            const logs = await Habit.getLogs(
                habit.id,
                userId,
                new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                new Date().toISOString().split('T')[0]
            );

            // Group logs by week
            const weeklyData = {};
            logs.forEach(log => {
                const week = getWeekNumber(new Date(log.date));
                if (!weeklyData[week]) {
                    weeklyData[week] = { completed: 0, total: 0 };
                }
                weeklyData[week].total++;
                if (log.status === 'completed') {
                    weeklyData[week].completed++;
                }
            });

            const weeklyRates = Object.entries(weeklyData).map(([week, data]) => ({
                week: parseInt(week),
                completionRate: data.total > 0 ? (data.completed / data.total) * 100 : 0,
                completed: data.completed,
                total: data.total
            }));

            trends.push({
                habitId: habit.id,
                habitName: habit.name,
                weeklyRates
            });
        }

        res.json({
            success: true,
            data: { trends }
        });
    } catch (error) {
        console.error('Habit trends error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch habit trends'
        });
    }
});

// Get sleep analytics
router.get('/sleep', async (req, res) => {
    try {
        const userId = req.user.id;
        const days = parseInt(req.query.days) || 30;

        const sleepStats = await SleepLog.getStats(userId, days);
        const qualityDist = await SleepLog.getQualityDistribution(userId, days);

        // Get sleep logs for trend analysis
        const sleepLogs = await SleepLog.findByUserIdAndDateRange(
            userId,
            new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            new Date().toISOString().split('T')[0]
        );

        // Calculate trends
        const dailySleep = sleepLogs.map(log => ({
            date: log.date,
            duration: log.duration ? parseFloat(log.duration.hours || 0) + parseFloat(log.duration.minutes || 0) / 60 : 0,
            quality: log.quality
        }));

        res.json({
            success: true,
            data: {
                stats: sleepStats,
                qualityDistribution: qualityDist,
                dailySleep
            }
        });
    } catch (error) {
        console.error('Sleep analytics error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch sleep analytics'
        });
    }
});

// Helper function to build weekly summary
async function buildWeeklySummary(habits, userId) {
    const weeklySummary = [];
    const today = new Date();

    for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
        const date = new Date(today);
        date.setDate(date.getDate() - dayOffset);
        const dateStr = date.toISOString().split('T')[0];
        const dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][date.getDay()];

        let completed = 0;
        let total = habits.length;

        for (const habit of habits) {
            const logs = await Habit.getLogs(habit.id, userId, dateStr, dateStr);
            if (logs.length > 0 && logs[0].status === 'completed') {
                completed++;
            }
        }

        const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
        weeklySummary.unshift({
            day: dayName,
            date: dateStr,
            completed,
            total,
            percentage
        });
    }

    return weeklySummary;
}

// Helper function to get week number
function getWeekNumber(date) {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

module.exports = router;