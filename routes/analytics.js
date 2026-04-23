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
        const avgSleepHours = sleepStats.avg_duration_hours
            ? parseFloat(sleepStats.avg_duration_hours)
            : 0;

        // Build weekly summary
        const weeklySummary = await buildWeeklySummary(habits, userId);
        const dailyConsistency = await buildDailyConsistencySeries(habits, userId, 28);
        const weekdayPerformance = buildWeekdayPerformance(dailyConsistency);
        const habitRiskAlerts = await buildHabitRiskAlerts(habits, userId, 14);

        const momentum = calculateMomentum(dailyConsistency);
        const streakScore = Math.min(currentStreak * 5, 100);
        const sleepScore = Math.min((avgSleepHours / 8) * 100, 100);
        const consistencyScore = Math.round(
            clamp((avgCompletionRate * 0.7) + (streakScore * 0.2) + (sleepScore * 0.1) + momentum, 0, 100)
        );

        const coachRecommendations = buildCoachRecommendations({
            avgCompletionRate,
            currentStreak,
            avgSleepHours,
            momentum,
            habitRiskAlerts
        });

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
                consistencyScore,
                consistencyIntelligence: {
                    dailyConsistency,
                    weekdayPerformance,
                    habitRiskAlerts,
                    momentum,
                    coachRecommendations
                }
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

async function buildDailyConsistencySeries(habits, userId, days = 28) {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - (days - 1));

    const startDateStr = formatDate(startDate);
    const endDateStr = formatDate(today);

    const habitLogMaps = await Promise.all(
        habits.map(async (habit) => {
            const logs = await Habit.getLogs(habit.id, userId, startDateStr, endDateStr);
            const statusByDate = logs.reduce((acc, log) => {
                acc[log.date] = log.status;
                return acc;
            }, {});

            return {
                habitId: habit.id,
                statusByDate
            };
        })
    );

    const series = [];
    for (let dayOffset = days - 1; dayOffset >= 0; dayOffset--) {
        const date = new Date(today);
        date.setDate(today.getDate() - dayOffset);
        const dateStr = formatDate(date);

        let completed = 0;
        for (const habitMap of habitLogMaps) {
            if (habitMap.statusByDate[dateStr] === 'completed') {
                completed++;
            }
        }

        const total = habits.length;
        series.push({
            date: dateStr,
            completed,
            total,
            percentage: total > 0 ? Math.round((completed / total) * 100) : 0
        });
    }

    return series;
}

function buildWeekdayPerformance(dailyConsistency) {
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const sums = [0, 0, 0, 0, 0, 0, 0];
    const counts = [0, 0, 0, 0, 0, 0, 0];

    dailyConsistency.forEach((day) => {
        const index = new Date(day.date).getDay();
        sums[index] += day.percentage;
        counts[index] += 1;
    });

    return dayNames.map((name, index) => ({
        day: name,
        score: counts[index] > 0 ? Math.round(sums[index] / counts[index]) : 0
    }));
}

async function buildHabitRiskAlerts(habits, userId, days = 14) {
    const endDate = new Date();
    const startDate = new Date(endDate);
    startDate.setDate(endDate.getDate() - (days - 1));

    const startDateStr = formatDate(startDate);
    const endDateStr = formatDate(endDate);

    const alerts = [];
    for (const habit of habits) {
        const logs = await Habit.getLogs(habit.id, userId, startDateStr, endDateStr);
        const totalLogs = logs.length;
        const completedLogs = logs.filter(log => log.status === 'completed').length;
        const completionRate = totalLogs > 0 ? (completedLogs / totalLogs) * 100 : 0;

        // Logs are returned descending; this calculates active miss streak from latest entries.
        let missedStreak = 0;
        for (const log of logs) {
            if (log.status === 'missed') {
                missedStreak++;
            } else {
                break;
            }
        }

        if (totalLogs > 0 && (completionRate < 50 || missedStreak >= 3)) {
            let severity = 'medium';
            if (completionRate < 30 || missedStreak >= 5) {
                severity = 'high';
            }

            alerts.push({
                habitId: habit.id,
                habitName: habit.name,
                completionRate: Math.round(completionRate),
                missedStreak,
                severity
            });
        }
    }

    return alerts
        .sort((a, b) => {
            if (a.severity === b.severity) {
                return a.completionRate - b.completionRate;
            }
            const rank = { high: 3, medium: 2, low: 1 };
            return rank[b.severity] - rank[a.severity];
        })
        .slice(0, 5);
}

function buildCoachRecommendations({ avgCompletionRate, currentStreak, avgSleepHours, momentum, habitRiskAlerts }) {
    const recommendations = [];

    if (avgCompletionRate < 60) {
        recommendations.push('Reduce active habits by 1-2 for one week to rebuild execution confidence.');
    }

    if (currentStreak < 3) {
        recommendations.push('Use a 2-minute starter action for each habit to restart your streak quickly.');
    }

    if (avgSleepHours > 0 && avgSleepHours < 7) {
        recommendations.push('Improve bedtime consistency. Sleep below 7 hours is likely hurting daytime habit completion.');
    }

    if (momentum < 0) {
        recommendations.push('Your 7-day momentum is negative. Focus on your top 3 habits only for the next 5 days.');
    }

    if (habitRiskAlerts.length > 0) {
        recommendations.push(`Prioritize recovery for "${habitRiskAlerts[0].habitName}" with a simpler daily target this week.`);
    }

    if (recommendations.length === 0) {
        recommendations.push('Excellent consistency. Add one stretch-goal habit only if your score stays above 80 for 2 weeks.');
    }

    return recommendations.slice(0, 4);
}

function calculateMomentum(dailyConsistency) {
    if (dailyConsistency.length < 14) {
        return 0;
    }

    const latest7 = dailyConsistency.slice(-7);
    const previous7 = dailyConsistency.slice(-14, -7);
    const latestAvg = latest7.reduce((sum, day) => sum + day.percentage, 0) / latest7.length;
    const previousAvg = previous7.reduce((sum, day) => sum + day.percentage, 0) / previous7.length;

    return Math.round((latestAvg - previousAvg) / 4);
}

function formatDate(date) {
    return date.toISOString().split('T')[0];
}

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
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