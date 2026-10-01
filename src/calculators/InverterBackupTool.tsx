import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { BatteryCharging, Zap, Clock, ShieldCheck, CheckCircle2 } from 'lucide-react'
import { calculateInverterBackup, InverterResult } from '../lib/calculations'
import { ToolPageLayout } from '../components/tools/ToolPageLayout'
import { getToolBySlug } from '../data/tools'

export const InverterBackupTool: React.FC = () => {
  const tool = getToolBySlug('inverter-backup')!

  const [loadWatts, setLoadWatts] = useState<number>(250)
  const [batteryAh, setBatteryAh] = useState<number>(150)
  const [batteryVoltage, setBatteryVoltage] = useState<number>(12)
  const [batteryType, setBatteryType] = useState<'tubular' | 'lithium'>('tubular')

  const results: InverterResult = useMemo(() => {
    const dod = batteryType === 'lithium' ? 95 : 80
    return calculateInverterBackup(loadWatts, batteryAh, batteryVoltage, 85, dod)
  }, [loadWatts, batteryAh, batteryVoltage, batteryType])

  const handleReset = () => {
    setLoadWatts(250)
    setBatteryAh(150)
    setBatteryVoltage(12)
    setBatteryType('tubular')
  }

  const getResultSummary = () => {
    return `Inverter Battery Backup Analysis:
Connected Load: ${loadWatts} Watts | Battery: ${batteryAh}Ah (${batteryVoltage}V ${batteryType.toUpperCase()})
- Backup Duration: ${results.backupMinutesFormatted} (${results.backupHours} hours)
- Usable Stored Energy: ${results.usableWattHours} Watt-hours
- Battery DC Draw: ${results.dcAmpsDraw} Amps
- Assessment: ${results.recommendedUsage}
Calculated on IndiaTools`
  }

  return (
    <ToolPageLayout tool={tool} onReset={handleReset} onCopyResult={getResultSummary}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Inputs */}
        <div className="lg:col-span-6 p-6 sm:p-7 rounded-2xl bg-neutral-900/80 light:bg-white border border-neutral-800 light:border-slate-200 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-800 light:border-slate-100">
            <h2 className="text-base font-bold text-white light:text-slate-900 flex items-center gap-2">
              <BatteryCharging className="w-5 h-5 text-sky-500" />
              <span>Inverter & Battery Sizing</span>
            </h2>
            <span className="text-xs font-mono text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
              85% Efficiency Factored
            </span>
          </div>

          {/* Running Power Load */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-mono uppercase tracking-wider text-neutral-400 light:text-slate-600">
                Total Connected Load (Watts)
              </label>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min="20"
                  max="4000"
                  value={loadWatts || ''}
                  onChange={(e) => setLoadWatts(parseInt(e.target.value) || 0)}
                  className="w-24 bg-neutral-950 light:bg-slate-50 border border-neutral-700 light:border-slate-300 rounded-lg px-2.5 py-1 text-sm font-mono text-right text-sky-400 font-bold focus:outline-none focus:border-sky-500"
                />
                <span className="text-xs text-neutral-400 font-mono">Watts</span>
              </div>
            </div>
            <input
              type="range"
              min="50"
              max="1200"
              step="25"
              value={loadWatts}
              onChange={(e) => setLoadWatts(parseInt(e.target.value))}
              className="w-full accent-sky-500 cursor-pointer"
            />
            {/* Quick load presets */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              <button
                type="button"
                onClick={() => setLoadWatts(120)}
                className="px-2 py-0.5 rounded bg-neutral-800 text-[11px] text-neutral-300 hover:text-white"
              >
                1 Fan + 2 Lights (120W)
              </button>
              <button
                type="button"
                onClick={() => setLoadWatts(250)}
                className="px-2 py-0.5 rounded bg-neutral-800 text-[11px] text-neutral-300 hover:text-white"
              >
                3 Fans + TV + Wi-Fi (250W)
              </button>
              <button
                type="button"
                onClick={() => setLoadWatts(550)}
                className="px-2 py-0.5 rounded bg-neutral-800 text-[11px] text-neutral-300 hover:text-white"
              >
                Full House + PC (550W)
              </button>
            </div>
          </div>

          {/* Battery Ah Selection */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 light:text-slate-600 mb-2">
              Battery Capacity (Ah)
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[100, 150, 180, 200].map((ah) => (
                <button
                  key={ah}
                  type="button"
                  onClick={() => setBatteryAh(ah)}
                  className={`py-2 px-1 text-center rounded-xl text-xs font-bold border transition-colors ${
                    batteryAh === ah
                      ? 'bg-sky-500/20 text-sky-400 border-sky-500/50'
                      : 'bg-neutral-950 light:bg-slate-100 text-neutral-300 light:text-slate-700 border-neutral-700'
                  }`}
                >
                  {ah} Ah
                </button>
              ))}
            </div>
          </div>

          {/* Voltage & Chemistry Selection */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 light:text-slate-600 mb-1.5">
                Inverter System Voltage
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setBatteryVoltage(12)}
                  className={`flex-1 py-2 rounded-xl text-xs font-semibold border ${
                    batteryVoltage === 12
                      ? 'bg-sky-500/20 text-sky-400 border-sky-500/50'
                      : 'bg-neutral-950 border-neutral-700 text-neutral-400'
                  }`}
                >
                  12V (1 Battery)
                </button>
                <button
                  type="button"
                  onClick={() => setBatteryVoltage(24)}
                  className={`flex-1 py-2 rounded-xl text-xs font-semibold border ${
                    batteryVoltage === 24
                      ? 'bg-sky-500/20 text-sky-400 border-sky-500/50'
                      : 'bg-neutral-950 border-neutral-700 text-neutral-400'
                  }`}
                >
                  24V (2 Batteries)
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 light:text-slate-600 mb-1.5">
                Battery Chemistry
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setBatteryType('tubular')}
                  className={`flex-1 py-2 rounded-xl text-xs font-semibold border ${
                    batteryType === 'tubular'
                      ? 'bg-sky-500/20 text-sky-400 border-sky-500/50'
                      : 'bg-neutral-950 border-neutral-700 text-neutral-400'
                  }`}
                >
                  Tubular (80% DoD)
                </button>
                <button
                  type="button"
                  onClick={() => setBatteryType('lithium')}
                  className={`flex-1 py-2 rounded-xl text-xs font-semibold border ${
                    batteryType === 'lithium'
                      ? 'bg-sky-500/20 text-sky-400 border-sky-500/50'
                      : 'bg-neutral-950 border-neutral-700 text-neutral-400'
                  }`}
                >
                  Lithium (95% DoD)
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Results */}
        <div className="lg:col-span-6 space-y-4">
          <motion.div
            layout
            className="p-6 sm:p-7 rounded-2xl bg-gradient-to-br from-neutral-900 via-neutral-900 to-sky-950/30 border border-sky-500/30 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono uppercase tracking-wider text-sky-400 font-semibold flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                <span>Backup Duration</span>
              </span>
              <span className="text-xs font-bold text-neutral-400">
                {batteryAh}Ah @ {loadWatts}W Load
              </span>
            </div>

            {/* Time Headline */}
            <div className="mb-6 pb-6 border-b border-neutral-800">
              <span className="text-xs text-neutral-400 block font-medium">Estimated Power Cut Endurance</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl sm:text-5xl font-black tracking-tight text-white">
                  {results.backupMinutesFormatted}
                </span>
              </div>
              <p className="mt-2 text-xs text-sky-300/90 font-mono">
                {results.recommendedUsage}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="p-3.5 rounded-xl bg-neutral-950/70 border border-neutral-800/90">
                <div className="flex items-center gap-1.5 text-xs text-neutral-400 mb-1">
                  <Zap className="w-3.5 h-3.5 text-sky-400" />
                  <span>Usable Energy</span>
                </div>
                <p className="text-lg sm:text-xl font-bold text-white font-mono">
                  {results.usableWattHours} Wh
                </p>
                <span className="text-[11px] text-neutral-400">Watt-hours</span>
              </div>

              <div className="p-3.5 rounded-xl bg-neutral-950/70 border border-neutral-800/90">
                <div className="flex items-center gap-1.5 text-xs text-neutral-400 mb-1">
                  <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" />
                  <span>DC Battery Draw</span>
                </div>
                <p className="text-lg sm:text-xl font-bold text-white font-mono">
                  {results.dcAmpsDraw} A
                </p>
                <span className="text-[11px] text-neutral-400">Current draw</span>
              </div>
            </div>

            <div className="mt-5 p-3.5 rounded-xl bg-neutral-950/80 border border-neutral-800 flex items-center justify-between text-xs">
              <span className="text-neutral-400">Longevity Recommendation:</span>
              <span className="font-bold text-emerald-400 text-xs">
                {batteryType === 'tubular' ? 'Keep topped with distilled water' : 'Maintenance-free LiFePO4'}
              </span>
            </div>
          </motion.div>

          <div className="p-4 rounded-xl bg-neutral-900/50 light:bg-slate-100 border border-neutral-800 light:border-slate-200 text-xs text-neutral-400 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <p>
              Avoid running heating elements (mixers, geysers, electric irons) on standard home inverters, as their 1,000W+ surge instantly triggers battery overload.
            </p>
          </div>
        </div>
      </div>
    </ToolPageLayout>
  )
}
