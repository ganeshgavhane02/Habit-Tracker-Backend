import { motion } from 'framer-motion'
import { useState } from 'react'

const ScrollIndicator = () => {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.5 }}
      className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20"
    >
      <div
        className="flex flex-col items-center cursor-pointer"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => window.scrollBy({ top: window.innerHeight, behavior: 'smooth' })}
      >
        <motion.span
          animate={{ y: hovered ? 10 : 0 }}
          className="text-text-tertiary text-sm font-mono tracking-widest mb-4"
        >
          EXPLORE
        </motion.span>
        <motion.div
          animate={{ height: hovered ? 40 : 60 }}
          className="w-px bg-gradient-to-b from-primary-500 to-transparent"
        />
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-3 h-3 rounded-full bg-primary-500 mt-2"
        />
      </div>
    </motion.div>
  )
}

export default ScrollIndicator