import React, { useEffect, useRef, useState } from 'react'
import { motion, useInView, animate } from 'framer-motion'
import { TOOLS, CATEGORIES } from '../../data/tools'
import { useReducedMotion } from '../../hooks/useReducedMotion'

interface NumberCounterProps {
  to: number
  suffix?: string
  duration?: number
}

const NumberCounter: React.FC<NumberCounterProps> = ({ to, suffix = '', duration = 1.2 }) => {
  const [displayValue, setDisplayValue] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 'some' })
  const prefersReduced = useReducedMotion()

  useEffect(() => {
    if (prefersReduced) {
      setDisplayValue(to)
      return
    }

    if (!inView) return

    let startTime: number | null = null
    let animationFrameId: number

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1)
      const easedProgress = 1 - Math.pow(1 - progress, 3)
      setDisplayValue(Math.round(easedProgress * to))

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step)
      } else {
        setDisplayValue(to)
      }
    }

    animationFrameId = requestAnimationFrame(step)
    const timer = setTimeout(() => setDisplayValue(to), duration * 1000 + 100)

    return () => {
      cancelAnimationFrame(animationFrameId)
      clearTimeout(timer)
    }
  }, [inView, to, duration, prefersReduced])

  return (
    <span ref={ref}>
      {displayValue}
      {suffix}
    </span>
  )
}

export const StatsSection: React.FC = () => {
  const toolCount = TOOLS.length // 43
  const catCount = Object.keys(CATEGORIES).length // 7

  return (
    <section className="py-14 relative border-y border-slate-200/80 dark:border-slate-800/80 bg-white/60 dark:bg-[#0B0F19]/60 backdrop-blur-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6"
        >
          {/* Stat 1: Real Total Tools */}
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            className="text-center p-6 rounded-2xl bg-white dark:bg-[#131B2E] border border-slate-200/90 dark:border-slate-800 shadow-2xs dark:shadow-black/20 hover:border-indigo-300 dark:hover:border-indigo-500/40 hover:shadow-lg dark:hover:shadow-indigo-950/30 transition-all"
          >
            <span className="text-3xl sm:text-5xl font-black font-mono tracking-tight text-indigo-600 dark:text-indigo-400 block">
              <NumberCounter to={toolCount} />
            </span>
            <span className="text-sm font-bold text-slate-900 dark:text-white mt-2 block">
              Precision Utilities
            </span>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Vehicles, Civil, Solar, Land, Salary & Cheque
            </p>
          </motion.div>

          {/* Stat 2: Real Categories */}
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            className="text-center p-6 rounded-2xl bg-white dark:bg-[#131B2E] border border-slate-200/90 dark:border-slate-800 shadow-2xs dark:shadow-black/20 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-lg dark:hover:shadow-black/30 transition-all"
          >
            <span className="text-3xl sm:text-5xl font-black font-mono tracking-tight text-slate-900 dark:text-white block">
              <NumberCounter to={catCount} />
            </span>
            <span className="text-sm font-bold text-slate-900 dark:text-white mt-2 block">
              Essential Categories
            </span>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Drive, Build, Power, Money, Land, Work, Create
            </p>
          </motion.div>

          {/* Stat 3: 100% Browser-Side Privacy */}
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            className="text-center p-6 rounded-2xl bg-white dark:bg-[#131B2E] border border-slate-200/90 dark:border-slate-800 shadow-2xs dark:shadow-black/20 hover:border-emerald-300 dark:hover:border-emerald-500/40 hover:shadow-lg dark:hover:shadow-emerald-950/30 transition-all"
          >
            <span className="text-3xl sm:text-5xl font-black font-mono tracking-tight text-emerald-600 dark:text-emerald-400 block">
              <NumberCounter to={100} suffix="%" />
            </span>
            <span className="text-sm font-bold text-slate-900 dark:text-white mt-2 block">
              Client-Side Privacy
            </span>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Zero cloud upload for photos or calculations
            </p>
          </motion.div>

          {/* Stat 4: 13 Regional Languages */}
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            className="text-center p-6 rounded-2xl bg-white dark:bg-[#131B2E] border border-slate-200/90 dark:border-slate-800 shadow-2xs dark:shadow-black/20 hover:border-teal-300 dark:hover:border-teal-500/40 hover:shadow-lg dark:hover:shadow-teal-950/30 transition-all"
          >
            <span className="text-3xl sm:text-5xl font-black font-mono tracking-tight text-teal-600 dark:text-teal-400 block">
              <NumberCounter to={13} />
            </span>
            <span className="text-sm font-bold text-slate-900 dark:text-white mt-2 block">
              Indian Languages
            </span>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Real-time regional cheque script conversion
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
