import { motion } from 'framer-motion';
import { useHabitStore } from '../stores/habitStore';
import { CheckCircle, Circle, TrendingUp, Target } from 'lucide-react';

const ProgressBars = () => {
  const { habits, toggleHabitCompletion, getTodayCompletionRate } = useHabitStore();
  const completionRate = getTodayCompletionRate();

  const today = new Date().toISOString().split('T')[0];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <div className="glass-panel p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="heading-3 text-text-primary">Daily Progress</h3>
          <p className="body-base text-text-secondary">Track your habit completion for today</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Target size={24} className="text-primary" />
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-text-primary">{Math.round(completionRate)}%</div>
            <div className="text-xs text-text-tertiary">Completion</div>
          </div>
        </div>
      </div>

      {/* Overall Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-text-primary">Overall Progress</span>
          <span className="text-sm font-semibold text-primary">{Math.round(completionRate)}%</span>
        </div>
        <div className="progress-bar">
          <motion.div
            className="progress-fill"
            initial={{ width: 0 }}
            animate={{ width: `${completionRate}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-text-tertiary">
            {habits.filter(h => h.completedDates.includes(today)).length} of {habits.length} habits completed
          </span>
          <div className="flex items-center gap-1 text-xs text-accent">
            <TrendingUp size={12} />
            <span>+12% from yesterday</span>
          </div>
        </div>
      </div>

      {/* Individual Habits */}
      <motion.div
        className="space-y-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {habits.map((habit) => {
          const isCompleted = habit.completedDates.includes(today);
          const completionPercentage = (habit.streak / 30) * 100; // Assuming 30 days target

          return (
            <motion.div
              key={habit.id}
              className="glass-card p-4"
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleHabitCompletion(habit.id)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                      isCompleted
                        ? 'bg-primary/20 text-primary'
                        : 'bg-surface/30 text-text-tertiary hover:bg-surface/50'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle size={18} />
                    ) : (
                      <Circle size={18} />
                    )}
                  </button>
                  <div>
                    <h4 className="font-medium text-text-primary">{habit.title}</h4>
                    <p className="text-xs text-text-tertiary">{habit.category} • {habit.streak} day streak</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {/* Mini progress bar */}
                  <div className="w-24">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-text-tertiary">{habit.streak}/30</span>
                      <span className="text-xs font-medium text-text-primary">
                        {Math.min(Math.round(completionPercentage), 100)}%
                      </span>
                    </div>
                    <div className="h-1.5 bg-surface/30 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${Math.min(completionPercentage, 100)}%`,
                          backgroundColor: habit.color,
                        }}
                      />
                    </div>
                  </div>
                  <div
                    className="w-2 h-8 rounded-full"
                    style={{ backgroundColor: habit.color }}
                  />
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Add Habit Button */}
      <motion.button
        className="w-full mt-6 py-3 border border-dashed border-surface-border rounded-xl text-text-tertiary hover:text-text-primary hover:border-primary/30 transition-colors"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        + Add New Habit
      </motion.button>
    </div>
  );
};

export default ProgressBars;