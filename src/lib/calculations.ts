// Pure calculation functions for India Practical Tools
// All formulas use genuine Indian benchmarks, IS codes, and tax standards

// Helper utilities to guarantee robust mathematical safety across all calculators
export function safeNum(val: unknown, min: number = 0, max: number = 1e11, fallback: number = 0): number {
  if (typeof val !== 'number' || !Number.isFinite(val) || Number.isNaN(val)) {
    return fallback
  }
  if (val < min) return min
  if (val > max) return max
  return val
}

export function ensureFinite<T extends Record<string, any>>(obj: T): T {
  for (const key of Object.keys(obj)) {
    const val = obj[key]
    if (typeof val === 'number') {
      if (!Number.isFinite(val) || Number.isNaN(val)) {
        (obj as any)[key] = 0
      }
    } else if (val && typeof val === 'object' && !Array.isArray(val)) {
      ensureFinite(val)
    }
  }
  return obj
}

export interface MileageResult {
  mileageKmPerL: number
  mileageKmPerLitre: number
  fuelCostPerKm: number
  costPerKm: number
  costPer100Km: number
  rating: 'exceptional' | 'good' | 'moderate' | 'heavy'
  ratingLabel: string
}

export function calculateMileage(
  distanceKm: number,
  fuelLitres: number,
  fuelPricePerLitre: number
): MileageResult {
  const safeDist = safeNum(distanceKm, 0, 1e9, 0)
  const safeFuel = safeNum(fuelLitres, 0, 1e9, 0)
  const safePrice = safeNum(fuelPricePerLitre, 0, 1e6, 0)

  if (safeDist <= 0 || safeFuel <= 0) {
    return ensureFinite({
      mileageKmPerL: 0,
      mileageKmPerLitre: 0,
      fuelCostPerKm: 0,
      costPerKm: 0,
      costPer100Km: 0,
      rating: 'moderate',
      ratingLabel: 'Enter valid distance and fuel',
    })
  }

  const mileageKmPerL = safeDist / safeFuel
  const fuelCostPerKm = safePrice > 0 ? safePrice / mileageKmPerL : 0
  const costPer100Km = fuelCostPerKm * 100

  let rating: MileageResult['rating'] = 'moderate'
  let ratingLabel = 'Moderate Efficiency'

  if (mileageKmPerL >= 22) {
    rating = 'exceptional'
    ratingLabel = 'Exceptional Fuel Economy (Hatchback/Hybrid/Bike)'
  } else if (mileageKmPerL >= 16) {
    rating = 'good'
    ratingLabel = 'Good Highway / Sedan Economy'
  } else if (mileageKmPerL >= 11) {
    rating = 'moderate'
    ratingLabel = 'Moderate City / Compact SUV Economy'
  } else {
    rating = 'heavy'
    ratingLabel = 'Heavy Fuel Consumption (Full-size SUV / Heavy Traffic)'
  }

  const roundedMileage = Number(mileageKmPerL.toFixed(2))
  const roundedCost = Number(fuelCostPerKm.toFixed(2))

  return ensureFinite({
    mileageKmPerL: roundedMileage,
    mileageKmPerLitre: roundedMileage,
    fuelCostPerKm: roundedCost,
    costPerKm: roundedCost,
    costPer100Km: Number(costPer100Km.toFixed(2)),
    rating,
    ratingLabel,
  })
}

export interface FuelCostResult {
  totalFuelNeededL: number
  litresRequired: number
  totalCost: number
  costPerKm: number
  co2EmissionsKg: number
}

export function calculateFuelCost(
  distanceKm: number,
  mileageKmPerL: number,
  fuelPricePerLitre: number
): FuelCostResult {
  const safeDist = safeNum(distanceKm, 0, 1e9, 0)
  const safeMileage = safeNum(mileageKmPerL, 0, 1e6, 0)
  const safePrice = safeNum(fuelPricePerLitre, 0, 1e6, 0)

  if (safeDist <= 0 || safeMileage <= 0 || safePrice <= 0) {
    return ensureFinite({ totalFuelNeededL: 0, litresRequired: 0, totalCost: 0, costPerKm: 0, co2EmissionsKg: 0 })
  }

  const totalFuelNeededL = safeDist / safeMileage
  const totalCost = totalFuelNeededL * safePrice
  const costPerKm = safePrice / safeMileage
  const co2EmissionsKg = totalFuelNeededL * 2.45
  const roundedFuel = Number(totalFuelNeededL.toFixed(2))

  return ensureFinite({
    totalFuelNeededL: roundedFuel,
    litresRequired: roundedFuel,
    totalCost: Math.round(totalCost),
    costPerKm: Number(costPerKm.toFixed(2)),
    co2EmissionsKg: Number(co2EmissionsKg.toFixed(1)),
  })
}

export interface TripCostResult {
  totalDistanceKm: number
  fuelRequiredL: number
  fuelCost: number
  tollsCost: number
  miscCost: number
  totalCost: number
  costPerPerson: number
}

export function calculateTripCost(
  oneWayDistanceKm: number,
  isRoundTrip: boolean,
  mileageKmPerL: number,
  fuelPricePerLitre: number,
  tolls: number,
  parkingMisc: number,
  travelers: number
): TripCostResult {
  const safeDist = safeNum(oneWayDistanceKm, 0, 1e9, 0)
  const safeMileage = safeNum(mileageKmPerL, 0, 1e6, 0)
  const safePrice = safeNum(fuelPricePerLitre, 0, 1e6, 0)
  const safeTolls = safeNum(tolls, 0, 1e9, 0)
  const safeMisc = safeNum(parkingMisc, 0, 1e9, 0)
  const safeTravelers = Math.max(1, safeNum(travelers, 1, 1000, 1))

  const totalDistanceKm = isRoundTrip ? safeDist * 2 : safeDist
  const effectiveTolls = isRoundTrip ? safeTolls * 2 : safeTolls

  if (totalDistanceKm <= 0 || safeMileage <= 0) {
    const defaultTotal = Math.round(effectiveTolls + safeMisc)
    return ensureFinite({
      totalDistanceKm: 0,
      fuelRequiredL: 0,
      fuelCost: 0,
      tollsCost: Math.round(effectiveTolls),
      miscCost: Math.round(safeMisc),
      totalCost: defaultTotal,
      costPerPerson: Math.round(defaultTotal / safeTravelers),
    })
  }

  const fuelRequiredL = totalDistanceKm / safeMileage
  const fuelCost = fuelRequiredL * safePrice
  const totalCost = fuelCost + effectiveTolls + safeMisc
  const costPerPerson = totalCost / safeTravelers

  return ensureFinite({
    totalDistanceKm: Number(totalDistanceKm.toFixed(1)),
    fuelRequiredL: Number(fuelRequiredL.toFixed(2)),
    fuelCost: Math.round(fuelCost),
    tollsCost: Math.round(effectiveTolls),
    miscCost: Math.round(safeMisc),
    totalCost: Math.round(totalCost),
    costPerPerson: Math.round(costPerPerson),
  })
}

export interface MonthlyVehicleRunningCostResult {
  monthlyFuelCost: number
  monthlyEmi: number
  monthlyInsurance: number
  monthlyMaintenance: number
  totalMonthlyCost: number
  annualTotalCost: number
  costPerKm: number
}

export function calculateMonthlyVehicleRunningCost(
  monthlyDistanceKm: number,
  mileageKmPerL: number,
  fuelPrice: number,
  monthlyEmi: number,
  annualInsurance: number,
  annualMaintenance: number
): MonthlyVehicleRunningCostResult {
  const safeDist = safeNum(monthlyDistanceKm, 0, 1e9, 0)
  const safeMileage = safeNum(mileageKmPerL, 0, 1e6, 0)
  const safeFuelPrice = safeNum(fuelPrice, 0, 1e6, 0)
  const safeEmi = safeNum(monthlyEmi, 0, 1e9, 0)
  const safeIns = safeNum(annualInsurance, 0, 1e9, 0)
  const safeMaint = safeNum(annualMaintenance, 0, 1e9, 0)

  const monthlyFuelCost = safeMileage > 0 ? (safeDist / safeMileage) * safeFuelPrice : 0
  const monthlyInsurance = safeIns / 12
  const monthlyMaintenance = safeMaint / 12
  const totalMonthlyCost = safeEmi + monthlyFuelCost + monthlyInsurance + monthlyMaintenance
  const annualTotalCost = totalMonthlyCost * 12
  const costPerKm = safeDist > 0 ? totalMonthlyCost / safeDist : 0

  return ensureFinite({
    monthlyFuelCost: Math.round(monthlyFuelCost),
    monthlyEmi: Math.round(safeEmi),
    monthlyInsurance: Math.round(monthlyInsurance),
    monthlyMaintenance: Math.round(monthlyMaintenance),
    totalMonthlyCost: Math.round(totalMonthlyCost),
    annualTotalCost: Math.round(annualTotalCost),
    costPerKm: Number(costPerKm.toFixed(2)),
  })
}

export interface PetrolVsDieselResult {
  monthlyPetrolCost: number
  monthlyDieselCost: number
  monthlySavingsWithDiesel: number
  annualSavingsWithDiesel: number
  breakevenMonths: number
  breakevenKm: number
  isDieselRecommended: boolean
  recommendationNote: string
}

export function calculatePetrolVsDiesel(
  monthlyKm: number,
  petrolMileage: number,
  dieselMileage: number,
  petrolPrice: number,
  dieselPrice: number,
  dieselCarExtraPrice: number
): PetrolVsDieselResult {
  const safeKm = safeNum(monthlyKm, 0, 1e9, 0)
  const safePetrolMileage = safeNum(petrolMileage, 0, 1e6, 0)
  const safeDieselMileage = safeNum(dieselMileage, 0, 1e6, 0)
  const safePetrolPrice = safeNum(petrolPrice, 0, 1e6, 0)
  const safeDieselPrice = safeNum(dieselPrice, 0, 1e6, 0)
  const safeExtraPrice = safeNum(dieselCarExtraPrice, 0, 1e9, 0)

  const monthlyPetrolCost = safePetrolMileage > 0 ? (safeKm / safePetrolMileage) * safePetrolPrice : 0
  const monthlyDieselCost = safeDieselMileage > 0 ? (safeKm / safeDieselMileage) * safeDieselPrice : 0
  const monthlySavingsWithDiesel = Math.max(0, monthlyPetrolCost - monthlyDieselCost)
  const annualSavingsWithDiesel = monthlySavingsWithDiesel * 12

  const breakevenMonths =
    monthlySavingsWithDiesel > 0
      ? Math.min(999, Math.round(safeExtraPrice / monthlySavingsWithDiesel))
      : 999
  const breakevenKm = breakevenMonths !== 999 ? breakevenMonths * safeKm : 0

  const isDieselRecommended = safeKm >= 1500 && breakevenMonths <= 48
  let recommendationNote = ''
  if (safeKm < 1000) {
    recommendationNote = 'Petrol is more economical for low city usage (< 1,000 km/month). Diesel maintenance and DPF filter clogging will offset fuel savings.'
  } else if (isDieselRecommended) {
    recommendationNote = `Diesel is highly advantageous at your driving volume. You will break even on the diesel price premium in approximately ${breakevenMonths} months.`
  } else {
    recommendationNote = `At your driving pattern, it takes ~${breakevenMonths} months to recover the extra diesel purchase cost. Petrol or Hybrid may be preferable.`
  }

  return ensureFinite({
    monthlyPetrolCost: Math.round(monthlyPetrolCost),
    monthlyDieselCost: Math.round(monthlyDieselCost),
    monthlySavingsWithDiesel: Math.round(monthlySavingsWithDiesel),
    annualSavingsWithDiesel: Math.round(annualSavingsWithDiesel),
    breakevenMonths,
    breakevenKm: Math.round(breakevenKm),
    isDieselRecommended,
    recommendationNote,
  })
}

export interface EvVsPetrolResult {
  costPerKmPetrol: number
  petrolCostPerKm: number
  costPerKmEv: number
  evCostPerKm: number
  monthlyCostPetrol: number
  petrolMonthlyCost: number
  monthlyCostEv: number
  evMonthlyCost: number
  monthlySavings: number
  monthlySavingsWithEv: number
  annualSavings: number
  breakevenYears: number
  breakevenKm: number
  fiveYearNetSavings: number
  co2SavedAnnualKg: number
}

export function calculateEvVsPetrol(
  monthlyKm: number,
  petrolMileage: number,
  petrolPrice: number,
  evEfficiencyKmPerKwh: number = 7.5,
  electricityRatePerUnit: number = 7.5,
  evExtraPrice: number = 350000
): EvVsPetrolResult {
  const safeKm = safeNum(monthlyKm, 0, 1e9, 0)
  const safePetrolMileage = safeNum(petrolMileage, 0, 1e6, 0)
  const safePetrolPrice = safeNum(petrolPrice, 0, 1e6, 0)
  const safeEvEff = safeNum(evEfficiencyKmPerKwh, 0.1, 1e6, 7.5)
  const safeElecRate = safeNum(electricityRatePerUnit, 0, 1e6, 7.5)
  const safeEvExtra = safeNum(evExtraPrice, 0, 1e9, 350000)

  const costPerKmPetrol = safePetrolMileage > 0 ? safePetrolPrice / safePetrolMileage : 0
  const costPerKmEv = safeEvEff > 0 ? safeElecRate / safeEvEff : 0

  const monthlyCostPetrol = safeKm * costPerKmPetrol
  const monthlyCostEv = safeKm * costPerKmEv
  const monthlySavings = Math.max(0, monthlyCostPetrol - monthlyCostEv)
  const annualSavings = monthlySavings * 12

  const breakevenYears = annualSavings > 0 ? Number((safeEvExtra / annualSavings).toFixed(1)) : 99
  const breakevenKm = Math.round(breakevenYears * safeKm * 12)
  const fiveYearNetSavings = Math.round(annualSavings * 5 - safeEvExtra)
  const co2SavedAnnualKg = safePetrolMileage > 0 ? Math.round((safeKm / safePetrolMileage) * 2.3 * 12) : 0

  const petrolCostFormatted = Number(costPerKmPetrol.toFixed(2))
  const evCostFormatted = Number(costPerKmEv.toFixed(2))
  const roundedMonthlyPetrol = Math.round(monthlyCostPetrol)
  const roundedMonthlyEv = Math.round(monthlyCostEv)
  const roundedMonthlySavings = Math.round(monthlySavings)

  return ensureFinite({
    costPerKmPetrol: petrolCostFormatted,
    petrolCostPerKm: petrolCostFormatted,
    costPerKmEv: evCostFormatted,
    evCostPerKm: evCostFormatted,
    monthlyCostPetrol: roundedMonthlyPetrol,
    petrolMonthlyCost: roundedMonthlyPetrol,
    monthlyCostEv: roundedMonthlyEv,
    evMonthlyCost: roundedMonthlyEv,
    monthlySavings: roundedMonthlySavings,
    monthlySavingsWithEv: roundedMonthlySavings,
    annualSavings: Math.round(annualSavings),
    breakevenYears,
    breakevenKm,
    fiveYearNetSavings,
    co2SavedAnnualKg,
  })
}

export interface VehicleServiceResult {
  engineOilCost: number
  filterCost: number
  laborCost: number
  consumablesCost: number
  wheelAlignmentCost: number
  estimatedTotal: number
  serviceIntervalKm: number
  keyRecommendations: string[]
}

export function calculateVehicleServiceCost(
  vehicleType: 'bike' | 'hatchback' | 'sedan' | 'suv',
  odometerKm: number,
  serviceType: 'minor' | 'major'
): VehicleServiceResult {
  const safeKm = safeNum(odometerKm, 0, 1e9, 0)
  let baseOil = 1200
  let filter = 450
  let labor = 1200
  let consumables = 400
  let alignment = 600

  if (vehicleType === 'bike') {
    baseOil = 600
    filter = 180
    labor = 450
    consumables = 150
    alignment = 0
  } else if (vehicleType === 'suv') {
    baseOil = 2800
    filter = 950
    labor = 2400
    consumables = 650
    alignment = 900
  } else if (vehicleType === 'sedan') {
    baseOil = 2100
    filter = 700
    labor = 1800
    consumables = 500
    alignment = 750
  }

  if (serviceType === 'major') {
    baseOil *= 1.1
    filter *= 2.2 // air, cabin, fuel filters
    labor *= 1.6
    consumables *= 2.0 // brake fluid, coolant flush, throttle body clean
  }

  const estimatedTotal = baseOil + filter + labor + consumables + alignment
  const nextServiceKm = Math.ceil((safeKm + 1) / 10000) * 10000

  const keyRecommendations = [
    serviceType === 'major'
      ? 'Includes complete Brake fluid & Radiator coolant flush'
      : 'Standard Synthetic Engine Oil replacement & multi-point check',
    'Verify tyre tread depth & rotate tyres every 10,000 km',
    'Inspect battery terminal voltage and brake pad thickness',
  ]

  return ensureFinite({
    engineOilCost: Math.round(baseOil),
    filterCost: Math.round(filter),
    laborCost: Math.round(labor),
    consumablesCost: Math.round(consumables),
    wheelAlignmentCost: Math.round(alignment),
    estimatedTotal: Math.round(estimatedTotal),
    serviceIntervalKm: nextServiceKm,
    keyRecommendations,
  })
}

export interface JcbMachinePreset {
  id: string
  name: string
  typicalLph: number
  description: string
}

export const JCB_MACHINE_PRESETS: JcbMachinePreset[] = [
  { id: 'jcb-3dx', name: 'JCB 3DX Backhoe Loader', typicalLph: 4.8, description: 'India’s most popular backhoe loader (EcoMax engine, 76HP)' },
  { id: 'jcb-4dx', name: 'JCB 4DX Heavy Duty', typicalLph: 5.6, description: 'Heavy excavation backhoe loader (92HP engine)' },
  { id: 'excavator-20t', name: '20-Ton Heavy Excavator (Tata Hitachi / CAT)', typicalLph: 14.5, description: 'Quarrying, earthwork and heavy canal digging' },
  { id: 'excavator-10t', name: '7 to 10-Ton Midi Excavator', typicalLph: 8.2, description: 'Medium urban foundation and pipeline works' },
  { id: 'mini-excavator', name: 'Mini Excavator (3 to 5-Ton)', typicalLph: 3.2, description: 'Trenching, plumbing & narrow village roadwork' },
  { id: 'custom', name: 'Custom Heavy Machine', typicalLph: 6.0, description: 'Custom hourly fuel burn' },
]

export interface JcbFuelResult {
  hourlyFuelCost: number
  dailyFuelLitres: number
  dailyFuelCost: number
  weeklyFuelCost: number
  monthlyFuelLitres: number
  monthlyFuelCost: number
  annualFuelCost: number
}

export function calculateJcbFuel(
  dailyHours: number,
  fuelLph: number,
  dieselPrice: number,
  workingDaysPerMonth: number
): JcbFuelResult {
  const safeHours = safeNum(dailyHours, 0, 24, 8)
  const safeLph = safeNum(fuelLph, 0, 1e6, 5)
  const safePrice = safeNum(dieselPrice, 0, 1e6, 90)
  const safeDays = safeNum(workingDaysPerMonth, 0, 31, 26)

  const hourlyFuelCost = safeLph * safePrice
  const dailyFuelLitres = safeLph * safeHours
  const dailyFuelCost = dailyFuelLitres * safePrice
  const weeklyFuelCost = dailyFuelCost * 6
  const monthlyFuelLitres = dailyFuelLitres * safeDays
  const monthlyFuelCost = dailyFuelCost * safeDays
  const annualFuelCost = monthlyFuelCost * 12

  return ensureFinite({
    hourlyFuelCost: Math.round(hourlyFuelCost),
    dailyFuelLitres: Number(dailyFuelLitres.toFixed(1)),
    dailyFuelCost: Math.round(dailyFuelCost),
    weeklyFuelCost: Math.round(weeklyFuelCost),
    monthlyFuelLitres: Math.round(monthlyFuelLitres),
    monthlyFuelCost: Math.round(monthlyFuelCost),
    annualFuelCost: Math.round(annualFuelCost),
  })
}

// ----------------- CONSTRUCTION CALCULATORS -----------------

export interface CementCalcResult {
  totalBags: number
  totalWeightKg: number
  estimatedCostRs: number
  sandRequiredCft: number
  aggregateRequiredCft: number
}

export function calculateCement(
  workType: 'plastering' | 'brickwork' | 'flooring' | 'slab',
  areaSqft: number,
  thicknessInchesOrMm: number = 12
): CementCalcResult {
  const safeArea = safeNum(areaSqft, 0, 1e9, 0)
  const safeThickness = safeNum(thicknessInchesOrMm, 0, 1e6, 12)
  let bags = 0
  let sandCft = 0
  let aggregateCft = 0

  if (workType === 'plastering') {
    // 12mm plaster with 1:4 mix: ~1 bag per 100 sq.ft
    bags = Math.ceil(safeArea * 0.0105)
    sandCft = Math.round(bags * 4.5)
  } else if (workType === 'brickwork') {
    // 9" brick wall: ~1 bag per 50 sq.ft
    bags = Math.ceil(safeArea * 0.02)
    sandCft = Math.round(bags * 5.0)
  } else if (workType === 'flooring') {
    // 2" screed bed 1:4 mix
    bags = Math.ceil(safeArea * 0.016)
    sandCft = Math.round(bags * 4.0)
  } else {
    // RCC slab (5" thick M20 concrete): ~0.45 bags per sq.ft
    bags = Math.ceil(safeArea * 0.42)
    sandCft = Math.round(safeArea * 0.9)
    aggregateCft = Math.round(safeArea * 1.8)
  }

  const estimatedCostRs = bags * 390 // Avg ₹390 per 50kg bag (Ultratech/ACC)

  return ensureFinite({
    totalBags: bags,
    totalWeightKg: bags * 50,
    estimatedCostRs,
    sandRequiredCft: sandCft,
    aggregateRequiredCft: aggregateCft,
  })
}

export interface ConcreteResult {
  volumeCum: number
  volumeCft: number
  dryVolumeCum: number
  cementBags: number
  sandTonnes: number
  sandCft: number
  aggregateTonnes: number
  aggregateCft: number
  waterLitres: number
}

export function calculateConcrete(
  lengthFt: number,
  widthFt: number,
  depthInches: number,
  mixRatio: 'M15' | 'M20' | 'M25' = 'M20'
): ConcreteResult {
  const safeL = safeNum(lengthFt, 0, 1e6, 0)
  const safeW = safeNum(widthFt, 0, 1e6, 0)
  const safeD = safeNum(depthInches, 0, 1e6, 0)

  const volumeCft = safeL * safeW * (safeD / 12)
  const volumeCum = volumeCft / 35.3147
  // Dry volume coefficient 1.54
  const dryVolumeCum = volumeCum * 1.54

  // Ratios:
  // M15 = 1:2:4 (Sum 7)
  // M20 = 1:1.5:3 (Sum 5.5)
  // M25 = 1:1:2 (Sum 4)
  let sumParts = 5.5
  let cementPart = 1
  let sandPart = 1.5
  let aggPart = 3

  if (mixRatio === 'M15') {
    sumParts = 7
    sandPart = 2
    aggPart = 4
  } else if (mixRatio === 'M25') {
    sumParts = 4
    sandPart = 1
    aggPart = 2
  }

  const cementCum = (dryVolumeCum * cementPart) / sumParts
  const cementBags = Math.ceil(cementCum / 0.035) // 1 bag = 0.035 cum

  const sandCum = (dryVolumeCum * sandPart) / sumParts
  const sandCft = Math.round(sandCum * 35.3147)
  const sandTonnes = Number((sandCum * 1.6).toFixed(2))

  const aggCum = (dryVolumeCum * aggPart) / sumParts
  const aggregateCft = Math.round(aggCum * 35.3147)
  const aggregateTonnes = Number((aggCum * 1.55).toFixed(2))

  const waterLitres = Math.round(cementBags * 28) // 0.55 w/c ratio ~28L/bag

  return ensureFinite({
    volumeCum: Number(volumeCum.toFixed(2)),
    volumeCft: Math.round(volumeCft),
    dryVolumeCum: Number(dryVolumeCum.toFixed(2)),
    cementBags,
    sandTonnes,
    sandCft,
    aggregateTonnes,
    aggregateCft,
    waterLitres,
  })
}

export interface BrickResult {
  totalBricks: number
  wallAreaSqft: number
  cementBags: number
  sandCft: number
  sandBrass: number
  estimatedCostRs: number
}

export function calculateBricks(
  wallLengthFt: number,
  wallHeightFt: number,
  wallThicknessInches: 4.5 | 9 = 9,
  wastagePct: number = 8
): BrickResult {
  const safeL = safeNum(wallLengthFt, 0, 1e6, 0)
  const safeH = safeNum(wallHeightFt, 0, 1e6, 0)
  const safeWastage = safeNum(wastagePct, 0, 100, 8)
  const wallAreaSqft = safeL * safeH
  // Standard Indian Red Clay Brick (9" x 4.25" x 2.75") with mortar:
  // 9" wall = 9 to 10 bricks per sq.ft
  // 4.5" wall = 4.5 to 5 bricks per sq.ft
  const bricksPerSqft = wallThicknessInches === 9 ? 9.2 : 4.6
  const rawBricks = wallAreaSqft * bricksPerSqft
  const totalBricks = Math.ceil(rawBricks * (1 + safeWastage / 100))

  // Mortar requirements
  const cementBags = Math.ceil((totalBricks / 1000) * (wallThicknessInches === 9 ? 3.5 : 2.0))
  const sandCft = Math.round(cementBags * 5.2)
  const sandBrass = Number((sandCft / 100).toFixed(2))

  const estimatedCostRs = totalBricks * 9.5 + cementBags * 390 + sandCft * 55

  return ensureFinite({
    totalBricks,
    wallAreaSqft: Math.round(wallAreaSqft),
    cementBags,
    sandCft,
    sandBrass,
    estimatedCostRs: Math.round(estimatedCostRs),
  })
}

export interface TileResult {
  roomAreaSqft: number
  skirtingAreaSqft: number
  totalTilingAreaSqft: number
  tileCount: number
  boxCount: number
  adhesiveBags: number
  estimatedCostRs: number
}

export function calculateTiles(
  lengthFt: number,
  widthFt: number,
  tileSize: '2x2' | '4x2' | '2x1' | '1x1' = '2x2',
  includeSkirting: boolean = true
): TileResult {
  const safeL = safeNum(lengthFt, 0, 1e6, 0)
  const safeW = safeNum(widthFt, 0, 1e6, 0)
  const roomAreaSqft = safeL * safeW
  // 4-inch skirting along perimeter
  const skirtingAreaSqft = includeSkirting ? 2 * (safeL + safeW) * (4 / 12) : 0
  const netArea = roomAreaSqft + skirtingAreaSqft
  // 10% wastage for cutting corners & borders
  const totalTilingAreaSqft = Math.round(netArea * 1.1)

  let tileSqft = 4 // default 2x2
  let tilesPerBox = 4
  let costPerSqft = 55 // Vitrified GVT average

  if (tileSize === '4x2') {
    tileSqft = 8
    tilesPerBox = 2
    costPerSqft = 75
  } else if (tileSize === '2x1') {
    tileSqft = 2
    tilesPerBox = 6
    costPerSqft = 45
  } else if (tileSize === '1x1') {
    tileSqft = 1
    tilesPerBox = 10
    costPerSqft = 40
  }

  const tileCount = Math.ceil(totalTilingAreaSqft / tileSqft)
  const boxCount = Math.ceil(tileCount / tilesPerBox)
  // Tile adhesive: 1 bag (20kg) covers ~40-50 sq.ft
  const adhesiveBags = Math.ceil(totalTilingAreaSqft / 45)
  const estimatedCostRs = Math.round(totalTilingAreaSqft * costPerSqft + adhesiveBags * 320)

  return ensureFinite({
    roomAreaSqft: Math.round(roomAreaSqft),
    skirtingAreaSqft: Math.round(skirtingAreaSqft),
    totalTilingAreaSqft,
    tileCount,
    boxCount,
    adhesiveBags,
    estimatedCostRs,
  })
}

export interface PaintResult {
  wallAreaSqft: number
  paintLitres: number
  primerLitres: number
  puttyKg: number
  bucket20L: number
  bucket10L: number
  bucket4L: number
  estimatedCostRs: number
}

export function calculatePaint(
  floorAreaSqft: number,
  ceilingHeightFt: number = 10,
  paintGrade: 'economy' | 'premium' | 'luxury' = 'premium'
): PaintResult {
  const safeArea = safeNum(floorAreaSqft, 0, 1e9, 0)
  // Thumb rule: Wall surface area ~ 3.5x to 4x of floor carpet area (deducting doors/windows)
  const wallAreaSqft = Math.round(safeArea * 3.6)

  // 2 coats emulsion paint coverage ~130 sq.ft per litre
  const paintLitres = Math.ceil(wallAreaSqft / 130)
  // 1 coat primer coverage ~150 sq.ft per litre
  const primerLitres = Math.ceil(wallAreaSqft / 150)
  // Wall putty: ~1 kg per 15 sq.ft for 2 coats
  const puttyKg = Math.ceil(wallAreaSqft / 15)

  // Buckets breakdown
  const bucket20L = Math.floor(paintLitres / 20)
  const rem20 = paintLitres % 20
  const bucket10L = Math.floor(rem20 / 10)
  const rem10 = rem20 % 10
  const bucket4L = Math.ceil(rem10 / 4)

  const rates: Record<string, number> = { economy: 220, premium: 380, luxury: 650 }
  const paintRate = rates[paintGrade] || 380
  const estimatedCostRs = Math.round(
    paintLitres * paintRate + primerLitres * 180 + puttyKg * 28 + wallAreaSqft * 12 // ₹12/sqft labor
  )

  return ensureFinite({
    wallAreaSqft,
    paintLitres,
    primerLitres,
    puttyKg,
    bucket20L,
    bucket10L,
    bucket4L,
    estimatedCostRs,
  })
}

export type ConstructionTier = 'economy' | 'standard' | 'premium' | 'luxury'

export interface ConstructionCostResult {
  totalBuiltUpAreaSqft: number
  totalBuiltUpSqft: number
  ratePerSqft: number
  totalCostRs: number
  materials: {
    cementCost: number
    cementBags: number
    steelCost: number
    steelTonnes: number
    sandAggregatesCost: number
    bricksCost: number
    bricksCount: number
    flooringTilesCost: number
    finishingPlumbingElectricalCost: number
    laborCost: number
  }
}

export function calculateConstructionCost(
  areaSqft: number,
  floors: number,
  tier: ConstructionTier
): ConstructionCostResult {
  const safeArea = safeNum(areaSqft, 0, 1e9, 0)
  const safeFloors = Math.max(1, safeNum(floors, 1, 100, 1))
  const rates: Record<ConstructionTier, number> = {
    economy: 1550,
    standard: 1850,
    premium: 2400,
    luxury: 3200,
  }

  const ratePerSqft = rates[tier] || 1850
  const totalBuiltUpAreaSqft = safeArea * safeFloors
  const totalCostRs = totalBuiltUpAreaSqft * ratePerSqft

  const cementCost = Math.round(totalCostRs * 0.164)
  const cementBags = Math.round(totalBuiltUpAreaSqft * 0.42)

  const steelCost = Math.round(totalCostRs * 0.142)
  const steelTonnes = Number(((totalBuiltUpAreaSqft * 3.6) / 1000).toFixed(2))

  const sandAggregatesCost = Math.round(totalCostRs * 0.103)
  const bricksCost = Math.round(totalCostRs * 0.10)
  const bricksCount = Math.round(totalBuiltUpAreaSqft * 18.5)

  const flooringTilesCost = Math.round(totalCostRs * 0.10)
  const finishingPlumbingElectricalCost = Math.round(totalCostRs * 0.141)
  const laborCost = Math.round(totalCostRs * 0.25)

  return ensureFinite({
    totalBuiltUpAreaSqft,
    totalBuiltUpSqft: totalBuiltUpAreaSqft,
    ratePerSqft,
    totalCostRs,
    materials: {
      cementCost,
      cementBags,
      steelCost,
      steelTonnes,
      sandAggregatesCost,
      bricksCost,
      bricksCount,
      flooringTilesCost,
      finishingPlumbingElectricalCost,
      laborCost,
    },
  })
}

// ----------------- ENERGY & HOME CALCULATORS -----------------

export interface ElectricityResult {
  monthlyUnitsKwh: number
  dailyUnitsKwh: number
  estimatedMonthlyBill: number
  monthlyBill: number
  estimatedAnnualBill: number
  carbonFootprintKg: number
}

export function calculateElectricity(
  unitsPerMonth: number,
  ratePerUnit: number = 7.0,
  fixedMonthlyCharges: number = 100
): ElectricityResult {
  const safeUnits = safeNum(unitsPerMonth, 0, 1e9, 0)
  const safeRate = safeNum(ratePerUnit, 0, 1e6, 7.0)
  const safeFixed = safeNum(fixedMonthlyCharges, 0, 1e6, 100)
  const dailyUnitsKwh = safeUnits / 30

  let estimatedMonthlyBill = 0
  if (safeRate === 7.0) {
    if (safeUnits <= 100) {
      estimatedMonthlyBill = safeUnits * 3.8
    } else if (safeUnits <= 250) {
      estimatedMonthlyBill = 100 * 3.8 + (safeUnits - 100) * 5.8
    } else if (safeUnits <= 500) {
      estimatedMonthlyBill = 100 * 3.8 + 150 * 5.8 + (safeUnits - 250) * 7.6
    } else {
      estimatedMonthlyBill = 100 * 3.8 + 150 * 5.8 + 250 * 7.6 + (safeUnits - 500) * 8.9
    }
    estimatedMonthlyBill += safeFixed
  } else {
    estimatedMonthlyBill = safeUnits * safeRate + safeFixed
  }

  const estimatedAnnualBill = estimatedMonthlyBill * 12
  const carbonFootprintKg = safeUnits * 0.82
  const roundedMonthlyBill = Math.round(estimatedMonthlyBill)

  return ensureFinite({
    monthlyUnitsKwh: Math.round(safeUnits),
    dailyUnitsKwh: Number(dailyUnitsKwh.toFixed(2)),
    estimatedMonthlyBill: roundedMonthlyBill,
    monthlyBill: roundedMonthlyBill,
    estimatedAnnualBill: Math.round(estimatedAnnualBill),
    carbonFootprintKg: Math.round(carbonFootprintKg),
  })
}

export interface AcCostResult {
  dailyUnitsKwh: number
  monthlyUnitsKwh: number
  dailyCostRs: number
  monthlyCostRs: number
  summerSeasonCostRs: number // 4 months summer
  averagePowerWatts: number
  fiveStarSavingsMonthly: number
}

export function calculateAcCost(
  tonnage: 1.0 | 1.5 | 2.0 = 1.5,
  starRating: 3 | 5 = 5,
  isInverter: boolean = true,
  dailyHours: number = 8,
  ratePerUnit: number = 7.5
): AcCostResult {
  const safeHours = safeNum(dailyHours, 0, 24, 8)
  const safeRate = safeNum(ratePerUnit, 0, 1e6, 7.5)

  // Approximate average running wattage (compressor cycling at 24C):
  // 1.5T 3-star non-inverter: ~1450W
  // 1.5T 3-star inverter: ~1150W
  // 1.5T 5-star inverter: ~900W
  let baseWatts = 1150

  if (tonnage === 1.0) baseWatts *= 0.7
  else if (tonnage === 2.0) baseWatts *= 1.35

  if (starRating === 5 && isInverter) {
    baseWatts *= 0.78
  } else if (!isInverter) {
    baseWatts *= 1.25
  }

  const dailyUnitsKwh = (baseWatts * safeHours) / 1000
  const monthlyUnitsKwh = dailyUnitsKwh * 30
  const dailyCostRs = dailyUnitsKwh * safeRate
  const monthlyCostRs = monthlyUnitsKwh * safeRate
  const summerSeasonCostRs = monthlyCostRs * 4

  // Compared to standard 3-star non-inverter
  const threeStarWatts = baseWatts * 1.3
  const threeStarMonthly = ((threeStarWatts * safeHours * 30) / 1000) * safeRate
  const fiveStarSavingsMonthly = Math.max(0, Math.round(threeStarMonthly - monthlyCostRs))

  return ensureFinite({
    dailyUnitsKwh: Number(dailyUnitsKwh.toFixed(2)),
    monthlyUnitsKwh: Math.round(monthlyUnitsKwh),
    dailyCostRs: Math.round(dailyCostRs),
    monthlyCostRs: Math.round(monthlyCostRs),
    summerSeasonCostRs: Math.round(summerSeasonCostRs),
    averagePowerWatts: Math.round(baseWatts),
    fiveStarSavingsMonthly,
  })
}

export interface FanCostResult {
  dailyUnitsKwh: number
  monthlyUnitsKwh: number
  monthlyCostRs: number
  monthlyCost: number
  annualCostRs: number
  annualCost: number
  annualBldcSavingsRs: number
  savingsIfBldcAnnual: number
  bldcPaybackMonths: number
}

export function calculateFanCost(
  arg1: 'bldc' | 'regular_induction' | number = 3,
  arg2: number = 14,
  arg3: number | boolean = false,
  arg4: number = 7.5
): FanCostResult {
  let fanCount = 3
  let dailyHours = 14
  let isBldc = false
  let ratePerUnit = 7.5

  if (typeof arg1 === 'string') {
    isBldc = arg1 === 'bldc'
    fanCount = safeNum(arg2, 0, 1e6, 3)
    dailyHours = safeNum(arg3, 0, 24, 14)
    ratePerUnit = safeNum(arg4, 0, 1e6, 7.5)
  } else {
    fanCount = safeNum(arg1, 0, 1e6, 3)
    dailyHours = safeNum(arg2, 0, 24, 14)
    isBldc = typeof arg3 === 'boolean' ? arg3 : false
    ratePerUnit = safeNum(arg4, 0, 1e6, 7.5)
  }

  const fanWatts = isBldc ? 28 : 75
  const dailyUnitsKwh = (fanWatts * fanCount * dailyHours) / 1000
  const monthlyUnitsKwh = dailyUnitsKwh * 30
  const monthlyCostRs = Math.round(monthlyUnitsKwh * ratePerUnit)
  const annualCostRs = Math.round(monthlyCostRs * 12)

  // BLDC savings
  const standardAnnual = ((75 * fanCount * dailyHours * 365) / 1000) * ratePerUnit
  const bldcAnnual = ((28 * fanCount * dailyHours * 365) / 1000) * ratePerUnit
  const annualBldcSavingsRs = Math.max(0, Math.round(standardAnnual - bldcAnnual))
  // Avg price difference between BLDC & standard fan is ~₹1,400 per fan
  const bldcExtraCost = fanCount * 1400
  const bldcPaybackMonths =
    annualBldcSavingsRs > 0 ? Math.round((bldcExtraCost / annualBldcSavingsRs) * 12) : 18

  return ensureFinite({
    dailyUnitsKwh: Number(dailyUnitsKwh.toFixed(2)),
    monthlyUnitsKwh: Math.round(monthlyUnitsKwh),
    monthlyCostRs,
    monthlyCost: monthlyCostRs,
    annualCostRs,
    annualCost: annualCostRs,
    annualBldcSavingsRs,
    savingsIfBldcAnnual: annualBldcSavingsRs,
    bldcPaybackMonths,
  })
}

export interface InverterResult {
  backupHours: number
  backupHoursDecimal: number
  backupMinutesFormatted: string
  usableWattHours: number
  dcAmpsDraw: number
  recommendedUsage: string
}

export function calculateInverterBackup(
  loadWatts: number,
  batteryAh: number,
  batteryVoltage: number,
  inverterEfficiencyPct: number = 85,
  depthOfDischargePct: number = 80
): InverterResult {
  const safeLoad = safeNum(loadWatts, 0, 1e9, 0)
  const safeAh = safeNum(batteryAh, 0, 1e6, 0)
  const safeVolt = safeNum(batteryVoltage, 0, 1e6, 12)
  const safeEffInput = safeNum(inverterEfficiencyPct, 1, 100, 85)
  const safeDodInput = safeNum(depthOfDischargePct, 1, 100, 80)

  if (safeLoad <= 0 || safeAh <= 0 || safeVolt <= 0) {
    return ensureFinite({
      backupHours: 0,
      backupHoursDecimal: 0,
      backupMinutesFormatted: '0 hrs 0 mins',
      usableWattHours: 0,
      dcAmpsDraw: 0,
      recommendedUsage: 'Enter valid power load and battery capacity',
    })
  }

  // Handle both 0.85 and 85
  const effPct = safeEffInput <= 1 && safeEffInput > 0 ? safeEffInput * 100 : safeEffInput
  const dodPct = safeDodInput <= 1 && safeDodInput > 0 ? safeDodInput * 100 : safeDodInput

  const totalWattHours = safeAh * safeVolt
  const usableWattHours = totalWattHours * (dodPct / 100) * (effPct / 100)
  const totalHours = usableWattHours / safeLoad

  const hrs = Math.floor(totalHours)
  const mins = Math.round((totalHours - hrs) * 60)
  const dcAmpsDraw = safeLoad / (safeVolt * (effPct / 100))

  let recommendedUsage = 'Adequate for basic lights, 2-3 ceiling fans & Wi-Fi'
  if (totalHours > 8) {
    recommendedUsage = 'Exceptional multi-appliance endurance (overnight full-house backup)'
  } else if (totalHours > 4) {
    recommendedUsage = 'Solid standard home load backup during typical power cuts'
  } else if (totalHours < 2) {
    recommendedUsage = 'Heavy load! Consider shedding high-wattage devices or upgrading Ah'
  }

  const roundedBackup = Number(totalHours.toFixed(2))

  return ensureFinite({
    backupHours: roundedBackup,
    backupHoursDecimal: roundedBackup,
    backupMinutesFormatted: `${hrs} hrs ${mins} mins`,
    usableWattHours: Math.round(usableWattHours),
    dcAmpsDraw: Number(dcAmpsDraw.toFixed(1)),
    recommendedUsage,
  })
}

export interface SolarResult {
  systemCapacityKw: number
  recommendedKw: number
  panelCount: number
  roofAreaSqft: number
  dailyUnitsGenerated: number
  monthlyUnitsGenerated: number
  monthlySavingsRs: number
  annualSavingsRs: number
  twentyFiveYearSavingsRs: number
  pmSuryaGharSubsidyRs: number
}

export function calculateSolar(
  monthlyBillOrUnits: number,
  isMonthlyUnits: boolean,
  sunHours: number = 5.0,
  panelWattage: number = 540,
  avgTariff: number = 7.5
): SolarResult {
  const safeBillOrUnits = safeNum(monthlyBillOrUnits, 0, 1e9, 0)
  const safeAvgTariff = Math.max(0.1, safeNum(avgTariff, 0.1, 100, 7.5))
  const safeSunHours = Math.max(0.5, safeNum(sunHours, 0.5, 12, 5.0))
  const safePanelWattage = Math.max(50, safeNum(panelWattage, 50, 2000, 540))

  const monthlyUnits = isMonthlyUnits ? safeBillOrUnits : safeBillOrUnits / safeAvgTariff
  const dailyUnitsNeeded = monthlyUnits / 30

  const generationFactorPerKw = safeSunHours * 0.78
  const rawKwNeeded = generationFactorPerKw > 0 ? dailyUnitsNeeded / generationFactorPerKw : 1
  const systemCapacityKw = Math.max(1, Number(rawKwNeeded.toFixed(1)))

  const panelCapacityKw = safePanelWattage / 1000
  const panelCount = Math.max(2, Math.ceil(systemCapacityKw / Math.max(0.05, panelCapacityKw)))
  const actualSystemKw = Number((panelCount * panelCapacityKw).toFixed(2))

  const roofAreaSqft = Math.round(panelCount * 25)

  const dailyUnitsGenerated = Number((actualSystemKw * generationFactorPerKw).toFixed(1))
  const monthlyUnitsGenerated = Math.round(dailyUnitsGenerated * 30)

  const monthlySavingsRs = Math.round(monthlyUnitsGenerated * safeAvgTariff)
  const annualSavingsRs = monthlySavingsRs * 12
  const twentyFiveYearSavingsRs = Math.round(annualSavingsRs * 22)

  let pmSuryaGharSubsidyRs = 0
  if (actualSystemKw >= 3) {
    pmSuryaGharSubsidyRs = 78000
  } else if (actualSystemKw >= 2) {
    pmSuryaGharSubsidyRs = 60000
  } else if (actualSystemKw >= 1) {
    pmSuryaGharSubsidyRs = 30000
  }

  return ensureFinite({
    systemCapacityKw: actualSystemKw,
    recommendedKw: actualSystemKw,
    panelCount,
    roofAreaSqft,
    dailyUnitsGenerated,
    monthlyUnitsGenerated,
    monthlySavingsRs,
    annualSavingsRs,
    twentyFiveYearSavingsRs,
    pmSuryaGharSubsidyRs,
  })
}

export interface WaterTankResult {
  dailyRequirementLitres: number
  recommendedOhtCapacityLitres: number
  recommendedSumpCapacityLitres: number
  ohtDimensionsFt: string
  sumpDimensionsFt: string
}

export function calculateWaterTank(
  familyMembers: number = 4,
  storageDays: number = 1.5,
  includeGardenCarWash: boolean = true
): WaterTankResult {
  const safeFamily = Math.max(1, safeNum(familyMembers, 1, 1000, 4))
  const safeDays = safeNum(storageDays, 0, 365, 1.5)
  // Indian Standard IS: 1172 - Domestic consumption benchmark: 135 to 150 L/head/day
  const baseRate = 135
  const extraForWashing = includeGardenCarWash ? 75 : 0
  const dailyRequirementLitres = Math.round(safeFamily * baseRate + extraForWashing)
  const storageTotal = Math.round(dailyRequirementLitres * safeDays)

  // Overhead tank: typically sized for 1-day storage
  const recommendedOhtCapacityLitres = Math.ceil(dailyRequirementLitres / 500) * 500
  // Sump: typically sized for 1.5 to 2 days storage
  const recommendedSumpCapacityLitres = Math.ceil((dailyRequirementLitres * 2) / 1000) * 1000

  // 1 Cubic Foot = 28.317 Litres
  const sumpCft = recommendedSumpCapacityLitres / 28.317
  // Assume 5ft depth
  const sumpArea = sumpCft / 5
  const sumpSide = Math.round(Math.sqrt(sumpArea) * 10) / 10

  return ensureFinite({
    dailyRequirementLitres,
    recommendedOhtCapacityLitres,
    recommendedSumpCapacityLitres,
    ohtDimensionsFt: `Standard cylindrical tank (~${recommendedOhtCapacityLitres}L)`,
    sumpDimensionsFt: `${sumpSide} ft × ${sumpSide} ft × 5 ft depth (~${recommendedSumpCapacityLitres}L)`,
  })
}

export interface LpgResult {
  daysCylinderLasts: number
  monthlyExpenditureRs: number
  dailyCostRs: number
  totalCookingHours: number
}

export function calculateLpgUsage(
  familyMembers: number = 4,
  burnersUsedHoursDaily: number = 2.5,
  cylinderPriceRs: number = 850
): LpgResult {
  const safeFamily = Math.max(1, safeNum(familyMembers, 1, 100, 4))
  const safeHours = safeNum(burnersUsedHoursDaily, 0, 24, 2.5)
  const safePrice = safeNum(cylinderPriceRs, 0, 1e6, 850)

  // Standard 14.2 kg domestic LPG cylinder has ~88 to 92 burner hours (consumption ~155-165g/hr per medium burner)
  const totalBurnerHoursCapacity = 90
  const adjustedHours = Math.max(0.5, safeHours * (0.8 + (safeFamily * 0.05)))
  const daysCylinderLasts = Math.max(1, Math.round(totalBurnerHoursCapacity / adjustedHours))
  const cylindersPerMonth = 30 / daysCylinderLasts
  const monthlyExpenditureRs = Math.round(cylindersPerMonth * safePrice)
  const dailyCostRs = Math.round(monthlyExpenditureRs / 30)

  return ensureFinite({
    daysCylinderLasts,
    monthlyExpenditureRs,
    dailyCostRs,
    totalCookingHours: totalBurnerHoursCapacity,
  })
}

// ----------------- SALARY & FINANCE CALCULATORS -----------------

export interface SalaryHikeResult {
  currentCtc: number
  newCtc: number
  absoluteHikeAnnual: number
  annualHikeAmount: number
  hikePercentage: number
  monthlyGrossCurrent: number
  monthlyGrossNew: number
  monthlyGrossIncrease: number
  monthlyHikeAmount: number
  estimatedMonthlyInHandCurrent: number
  estimatedMonthlyInHandNew: number
  monthlyInHandIncrease: number
}

export function calculateSalaryHike(
  currentCtc: number,
  hikeValue: number,
  mode?: 'percentage' | 'offeredCtc'
): SalaryHikeResult {
  const safeCurrentCtc = safeNum(currentCtc, 0, 1e11, 0)
  const safeHikeVal = safeNum(hikeValue, 0, 1e11, 0)

  let newCtc = 0
  let hikePercentage = 0
  let absoluteHikeAnnual = 0

  const actualMode = mode || (safeHikeVal > 100 ? 'offeredCtc' : 'percentage')

  if (actualMode === 'percentage') {
    hikePercentage = safeHikeVal
    absoluteHikeAnnual = (safeCurrentCtc * hikePercentage) / 100
    newCtc = safeCurrentCtc + absoluteHikeAnnual
  } else {
    newCtc = safeHikeVal
    absoluteHikeAnnual = Math.max(0, newCtc - safeCurrentCtc)
    hikePercentage = safeCurrentCtc > 0 ? (absoluteHikeAnnual / safeCurrentCtc) * 100 : 0
  }

  const monthlyGrossCurrent = Math.round(safeCurrentCtc / 12)
  const monthlyGrossNew = Math.round(newCtc / 12)
  const monthlyGrossIncrease = monthlyGrossNew - monthlyGrossCurrent

  const estimateInHandMonthly = (ctc: number): number => {
    if (ctc <= 0) return 0
    if (ctc <= 775000) return Math.round((ctc * 0.94) / 12)
    let effectiveRatio = 0.88
    if (ctc > 2500000) effectiveRatio = 0.72
    else if (ctc > 1500000) effectiveRatio = 0.78
    else if (ctc > 1000000) effectiveRatio = 0.83
    return Math.round((ctc * effectiveRatio) / 12)
  }

  const estimatedMonthlyInHandCurrent = estimateInHandMonthly(safeCurrentCtc)
  const estimatedMonthlyInHandNew = estimateInHandMonthly(newCtc)
  const monthlyInHandIncrease = estimatedMonthlyInHandNew - estimatedMonthlyInHandCurrent
  const roundedAnnualHike = Math.round(absoluteHikeAnnual)

  return ensureFinite({
    currentCtc: safeCurrentCtc,
    newCtc: Math.round(newCtc),
    absoluteHikeAnnual: roundedAnnualHike,
    annualHikeAmount: roundedAnnualHike,
    hikePercentage: Number(hikePercentage.toFixed(2)),
    monthlyGrossCurrent,
    monthlyGrossNew,
    monthlyGrossIncrease,
    monthlyHikeAmount: Math.round(roundedAnnualHike / 12),
    estimatedMonthlyInHandCurrent,
    estimatedMonthlyInHandNew,
    monthlyInHandIncrease,
  })
}

export interface InHandSalaryResult {
  annualCtc: number
  monthlyGross: number
  monthlyEpfDeduction: number
  monthlyProfessionalTax: number
  monthlyTdsIncomeTax: number
  totalMonthlyDeductions: number
  monthlyInHand: number
  annualInHand: number
  totalAnnualTax: number
}

export function calculateInHandSalary(
  annualCtc: number,
  regime: 'new' | 'old' = 'new'
): InHandSalaryResult {
  const safeCtc = safeNum(annualCtc, 0, 1e11, 0)
  const monthlyGross = Math.round(safeCtc / 12)
  // Basic is typically 40% to 50% of CTC
  const basicAnnual = safeCtc * 0.5
  // EPF: 12% of basic (capped optionally or uncapped)
  const monthlyEpfDeduction = Math.min(1800, Math.round((basicAnnual * 0.12) / 12))
  const monthlyProfessionalTax = 200

  // Indian New Tax Regime (FY 2024-25 / 2025-26):
  // Standard Deduction: ₹75,000
  // Slabs: 0-3L (0%), 3-7L (5%), 7-10L (10%), 10-12L (15%), 12-15L (20%), >15L (30%)
  // Section 87A rebate: zero tax if taxable income <= ₹7,00,000 (i.e. CTC <= ₹7,75,000)
  const standardDeduction = regime === 'new' ? 75000 : 50000
  const taxableIncome = Math.max(0, safeCtc - standardDeduction)

  let totalAnnualTax = 0
  if (regime === 'new') {
    if (taxableIncome > 700000) {
      if (taxableIncome > 1500000) {
        totalAnnualTax += (taxableIncome - 1500000) * 0.3 + 300000 * 0.2 + 200000 * 0.15 + 300000 * 0.1 + 400000 * 0.05
      } else if (taxableIncome > 1200000) {
        totalAnnualTax += (taxableIncome - 1200000) * 0.2 + 200000 * 0.15 + 300000 * 0.1 + 400000 * 0.05
      } else if (taxableIncome > 1000000) {
        totalAnnualTax += (taxableIncome - 1000000) * 0.15 + 300000 * 0.1 + 400000 * 0.05
      } else if (taxableIncome > 700000) {
        totalAnnualTax += (taxableIncome - 700000) * 0.1 + 400000 * 0.05
      }
      // 4% health & education cess
      totalAnnualTax *= 1.04
    }
  } else {
    // Old regime fallback approximation
    if (taxableIncome > 500000) {
      totalAnnualTax = (taxableIncome - 500000) * 0.2 * 1.04
    }
  }

  const monthlyTdsIncomeTax = Math.round(totalAnnualTax / 12)
  const totalMonthlyDeductions = monthlyEpfDeduction + monthlyProfessionalTax + monthlyTdsIncomeTax
  const monthlyInHand = Math.max(0, monthlyGross - totalMonthlyDeductions)
  const annualInHand = monthlyInHand * 12

  return ensureFinite({
    annualCtc: safeCtc,
    monthlyGross,
    monthlyEpfDeduction,
    monthlyProfessionalTax,
    monthlyTdsIncomeTax,
    totalMonthlyDeductions,
    monthlyInHand,
    annualInHand,
    totalAnnualTax: Math.round(totalAnnualTax),
  })
}

export interface EmiResult {
  monthlyEmi: number
  totalPrincipal: number
  totalInterest: number
  totalAmountPayable: number
  totalPayment: number
  interestPercentage: number
  interestRatioPercentage: number
  tenureMonths: number
}

export function calculateEmi(
  loanAmount: number,
  annualInterestRatePct: number,
  tenureYears: number
): EmiResult {
  const safeLoan = safeNum(loanAmount, 0, 1e11, 0)
  const safeRate = safeNum(annualInterestRatePct, 0, 100, 0)
  const safeTenure = safeNum(tenureYears, 0, 60, 0)
  const totalMonths = Math.round(safeTenure * 12)

  if (safeLoan <= 0 || safeRate <= 0 || totalMonths <= 0) {
    return ensureFinite({
      monthlyEmi: 0,
      totalPrincipal: safeLoan,
      totalInterest: 0,
      totalAmountPayable: safeLoan,
      totalPayment: safeLoan,
      interestPercentage: 0,
      interestRatioPercentage: 0,
      tenureMonths: totalMonths,
    })
  }

  const monthlyRate = safeRate / 12 / 100
  const compound = Math.pow(1 + monthlyRate, totalMonths)

  let emi = 0
  if (compound > 1 && Number.isFinite(compound)) {
    emi = (safeLoan * monthlyRate * compound) / (compound - 1)
  } else {
    emi = safeLoan / Math.max(1, totalMonths)
  }

  const totalAmountPayable = emi * totalMonths
  const totalInterest = Math.max(0, totalAmountPayable - safeLoan)
  const interestPercentage = totalAmountPayable > 0 ? Number(((totalInterest / totalAmountPayable) * 100).toFixed(1)) : 0

  return ensureFinite({
    monthlyEmi: Math.round(emi),
    totalPrincipal: Math.round(safeLoan),
    totalInterest: Math.round(totalInterest),
    totalAmountPayable: Math.round(totalAmountPayable),
    totalPayment: Math.round(totalAmountPayable),
    interestPercentage,
    interestRatioPercentage: interestPercentage,
    tenureMonths: totalMonths,
  })
}

export interface GstResult {
  originalAmount: number
  gstRatePct: number
  gstAmount: number
  cgstAmount: number
  sgstAmount: number
  finalAmount: number
  isInclusive: boolean
}

export function calculateGst(
  amount: number,
  gstRatePct: 5 | 12 | 18 | 28 | number = 18,
  modeOrInclusive: boolean | 'add' | 'remove' | 'exclusive' | 'inclusive' = false
): GstResult {
  const safeAmount = safeNum(amount, 0, 1e11, 0)
  const safeRate = safeNum(gstRatePct, 0, 100, 18)

  const isInclusive =
    modeOrInclusive === true || modeOrInclusive === 'remove' || modeOrInclusive === 'inclusive'

  let gstAmount = 0
  let finalAmount = 0
  let originalAmount = safeAmount

  if (isInclusive) {
    // When price is inclusive of GST:
    // Base Price = Total Amount / (1 + Rate / 100)
    // GST = Total Amount - Base Price
    originalAmount = Number((safeAmount / (1 + safeRate / 100)).toFixed(2))
    gstAmount = Number((safeAmount - originalAmount).toFixed(2))
    finalAmount = safeAmount
  } else {
    // When price is exclusive of GST (adding GST):
    gstAmount = Number(((safeAmount * safeRate) / 100).toFixed(2))
    finalAmount = Number((safeAmount + gstAmount).toFixed(2))
    originalAmount = Math.round(safeAmount)
  }

  const cgstAmount = Number((gstAmount / 2).toFixed(2))
  const sgstAmount = Number((gstAmount / 2).toFixed(2))

  return ensureFinite({
    originalAmount,
    gstRatePct: safeRate,
    gstAmount,
    cgstAmount,
    sgstAmount,
    finalAmount,
    isInclusive,
  })
}

export interface SipResult {
  monthlyInvestment: number
  investedAmount: number
  totalInvested: number
  estimatedReturns: number
  totalMaturityValue: number
  maturityAmount: number
}

export function calculateSip(
  monthlyInvestment: number,
  expectedReturnRatePct: number,
  tenureYears: number
): SipResult {
  const safeInvestment = safeNum(monthlyInvestment, 0, 1e11, 0)
  const safeYears = safeNum(tenureYears, 0, 60, 0)
  const safeRate = safeNum(expectedReturnRatePct, 0, 100, 0)

  const n = safeYears * 12
  const investedAmount = safeInvestment * n

  if (safeInvestment <= 0 || safeYears <= 0) {
    return ensureFinite({
      monthlyInvestment: safeInvestment,
      investedAmount: 0,
      totalInvested: 0,
      estimatedReturns: 0,
      totalMaturityValue: 0,
      maturityAmount: 0,
    })
  }

  if (safeRate <= 0) {
    const roundedInvested = Math.round(investedAmount)
    return ensureFinite({
      monthlyInvestment: safeInvestment,
      investedAmount: roundedInvested,
      totalInvested: roundedInvested,
      estimatedReturns: 0,
      totalMaturityValue: roundedInvested,
      maturityAmount: roundedInvested,
    })
  }

  const i = safeRate / 12 / 100
  const compound = Math.pow(1 + i, n)
  const totalMaturityValue = Number.isFinite(compound) ? safeInvestment * (((compound - 1) / i) * (1 + i)) : investedAmount
  const estimatedReturns = Math.max(0, totalMaturityValue - investedAmount)

  const roundedInvested = Math.round(investedAmount)
  const roundedMaturity = Math.round(totalMaturityValue)

  return ensureFinite({
    monthlyInvestment: safeInvestment,
    investedAmount: roundedInvested,
    totalInvested: roundedInvested,
    estimatedReturns: Math.round(estimatedReturns),
    totalMaturityValue: roundedMaturity,
    maturityAmount: roundedMaturity,
  })
}

// ----------------- LAND & PROPERTY CALCULATORS -----------------

export type LandUnit = 'cent' | 'sqft' | 'sqm' | 'acre' | 'guntha' | 'ground' | 'bigha' | 'hectare'

export const LAND_CONVERSION_FACTORS_SQFT: Record<LandUnit, number> = {
  sqft: 1,
  cent: 435.6,
  sqm: 10.7639,
  acre: 43560,
  guntha: 1089,
  ground: 2400,
  bigha: 14400,
  hectare: 107639,
}

export interface LandConversionResult {
  sqft: number
  cent: number
  cents: number
  sqm: number
  acre: number
  acres: number
  guntha: number
  ground: number
  bigha: number
  hectare: number
}

export function convertLandArea(value: number, fromUnit: LandUnit): LandConversionResult {
  const safeVal = safeNum(value, 0, 1e11, 0)
  const factor = LAND_CONVERSION_FACTORS_SQFT[fromUnit] || 1
  const sqft = safeVal * factor
  const centVal = Number((sqft / LAND_CONVERSION_FACTORS_SQFT.cent).toFixed(3))
  const acreVal = Number((sqft / LAND_CONVERSION_FACTORS_SQFT.acre).toFixed(4))

  return ensureFinite({
    sqft: Number(sqft.toFixed(2)),
    cent: centVal,
    cents: centVal,
    sqm: Number((sqft / LAND_CONVERSION_FACTORS_SQFT.sqm).toFixed(2)),
    acre: acreVal,
    acres: acreVal,
    guntha: Number((sqft / LAND_CONVERSION_FACTORS_SQFT.guntha).toFixed(3)),
    ground: Number((sqft / LAND_CONVERSION_FACTORS_SQFT.ground).toFixed(3)),
    bigha: Number((sqft / LAND_CONVERSION_FACTORS_SQFT.bigha).toFixed(3)),
    hectare: Number((sqft / LAND_CONVERSION_FACTORS_SQFT.hectare).toFixed(4)),
  })
}

export interface CarpetAreaResult {
  superBuiltUpAreaSqft: number
  loadingPercentage: number
  carpetAreaSqft: number
  builtUpAreaSqft: number
  usableSpaceRatioPct: number
  efficiencyRatioPct: number
}

export function calculateCarpetArea(
  superBuiltUpAreaSqft: number,
  loadingPercentage: number = 25
): CarpetAreaResult {
  const safeSuper = safeNum(superBuiltUpAreaSqft, 0, 1e11, 0)
  const safeLoading = safeNum(loadingPercentage, 0, 100, 25)

  if (safeSuper <= 0) {
    return ensureFinite({
      superBuiltUpAreaSqft: 0,
      loadingPercentage: safeLoading,
      carpetAreaSqft: 0,
      builtUpAreaSqft: 0,
      usableSpaceRatioPct: 0,
      efficiencyRatioPct: 0,
    })
  }

  // RERA Carpet Area formula:
  // Carpet Area = Super Built-up / (1 + Loading / 100)
  const carpetAreaSqft = Math.round(safeSuper / (1 + safeLoading / 100))
  // Built-up includes internal walls and balcony (~12% over carpet)
  const builtUpAreaSqft = Math.round(carpetAreaSqft * 1.12)
  const usableSpaceRatioPct = Number(((carpetAreaSqft / safeSuper) * 100).toFixed(1))

  return ensureFinite({
    superBuiltUpAreaSqft: safeSuper,
    loadingPercentage: safeLoading,
    carpetAreaSqft,
    builtUpAreaSqft,
    usableSpaceRatioPct,
    efficiencyRatioPct: usableSpaceRatioPct,
  })
}

export interface ExperienceResult {
  years: number
  months: number
  days: number
  totalMonths: number
  formattedExperience: string
  totalCalendarDays: number
  totalWorkingDaysApprox: number
  effectiveMonths: number
}

export function calculateExperience(
  startDateStr: string,
  endDateStr: string = '',
  isCurrentlyWorking: boolean = false,
  careerGapMonths: number = 0
): ExperienceResult {
  const safeGap = safeNum(careerGapMonths, 0, 600, 0)
  const start = new Date(startDateStr)
  const end = isCurrentlyWorking || !endDateStr ? new Date() : new Date(endDateStr)

  if (isNaN(start.getTime()) || isNaN(end.getTime()) || end < start) {
    return ensureFinite({
      years: 0,
      months: 0,
      days: 0,
      totalMonths: 0,
      formattedExperience: 'Select valid start & end dates',
      totalCalendarDays: 0,
      totalWorkingDaysApprox: 0,
      effectiveMonths: 0,
    })
  }

  let y = end.getFullYear() - start.getFullYear()
  let m = end.getMonth() - start.getMonth()
  let d = end.getDate() - start.getDate()

  if (d < 0) {
    m -= 1
    const prevMonth = new Date(end.getFullYear(), end.getMonth(), 0)
    d += prevMonth.getDate()
  }

  if (m < 0) {
    y -= 1
    m += 12
  }

  if (safeGap > 0) {
    let totalM = y * 12 + m
    totalM = Math.max(0, totalM - safeGap)
    y = Math.floor(totalM / 12)
    m = totalM % 12
  }

  const totalCalendarDays = Math.max(0, Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) - safeGap * 30.4)
  const totalWorkingDaysApprox = Math.round(totalCalendarDays * (5 / 7))
  const effectiveMonths = Number((y * 12 + m + d / 30.4).toFixed(1))

  return ensureFinite({
    years: y,
    months: m,
    days: d,
    totalMonths: Math.round(y * 12 + m),
    formattedExperience: `${y} Years, ${m} Months, ${d} Days`,
    totalCalendarDays,
    totalWorkingDaysApprox,
    effectiveMonths,
  })
}

// ==================== GENERATOR FUEL COST ====================
export interface GeneratorFuelResult {
  kvaRating: number
  loadPercentage: number
  hoursRun: number
  hourlyLitres: number
  litresPerHour: number
  hourlyCost: number
  totalLitres: number
  totalCost: number
  totalFuelCost: number
  effectiveCostPerUnit: number
  costPerKwhUnit: number
  totalUnitsKwh: number
}

export function calculateGeneratorFuel(
  kvaRating: number,
  loadPercentage: number = 75,
  hoursRun: number = 4,
  dieselPrice: number = 90
): GeneratorFuelResult {
  const safeKva = safeNum(kvaRating, 0, 1e6, 0)
  const safeLoad = safeNum(loadPercentage, 0, 100, 75)
  const safeHours = safeNum(hoursRun, 0, 1e6, 4)
  const safePrice = safeNum(dieselPrice, 0, 1e6, 90)

  // Approximate standard industrial specific fuel consumption: ~0.22 - 0.25 L/kVA/hr at 100% load
  // Formula: base idle (0.04 * kva) + load curve (0.20 * kva * loadFactor)
  const loadFactor = Math.min(1, Math.max(0.2, safeLoad / 100))
  const hourlyLitres = Number((safeKva * (0.04 + 0.20 * loadFactor)).toFixed(2))
  const hourlyCost = Math.round(hourlyLitres * safePrice)
  const totalLitres = Number((hourlyLitres * safeHours).toFixed(2))
  const totalCost = Math.round(totalLitres * safePrice)

  // Power generated: kVA * 0.8 power factor * loadFactor * hours
  const totalUnitsKwh = Number((safeKva * 0.8 * loadFactor * safeHours).toFixed(1))
  const effectiveCostPerUnit = totalUnitsKwh > 0 ? Number((totalCost / totalUnitsKwh).toFixed(2)) : 0

  return ensureFinite({
    kvaRating: safeKva,
    loadPercentage: safeLoad,
    hoursRun: safeHours,
    hourlyLitres,
    litresPerHour: hourlyLitres,
    hourlyCost,
    totalLitres,
    totalCost,
    totalFuelCost: totalCost,
    effectiveCostPerUnit,
    costPerKwhUnit: effectiveCostPerUnit,
    totalUnitsKwh,
  })
}

// ==================== EXCAVATOR WORKING COST ====================
export interface ExcavatorCostResult {
  hoursWorked: number
  hireMode: 'wet' | 'dry'
  machineRent: number
  totalMachineRent: number
  dieselLitresTotal: number
  dieselCost: number
  totalFuelCost: number
  bataCost: number
  totalCost: number
  effectiveHourlyCost: number
}

export function calculateExcavatorCost(
  hoursWorked: number = 8,
  hireMode: 'wet' | 'dry' = 'dry',
  hourlyRate: number = 1100, // dry hire machine rate
  dieselPrice: number = 90,
  litresPerHour: number = 5.5,
  operatorBataPerDay: number = 500,
  days: number = 1
): ExcavatorCostResult {
  const safeHours = safeNum(hoursWorked, 0, 1e6, 0)
  const safeRate = safeNum(hourlyRate, 0, 1e6, 1100)
  const safePrice = safeNum(dieselPrice, 0, 1e6, 90)
  const safeLph = safeNum(litresPerHour, 0, 1e6, 5.5)
  const safeBata = safeNum(operatorBataPerDay, 0, 1e6, 500)
  const safeDays = safeNum(days, 0, 1e6, 1)

  const machineRent = Math.round(safeHours * safeRate)
  const bataCost = Math.round(safeBata * safeDays)

  let dieselLitresTotal = 0
  let dieselCost = 0

  if (hireMode === 'dry') {
    dieselLitresTotal = Number((safeHours * safeLph).toFixed(1))
    dieselCost = Math.round(dieselLitresTotal * safePrice)
  }

  const totalCost = machineRent + dieselCost + bataCost
  const effectiveHourlyCost = safeHours > 0 ? Math.round(totalCost / safeHours) : 0

  return ensureFinite({
    hoursWorked: safeHours,
    hireMode,
    machineRent,
    totalMachineRent: machineRent,
    dieselLitresTotal,
    dieselCost,
    totalFuelCost: dieselCost,
    bataCost,
    totalCost,
    effectiveHourlyCost,
  })
}

// ==================== DAILY WAGE & OVERTIME ====================
export interface DailyWageResult {
  monthlySalary: number
  workingDays: number
  dailyWage: number
  hourlyWage: number
  overtimeHours: number
  overtimeMultiplier: number
  overtimeHourlyRate: number
  overtimeEarnings: number
  totalTakeHome: number
}

export function calculateDailyWage(
  monthlySalary: number = 25000,
  workingDays: number = 26,
  dailyHours: number = 8,
  overtimeHours: number = 10,
  overtimeMultiplier: number = 2.0 // Indian Factories Act 1948 Sec 59: Double rate for OT
): DailyWageResult {
  const safeSalary = safeNum(monthlySalary, 0, 1e11, 0)
  const safeDays = Math.max(1, safeNum(workingDays, 1, 31, 26))
  const safeHours = Math.max(1, safeNum(dailyHours, 1, 24, 8))
  const safeOtHours = safeNum(overtimeHours, 0, 1000, 0)
  const safeOtMult = safeNum(overtimeMultiplier, 1, 10, 2.0)

  const dailyWage = Math.round(safeSalary / safeDays)
  const hourlyWage = Number((dailyWage / safeHours).toFixed(2))
  const overtimeHourlyRate = Number((hourlyWage * safeOtMult).toFixed(2))
  const overtimeEarnings = Math.round(safeOtHours * overtimeHourlyRate)
  const totalTakeHome = safeSalary + overtimeEarnings

  return ensureFinite({
    monthlySalary: safeSalary,
    workingDays: safeDays,
    dailyWage,
    hourlyWage,
    overtimeHours: safeOtHours,
    overtimeMultiplier: safeOtMult,
    overtimeHourlyRate,
    overtimeEarnings,
    totalTakeHome,
  })
}

// ==================== PERCENTAGE & DISCOUNT ====================
export interface PercentageResult {
  baseValue: number
  percentRate: number
  calculatedAmount: number
  percentageAmount: number
  finalWithAddition: number
  valueAfterIncrease: number
  finalWithDiscount: number
  valueAfterDiscount: number
}

export function calculatePercentage(baseValue: number, percentRate: number): PercentageResult {
  const safeBase = safeNum(baseValue, -1e11, 1e11, 0)
  const safeRate = safeNum(percentRate, -10000, 10000, 0)

  const calculatedAmount = Number(((safeBase * safeRate) / 100).toFixed(2))
  const finalWithAddition = Number((safeBase + calculatedAmount).toFixed(2))
  const finalWithDiscount = Number((Math.max(0, safeBase - calculatedAmount)).toFixed(2))

  return ensureFinite({
    baseValue: safeBase,
    percentRate: safeRate,
    calculatedAmount,
    percentageAmount: calculatedAmount,
    finalWithAddition,
    valueAfterIncrease: finalWithAddition,
    finalWithDiscount,
    valueAfterDiscount: finalWithDiscount,
  })
}

// ==================== ROAD TRIP PLANNER ====================
export interface RoadTripResult {
  distanceKm: number
  fuelLitres: number
  fuelCost: number
  tollEstimate: number
  mealsAndOther: number
  totalCost: number
  costPerKm: number
  costPerPerson: number
}

export function calculateRoadTrip(
  distanceKm: number = 650,
  mileageKmPerLitre: number = 16,
  fuelPrice: number = 102,
  tollEstimate: number = 950,
  mealsAndOther: number = 1500,
  passengers: number = 3
): RoadTripResult {
  const safeDist = safeNum(distanceKm, 0, 1e9, 0)
  const safeMileage = Math.max(0.1, safeNum(mileageKmPerLitre, 0.1, 1e6, 16))
  const safePrice = safeNum(fuelPrice, 0, 1e6, 102)
  const safeToll = safeNum(tollEstimate, 0, 1e9, 0)
  const safeMeals = safeNum(mealsAndOther, 0, 1e9, 0)
  const safePax = Math.max(1, safeNum(passengers, 1, 1000, 1))

  const fuelLitres = Number((safeDist / safeMileage).toFixed(1))
  const fuelCost = Math.round(fuelLitres * safePrice)
  const totalCost = fuelCost + safeToll + safeMeals
  const costPerKm = safeDist > 0 ? Number((totalCost / safeDist).toFixed(2)) : 0
  const costPerPerson = Math.round(totalCost / safePax)

  return ensureFinite({
    distanceKm: safeDist,
    fuelLitres,
    fuelCost,
    tollEstimate: safeToll,
    mealsAndOther: safeMeals,
    totalCost,
    costPerKm,
    costPerPerson,
  })
}
