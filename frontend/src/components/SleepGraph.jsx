import { motion } from 'framer-motion';
import { useHabitStore } from '../stores/habitStore';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Moon, TrendingUp, Zap } from 'lucide-react';

const SleepGraph = () => {
  const { sleepData } = useHabitStore();

  // Calculate average sleep
  const avgSleep = sleepData.reduce((sum, day) => sum + day.hours, 0) / sleepData.length;
  const avgQuality = sleepData.reduce((sum, day) => sum + day.quality, 0) / sleepData.length;

  // Format data for chart
  const chartData = sleepData.map(day => ({
    ...day,
    date: new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' }),
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card p-3 border border-surface-border">
          <p className="text-sm font-medium text-text-primary">{label}</p>
          <p className="text-xs text-text-secondary">
            Hours: <span className="text-accent font-semibold">{payload[0].value}</span>
          </p>
          <p className="text-xs text-text-secondary">
            Quality: <span className="text-primary font-semibold">{payload[1].value}%</span>
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
          <h3 className="heading-3 text-text-primary">Sleep Analytics</h3>
          <p className="body-base text-text-secondary">Track your sleep patterns and quality</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-text-primary">{avgSleep.toFixed(1)}h</div>
            <div className="text-xs text-text-tertiary">Avg. Sleep</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-text-primary">{Math.round(avgQuality)}%</div>
            <div className="text-xs text-text-tertiary">Avg. Quality</div>
          </div>
          <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
            <Moon size={24} className="text-accent" />
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-64 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#A1A1AA', fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#A1A1AA', fontSize: 12 }}
              domain={[6, 9]}
            />
            <Tooltip content={<CustomTooltip />} />
            <defs>
              <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#06B6D4" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorQuality" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="hours"
              stroke="#06B6D4"
              strokeWidth={2}
              fill="url(#colorHours)"
              dot={{ stroke: '#06B6D4', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#ffffff', strokeWidth: 2 }}
            />
            <Area
              type="monotone"
              dataKey="quality"
              stroke="#7C3AED"
              strokeWidth={2}
              fill="url(#colorQuality)"
              dot={{ stroke: '#7C3AED', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#ffffff', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
              <div className="text-lg font-bold text-text-primary">
                {Math.max(...sleepData.map(d => d.hours)).toFixed(1)}h
              </div>
              <div className="text-xs text-text-tertiary">Best Sleep</div>
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
              <div className="text-lg font-bold text-text-primary">
                {Math.max(...sleepData.map(d => d.quality))}%
              </div>
              <div className="text-xs text-text-tertiary">Best Quality</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="glass-card p-4"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-surface/30 flex items-center justify-center">
              <span className="text-lg font-bold text-text-primary">7.5</span>
            </div>
            <div>
              <div className="text-lg font-bold text-text-primary">Goal</div>
              <div className="text-xs text-text-tertiary">Hours per night</div>
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
              <span className="text-lg font-bold text-green-500">+2</span>
            </div>
            <div>
              <div className="text-lg font-bold text-text-primary">Trend</div>
              <div className="text-xs text-text-tertiary">Days improving</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recommendation */}
      <motion.div
        className="mt-6 p-4 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <Moon size={16} className="text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-text-primary">
              Sleep recommendation
            </p>
            <p className="text-xs text-text-secondary">
              Try going to bed 30 minutes earlier tonight to reach your 7.5 hour goal.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SleepGraph;