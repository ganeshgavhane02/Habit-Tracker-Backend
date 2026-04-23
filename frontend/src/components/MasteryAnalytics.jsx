import { motion } from 'framer-motion';
import { useHabitStore } from '../stores/habitStore';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Trophy, Target, TrendingUp, Award, Star, Zap } from 'lucide-react';

const MasteryAnalytics = () => {
  const { habits, getStreakStats, getCategoryStats } = useHabitStore();
  const { avgStreak, maxStreak } = getStreakStats();
  const categoryStats = getCategoryStats();

  // Prepare data for category chart
  const categoryData = Object.entries(categoryStats).map(([category, stats]) => ({
    category,
    count: stats.count,
    completion: (stats.completed / stats.count) * 100,
    color: category === 'Wellness' ? '#7C3AED' : 
           category === 'Fitness' ? '#06B6D4' : 
           category === 'Learning' ? '#10B981' : 
           category === 'Sleep' ? '#8B5CF6' : 
           category === 'Health' ? '#3B82F6' : '#F59E0B',
  }));

  // Calculate mastery level
  const totalCompletion = habits.reduce((sum, habit) => {
    const today = new Date().toISOString().split('T')[0];
    return sum + (habit.completedDates.includes(today) ? 1 : 0);
  }, 0);
  const masteryPercentage = (totalCompletion / habits.length) * 100;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card p-3 border border-surface-border">
          <p className="text-sm font-medium text-text-primary">{label}</p>
          <p className="text-xs text-text-secondary">
            Habits: <span className="font-semibold">{payload[0].value}</span>
          </p>
          <p className="text-xs text-text-secondary">
            Completion: <span className="font-semibold text-accent">{payload[1]?.value?.toFixed(1)}%</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-panel p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="heading-3 text-text-primary">Mastery Analytics</h3>
          <p className="body-base text-text-secondary">Track your progress and mastery across categories</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-600 to-accent-500 flex items-center justify-center">
            <Trophy size={24} className="text-white" />
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-text-primary">{Math.round(masteryPercentage)}%</div>
            <div className="text-xs text-text-tertiary">Mastery Score</div>
          </div>
        </div>
      </div>

      {/* Mastery Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Target size={18} className="text-primary" />
            <span className="font-medium text-text-primary">Overall Mastery</span>
          </div>
          <span className="text-sm font-semibold text-primary">{Math.round(masteryPercentage)}%</span>
        </div>
        <div className="relative">
          <div className="h-3 bg-surface/30 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-primary-500 to-accent-400"
              initial={{ width: 0 }}
              animate={{ width: `${masteryPercentage}%` }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
            />
          </div>
          <div className="flex justify-between mt-2">
            {[0, 25, 50, 75, 100].map((point) => (
              <div key={point} className="flex flex-col items-center">
                <div className={`w-1 h-3 rounded-full ${masteryPercentage >= point ? 'bg-primary' : 'bg-surface/30'}`} />
                <span className="text-xs text-text-tertiary mt-1">{point}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <motion.div
          className="glass-card p-4"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <TrendingUp size={18} className="text-primary" />
            </div>
            <div>
              <div className="text-lg font-bold text-text-primary">{avgStreak.toFixed(1)}</div>
              <div className="text-xs text-text-tertiary">Avg. Streak</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="glass-card p-4"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <Zap size={18} className="text-accent" />
            </div>
            <div>
              <div className="text-lg font-bold text-text-primary">{maxStreak}</div>
              <div className="text-xs text-text-tertiary">Max Streak</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="glass-card p-4"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
              <Award size={18} className="text-green-500" />
            </div>
            <div>
              <div className="text-lg font-bold text-text-primary">{habits.length}</div>
              <div className="text-xs text-text-tertiary">Total Habits</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="glass-card p-4"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <Star size={18} className="text-purple-500" />
            </div>
            <div>
              <div className="text-lg font-bold text-text-primary">{Object.keys(categoryStats).length}</div>
              <div className="text-xs text-text-tertiary">Categories</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Category Chart */}
      <div className="mb-6">
        <h4 className="font-medium text-text-primary mb-4">Habits by Category</h4>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={categoryData}
              margin={{ top: 20, right: 10, left: 0, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
              <XAxis
                dataKey="category"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#A1A1AA', fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#A1A1AA', fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="count"
                radius={[4, 4, 0, 0]}
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Completion */}
      <div>
        <h4 className="font-medium text-text-primary mb-4">Category Completion</h4>
        <div className="space-y-3">
          {categoryData.map((cat) => (
            <motion.div
              key={cat.category}
              className="flex items-center justify-between"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: cat.index * 0.1 }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: cat.color }}
                />
                <span className="text-sm text-text-primary">{cat.category}</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-32">
                  <div className="h-2 bg-surface/30 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${cat.completion}%`,
                        backgroundColor: cat.color,
                      }}
                    />
                  </div>
                </div>
                <span className="text-sm font-medium text-text-primary w-10 text-right">
                  {cat.completion.toFixed(0)}%
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Achievement Badge */}
      <motion.div
        className="mt-6 p-4 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-400 flex items-center justify-center">
            <Trophy size={20} className="text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-text-primary">
              Consistency Master
            </p>
            <p className="text-xs text-text-secondary">
              You've maintained a 7+ day streak in 3 categories. Keep going to unlock the next badge!
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default MasteryAnalytics;