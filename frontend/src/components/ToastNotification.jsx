import { motion, AnimatePresence } from 'framer-motion';
import { useHabitStore } from '../stores/habitStore';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { useEffect, useState } from 'react';

const ToastNotification = () => {
  const { notifications, clearNotification } = useHabitStore();
  const [visibleNotifications, setVisibleNotifications] = useState([]);

  useEffect(() => {
    setVisibleNotifications(notifications);
  }, [notifications]);

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="text-green-400" size={20} />;
      case 'warning':
        return <AlertCircle className="text-yellow-400" size={20} />;
      case 'error':
        return <AlertCircle className="text-red-400" size={20} />;
      default:
        return <Info className="text-blue-400" size={20} />;
    }
  };

  const getBgColor = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-500/10 border-green-500/20';
      case 'warning':
        return 'bg-yellow-500/10 border-yellow-500/20';
      case 'error':
        return 'bg-red-500/10 border-red-500/20';
      default:
        return 'bg-blue-500/10 border-blue-500/20';
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 space-y-3">
      <AnimatePresence>
        {visibleNotifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, transition: { duration: 0.2 } }}
            className={`glass-panel border ${getBgColor(notification.type)} p-4 min-w-[300px] max-w-md`}
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                {getIcon(notification.type)}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-text-primary">
                  {notification.message}
                </p>
                <p className="text-xs text-text-tertiary mt-1">
                  {new Date(notification.timestamp).toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>
              <button
                onClick={() => clearNotification(notification.id)}
                className="p-1 rounded-lg hover:bg-surface/30 transition-colors"
              >
                <X size={16} className="text-text-tertiary" />
              </button>
            </div>
            
            {/* Auto-dismiss progress bar */}
            <motion.div
              className="h-0.5 bg-gradient-to-r from-primary to-accent rounded-full mt-3"
              initial={{ width: '100%' }}
              animate={{ width: '0%' }}
              transition={{ duration: 5, ease: 'linear' }}
              onAnimationComplete={() => {
                setTimeout(() => {
                  clearNotification(notification.id);
                }, 300);
              }}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ToastNotification;