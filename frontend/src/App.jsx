import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, Component } from 'react';
import Scene from './components/Scene';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ParticleSystem from './components/ParticleSystem';
import MouseLight from './components/MouseLight';
import ScrollManager from './components/ScrollManager';
import ScrollIndicator from './components/ScrollIndicator';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-8">
          <div className="glass-panel p-8 max-w-2xl">
            <h2 className="heading-2 text-primary mb-4">Something went wrong</h2>
            <p className="body-large text-text-secondary mb-6">
              The website encountered an error. Please refresh the page.
            </p>
            <pre className="bg-surface-50 p-4 rounded-lg overflow-auto text-sm text-text-tertiary">
              {this.state.error?.toString()}
            </pre>
            <button
              className="btn-primary mt-6"
              onClick={() => window.location.reload()}
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const racingStats = [
    { 
      label: 'Race Starts', 
      value: '104', 
      change: '+22', 
      color: 'from-primary-500 to-primary-700',
      icon: '🏁',
      description: 'Total Formula 1 race starts'
    },
    { 
      label: 'Podium Finishes', 
      value: '6', 
      change: '+2', 
      color: 'from-yellow-500 to-yellow-700',
      icon: '🏆',
      description: 'Career podium finishes'
    },
    { 
      label: 'Points Scored', 
      value: '568', 
      change: '+124', 
      color: 'from-accent-500 to-accent-700',
      icon: '📊',
      description: 'Total championship points'
    },
    { 
      label: 'Fastest Laps', 
      value: '3', 
      change: '+1', 
      color: 'from-green-500 to-green-700',
      icon: '⚡',
      description: 'Career fastest laps'
    },
  ];

  const careerHighlights = [
    {
      year: '2024',
      title: 'Miami Grand Prix Victory',
      description: 'First Formula 1 victory at the Miami International Autodrome',
      color: 'border-l-primary-500'
    },
    {
      year: '2023',
      title: 'Multiple Podium Finishes',
      description: 'Achieved 6 podium finishes including Silverstone and Singapore',
      color: 'border-l-accent-500'
    },
    {
      year: '2022',
      title: 'First Pole Position',
      description: 'Secured first career pole position at the Russian Grand Prix',
      color: 'border-l-yellow-500'
    },
    {
      year: '2021',
      title: 'Maiden Podium',
      description: 'First podium finish at the Emilia Romagna Grand Prix',
      color: 'border-l-green-500'
    },
  ];

  return (
    <ErrorBoundary>
      <div className="relative w-full min-h-screen bg-background overflow-x-hidden">
      {/* 3D Canvas Background */}
      <Canvas
        className="fixed top-0 left-0 z-[-2]"
        camera={{ position: [0, 0, 8], fov: 50 }}
        shadows
      >
        <Scene />
        <ScrollManager />
        <ParticleSystem />
        <MouseLight />
        <Environment preset="city" />
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>

      {/* Main Layout */}
      <div className="relative z-10">
        {/* Navigation */}
        <Navbar isScrolled={isScrolled} activeSection={activeSection} setActiveSection={setActiveSection} />

        {/* Hero Section */}
        <Hero />

        {/* Stats Section */}
        <section className="py-20 px-4 parallax-section">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="heading-2 mb-6">Racing Statistics</h2>
              <p className="body-large text-text-secondary max-w-3xl mx-auto">
                Career achievements and performance metrics from Landon Norris's Formula 1 journey
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
              {racingStats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="glass-panel p-6 relative overflow-hidden group hover-lift float-element"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -8 }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                  
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-5">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white text-xl shadow-glow`}>
                        {stat.icon}
                      </div>
                      <div className="text-right">
                        <div className="caption">Increase</div>
                        <div className="text-sm font-bold text-green-400">{stat.change}</div>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-text-primary mb-1">{stat.label}</h3>
                      <p className="body-small text-text-secondary">{stat.description}</p>
                    </div>
                    
                    <div className="flex items-end justify-between">
                      <div className="text-3xl font-bold text-text-primary">{stat.value}</div>
                      <div className="text-xs font-mono text-text-tertiary">↑</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Career Timeline */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="glass-panel p-8"
            >
              <h3 className="heading-3 mb-8">Career Highlights</h3>
              <div className="space-y-6">
                {careerHighlights.map((highlight, index) => (
                  <motion.div
                    key={highlight.year}
                    className={`pl-6 ${highlight.color} border-l-4 py-4`}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-xl bg-surface-glass flex items-center justify-center">
                        <span className="text-2xl font-bold text-text-primary">{highlight.year}</span>
                      </div>
                      <div>
                        <h4 className="text-xl font-semibold text-text-primary mb-2">{highlight.title}</h4>
                        <p className="text-text-secondary">{highlight.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Gallery Preview */}
        <section className="py-20 px-4 parallax-section">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="heading-2 mb-6">Gallery</h2>
              <p className="body-large text-text-secondary max-w-3xl mx-auto">
                Behind the scenes and racing moments from the track
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: 'Victory Celebration', desc: 'Miami GP 2024', color: 'bg-primary/20' },
                { title: 'Qualifying Lap', desc: 'Monza 2023', color: 'bg-accent/20' },
                { title: 'Team Strategy', desc: 'McLaren Garage', color: 'bg-surface-glass' },
              ].map((item, index) => (
                <motion.div
                  key={item.title}
                  className="glass-panel p-6 aspect-video flex flex-col justify-end relative overflow-hidden group"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className={`absolute inset-0 ${item.color} opacity-50`} />
                  <div className="relative z-10">
                    <h4 className="text-xl font-semibold text-text-primary mb-2">{item.title}</h4>
                    <p className="text-text-secondary">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-4 border-t border-surface-border">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold text-lg">
                    LN
                  </div>
                  <div>
                    <div className="text-lg font-bold text-text-primary">LANDON NORRIS</div>
                    <div className="text-xs text-text-tertiary font-mono">Official Website</div>
                  </div>
                </div>
                <p className="text-text-secondary max-w-md">
                  British racing driver for McLaren Formula 1 Team. 
                  This is the official fan website showcasing career highlights and statistics.
                </p>
              </div>

              <div className="flex gap-4">
                <motion.a
                  href="#"
                  className="w-12 h-12 rounded-xl bg-surface-glass border border-surface-border flex items-center justify-center text-text-primary"
                  whileHover={{ scale: 1.1, backgroundColor: '#1DA1F2' }}
                  whileTap={{ scale: 0.9 }}
                >
                  𝕏
                </motion.a>
                <motion.a
                  href="#"
                  className="w-12 h-12 rounded-xl bg-surface-glass border border-surface-border flex items-center justify-center text-text-primary"
                  whileHover={{ scale: 1.1, backgroundColor: '#E4405F' }}
                  whileTap={{ scale: 0.9 }}
                >
                  📷
                </motion.a>
                <motion.a
                  href="#"
                  className="w-12 h-12 rounded-xl bg-surface-glass border border-surface-border flex items-center justify-center text-text-primary"
                  whileHover={{ scale: 1.1, backgroundColor: '#FF0000' }}
                  whileTap={{ scale: 0.9 }}
                >
                  ▶️
                </motion.a>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-surface-border text-center text-text-tertiary text-sm">
              <p>© {new Date().getFullYear()} Landon Norris. This is a fan-made website for demonstration purposes.</p>
              <p className="mt-2">All Formula 1 imagery and trademarks are property of their respective owners.</p>
            </div>
          </div>
        </footer>

        {/* Scroll Indicator */}
        <ScrollIndicator />
      </div>
    </div>
    </ErrorBoundary>
  );
}

export default App;