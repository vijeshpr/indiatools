import { calculateBorewellPump } from '../src/lib/calculations.ts'
import type { BorewellPumpInput } from '../src/lib/calculations.ts'

interface TestResult {
  name: string
  passed: boolean
  details?: string
}

const tests: TestResult[] = []

function assert(condition: boolean, name: string, details?: string) {
  if (condition) {
    tests.push({ name, passed: true })
    console.log(`✅ [PASS] ${name}`)
  } else {
    tests.push({ name, passed: false, details })
    console.error(`❌ [FAIL] ${name}: ${details || 'Assertion failed'}`)
  }
}

console.log('=== STARTING BOREWELL PUMP CALCULATOR UNIT TESTS ===\n')

// 1. Basic Residential Setup
const standardInput: BorewellPumpInput = {
  borewellDepthM: 60, // 200 ft
  pumpDepthM: 52,     // 170 ft
  waterLevelM: 25,    // 82 ft
  drawdownM: 10,      // 33 ft -> pumping water level = 35m
  tankHeightM: 10,    // 33 ft -> static lift = 45m
  deliveryLengthM: 15,
  flowLpm: 50,
  pipeInternalDiameterMm: 32,
  pipeMaterial: 'upvc',
  bendsCount: 3,
  valvesCount: 2,
  fittingsAllowancePct: 10,
  pumpEfficiencyPct: 55,
  motorEfficiencyPct: 75,
  headPerStageM: 6,
  tariffInr: 6,
  supplyPhase: 1,
  supplyVoltageV: 230,
  cableLengthM: 65,
  cableConductor: 'copper',
}

const resStandard = calculateBorewellPump(standardInput)

assert(resStandard.pumpingWaterLevelM === 35, 'Pumping water level equals water level + drawdown (25 + 10 = 35m)')
assert(resStandard.staticLiftM === 45, 'Static vertical lift is pumping water level + tank height (35 + 10 = 45m)')
assert(resStandard.totalDynamicHeadM > 45, 'TDH is greater than static lift due to friction and outlet head')
assert(resStandard.waterHp > 0.4 && resStandard.waterHp < 0.8, 'Hydraulic water HP is in realistic range (~0.57 HP)')
assert(resStandard.requiredMotorHp > 1.0 && resStandard.requiredMotorHp < 1.6, 'Required motor input HP is ~1.39 HP')
assert(resStandard.recommendedMotorHp === 1.5, 'Selects next standard commercial rating of 1.5 HP')
assert(resStandard.estimatedStages === 9, 'Stages count matches TDH divided by head-per-stage (51.5 / 6 = 9 stages)')
assert(resStandard.tankFillTimeMinutes === 20, '1,000L tank fill time at 50 LPM is 20 minutes')
assert(resStandard.energyPer1000LitreKwh > 0.3 && resStandard.energyPer1000LitreKwh < 0.7, 'Energy consumption per 1,000L is ~0.5 kWh')
assert(resStandard.electricityCostPer1000LitreInr > 2.0 && resStandard.electricityCostPer1000LitreInr < 4.0, 'Electricity cost is ~₹3 per 1,000L fill')
assert(resStandard.feasibility === 'feasible', 'Standard setup has feasible operational status')
assert(resStandard.submergenceM === 17, 'Submergence is 52m pump depth - 35m pumping level = 17m')

// 2. Dry-Running / Low Submergence Warning
const dryRunInput: BorewellPumpInput = {
  ...standardInput,
  pumpDepthM: 30, // pump hung higher than pumping level (35m)
}
const resDryRun = calculateBorewellPump(dryRunInput)
assert(resDryRun.submergenceM < 0, 'Negative submergence detected for dry running')
assert(resDryRun.feasibility === 'infeasible', 'Identified as infeasible due to dry running risk')
assert(resDryRun.warnings.some(w => w.includes('dry-running')), 'Issues clear dry-running warning')

// 3. Excessive Motor Power Requirement (Over 7.5 HP)
const deepIndustrialInput: BorewellPumpInput = {
  ...standardInput,
  borewellDepthM: 300,
  pumpDepthM: 280,
  waterLevelM: 200,
  drawdownM: 40, // pumping level = 240m
  tankHeightM: 20, // static lift = 260m
  flowLpm: 150, // high flow
}
const resIndustrial = calculateIndustrialPump(deepIndustrialInput)
function calculateIndustrialPump(inp: BorewellPumpInput) {
  return calculateBorewellPump(inp)
}
assert(resIndustrial.recommendedMotorHp === null, 'Sets recommendedMotorHp to null when exceeding 7.5 HP residential range')
assert(resIndustrial.warnings.some(w => w.includes('exceeds standard residential domestic ratings')), 'Warns when special commercial pump is required')

// 4. Pipe Velocity & Diameter Recommendation
const highFlowPipeInput: BorewellPumpInput = {
  ...standardInput,
  flowLpm: 120, // 120 LPM in 25mm pipe creates high velocity
  pipeInternalDiameterMm: 25,
}
const resHighFlow = calculateBorewellPump(highFlowPipeInput)
assert(resHighFlow.pipeVelocityMs > 2.2, 'Correctly flags excessive water velocity (>2.2 m/s) in 25mm pipe at 120 LPM')
assert(resHighFlow.recommendedPipeLabel.includes('40 mm') || resHighFlow.recommendedPipeLabel.includes('50 mm'), 'Recommends larger 40mm or 50mm pipe for 120 LPM')

// 5. Cable Sizing & 3-Phase vs Single Phase
const threePhaseInput: BorewellPumpInput = {
  ...standardInput,
  supplyPhase: 3,
  supplyVoltageV: 415,
}
const res3Ph = calculateBorewellPump(threePhaseInput)
assert(res3Ph.currentAmps < resStandard.currentAmps, '3-phase current is significantly lower than single-phase at same kW')
assert(res3Ph.cableVoltageDropPct <= 3.5, 'Voltage drop on 3-phase remains within acceptable 3.5% threshold')

// 6. Zero/Edge Case Inputs Safety
const zeroInput: BorewellPumpInput = {
  ...standardInput,
  waterLevelM: 0,
  drawdownM: 0,
  tankHeightM: 0,
  deliveryLengthM: 0,
}
const resZero = calculateBorewellPump(zeroInput)
assert(Number.isFinite(resZero.totalDynamicHeadM) && resZero.totalDynamicHeadM > 0, 'Handles zero elevation inputs with residual head safety without crashing')

console.log(`\n=== UNIT TESTS COMPLETE: ${tests.filter(t => t.passed).length} / ${tests.length} PASSED ===`)
if (tests.some(t => !t.passed)) {
  process.exit(1)
}
