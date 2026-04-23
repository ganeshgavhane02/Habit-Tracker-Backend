import { motion } from 'framer-motion';
import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls, PerspectiveCamera } from '@react-three/drei';
import Helmet3D from './Helmet3D';

const Hero = () => {
  const [hoveredButton, setHoveredButton] = useState(null);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 px-4">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000" />
        
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `linear-gradient(to right, #8882 1px, transparent 1px),
                           linear-gradient(to bottom, #8882 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="text-left"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-glass border border-surface-border mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-sm font-mono text-text-primary">FORMULA 1 • MCLAREN</span>
              <span className="text-xs text-text-tertiary ml-2">#4</span>
            </motion.div>

            {/* Main Heading */}
            <h1 className="heading-1 mb-6">
              <span className="block">LANDON</span>
              <span className="gradient-text">NORRIS</span>
              <span className="block">RACING PROTOCOL</span>
            </h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="body-large text-text-secondary mb-10 max-w-2xl"
            >
              British racing driver for McLaren Formula 1 Team. 
              Experience the thrill of speed, precision engineering, and cutting-edge 
              performance through an immersive 3D dashboard.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap gap-4 mb-12"
            >
              <motion.button
                className="btn-primary text-lg px-8 py-4 flex items-center gap-3"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onHoverStart={() => setHoveredButton('primary')}
                onHoverEnd={() => setHoveredButton(null)}
              >
                <span className="text-xl">🏎️</span>
                View Racing Stats
                <motion.span
                  animate={{ x: hoveredButton === 'primary' ? 5 : 0 }}
                  transition={{ type: 'spring', stiffness: 400 }}
                >
                  →
                </motion.span>
              </motion.button>

              <motion.button
                className="btn-secondary text-lg px-8 py-4 flex items-center gap-3"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onHoverStart={() => setHoveredButton('secondary')}
                onHoverEnd={() => setHoveredButton(null)}
              >
                <span className="text-xl">🎥</span>
                Watch Highlights
                <span className="text-text-tertiary">(2:18)</span>
              </motion.button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex flex-wrap gap-8"
            >
              {[
                { value: '6', label: 'Podium Finishes', icon: '🏆' },
                { value: '1', label: 'Race Wins', icon: '🥇' },
                { value: '8', label: 'Pole Positions', icon: '🚩' },
                { value: '500+', label: 'Points Scored', icon: '📊' },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 + index * 0.1 }}
                >
                  <div className="text-2xl">{stat.icon}</div>
                  <div>
                    <div className="text-2xl font-bold text-text-primary">{stat.value}</div>
                    <div className="text-sm text-text-tertiary">{stat.label}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Column - 3D Helmet */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative h-[600px] lg:h-[700px]"
          >
            <Canvas
              shadows
              className="rounded-3xl overflow-hidden glass-panel"
            >
              <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50} />
              <ambientLight intensity={0.5} />
              <pointLight position={[10, 10, 10]} intensity={1} color="#FF5800" />
              <pointLight position={[-10, -10, -10]} intensity={0.5} color="#004BA8" />
              
              <Helmet3D position={[0, 0, 0]} scale={1.2} rotationSpeed={0.003} />
              
              <Environment preset="city" />
              <OrbitControls
                enableZoom={false}
                enablePan={false}
                autoRotate
                autoRotateSpeed={0.5}
                maxPolarAngle={Math.PI / 2}
                minPolarAngle={Math.PI / 2}
              />
            </Canvas>

            {/* Floating Badges */}
            <motion.div
              className="absolute -top-4 -right-4 glass-card px-4 py-2 flex items-center gap-2"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <span className="text-xl">⚡</span>
              <span className="font-mono text-sm text-text-primary">Interactive 3D</span>
            </motion.div>

            <motion.div
              className="absolute -bottom-4 -left-4 glass-card px-4 py-2 flex items-center gap-2"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
            >
              <span className="text-xl">🎮</span>
              <span className="font-mono text-sm text-text-primary">Drag to Rotate</span>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="text-text-tertiary text-sm mb-2">Scroll to explore career</span>
          <div className="w-6 h-10 rounded-full border-2 border-surface-border flex justify-center">
            <div className="w-1 h-3 bg-text-tertiary rounded-full mt-2" />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;