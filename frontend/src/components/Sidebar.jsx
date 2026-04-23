import { motion } from 'framer-motion';
import { useState } from 'react';
import { 
  Home, 
  BarChart3, 
  Target, 
  Moon, 
  Settings, 
  User,
  Calendar,
  TrendingUp,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState('dashboard');

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <Home size={20} /> },
    { id: 'habits', label: 'Habits', icon: <Target size={20} /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={20} /> },
    { id: 'sleep', label: 'Sleep Tracker', icon: <Moon size={20} /> },
    { id: 'calendar', label: 'Calendar', icon: <Calendar size={20} /> },
    { id: 'trends', label: 'Trends', icon: <TrendingUp size={20} /> },
    { id: 'profile', label: 'Profile', icon: <User size={20} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
  ];

  const containerVariants = {
    expanded: { width: 280 },
    collapsed: { width: 80 },
  };

  const textVariants = {
    expanded: { opacity: 1, display: 'block' },
    collapsed: { opacity: 0, display: 'none' },
  };

  return (
    <motion.aside
      className="h-screen glass-panel flex flex-col py-6"
      initial={false}
      animate={collapsed ? 'collapsed' : 'expanded'}
      variants={containerVariants}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      {/* Logo */}
      <div className="px-6 mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-accent-500 flex items-center justify-center">
            <Target size={24} className="text-white" />
          </div>
          <motion.div
            variants={textVariants}
            className="flex flex-col"
          >
            <span className="font-display font-bold text-xl tracking-tight">HabitFlow</span>
            <span className="text-xs text-text-tertiary">Premium Tracker</span>
          </motion.div>
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg hover:bg-surface/30 transition-colors"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.id}>
              <motion.button
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  activeItem === item.id
                    ? 'bg-primary/20 text-primary border-l-4 border-primary'
                    : 'text-text-secondary hover:bg-surface/30 hover:text-text-primary'
                }`}
                onClick={() => setActiveItem(item.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className={`${activeItem === item.id ? 'text-primary' : 'text-text-tertiary'}`}>
                  {item.icon}
                </div>
                <motion.span
                  variants={textVariants}
                  className="font-medium text-sm"
                >
                  {item.label}
                </motion.span>
              </motion.button>
            </li>
          ))}
        </ul>
      </nav>

      {/* User Profile */}
      <motion.div 
        className="px-4 pt-6 border-t border-surface-border"
        variants={textVariants}
      >
        <div className="glass-card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-400 flex items-center justify-center">
            <span className="font-bold text-white">JG</span>
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-text-primary">John Ganesh</h4>
            <p className="text-xs text-text-tertiary">42 day streak</p>
          </div>
        </div>
      </motion.div>

      {/* Collapse hint */}
      <div className="px-6 pt-4">
        <p className="text-xs text-text-tertiary text-center">
          {collapsed ? 'Expand' : 'Collapse'} sidebar
        </p>
      </div>
    </motion.aside>
  );
};

export default Sidebar;