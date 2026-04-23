import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

const Navbar = ({ isScrolled, activeSection, setActiveSection }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState('dark');

  const navItems = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'career', label: 'Career', icon: '🏎️' },
    { id: 'stats', label: 'Statistics', icon: '📊' },
    { id: 'gallery', label: 'Gallery', icon: '📸' },
    { id: 'merch', label: 'Merchandise', icon: '👕' },
    { id: 'contact', label: 'Contact', icon: '📞' },
  ];

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className={`fixed top-0 left-0 w-full z-50 px-6 py-4 transition-all duration-300 ${
          isScrolled 
            ? 'bg-background/90 backdrop-blur-xl border-b border-surface-border' 
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Logo */}
          <motion.div 
            className="flex items-center gap-3"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold text-lg">
              LN
            </div>
            <div>
              <div className="text-lg font-bold text-text-primary tracking-tight">LANDON NORRIS</div>
              <div className="text-xs text-text-tertiary font-mono">McLaren Formula 1 Driver</div>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <motion.button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                  activeSection === item.id
                    ? 'bg-primary/20 text-primary border border-primary/30'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface/30'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
              </motion.button>
            ))}
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-4">
            {/* Theme toggle */}
            <motion.button
              onClick={toggleTheme}
              className="w-10 h-10 rounded-xl bg-surface-glass border border-surface-border flex items-center justify-center text-text-primary"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {theme === 'dark' ? '🌙' : '☀️'}
            </motion.button>

            {/* Social links */}
            <div className="hidden md:flex items-center gap-2">
              <motion.a
                href="https://twitter.com/LandoNorris"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-surface-glass border border-surface-border flex items-center justify-center text-text-primary"
                whileHover={{ scale: 1.1, backgroundColor: '#1DA1F2' }}
                whileTap={{ scale: 0.9 }}
              >
                𝕏
              </motion.a>
              <motion.a
                href="https://instagram.com/landonorris"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-surface-glass border border-surface-border flex items-center justify-center text-text-primary"
                whileHover={{ scale: 1.1, backgroundColor: '#E4405F' }}
                whileTap={{ scale: 0.9 }}
              >
                📷
              </motion.a>
            </div>

            {/* Mobile menu button */}
            <motion.button
              onClick={toggleMobileMenu}
              className="md:hidden w-10 h-10 rounded-xl bg-surface-glass border border-surface-border flex items-center justify-center text-text-primary"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {isMobileMenuOpen ? '✕' : '☰'}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-4 overflow-hidden"
            >
              <div className="glass-panel p-4 rounded-2xl">
                <div className="grid grid-cols-2 gap-2">
                  {navItems.map((item) => (
                    <motion.button
                      key={item.id}
                      onClick={() => {
                        setActiveSection(item.id);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                        activeSection === item.id
                          ? 'bg-primary/20 text-primary border border-primary/30'
                          : 'text-text-secondary hover:text-text-primary hover:bg-surface/30'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className="text-lg">{item.icon}</span>
                      {item.label}
                    </motion.button>
                  ))}
                </div>
                
                {/* Mobile social links */}
                <div className="flex justify-center gap-4 mt-6 pt-6 border-t border-surface-border">
                  <motion.a
                    href="https://twitter.com/LandoNorris"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-xl bg-surface-glass border border-surface-border flex items-center justify-center text-text-primary text-lg"
                    whileHover={{ scale: 1.1, backgroundColor: '#1DA1F2' }}
                    whileTap={{ scale: 0.9 }}
                  >
                    𝕏
                  </motion.a>
                  <motion.a
                    href="https://instagram.com/landonorris"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-xl bg-surface-glass border border-surface-border flex items-center justify-center text-text-primary text-lg"
                    whileHover={{ scale: 1.1, backgroundColor: '#E4405F' }}
                    whileTap={{ scale: 0.9 }}
                  >
                    📷
                  </motion.a>
                  <motion.a
                    href="https://youtube.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-xl bg-surface-glass border border-surface-border flex items-center justify-center text-text-primary text-lg"
                    whileHover={{ scale: 1.1, backgroundColor: '#FF0000' }}
                    whileTap={{ scale: 0.9 }}
                  >
                    ▶️
                  </motion.a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Racing stripe effect */}
      <motion.div 
        className="absolute top-0 left-0 w-full h-1 z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="h-full bg-gradient-to-r from-transparent via-primary-500 to-transparent racing-stripe" />
      </motion.div>
    </>
  );
};

export default Navbar;