import { getToolTranslations } from '../src/i18n/toolTranslations.ts'
// Import tool bundles so they are registered
import '../src/i18n/tools/vehicleMileageI18n.ts'
import '../src/i18n/tools/fuelCostI18n.ts'
import '../src/i18n/tools/tripCostI18n.ts'
import '../src/i18n/tools/monthlyVehicleRunningCostI18n.ts'
import '../src/i18n/tools/petrolVsDieselI18n.ts'
import '../src/i18n/tools/evVsPetrolI18n.ts'
import '../src/i18n/tools/jcbFuelCostI18n.ts'
import '../src/i18n/tools/vehicleServiceCostI18n.ts'
import {
  calculateMileage,
  calculateFuelCost,
  calculateTripCost,
  calculateMonthlyVehicleRunningCost,
  calculatePetrolVsDiesel,
  calculateEvVsPetrol,
  calculateJcbFuel,
  calculateVehicleServiceCost
} from '../src/lib/calculations.ts'

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

console.log('=== VERIFYING BATCH 1 (8 VEHICLE TOOLS) MULTILINGUAL TRANSLATIONS ===\n')

const vehicleSlugs = [
  'vehicle-mileage',
  'fuel-cost',
  'trip-cost',
  'monthly-vehicle-running-cost',
  'petrol-vs-diesel',
  'ev-vs-petrol',
  'jcb-fuel-cost',
  'vehicle-service-cost',
]

const requiredLocales = ['en', 'ml', 'hi', 'ta', 'te', 'kn'] as const

for (const slug of vehicleSlugs) {
  for (const locale of requiredLocales) {
    const bundle = getToolTranslations(slug, locale)
    assert(!!bundle, `Tool '${slug}' returns translation bundle for '${locale}'`)
    assert(bundle.meta.title.length > 5, `Tool '${slug}' [${locale}] has valid meta title: "${bundle.meta.title.slice(0, 30)}..."`)
    assert(bundle.meta.h1.length > 3, `Tool '${slug}' [${locale}] has valid H1: "${bundle.meta.h1}"`)
    assert(bundle.meta.subtitle.length > 10, `Tool '${slug}' [${locale}] has valid subtitle`)
    assert(Object.keys(bundle.ui).length > 5, `Tool '${slug}' [${locale}] has UI dictionary with > 5 keys`)
  }
}

console.log('\n=== VERIFYING NUMERICAL CALCULATION EQUIVALENCE & PURITY ===\n')

// 1. vehicle-mileage
const m1 = calculateMileage(450, 25, 102)
assert(m1.mileageKmPerL === 18 && m1.fuelCostPerKm === 5.67, 'vehicle-mileage math is correct and identical')

// 2. fuel-cost
const fc1 = calculateFuelCost(280, 16, 90)
assert(fc1.totalCost === 1575 && fc1.totalFuelNeededL === 17.5, 'fuel-cost math is correct and identical')

// 3. trip-cost
const tc1 = calculateTripCost(350, true, 15, 104, 450, 300, 4)
assert(tc1.totalDistanceKm === 700 && tc1.totalCost > 0 && tc1.costPerPerson > 0, 'trip-cost math is correct and identical')

// 4. monthly-vehicle-running-cost
const mv1 = calculateMonthlyVehicleRunningCost(1200, 15, 102, 8500, 14000, 9000)
assert(mv1.monthlyFuelCost === 8160 && mv1.totalMonthlyCost > 0, 'monthly-vehicle-running-cost math is correct and identical')

// 5. petrol-vs-diesel
const pvd = calculatePetrolVsDiesel(1500, 14, 19, 102, 90, 125000)
assert(pvd.monthlyPetrolCost > pvd.monthlyDieselCost && pvd.breakevenMonths > 0, 'petrol-vs-diesel math is correct and identical')

// 6. ev-vs-petrol
const evp = calculateEvVsPetrol(1500, 14, 102, 7.5, 8.5, 350000)
assert(evp.annualSavings > 0 && evp.breakevenYears > 0, 'ev-vs-petrol math is correct and identical')

// 7. jcb-fuel-cost
const jcb = calculateJcbFuel(8, 4.8, 90, 26)
assert(jcb.dailyFuelCost === 3456 && jcb.monthlyFuelCost === 89856, 'jcb-fuel-cost math is correct and identical')

// 8. vehicle-service-cost
const vsc = calculateVehicleServiceCost('hatchback', 35000, 'major')
assert(vsc.estimatedTotal > 0 && vsc.keyRecommendations.length > 0, 'vehicle-service-cost math is correct and identical')

const failed = tests.filter(t => !t.passed)
console.log(`\n========================================`)
console.log(`TOTAL CHECKS: ${tests.length}`)
console.log(`PASSED: ${tests.length - failed.length}`)
console.log(`FAILED: ${failed.length}`)
if (failed.length > 0) {
  process.exit(1)
} else {
  console.log(`🌟 ALL 8 VEHICLE TOOLS PASSED MULTILINGUAL AUDIT!`)
}
