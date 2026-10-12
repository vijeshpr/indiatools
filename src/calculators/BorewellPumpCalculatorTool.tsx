import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  Droplet,
  Zap,
  Gauge,
  Layers,
  ArrowRight,
  ShieldAlert,
  ShieldCheck,
  RotateCcw,
  Sliders,
  Info,
  Clock,
  IndianRupee,
  Activity,
  Maximize2,
  Minimize2,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  TrendingDown,
  Cable,
} from 'lucide-react'
import {
  calculateBorewellPump,
  BorewellPumpInput,
  BorewellPumpResult,
  STANDARD_DELIVERY_PIPES,
  STANDARD_PUMP_HP_RATINGS,
} from '../lib/calculations'
import { ToolPageLayout } from '../components/tools/ToolPageLayout'
import { getToolBySlug } from '../data/tools'

type UnitMode = 'metric' | 'imperial'

interface PresetConfig {
  name: string
  desc: string
  data: {
    unitMode: UnitMode
    depth: number
    pumpDepth: number
    waterLevel: number
    drawdown: number
    tankHeight: number
    deliveryLength: number
    flowLpm: number
    pipeIdMm: number
    pipeMaterial: 'upvc' | 'hdpe' | 'gi'
    tariff: number
    phase: 1 | 3
    voltage: number
  }
}

const PRESETS: PresetConfig[] = [
  {
    name: 'Standard Home (200 ft)',
    desc: 'Two-floor house with overhead tank, 150–250 ft borewell, 40–50 LPM.',
    data: {
      unitMode: 'imperial',
      depth: 200,
      pumpDepth: 180,
      waterLevel: 80,
      drawdown: 30,
      tankHeight: 35,
      deliveryLength: 45,
      flowLpm: 45,
      pipeIdMm: 32,
      pipeMaterial: 'upvc',
      tariff: 6,
      phase: 1,
      voltage: 230,
    },
  },
  {
    name: 'Deep Borewell (400 ft)',
    desc: 'Apartment or deep residential borewell 350–500 ft, 60 LPM high delivery head.',
    data: {
      unitMode: 'imperial',
      depth: 400,
      pumpDepth: 360,
      waterLevel: 180,
      drawdown: 50,
      tankHeight: 45,
      deliveryLength: 60,
      flowLpm: 60,
      pipeIdMm: 32,
      pipeMaterial: 'upvc',
      tariff: 6.5,
      phase: 1,
      voltage: 230,
    },
  },
  {
    name: 'Farm / Irrigation (120 LPM)',
    desc: 'Open discharge farm / plantation irrigation, 3-phase supply, high yield.',
    data: {
      unitMode: 'imperial',
      depth: 180,
      pumpDepth: 150,
      waterLevel: 60,
      drawdown: 25,
      tankHeight: 0,
      deliveryLength: 150,
      flowLpm: 120,
      pipeIdMm: 50,
      pipeMaterial: 'hdpe',
      tariff: 5.5,
      phase: 3,
      voltage: 415,
    },
  },
]

export const BorewellPumpCalculatorTool: React.FC = () => {
  const tool = getToolBySlug('borewell-pump-calculator')!

  // Unit Mode
  const [unitMode, setUnitMode] = useState<UnitMode>('imperial')

  // User Inputs (stored in current active unit mode)
  // Depth & elevations
  const [borewellDepth, setBorewellDepth] = useState<number>(200)
  const [pumpDepth, setPumpDepth] = useState<number>(180)
  const [waterLevel, setWaterLevel] = useState<number>(80)
  const [drawdown, setDrawdown] = useState<number>(30)
  const [tankHeight, setTankHeight] = useState<number>(35)
  const [deliveryLength, setDeliveryLength] = useState<number>(45)

  // Flow & Pipe
  const [flowLpm, setFlowLpm] = useState<number>(50)
  const [pipeIdMm, setPipeIdMm] = useState<number>(32)
  const [pipeMaterial, setPipeMaterial] = useState<'upvc' | 'hdpe' | 'gi'>('upvc')
  const [bendsCount, setBendsCount] = useState<number>(3)
  const [valvesCount, setValvesCount] = useState<number>(2)

  // Efficiencies & Stages
  const [pumpEfficiencyPct, setPumpEfficiencyPct] = useState<number>(55)
  const [motorEfficiencyPct, setMotorEfficiencyPct] = useState<number>(75)
  const [headPerStageM, setHeadPerStageM] = useState<number>(6)

  // Electrical
  const [tariffInr, setTariffInr] = useState<number>(6)
  const [supplyPhase, setSupplyPhase] = useState<1 | 3>(1)
  const [supplyVoltageV, setSupplyVoltageV] = useState<number>(230)
  const [cableLengthOffset, setCableLengthOffset] = useState<number>(15) // extra lead from borewell cap to starter panel
  const [cableConductor, setCableConductor] = useState<'copper' | 'aluminium'>('copper')

  // Visual collapse toggles
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false)

  // Conversion Helpers
  const ftToM = (ft: number) => ft * 0.3048
  const mToFt = (m: number) => m * 3.28084

  // Switch Unit Mode with clean roundings
  const handleUnitToggle = (newMode: UnitMode) => {
    if (newMode === unitMode) return
    if (newMode === 'metric') {
      // Imperial -> Metric
      setBorewellDepth(Math.round(ftToM(borewellDepth)))
      setPumpDepth(Math.round(ftToM(pumpDepth)))
      setWaterLevel(Math.round(ftToM(waterLevel)))
      setDrawdown(Math.round(ftToM(drawdown)))
      setTankHeight(Math.round(ftToM(tankHeight)))
      setDeliveryLength(Math.round(ftToM(deliveryLength)))
    } else {
      // Metric -> Imperial
      setBorewellDepth(Math.round(mToFt(borewellDepth)))
      setPumpDepth(Math.round(mToFt(pumpDepth)))
      setWaterLevel(Math.round(mToFt(waterLevel)))
      setDrawdown(Math.round(mToFt(drawdown)))
      setTankHeight(Math.round(mToFt(tankHeight)))
      setDeliveryLength(Math.round(mToFt(deliveryLength)))
    }
    setUnitMode(newMode)
  }

  // Convert inputs to metric for calculation engine
  const calcInputs: BorewellPumpInput = useMemo(() => {
    const isImp = unitMode === 'imperial'
    const depthM = isImp ? ftToM(borewellDepth) : borewellDepth
    const pDepthM = isImp ? ftToM(pumpDepth) : pumpDepth
    const wLevelM = isImp ? ftToM(waterLevel) : waterLevel
    const dDownM = isImp ? ftToM(drawdown) : drawdown
    const tHeightM = isImp ? ftToM(tankHeight) : tankHeight
    const dLengthM = isImp ? ftToM(deliveryLength) : deliveryLength
    const totalCableM = pDepthM + (isImp ? ftToM(cableLengthOffset) : cableLengthOffset)

    return {
      borewellDepthM: depthM,
      pumpDepthM: pDepthM,
      waterLevelM: wLevelM,
      drawdownM: dDownM,
      tankHeightM: tHeightM,
      deliveryLengthM: dLengthM,
      flowLpm,
      pipeInternalDiameterMm: pipeIdMm,
      pipeMaterial,
      bendsCount,
      valvesCount,
      fittingsAllowancePct: 10,
      pumpEfficiencyPct,
      motorEfficiencyPct,
      headPerStageM,
      tariffInr,
      supplyPhase,
      supplyVoltageV,
      cableLengthM: totalCableM,
      cableConductor,
    }
  }, [
    unitMode,
    borewellDepth,
    pumpDepth,
    waterLevel,
    drawdown,
    tankHeight,
    deliveryLength,
    flowLpm,
    pipeIdMm,
    pipeMaterial,
    bendsCount,
    valvesCount,
    pumpEfficiencyPct,
    motorEfficiencyPct,
    headPerStageM,
    tariffInr,
    supplyPhase,
    supplyVoltageV,
    cableLengthOffset,
    cableConductor,
  ])

  const result: BorewellPumpResult = useMemo(() => {
    return calculateBorewellPump(calcInputs)
  }, [calcInputs])

  // Apply Preset
  const handleApplyPreset = (preset: PresetConfig) => {
    setUnitMode(preset.data.unitMode)
    setBorewellDepth(preset.data.depth)
    setPumpDepth(preset.data.pumpDepth)
    setWaterLevel(preset.data.waterLevel)
    setDrawdown(preset.data.drawdown)
    setTankHeight(preset.data.tankHeight)
    setDeliveryLength(preset.data.deliveryLength)
    setFlowLpm(preset.data.flowLpm)
    setPipeIdMm(preset.data.pipeIdMm)
    setPipeMaterial(preset.data.pipeMaterial)
    setTariffInr(preset.data.tariff)
    setSupplyPhase(preset.data.phase)
    setSupplyVoltageV(preset.data.voltage)
  }

  // Reset to default
  const handleReset = () => {
    handleApplyPreset(PRESETS[0])
    setBendsCount(3)
    setValvesCount(2)
    setPumpEfficiencyPct(55)
    setMotorEfficiencyPct(75)
    setHeadPerStageM(6)
    setCableLengthOffset(15)
    setCableConductor('copper')
  }

  // Summary for Clipboard
  const getResultSummary = () => {
    const unitLabel = unitMode === 'imperial' ? 'ft' : 'm'
    return `Borewell Submersible Pump & Pipe Sizing Assessment:
- Total Depth: ${borewellDepth} ${unitLabel} | Pump Installation: ${pumpDepth} ${unitLabel}
- Static Water Level: ${waterLevel} ${unitLabel} | Drawdown: ${drawdown} ${unitLabel}
- Overhead Tank Height: ${tankHeight} ${unitLabel} | Flow: ${flowLpm} LPM
----------------------------------------
- Total Dynamic Head (TDH): ${result.totalDynamicHeadM} m (${result.totalDynamicHeadFt} ft)
- Recommended Motor Rating: ${result.recommendedMotorHp ? `${result.recommendedMotorHp} HP` : `${result.requiredMotorHp} HP (Special Industrial)`}
- Hydraulic Power (Water HP): ${result.waterHp} HP
- Indicative Pump Stages: ${result.estimatedStages} Stages (~${headPerStageM}m per stage)
- Delivery Pipe Evaluation: ${result.recommendedPipeLabel} (Velocity: ${result.pipeVelocityMs} m/s)
- 1,000L Tank Filling Time: ${result.tankFillTimeMinutes} mins
- Electricity Cost / 1,000L: ₹${result.electricityCostPer1000LitreInr} (@ ₹${tariffInr}/kWh)
- Submersible Cable Recommendation: ${result.recommendedCableSqmm} sq.mm 3-core flat (${result.cableVoltageDropPct}% voltage drop)
Calculated via IndiaTools (https://indiatools-rho.vercel.app/calculators/borewell-pump-calculator)`
  }

  // Visual Borewell Proportions
  const diagramMaxDepth = Math.max(borewellDepth, pumpDepth + 10, 100)
  const getPct = (valM: number) => {
    const totalM = unitMode === 'imperial' ? ftToM(diagramMaxDepth) : diagramMaxDepth
    if (totalM <= 0) return 0
    return Math.min(95, Math.max(5, (valM / totalM) * 100))
  }

  const staticWaterPct = getPct(calcInputs.waterLevelM)
  const pumpingWaterPct = getPct(result.pumpingWaterLevelM)
  const pumpPositionPct = getPct(calcInputs.pumpDepthM)

  return (
    <ToolPageLayout tool={tool} onReset={handleReset} onCopyResult={getResultSummary} maxWidthClass="max-w-6xl">
      <div className="space-y-8">
        {/* Preset Selector Banner */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/60 dark:bg-zinc-900/60 border border-slate-800 dark:border-white/10 backdrop-blur-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300 dark:text-slate-200">
                Quick Setup Presets (Editable Benchmarks)
              </span>
            </div>
            {/* Unit Toggle */}
            <div className="inline-flex p-1 rounded-xl bg-slate-800/80 dark:bg-zinc-800/80 border border-slate-700 dark:border-zinc-700 self-end sm:self-auto">
              <button
                type="button"
                onClick={() => handleUnitToggle('imperial')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  unitMode === 'imperial'
                    ? 'bg-cyan-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Feet (ft)
              </button>
              <button
                type="button"
                onClick={() => handleUnitToggle('metric')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  unitMode === 'metric'
                    ? 'bg-cyan-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Metres (m)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {PRESETS.map((p) => (
              <button
                key={p.name}
                type="button"
                onClick={() => handleApplyPreset(p)}
                className="text-left p-3 rounded-xl bg-slate-800/40 hover:bg-slate-800/70 dark:bg-zinc-800/40 dark:hover:bg-zinc-800/70 border border-slate-700/50 dark:border-white/5 transition-all group"
              >
                <div className="text-xs font-bold text-white group-hover:text-cyan-400 transition-colors flex items-center justify-between">
                  <span>{p.name}</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-cyan-400" />
                </div>
                <p className="text-[11px] text-slate-400 mt-1 leading-snug">{p.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Main Grid: Inputs + Interactive Diagram & Results */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: Inputs (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Section 1: Borewell & Water Levels */}
            <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900/70 border border-slate-200 dark:border-white/10 shadow-xl space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-800">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                  <Droplet className="w-4 h-4 text-cyan-500" />
                  <span>1. Borewell Depth & Water Table</span>
                </h3>
                <span className="text-xs font-mono text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded">
                  {unitMode === 'imperial' ? 'Feet (ft)' : 'Metres (m)'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Total Borewell Depth */}
                <div>
                  <div className="flex justify-between items-center text-xs text-slate-700 dark:text-slate-300 font-medium mb-1.5">
                    <span>Total Borewell Depth</span>
                    <span className="font-mono font-bold text-cyan-600 dark:text-cyan-400">
                      {borewellDepth} {unitMode === 'imperial' ? 'ft' : 'm'}
                    </span>
                  </div>
                  <input
                    type="number"
                    min="10"
                    max="1500"
                    value={borewellDepth || ''}
                    onChange={(e) => setBorewellDepth(Number(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-300 dark:border-zinc-700 text-sm font-mono font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
                  />
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Drilled depth to bottom rock</p>
                </div>

                {/* Pump Installation Depth */}
                <div>
                  <div className="flex justify-between items-center text-xs text-slate-700 dark:text-slate-300 font-medium mb-1.5">
                    <span>Pump Installation Depth</span>
                    <span className="font-mono font-bold text-cyan-600 dark:text-cyan-400">
                      {pumpDepth} {unitMode === 'imperial' ? 'ft' : 'm'}
                    </span>
                  </div>
                  <input
                    type="number"
                    min="5"
                    max="1500"
                    value={pumpDepth || ''}
                    onChange={(e) => setPumpDepth(Number(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-300 dark:border-zinc-700 text-sm font-mono font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
                  />
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    Depth where pump is hung (submerged)
                  </p>
                </div>

                {/* Static Water Level */}
                <div>
                  <div className="flex justify-between items-center text-xs text-slate-700 dark:text-slate-300 font-medium mb-1.5">
                    <span>Static Water Level</span>
                    <span className="font-mono font-bold text-cyan-600 dark:text-cyan-400">
                      {waterLevel} {unitMode === 'imperial' ? 'ft' : 'm'}
                    </span>
                  </div>
                  <input
                    type="number"
                    min="0"
                    max="1500"
                    value={waterLevel || ''}
                    onChange={(e) => setWaterLevel(Number(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-300 dark:border-zinc-700 text-sm font-mono font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
                  />
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Water rest level below ground</p>
                </div>

                {/* Estimated Drawdown */}
                <div>
                  <div className="flex justify-between items-center text-xs text-slate-700 dark:text-slate-300 font-medium mb-1.5">
                    <span>Drawdown / Water Drop</span>
                    <span className="font-mono font-bold text-cyan-600 dark:text-cyan-400">
                      {drawdown} {unitMode === 'imperial' ? 'ft' : 'm'}
                    </span>
                  </div>
                  <input
                    type="number"
                    min="0"
                    max="500"
                    value={drawdown || ''}
                    onChange={(e) => setDrawdown(Number(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-300 dark:border-zinc-700 text-sm font-mono font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
                  />
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Water level drop during pumping</p>
                </div>
              </div>
            </div>

            {/* Section 2: Above Ground Delivery & Tank Height */}
            <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900/70 border border-slate-200 dark:border-white/10 shadow-xl space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-800">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-indigo-500" />
                  <span>2. Overhead Tank & Delivery Run</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Tank Inlet Height */}
                <div>
                  <div className="flex justify-between items-center text-xs text-slate-700 dark:text-slate-300 font-medium mb-1.5">
                    <span>Overhead Tank Inlet Height</span>
                    <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      {tankHeight} {unitMode === 'imperial' ? 'ft' : 'm'}
                    </span>
                  </div>
                  <input
                    type="number"
                    min="0"
                    max="300"
                    value={tankHeight || ''}
                    onChange={(e) => setTankHeight(Number(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-300 dark:border-zinc-700 text-sm font-mono font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  />
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    Roof/Tank elevation above ground level
                  </p>
                </div>

                {/* Horizontal Pipe Run */}
                <div>
                  <div className="flex justify-between items-center text-xs text-slate-700 dark:text-slate-300 font-medium mb-1.5">
                    <span>Horizontal Pipe Distance</span>
                    <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      {deliveryLength} {unitMode === 'imperial' ? 'ft' : 'm'}
                    </span>
                  </div>
                  <input
                    type="number"
                    min="0"
                    max="3000"
                    value={deliveryLength || ''}
                    onChange={(e) => setDeliveryLength(Number(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-300 dark:border-zinc-700 text-sm font-mono font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  />
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    Ground pipe distance from borewell to house
                  </p>
                </div>
              </div>
            </div>

            {/* Section 3: Desired Flow & Delivery Pipe Sizing */}
            <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900/70 border border-slate-200 dark:border-white/10 shadow-xl space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-800">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-500" />
                  <span>3. Desired Water Flow & Pipe Selection</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Flow LPM */}
                <div>
                  <div className="flex justify-between items-center text-xs text-slate-700 dark:text-slate-300 font-medium mb-1.5">
                    <span>Required Flow (LPM)</span>
                    <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{flowLpm} LPM</span>
                  </div>
                  <input
                    type="number"
                    min="10"
                    max="500"
                    value={flowLpm || ''}
                    onChange={(e) => setFlowLpm(Number(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-300 dark:border-zinc-700 text-sm font-mono font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Typical home: 35–60 LPM</p>
                </div>

                {/* Delivery Pipe Internal Diameter */}
                <div>
                  <div className="flex justify-between items-center text-xs text-slate-700 dark:text-slate-300 font-medium mb-1.5">
                    <span>Delivery Pipe Size</span>
                    <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{pipeIdMm} mm</span>
                  </div>
                  <select
                    value={pipeIdMm}
                    onChange={(e) => setPipeIdMm(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-300 dark:border-zinc-700 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  >
                    {STANDARD_DELIVERY_PIPES.map((p) => (
                      <option key={p.defaultIdMm} value={p.defaultIdMm}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Column & rising main pipe</p>
                </div>

                {/* Pipe Material */}
                <div>
                  <div className="flex justify-between items-center text-xs text-slate-700 dark:text-slate-300 font-medium mb-1.5">
                    <span>Pipe Material</span>
                    <span className="font-mono font-bold uppercase text-emerald-600 dark:text-emerald-400">
                      {pipeMaterial}
                    </span>
                  </div>
                  <select
                    value={pipeMaterial}
                    onChange={(e) => setPipeMaterial(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-300 dark:border-zinc-700 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="upvc">uPVC Column Pipe (C=145)</option>
                    <option value="hdpe">HDPE Pipe (C=135)</option>
                    <option value="gi">GI Galvanized Iron (C=110)</option>
                  </select>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Smooth interior reduces friction</p>
                </div>
              </div>
            </div>

            {/* Section 4: Electrical & Advanced Engineering (Collapsible) */}
            <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900/70 border border-slate-200 dark:border-white/10 shadow-xl space-y-4">
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="w-full flex items-center justify-between text-left cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-500" />
                  <span className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                    4. Electrical Power & Efficiency Assumptions
                  </span>
                </div>
                <span className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:underline">
                  {showAdvanced ? 'Hide Technical Settings' : 'Edit Power & Tariff Defaults'}
                </span>
              </button>

              {showAdvanced && (
                <div className="pt-4 border-t border-slate-100 dark:border-zinc-800 space-y-4 animate-in fade-in duration-200">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Power Supply Phase */}
                    <div>
                      <label className="block text-xs text-slate-700 dark:text-slate-300 font-medium mb-1">
                        Supply Phase
                      </label>
                      <select
                        value={supplyPhase}
                        onChange={(e) => {
                          const ph = Number(e.target.value) as 1 | 3
                          setSupplyPhase(ph)
                          setSupplyVoltageV(ph === 3 ? 415 : 230)
                        }}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-300 dark:border-zinc-700 text-sm font-medium text-slate-900 dark:text-white"
                      >
                        <option value={1}>Single Phase (1Φ 230V)</option>
                        <option value={3}>Three Phase (3Φ 415V)</option>
                      </select>
                    </div>

                    {/* Supply Voltage */}
                    <div>
                      <label className="block text-xs text-slate-700 dark:text-slate-300 font-medium mb-1">
                        Nominal Voltage (V)
                      </label>
                      <input
                        type="number"
                        value={supplyVoltageV}
                        onChange={(e) => setSupplyVoltageV(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-300 dark:border-zinc-700 text-sm font-mono text-slate-900 dark:text-white"
                      />
                    </div>

                    {/* Electricity Tariff */}
                    <div>
                      <label className="block text-xs text-slate-700 dark:text-slate-300 font-medium mb-1">
                        Tariff Rate (₹/kWh)
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        value={tariffInr}
                        onChange={(e) => setTariffInr(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-300 dark:border-zinc-700 text-sm font-mono text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Pump Efficiency */}
                    <div>
                      <label className="block text-xs text-slate-700 dark:text-slate-300 font-medium mb-1">
                        Pump Efficiency: {pumpEfficiencyPct}%
                      </label>
                      <input
                        type="range"
                        min="35"
                        max="75"
                        value={pumpEfficiencyPct}
                        onChange={(e) => setPumpEfficiencyPct(Number(e.target.value))}
                        className="w-full accent-cyan-500"
                      />
                      <span className="text-[10px] text-slate-500">Typical 50–60% for domestic submersible</span>
                    </div>

                    {/* Motor Efficiency */}
                    <div>
                      <label className="block text-xs text-slate-700 dark:text-slate-300 font-medium mb-1">
                        Motor Efficiency: {motorEfficiencyPct}%
                      </label>
                      <input
                        type="range"
                        min="50"
                        max="90"
                        value={motorEfficiencyPct}
                        onChange={(e) => setMotorEfficiencyPct(Number(e.target.value))}
                        className="w-full accent-cyan-500"
                      />
                      <span className="text-[10px] text-slate-500">Typical 70–80% for wet-type submersible</span>
                    </div>

                    {/* Head Per Stage */}
                    <div>
                      <label className="block text-xs text-slate-700 dark:text-slate-300 font-medium mb-1">
                        Head Per Stage (m): {headPerStageM}m
                      </label>
                      <input
                        type="range"
                        min="3"
                        max="15"
                        value={headPerStageM}
                        onChange={(e) => setHeadPerStageM(Number(e.target.value))}
                        className="w-full accent-cyan-500"
                      />
                      <span className="text-[10px] text-slate-500">Illustrative ~5–7m head per impeller stage</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-100 dark:border-zinc-800">
                    <div>
                      <label className="block text-xs text-slate-700 dark:text-slate-300 font-medium mb-1">
                        Cable Conductor
                      </label>
                      <select
                        value={cableConductor}
                        onChange={(e) => setCableConductor(e.target.value as any)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-300 dark:border-zinc-700 text-sm font-medium text-slate-900 dark:text-white"
                      >
                        <option value="copper">Copper (Recommended for Submersible)</option>
                        <option value="aluminium">Aluminium</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs text-slate-700 dark:text-slate-300 font-medium mb-1">
                        Borewell Cap to Panel Lead
                      </label>
                      <input
                        type="number"
                        value={cableLengthOffset}
                        onChange={(e) => setCableLengthOffset(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-300 dark:border-zinc-700 text-sm font-mono text-slate-900 dark:text-white"
                      />
                      <span className="text-[10px] text-slate-500">Extra cable run to starter switchboard</span>
                    </div>

                    <div>
                      <label className="block text-xs text-slate-700 dark:text-slate-300 font-medium mb-1">
                        Fittings: Bends & Valves
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          placeholder="Bends"
                          value={bendsCount}
                          onChange={(e) => setBendsCount(Number(e.target.value))}
                          className="w-1/2 px-2 py-2 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-300 dark:border-zinc-700 text-xs font-mono text-slate-900 dark:text-white"
                        />
                        <input
                          type="number"
                          placeholder="Valves"
                          value={valvesCount}
                          onChange={(e) => setValvesCount(Number(e.target.value))}
                          className="w-1/2 px-2 py-2 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-300 dark:border-zinc-700 text-xs font-mono text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: Diagram & Results Output (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Primary Recommendation Banner */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-cyan-950/80 via-slate-900/90 to-indigo-950/80 border border-cyan-500/30 shadow-2xl relative overflow-hidden text-white">
              <div className="absolute top-0 right-0 -mr-8 -mt-8 w-36 h-36 bg-cyan-500/10 rounded-full blur-2xl" />

              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono font-bold tracking-widest uppercase text-cyan-400 flex items-center gap-1.5">
                  <Gauge className="w-4 h-4" /> Recommended Submersible Motor
                </span>
                <span
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${
                    result.feasibility === 'feasible'
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                      : result.feasibility === 'warning'
                      ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                      : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                  }`}
                >
                  {result.feasibility === 'feasible'
                    ? 'Feasible Setup'
                    : result.feasibility === 'warning'
                    ? 'Check Submergence'
                    : 'Requires Revision'}
                </span>
              </div>

              {/* Big HP Display */}
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-5xl font-black font-mono tracking-tight text-white drop-shadow-md">
                  {result.recommendedMotorHp ? `${result.recommendedMotorHp} HP` : `${result.requiredMotorHp} HP`}
                </span>
                <span className="text-xs font-mono text-slate-300">
                  ({((result.recommendedMotorHp || result.requiredMotorHp) * 0.746).toFixed(2)} kW Rating)
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Calculated demand: <span className="font-mono text-cyan-300 font-bold">{result.requiredMotorHp} HP</span>{' '}
                motor input power (Water HP: {result.waterHp} HP at {combinedEffText(pumpEfficiencyPct, motorEfficiencyPct)}).
              </p>

              {/* Quick Metrics Strip */}
              <div className="grid grid-cols-2 gap-2 pt-4 border-t border-white/10 text-xs">
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                  <span className="text-[11px] text-slate-400 block mb-0.5">Total Dynamic Head (TDH)</span>
                  <span className="font-mono font-bold text-cyan-300 text-sm">
                    {result.totalDynamicHeadM} m{' '}
                    <span className="text-[11px] font-normal text-slate-300">({result.totalDynamicHeadFt} ft)</span>
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                  <span className="text-[11px] text-slate-400 block mb-0.5">Indicative Stages</span>
                  <span className="font-mono font-bold text-cyan-300 text-sm">
                    ~{result.estimatedStages} Stages{' '}
                    <span className="text-[11px] font-normal text-slate-300">(@{headPerStageM}m/stg)</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Warnings if any */}
            {result.warnings.length > 0 && (
              <div className="p-4 rounded-2xl bg-amber-500/10 dark:bg-amber-500/10 border border-amber-500/30 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-500 dark:text-amber-400">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>Engineering Attention Warnings</span>
                </div>
                <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1 list-disc pl-5">
                  {result.warnings.map((w, idx) => (
                    <li key={idx}>{w}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Dynamic Vertical Borewell Diagram */}
            <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900/70 border border-slate-200 dark:border-white/10 shadow-xl space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-zinc-800">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-cyan-500" /> Borewell Submergence & Column Diagram
                </span>
                <span className="text-[11px] font-mono text-slate-500">Live Scale Schematic</span>
              </div>

              {/* Graphic container */}
              <div className="relative w-full h-80 bg-slate-950 rounded-xl overflow-hidden border border-slate-800 p-3 flex">
                {/* Left Elevation Scale */}
                <div className="w-1/3 flex flex-col justify-between text-[10px] font-mono text-slate-400 pr-2 border-r border-slate-800">
                  <div>
                    <span className="text-indigo-400 font-bold block">+ Tank Inlet</span>
                    <span>+{tankHeight}{unitMode === 'imperial' ? 'ft' : 'm'}</span>
                  </div>
                  <div className="py-1 border-t border-dashed border-amber-500/40">
                    <span className="text-amber-400 font-bold block">▼ Ground Level</span>
                    <span>0 {unitMode === 'imperial' ? 'ft' : 'm'}</span>
                  </div>
                  <div>
                    <span className="text-cyan-400 font-bold block">▼ Static Water</span>
                    <span>-{waterLevel}{unitMode === 'imperial' ? 'ft' : 'm'}</span>
                  </div>
                  <div>
                    <span className="text-blue-400 font-bold block">▼ Pumping Level</span>
                    <span>-{unitMode === 'imperial' ? Math.round(mToFt(result.pumpingWaterLevelM)) : result.pumpingWaterLevelM}{unitMode === 'imperial' ? 'ft' : 'm'}</span>
                  </div>
                  <div>
                    <span className="text-emerald-400 font-bold block">▼ Submersible Pump</span>
                    <span>-{pumpDepth}{unitMode === 'imperial' ? 'ft' : 'm'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-bold block">▼ Well Bottom</span>
                    <span>-{borewellDepth}{unitMode === 'imperial' ? 'ft' : 'm'}</span>
                  </div>
                </div>

                {/* Right Visual Cross Section */}
                <div className="w-2/3 relative h-full flex justify-center items-center">
                  {/* Ground Surface Line */}
                  <div className="absolute top-[20%] left-0 right-0 h-0.5 bg-amber-500/70 z-10">
                    <span className="absolute -top-3.5 right-2 text-[9px] font-bold uppercase tracking-wider text-amber-400 bg-slate-950 px-1">
                      Ground Surface
                    </span>
                  </div>

                  {/* Borewell Casing Tube */}
                  <div className="w-20 h-full bg-slate-900 border-x-2 border-slate-700 relative overflow-hidden flex justify-center">
                    {/* Water Column inside borewell */}
                    <div
                      className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-cyan-600/40 via-blue-600/30 to-blue-500/20 border-t border-cyan-400/80 transition-all duration-300"
                      style={{
                        top: `${Math.min(90, Math.max(25, 20 + (pumpingWaterPct * 0.75)))}%`,
                      }}
                    >
                      <div className="absolute top-1 left-1.5 text-[8px] font-mono text-cyan-300 uppercase tracking-tighter">
                        Water Reserve
                      </div>
                    </div>

                    {/* Delivery Column Pipe (Vertical) */}
                    <div className="w-2.5 h-full bg-slate-400 dark:bg-slate-500 border-x border-slate-600 z-10 flex flex-col justify-end items-center">
                      {/* Flow chevron animation placeholder */}
                      <div className="w-1 h-3 bg-cyan-300 animate-pulse mb-4 rounded-full" />
                    </div>

                    {/* Submersible Pump Unit graphic */}
                    <div
                      className="absolute z-20 w-8 h-12 bg-gradient-to-b from-slate-200 via-slate-300 to-slate-400 rounded-sm shadow-lg border border-slate-950 flex flex-col items-center justify-center transition-all duration-300"
                      style={{
                        top: `${Math.min(88, Math.max(30, 20 + (pumpPositionPct * 0.72)))}%`,
                      }}
                    >
                      <div className="w-full h-1 bg-cyan-500" />
                      <span className="text-[7px] font-black text-slate-900 leading-none py-0.5">PUMP</span>
                      <div className="w-full h-0.5 bg-slate-600 my-0.5" />
                      <span className="text-[6px] font-bold text-slate-800 leading-none">
                        {result.recommendedMotorHp || result.requiredMotorHp}HP
                      </span>
                    </div>
                  </div>

                  {/* Overhead Tank Graphic (Top right) */}
                  <div className="absolute top-1 right-2 p-1.5 rounded-lg bg-indigo-950/80 border border-indigo-500/40 text-center">
                    <span className="text-[8px] font-bold text-indigo-300 block">OHT Tank</span>
                    <span className="text-[9px] font-mono text-white font-bold">+{tankHeight}{unitMode === 'imperial' ? 'ft' : 'm'}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                <span>
                  Net Submergence:{' '}
                  <strong className="text-cyan-600 dark:text-cyan-400 font-mono">
                    {result.submergenceM} m ({Number((result.submergenceM * 3.28084).toFixed(1))} ft)
                  </strong>
                </span>
                <span>
                  Static Head Lift:{' '}
                  <strong className="text-slate-800 dark:text-slate-200 font-mono">{result.staticLiftM} m</strong>
                </span>
              </div>
            </div>

            {/* Delivery Pipe Sizing Evaluation */}
            <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900/70 border border-slate-200 dark:border-white/10 shadow-xl space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-zinc-800">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-emerald-500" /> Delivery Pipe Sizing (Target &lt; 2.0 m/s)
                </span>
                <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                  Recommended: {result.recommendedPipeLabel}
                </span>
              </div>

              <div className="space-y-2">
                {result.pipeEvaluations.map((p) => (
                  <div
                    key={p.nominalLabel}
                    className={`p-2.5 rounded-xl border text-xs flex items-center justify-between transition-all ${
                      p.isRecommended
                        ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-950 dark:text-emerald-200'
                        : p.status === 'excessive-velocity'
                        ? 'bg-rose-500/5 border-rose-500/20 text-slate-700 dark:text-slate-300'
                        : 'bg-slate-50 dark:bg-zinc-800/40 border-slate-200 dark:border-zinc-700/60 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {p.isRecommended ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-slate-400 dark:border-slate-600 flex items-center justify-center text-[9px] text-slate-400">
                          -
                        </div>
                      )}
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white mr-1.5">{p.nominalLabel}</span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">
                          (Velocity: <strong className="font-mono">{p.velocityMs} m/s</strong>)
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-xs block text-slate-600 dark:text-slate-300">
                        Loss: {p.frictionLossM} m
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tank Filling & Electricity Economics */}
            <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900/70 border border-slate-200 dark:border-white/10 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-zinc-800">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <IndianRupee className="w-3.5 h-3.5 text-indigo-500" /> Tank Filling Time & Electricity Cost
                </span>
                <span className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400">
                  @ ₹{tariffInr}/kWh
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-700">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block mb-1">Time for 1,000L</span>
                  <span className="text-base font-bold font-mono text-slate-900 dark:text-white">
                    {result.tankFillTimeMinutes} <span className="text-xs font-normal">min</span>
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-700">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block mb-1">Units (kWh) / 1000L</span>
                  <span className="text-base font-bold font-mono text-indigo-600 dark:text-indigo-400">
                    {result.energyPer1000LitreKwh}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-700">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block mb-1">Cost per 1,000L</span>
                  <span className="text-base font-bold font-mono text-emerald-600 dark:text-emerald-400">
                    ₹{result.electricityCostPer1000LitreInr}
                  </span>
                </div>
              </div>

              {/* Cable recommendation */}
              <div className="p-3 rounded-xl bg-indigo-500/5 border border-indigo-500/20 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2.5">
                <Cable className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="font-bold text-slate-900 dark:text-white block">
                    Indicative Submersible Cable: {result.recommendedCableSqmm} sq.mm 3-Core Flat
                  </span>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                    Operating current ~{result.currentAmps}A with {result.cableVoltageDropPct}% voltage drop on the{' '}
                    {Math.round(calcInputs.cableLengthM)}m run. Voltage drop should stay below 3–5% to ensure smooth motor starting.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Engineering Breakdown & Formula Guide */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-zinc-900/60 border border-slate-200 dark:border-white/10 shadow-xl space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-zinc-800">
            <Info className="w-5 h-5 text-cyan-500" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Hydraulic Formula Breakdown & Indian Engineering Practices
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">1. Total Dynamic Head (TDH) Principle</h4>
              <p>
                Unlike surface suction pumps, a submerged borewell pump does not work against the depth at which it is physically lowered. 
                Instead, the static vertical lift begins from the <strong>pumping water level below ground</strong> (which accounts for drawdown) up to the <strong>overhead tank delivery inlet</strong>.
              </p>
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-zinc-950 font-mono text-[11px] text-slate-800 dark:text-slate-200">
                TDH = Pumping Water Level ({result.pumpingWaterLevelM}m) + Tank Elevation ({calcInputs.tankHeightM.toFixed(1)}m) + Pipe Friction ({result.pipeFrictionHeadM}m) + Fittings Loss ({result.fittingsLossM}m) + Residual Outlet Head (3m) = <strong>{result.totalDynamicHeadM} m ({result.totalDynamicHeadFt} ft)</strong>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">2. Hydraulic vs Electrical Motor Rating</h4>
              <p>
                Hydraulic power (Water HP) represents purely the energy delivered to raise water:
                <br />
                <code className="text-cyan-600 dark:text-cyan-400 font-bold">Water HP = (Flow in LPM × TDH in metres) ÷ 4500</code>.
              </p>
              <p>
                Due to hydraulic losses in pump impellers (~50–60% efficiency) and electrical losses in wet submersible motors (~70–80% efficiency), the required motor power rating is substantially higher. Always confirm the duty point against the pump manufacturer's published Q-H performance curve.
              </p>
            </div>
          </div>
        </div>
      </div>
    </ToolPageLayout>
  )
}

function combinedEffText(pumpEff: number, motorEff: number): string {
  const combined = ((pumpEff / 100) * (motorEff / 100) * 100).toFixed(0)
  return `${pumpEff}% pump × ${motorEff}% motor = ${combined}% combined eff.`
}
