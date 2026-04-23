import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Mock initial habits data
const initialHabits = [
  {
    id: '1',
    title: 'Morning Meditation',
    description: '10 minutes of mindfulness meditation',
    category: 'Wellness',
    targetFrequency: 'daily',
    completedDates: ['2026-04-15', '2026-04-16'],
    streak: 2,
    color: '#7C3AED',
    createdAt: '2026-04-10',
  },
  {
    id: '2',
    title: 'Exercise',
    description: '30 minutes of cardio or strength training',
    category: 'Fitness',
    targetFrequency: 'daily',
    completedDates: ['2026-04-15', '2026-04-16', '2026-04-17'],
    streak: 3,
    color: '#06B6D4',
    createdAt: '2026-04-05',
  },
  {
    id: '3',
    title: 'Read 20 Pages',
    description: 'Read at least 20 pages of a book',
    category: 'Learning',
    targetFrequency: 'daily',
    completedDates: ['2026-04-16'],
    streak: 1,
    color: '#10B981',
    createdAt: '2026-04-12',
  },
  {
    id: '4',
    title: 'Sleep by 11 PM',
    description: 'Go to bed before 11 PM',
    category: 'Sleep',
    targetFrequency: 'daily',
    completedDates: ['2026-04-14', '2026-04-16'],
    streak: 2,
    color: '#8B5CF6',
    createdAt: '2026-04-01',
  },
  {
    id: '5',
    title: 'Drink 2L Water',
    description: 'Stay hydrated throughout the day',
    category: 'Health',
    targetFrequency: 'daily',
    completedDates: ['2026-04-15', '2026-04-16', '2026-04-17'],
    streak: 3,
    color: '#3B82F6',
    createdAt: '2026-04-03',
  },
  {
    id: '6',
    title: 'Coding Practice',
    description: '1 hour of coding practice or project work',
    category: 'Career',
    targetFrequency: 'daily',
    completedDates: ['2026-04-16', '2026-04-17'],
    streak: 2,
    color: '#F59E0B',
    createdAt: '2026-04-08',
  },
];

// Mock sleep data
const initialSleepData = [
  { date: '2026-04-10', hours: 7.2, quality: 85 },
  { date: '2026-04-11', hours: 6.8, quality: 78 },
  { date: '2026-04-12', hours: 8.1, quality: 92 },
  { date: '2026-04-13', hours: 7.5, quality: 88 },
  { date: '2026-04-14', hours: 6.5, quality: 72 },
  { date: '2026-04-15', hours: 7.9, quality: 90 },
  { date: '2026-04-16', hours: 8.2, quality: 94 },
  { date: '2026-04-17', hours: 7.7, quality: 86 },
];

export const useHabitStore = create(
  persist(
    (set, get) => ({
      // State
      habits: initialHabits,
      sleepData: initialSleepData,
      selectedDate: new Date().toISOString().split('T')[0],
      notifications: [],
      
      // Computed values
      getTodayCompletionRate: () => {
        const today = new Date().toISOString().split('T')[0];
        const habits = get().habits;
        const completedToday = habits.filter(h => 
          h.completedDates.includes(today)
        ).length;
        return habits.length > 0 ? (completedToday / habits.length) * 100 : 0;
      },
      
      getStreakStats: () => {
        const habits = get().habits;
        const totalStreak = habits.reduce((sum, h) => sum + h.streak, 0);
        const avgStreak = habits.length > 0 ? totalStreak / habits.length : 0;
        const maxStreak = Math.max(...habits.map(h => h.streak), 0);
        return { totalStreak, avgStreak, maxStreak };
      },
      
      getCategoryStats: () => {
        const habits = get().habits;
        const categories = {};
        habits.forEach(habit => {
          if (!categories[habit.category]) {
            categories[habit.category] = { count: 0, completed: 0 };
          }
          categories[habit.category].count++;
          const today = new Date().toISOString().split('T')[0];
          if (habit.completedDates.includes(today)) {
            categories[habit.category].completed++;
          }
        });
        return categories;
      },
      
      // Actions
      toggleHabitCompletion: (habitId) => {
        const today = new Date().toISOString().split('T')[0];
        set((state) => ({
          habits: state.habits.map(habit => {
            if (habit.id === habitId) {
              const isCompleted = habit.completedDates.includes(today);
              let newCompletedDates = [...habit.completedDates];
              let newStreak = habit.streak;
              
              if (isCompleted) {
                // Remove today's completion
                newCompletedDates = newCompletedDates.filter(d => d !== today);
                // Decrease streak if it was consecutive
                if (habit.streak > 0) {
                  newStreak = Math.max(0, habit.streak - 1);
                }
              } else {
                // Add today's completion
                newCompletedDates.push(today);
                // Increase streak
                newStreak = habit.streak + 1;
              }
              
              return {
                ...habit,
                completedDates: newCompletedDates,
                streak: newStreak,
              };
            }
            return habit;
          }),
          notifications: [
            ...state.notifications,
            {
              id: Date.now(),
              type: 'success',
              message: `Habit ${state.habits.find(h => h.id === habitId)?.title} ${state.habits.find(h => h.id === habitId)?.completedDates.includes(today) ? 'unchecked' : 'completed'}`,
              timestamp: new Date().toISOString(),
            }
          ].slice(-5), // Keep only last 5 notifications
        }));
      },
      
      addHabit: (habit) => {
        const newHabit = {
          ...habit,
          id: Date.now().toString(),
          completedDates: [],
          streak: 0,
          createdAt: new Date().toISOString().split('T')[0],
        };
        set((state) => ({
          habits: [...state.habits, newHabit],
          notifications: [
            ...state.notifications,
            {
              id: Date.now(),
              type: 'info',
              message: `Added new habit: ${habit.title}`,
              timestamp: new Date().toISOString(),
            }
          ].slice(-5),
        }));
      },
      
      deleteHabit: (habitId) => {
        set((state) => ({
          habits: state.habits.filter(h => h.id !== habitId),
          notifications: [
            ...state.notifications,
            {
              id: Date.now(),
              type: 'warning',
              message: 'Habit deleted',
              timestamp: new Date().toISOString(),
            }
          ].slice(-5),
        }));
      },
      
      updateHabit: (habitId, updates) => {
        set((state) => ({
          habits: state.habits.map(h => 
            h.id === habitId ? { ...h, ...updates } : h
          ),
        }));
      },
      
      addSleepEntry: (entry) => {
        set((state) => ({
          sleepData: [...state.sleepData, entry],
        }));
      },
      
      clearNotification: (notificationId) => {
        set((state) => ({
          notifications: state.notifications.filter(n => n.id !== notificationId),
        }));
      },
      
      setSelectedDate: (date) => {
        set({ selectedDate: date });
      },
    }),
    {
      name: 'habit-tracker-storage',
      partialize: (state) => ({ 
        habits: state.habits,
        sleepData: state.sleepData,
      }),
    }
  )
);