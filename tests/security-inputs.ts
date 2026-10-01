import * as Calc from '../src/lib/calculations.ts'

console.log('=== RUNNING SECURITY & INPUT SAFETY SUITE ===\n')

const testValues = [0, -1, -999999, 999999999999999, 0.000001, 1e-7, NaN, Infinity, -Infinity]
let totalChecks = 0
let failedChecks = 0

function checkResult(funcName: string, inputDesc: string, res: any) {
  totalChecks++
  for (const [k, v] of Object.entries(res)) {
    if (typeof v === 'number') {
      if (Number.isNaN(v)) {
        console.error(`❌ [FAIL] ${funcName} with ${inputDesc} returned NaN for ${k}`)
        failedChecks++
        return
      }
      if (!Number.isFinite(v)) {
        console.error(`❌ [FAIL] ${funcName} with ${inputDesc} returned Infinite for ${k}`)
        failedChecks++
        return
      }
    }
  }
}

for (const val of testValues) {
  // Mileage
  checkResult('calculateMileage', `${val}`, Calc.calculateMileage(val, val, val))
  // Fuel Cost
  checkResult('calculateFuelCost', `${val}`, Calc.calculateFuelCost(val, val, val))
  // Trip Cost
  checkResult('calculateTripCost', `${val}`, Calc.calculateTripCost(val, false, val, val, val, val, val))
  // Monthly Running Cost
  checkResult('calculateMonthlyVehicleRunningCost', `${val}`, Calc.calculateMonthlyVehicleRunningCost(val, val, val, val, val, val))
  // Petrol vs Diesel
  checkResult('calculatePetrolVsDiesel', `${val}`, Calc.calculatePetrolVsDiesel(val, val, val, val, val, val))
  // EV vs Petrol
  checkResult('calculateEvVsPetrol', `${val}`, Calc.calculateEvVsPetrol(val, val, val, val, val, val))
  // JCB Fuel
  checkResult('calculateJcbFuel', `${val}`, Calc.calculateJcbFuel(val, val, val, val))
  // Cement
  checkResult('calculateCement', `${val}`, Calc.calculateCement('plastering', val))
  // Concrete
  checkResult('calculateConcrete', `${val}`, Calc.calculateConcrete(val, val, val))
  // Bricks
  checkResult('calculateBricks', `${val}`, Calc.calculateBricks(val, val, 9, val))
  // Tiles
  checkResult('calculateTiles', `${val}`, Calc.calculateTiles(val, val))
  // Paint
  checkResult('calculatePaint', `${val}`, Calc.calculatePaint(val, val))
  // Construction Cost
  checkResult('calculateConstructionCost', `${val}`, Calc.calculateConstructionCost(val, val, 'standard'))
  // Excavator Cost
  checkResult('calculateExcavatorCost', `${val}`, Calc.calculateExcavatorCost(val, 'dry', val, val, val, val, val))
  // Electricity
  checkResult('calculateElectricity', `${val}`, Calc.calculateElectricity(val, val))
  // AC
  checkResult('calculateAcCost', `${val}`, Calc.calculateAcCost(1.5, 5, true, val, val))
  // Fan
  checkResult('calculateFanCost', `${val}`, Calc.calculateFanCost('regular_induction', val, val, val))
  // Inverter
  checkResult('calculateInverterBackup', `${val}`, Calc.calculateInverterBackup(val, val, val, val, val))
  // Solar
  checkResult('calculateSolar', `${val}`, Calc.calculateSolar(val, true, val, val, val))
  // Water Tank
  checkResult('calculateWaterTank', `${val}`, Calc.calculateWaterTank(val, val, false))
  // LPG
  checkResult('calculateLpgUsage', `${val}`, Calc.calculateLpgUsage(val, val, val))
  // DG Fuel
  checkResult('calculateGeneratorFuel', `${val}`, Calc.calculateGeneratorFuel(val, val, val, val))
  // Salary Hike
  checkResult('calculateSalaryHike', `${val}`, Calc.calculateSalaryHike(val, val))
  // In-Hand Salary
  checkResult('calculateInHandSalary', `${val}`, Calc.calculateInHandSalary(val, 'new'))
  // EMI
  checkResult('calculateEmi', `${val}`, Calc.calculateEmi(val, val, val))
  // GST
  checkResult('calculateGst', `${val}`, Calc.calculateGst(val, 18, false))
  checkResult('calculateGst-inclusive', `${val}`, Calc.calculateGst(val, 18, true))
  // SIP
  checkResult('calculateSip', `${val}`, Calc.calculateSip(val, val, val))
  // Daily Wage
  checkResult('calculateDailyWage', `${val}`, Calc.calculateDailyWage(val, val, val, val, val))
  // Percentage
  checkResult('calculatePercentage', `${val}`, Calc.calculatePercentage(val, val))
  // Land Area
  checkResult('convertLandArea', `${val}`, Calc.convertLandArea(val, 'cent'))
  // Carpet Area
  checkResult('calculateCarpetArea', `${val}`, Calc.calculateCarpetArea(val, val))
}

console.log(`TOTAL SECURITY & EDGE CHECKS: ${totalChecks}`)
console.log(`FAILED: ${failedChecks}`)

if (failedChecks > 0) {
  process.exit(1)
} else {
  console.log('🛡️ ALL SECURITY & EXTREME INPUT CHECKS PASSED!')
}
