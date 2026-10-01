// Pure calculation functions for India Practical Tools
// All formulas use genuine Indian benchmarks, IS codes, and tax standards

export interface MileageResult {
  mileageKmPerL: number
  fuelCostPerKm: number
  costPer100Km: number
  rating: 'exceptional' | 'good' | 'moderate' | 'heavy'
  ratingLabel: string
}

export function calculateMileage(
  distanceKm: number,
  fuelLitres: number,
  fuelPricePerLitre: number
): MileageResult {
  if (distanceKm <= 0 || fuelLitres <= 0) {
    return {
      mileageKmPerL: 0,
      fuelCostPerKm: 0,
      costPer100Km: 0,
      rating: 'moderate',
      ratingLabel: 'Enter valid distance and fuel',
    }
  }

  const mileageKmPerL = distanceKm / fuelLitres
  const fuelCostPerKm = fuelPricePerLitre > 0 ? fuelPricePerLitre / mileageKmPerL : 0
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

  return {
    mileageKmPerL: Number(mileageKmPerL.toFixed(2)),
    fuelCostPerKm: Number(fuelCostPerKm.toFixed(2)),
    costPer100Km: Number(costPer100Km.toFixed(2)),
    rating,
    ratingLabel,
  }
}

export interface FuelCostResult {
  totalFuelNeededL: number
  totalCost: number
  costPerKm: number
  co2EmissionsKg: number
}

export function calculateFuelCost(
  distanceKm: number,
  mileageKmPerL: number,
  fuelPricePerLitre: number
): FuelCostResult {
  if (distanceKm <= 0 || mileageKmPerL <= 0 || fuelPricePerLitre <= 0) {
    return { totalFuelNeededL: 0, totalCost: 0, costPerKm: 0, co2EmissionsKg: 0 }
  }

  const totalFuelNeededL = distanceKm / mileageKmPerL
  const totalCost = totalFuelNeededL * fuelPricePerLitre
  const costPerKm = fuelPricePerLitre / mileageKmPerL
  const co2EmissionsKg = totalFuelNeededL * 2.45

  return {
    totalFuelNeededL: Number(totalFuelNeededL.toFixed(2)),
    totalCost: Math.round(totalCost),
    costPerKm: Number(costPerKm.toFixed(2)),
    co2EmissionsKg: Number(co2EmissionsKg.toFixed(1)),
  }
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
  const totalDistanceKm = isRoundTrip ? oneWayDistanceKm * 2 : oneWayDistanceKm
  if (totalDistanceKm <= 0 || mileageKmPerL <= 0) {
    return {
      totalDistanceKm: 0,
      fuelRequiredL: 0,
      fuelCost: 0,
      tollsCost: tolls,
      miscCost: parkingMisc,
      totalCost: 0,
      costPerPerson: 0,
    }
  }

  const fuelRequiredL = totalDistanceKm / mileageKmPerL
  const fuelCost = fuelRequiredL * fuelPricePerLitre
  const effectiveTolls = isRoundTrip ? tolls * 2 : tolls
  const totalCost = fuelCost + effectiveTolls + parkingMisc
  const people = Math.max(1, travelers || 1)
  const costPerPerson = totalCost / people

  return {
    totalDistanceKm: Number(totalDistanceKm.toFixed(1)),
    fuelRequiredL: Number(fuelRequiredL.toFixed(2)),
    fuelCost: Math.round(fuelCost),
    tollsCost: Math.round(effectiveTolls),
    miscCost: Math.round(parkingMisc),
    totalCost: Math.round(totalCost),
    costPerPerson: Math.round(costPerPerson),
  }
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
  const monthlyFuelCost = mileageKmPerL > 0 ? (monthlyDistanceKm / mileageKmPerL) * fuelPrice : 0
  const monthlyInsurance = annualInsurance / 12
  const monthlyMaintenance = annualMaintenance / 12
  const totalMonthlyCost = monthlyEmi + monthlyFuelCost + monthlyInsurance + monthlyMaintenance
  const annualTotalCost = totalMonthlyCost * 12
  const costPerKm = monthlyDistanceKm > 0 ? totalMonthlyCost / monthlyDistanceKm : 0

  return {
    monthlyFuelCost: Math.round(monthlyFuelCost),
    monthlyEmi: Math.round(monthlyEmi),
    monthlyInsurance: Math.round(monthlyInsurance),
    monthlyMaintenance: Math.round(monthlyMaintenance),
    totalMonthlyCost: Math.round(totalMonthlyCost),
    annualTotalCost: Math.round(annualTotalCost),
    costPerKm: Number(costPerKm.toFixed(2)),
  }
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
  const monthlyPetrolCost = petrolMileage > 0 ? (monthlyKm / petrolMileage) * petrolPrice : 0
  const monthlyDieselCost = dieselMileage > 0 ? (monthlyKm / dieselMileage) * dieselPrice : 0
  const monthlySavingsWithDiesel = monthlyPetrolCost - monthlyDieselCost
  const annualSavingsWithDiesel = monthlySavingsWithDiesel * 12

  const breakevenMonths =
    monthlySavingsWithDiesel > 0
      ? Math.round(dieselCarExtraPrice / monthlySavingsWithDiesel)
      : 999
  const breakevenKm = breakevenMonths !== 999 ? breakevenMonths * monthlyKm : 0

  const isDieselRecommended = monthlyKm >= 1500 && breakevenMonths <= 48
  let recommendationNote = ''
  if (monthlyKm < 1000) {
    recommendationNote = 'Petrol is more economical for low city usage (< 1,000 km/month). Diesel maintenance and DPF filter clogging will offset fuel savings.'
  } else if (isDieselRecommended) {
    recommendationNote = `Diesel is highly advantageous at your driving volume. You will break even on the diesel price premium in approximately ${breakevenMonths} months.`
  } else {
    recommendationNote = `At your driving pattern, it takes ~${breakevenMonths} months to recover the extra diesel purchase cost. Petrol or Hybrid may be preferable.`
  }

  return {
    monthlyPetrolCost: Math.round(monthlyPetrolCost),
    monthlyDieselCost: Math.round(monthlyDieselCost),
    monthlySavingsWithDiesel: Math.round(monthlySavingsWithDiesel),
    annualSavingsWithDiesel: Math.round(annualSavingsWithDiesel),
    breakevenMonths,
    breakevenKm: Math.round(breakevenKm),
    isDieselRecommended,
    recommendationNote,
  }
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
  const costPerKmPetrol = petrolMileage > 0 ? petrolPrice / petrolMileage : 0
  const costPerKmEv = evEfficiencyKmPerKwh > 0 ? electricityRatePerUnit / evEfficiencyKmPerKwh : 0

  const monthlyCostPetrol = monthlyKm * costPerKmPetrol
  const monthlyCostEv = monthlyKm * costPerKmEv
  const monthlySavings = monthlyCostPetrol - monthlyCostEv
  const annualSavings = monthlySavings * 12

  const breakevenYears = monthlySavings > 0 ? Number((evExtraPrice / annualSavings).toFixed(1)) : 99
  const breakevenKm = Math.round(breakevenYears * monthlyKm * 12)
  const fiveYearNetSavings = Math.round(annualSavings * 5 - evExtraPrice)
  const co2SavedAnnualKg = Math.round((monthlyKm / petrolMileage) * 2.3 * 12)

  const petrolCostFormatted = Number(costPerKmPetrol.toFixed(2))
  const evCostFormatted = Number(costPerKmEv.toFixed(2))
  const roundedMonthlyPetrol = Math.round(monthlyCostPetrol)
  const roundedMonthlyEv = Math.round(monthlyCostEv)
  const roundedMonthlySavings = Math.round(monthlySavings)

  return {
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
  }
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
  const nextServiceKm = Math.ceil((odometerKm + 1) / 10000) * 10000

  const keyRecommendations = [
    serviceType === 'major'
      ? 'Includes complete Brake fluid & Radiator coolant flush'
      : 'Standard Synthetic Engine Oil replacement & multi-point check',
    'Verify tyre tread depth & rotate tyres every 10,000 km',
    'Inspect battery terminal voltage and brake pad thickness',
  ]

  return {
    engineOilCost: Math.round(baseOil),
    filterCost: Math.round(filter),
    laborCost: Math.round(labor),
    consumablesCost: Math.round(consumables),
    wheelAlignmentCost: Math.round(alignment),
    estimatedTotal: Math.round(estimatedTotal),
    serviceIntervalKm: nextServiceKm,
    keyRecommendations,
  }
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
  const hourlyFuelCost = fuelLph * dieselPrice
  const dailyFuelLitres = fuelLph * dailyHours
  const dailyFuelCost = dailyFuelLitres * dieselPrice
  const weeklyFuelCost = dailyFuelCost * 6
  const monthlyFuelLitres = dailyFuelLitres * workingDaysPerMonth
  const monthlyFuelCost = dailyFuelCost * workingDaysPerMonth
  const annualFuelCost = monthlyFuelCost * 12

  return {
    hourlyFuelCost: Math.round(hourlyFuelCost),
    dailyFuelLitres: Number(dailyFuelLitres.toFixed(1)),
    dailyFuelCost: Math.round(dailyFuelCost),
    weeklyFuelCost: Math.round(weeklyFuelCost),
    monthlyFuelLitres: Math.round(monthlyFuelLitres),
    monthlyFuelCost: Math.round(monthlyFuelCost),
    annualFuelCost: Math.round(annualFuelCost),
  }
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
  let bags = 0
  let sandCft = 0
  let aggregateCft = 0

  if (workType === 'plastering') {
    // 12mm plaster with 1:4 mix: ~1 bag per 100 sq.ft
    bags = Math.ceil(areaSqft * 0.0105)
    sandCft = Math.round(bags * 4.5)
  } else if (workType === 'brickwork') {
    // 9" brick wall: ~1 bag per 50 sq.ft
    bags = Math.ceil(areaSqft * 0.02)
    sandCft = Math.round(bags * 5.0)
  } else if (workType === 'flooring') {
    // 2" screed bed 1:4 mix
    bags = Math.ceil(areaSqft * 0.016)
    sandCft = Math.round(bags * 4.0)
  } else {
    // RCC slab (5" thick M20 concrete): ~0.45 bags per sq.ft
    bags = Math.ceil(areaSqft * 0.42)
    sandCft = Math.round(areaSqft * 0.9)
    aggregateCft = Math.round(areaSqft * 1.8)
  }

  const estimatedCostRs = bags * 390 // Avg ₹390 per 50kg bag (Ultratech/ACC)

  return {
    totalBags: bags,
    totalWeightKg: bags * 50,
    estimatedCostRs,
    sandRequiredCft: sandCft,
    aggregateRequiredCft: aggregateCft,
  }
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
  const volumeCft = lengthFt * widthFt * (depthInches / 12)
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

  return {
    volumeCum: Number(volumeCum.toFixed(2)),
    volumeCft: Math.round(volumeCft),
    dryVolumeCum: Number(dryVolumeCum.toFixed(2)),
    cementBags,
    sandTonnes,
    sandCft,
    aggregateTonnes,
    aggregateCft,
    waterLitres,
  }
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
  const wallAreaSqft = wallLengthFt * wallHeightFt
  // Standard Indian Red Clay Brick (9" x 4.25" x 2.75") with mortar:
  // 9" wall = 9 to 10 bricks per sq.ft
  // 4.5" wall = 4.5 to 5 bricks per sq.ft
  const bricksPerSqft = wallThicknessInches === 9 ? 9.2 : 4.6
  const rawBricks = wallAreaSqft * bricksPerSqft
  const totalBricks = Math.ceil(rawBricks * (1 + wastagePct / 100))

  // Mortar requirements
  const cementBags = Math.ceil((totalBricks / 1000) * (wallThicknessInches === 9 ? 3.5 : 2.0))
  const sandCft = Math.round(cementBags * 5.2)
  const sandBrass = Number((sandCft / 100).toFixed(2))

  const estimatedCostRs = totalBricks * 9.5 + cementBags * 390 + sandCft * 55

  return {
    totalBricks,
    wallAreaSqft: Math.round(wallAreaSqft),
    cementBags,
    sandCft,
    sandBrass,
    estimatedCostRs: Math.round(estimatedCostRs),
  }
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
  const roomAreaSqft = lengthFt * widthFt
  // 4-inch skirting along perimeter
  const skirtingAreaSqft = includeSkirting ? 2 * (lengthFt + widthFt) * (4 / 12) : 0
  const netArea = roomAreaSqft + skirtingAreaSqft
  // 10% wastage for cutting corners & borders
  const totalTilingAreaSqft = Math.ceil(netArea * 1.1)

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

  return {
    roomAreaSqft: Math.round(roomAreaSqft),
    skirtingAreaSqft: Math.round(skirtingAreaSqft),
    totalTilingAreaSqft,
    tileCount,
    boxCount,
    adhesiveBags,
    estimatedCostRs,
  }
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
  // Thumb rule: Wall surface area ~ 3.5x to 4x of floor carpet area (deducting doors/windows)
  const wallAreaSqft = Math.round(floorAreaSqft * 3.6)

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

  const rates = { economy: 220, premium: 380, luxury: 650 }
  const paintRate = rates[paintGrade]
  const estimatedCostRs = Math.round(
    paintLitres * paintRate + primerLitres * 180 + puttyKg * 28 + wallAreaSqft * 12 // ₹12/sqft labor
  )

  return {
    wallAreaSqft,
    paintLitres,
    primerLitres,
    puttyKg,
    bucket20L,
    bucket10L,
    bucket4L,
    estimatedCostRs,
  }
}

export type ConstructionTier = 'economy' | 'standard' | 'premium' | 'luxury'

export interface ConstructionCostResult {
  totalBuiltUpAreaSqft: number
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
  const rates: Record<ConstructionTier, number> = {
    economy: 1550,
    standard: 1850,
    premium: 2400,
    luxury: 3200,
  }

  const ratePerSqft = rates[tier]
  const totalBuiltUpAreaSqft = areaSqft * floors
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

  return {
    totalBuiltUpAreaSqft,
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
  }
}

// ----------------- ENERGY & HOME CALCULATORS -----------------

export interface ElectricityResult {
  monthlyUnitsKwh: number
  dailyUnitsKwh: number
  estimatedMonthlyBill: number
  estimatedAnnualBill: number
  carbonFootprintKg: number
}

export function calculateElectricity(
  unitsPerMonth: number,
  ratePerUnit: number = 7.0,
  fixedMonthlyCharges: number = 100
): ElectricityResult {
  const monthlyUnitsKwh = Math.max(0, unitsPerMonth)
  const dailyUnitsKwh = monthlyUnitsKwh / 30

  let estimatedMonthlyBill = 0
  if (ratePerUnit === 7.0) {
    if (monthlyUnitsKwh <= 100) {
      estimatedMonthlyBill = monthlyUnitsKwh * 3.8
    } else if (monthlyUnitsKwh <= 250) {
      estimatedMonthlyBill = 100 * 3.8 + (monthlyUnitsKwh - 100) * 5.8
    } else if (monthlyUnitsKwh <= 500) {
      estimatedMonthlyBill = 100 * 3.8 + 150 * 5.8 + (monthlyUnitsKwh - 250) * 7.6
    } else {
      estimatedMonthlyBill = 100 * 3.8 + 150 * 5.8 + 250 * 7.6 + (monthlyUnitsKwh - 500) * 8.9
    }
    estimatedMonthlyBill += fixedMonthlyCharges
  } else {
    estimatedMonthlyBill = monthlyUnitsKwh * ratePerUnit + fixedMonthlyCharges
  }

  const estimatedAnnualBill = estimatedMonthlyBill * 12
  const carbonFootprintKg = monthlyUnitsKwh * 0.82

  return {
    monthlyUnitsKwh: Math.round(monthlyUnitsKwh),
    dailyUnitsKwh: Number(dailyUnitsKwh.toFixed(2)),
    estimatedMonthlyBill: Math.round(estimatedMonthlyBill),
    estimatedAnnualBill: Math.round(estimatedAnnualBill),
    carbonFootprintKg: Math.round(carbonFootprintKg),
  }
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

  const dailyUnitsKwh = (baseWatts * dailyHours) / 1000
  const monthlyUnitsKwh = dailyUnitsKwh * 30
  const dailyCostRs = dailyUnitsKwh * ratePerUnit
  const monthlyCostRs = monthlyUnitsKwh * ratePerUnit
  const summerSeasonCostRs = monthlyCostRs * 4

  // Compared to standard 3-star non-inverter
  const threeStarWatts = baseWatts * 1.3
  const threeStarMonthly = ((threeStarWatts * dailyHours * 30) / 1000) * ratePerUnit
  const fiveStarSavingsMonthly = Math.max(0, Math.round(threeStarMonthly - monthlyCostRs))

  return {
    dailyUnitsKwh: Number(dailyUnitsKwh.toFixed(2)),
    monthlyUnitsKwh: Math.round(monthlyUnitsKwh),
    dailyCostRs: Math.round(dailyCostRs),
    monthlyCostRs: Math.round(monthlyCostRs),
    summerSeasonCostRs: Math.round(summerSeasonCostRs),
    averagePowerWatts: Math.round(baseWatts),
    fiveStarSavingsMonthly,
  }
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
    fanCount = arg2
    dailyHours = typeof arg3 === 'number' ? arg3 : 14
    ratePerUnit = arg4
  } else {
    fanCount = arg1
    dailyHours = arg2
    isBldc = typeof arg3 === 'boolean' ? arg3 : false
    ratePerUnit = arg4
  }

  const fanWatts = isBldc ? 28 : 75
  const dailyUnitsKwh = (fanWatts * fanCount * dailyHours) / 1000
  const monthlyUnitsKwh = dailyUnitsKwh * 30
  const monthlyCostRs = Math.round(monthlyUnitsKwh * ratePerUnit)
  const annualCostRs = Math.round(monthlyCostRs * 12)

  // BLDC savings
  const standardAnnual = ((75 * fanCount * dailyHours * 365) / 1000) * ratePerUnit
  const bldcAnnual = ((28 * fanCount * dailyHours * 365) / 1000) * ratePerUnit
  const annualBldcSavingsRs = Math.round(standardAnnual - bldcAnnual)
  // Avg price difference between BLDC & standard fan is ~₹1,400 per fan
  const bldcExtraCost = fanCount * 1400
  const bldcPaybackMonths =
    annualBldcSavingsRs > 0 ? Math.round((bldcExtraCost / annualBldcSavingsRs) * 12) : 18

  return {
    dailyUnitsKwh: Number(dailyUnitsKwh.toFixed(2)),
    monthlyUnitsKwh: Math.round(monthlyUnitsKwh),
    monthlyCostRs,
    monthlyCost: monthlyCostRs,
    annualCostRs,
    annualCost: annualCostRs,
    annualBldcSavingsRs,
    savingsIfBldcAnnual: annualBldcSavingsRs,
    bldcPaybackMonths,
  }
}

export interface InverterResult {
  backupHours: number
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
  if (loadWatts <= 0 || batteryAh <= 0 || batteryVoltage <= 0) {
    return {
      backupHours: 0,
      backupMinutesFormatted: '0 hrs 0 mins',
      usableWattHours: 0,
      dcAmpsDraw: 0,
      recommendedUsage: 'Enter valid power load and battery capacity',
    }
  }

  const totalWattHours = batteryAh * batteryVoltage
  const usableWattHours = totalWattHours * (depthOfDischargePct / 100) * (inverterEfficiencyPct / 100)
  const totalHours = usableWattHours / loadWatts

  const hrs = Math.floor(totalHours)
  const mins = Math.round((totalHours - hrs) * 60)
  const dcAmpsDraw = loadWatts / (batteryVoltage * (inverterEfficiencyPct / 100))

  let recommendedUsage = 'Adequate for basic lights, 2-3 ceiling fans & Wi-Fi'
  if (totalHours > 8) {
    recommendedUsage = 'Exceptional multi-appliance endurance (overnight full-house backup)'
  } else if (totalHours > 4) {
    recommendedUsage = 'Solid standard home load backup during typical power cuts'
  } else if (totalHours < 2) {
    recommendedUsage = 'Heavy load! Consider shedding high-wattage devices or upgrading Ah'
  }

  return {
    backupHours: Number(totalHours.toFixed(2)),
    backupMinutesFormatted: `${hrs} hrs ${mins} mins`,
    usableWattHours: Math.round(usableWattHours),
    dcAmpsDraw: Number(dcAmpsDraw.toFixed(1)),
    recommendedUsage,
  }
}

export interface SolarResult {
  systemCapacityKw: number
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
  const monthlyUnits = isMonthlyUnits ? monthlyBillOrUnits : Math.max(0, monthlyBillOrUnits / avgTariff)
  const dailyUnitsNeeded = monthlyUnits / 30

  const generationFactorPerKw = sunHours * 0.78
  const rawKwNeeded = dailyUnitsNeeded / generationFactorPerKw
  const systemCapacityKw = Math.max(1, Number(rawKwNeeded.toFixed(1)))

  const panelCapacityKw = panelWattage / 1000
  const panelCount = Math.max(2, Math.ceil(systemCapacityKw / panelCapacityKw))
  const actualSystemKw = Number((panelCount * panelCapacityKw).toFixed(2))

  const roofAreaSqft = Math.round(panelCount * 25)

  const dailyUnitsGenerated = Number((actualSystemKw * generationFactorPerKw).toFixed(1))
  const monthlyUnitsGenerated = Math.round(dailyUnitsGenerated * 30)

  const monthlySavingsRs = Math.round(monthlyUnitsGenerated * avgTariff)
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

  return {
    systemCapacityKw: actualSystemKw,
    panelCount,
    roofAreaSqft,
    dailyUnitsGenerated,
    monthlyUnitsGenerated,
    monthlySavingsRs,
    annualSavingsRs,
    twentyFiveYearSavingsRs,
    pmSuryaGharSubsidyRs,
  }
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
  // Indian Standard IS: 1172 - Domestic consumption benchmark: 135 to 150 L/head/day
  const baseRate = 135
  const extraForWashing = includeGardenCarWash ? 75 : 0
  const dailyRequirementLitres = Math.round(familyMembers * baseRate + extraForWashing)
  const storageTotal = Math.round(dailyRequirementLitres * storageDays)

  // Overhead tank: typically sized for 1-day storage
  const recommendedOhtCapacityLitres = Math.ceil(dailyRequirementLitres / 500) * 500
  // Sump: typically sized for 1.5 to 2 days storage
  const recommendedSumpCapacityLitres = Math.ceil((dailyRequirementLitres * 2) / 1000) * 1000

  // 1 Cubic Foot = 28.317 Litres
  const sumpCft = recommendedSumpCapacityLitres / 28.317
  // Assume 5ft depth
  const sumpArea = sumpCft / 5
  const sumpSide = Math.round(Math.sqrt(sumpArea) * 10) / 10

  return {
    dailyRequirementLitres,
    recommendedOhtCapacityLitres,
    recommendedSumpCapacityLitres,
    ohtDimensionsFt: `Standard cylindrical tank (~${recommendedOhtCapacityLitres}L)`,
    sumpDimensionsFt: `${sumpSide} ft × ${sumpSide} ft × 5 ft depth (~${recommendedSumpCapacityLitres}L)`,
  }
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
  // Standard 14.2 kg domestic LPG cylinder has ~28 to 32 burner hours at normal flame
  // Burn rate: ~450g to 500g LPG per hour per medium burner
  const totalBurnerHoursCapacity = 30
  const daysCylinderLasts = Math.max(1, Math.round(totalBurnerHoursCapacity / burnersUsedHoursDaily))
  const cylindersPerMonth = 30 / daysCylinderLasts
  const monthlyExpenditureRs = Math.round(cylindersPerMonth * cylinderPriceRs)
  const dailyCostRs = Math.round(monthlyExpenditureRs / 30)

  return {
    daysCylinderLasts,
    monthlyExpenditureRs,
    dailyCostRs,
    totalCookingHours: totalBurnerHoursCapacity,
  }
}

// ----------------- SALARY & FINANCE CALCULATORS -----------------

export interface SalaryHikeResult {
  currentCtc: number
  newCtc: number
  absoluteHikeAnnual: number
  hikePercentage: number
  monthlyGrossCurrent: number
  monthlyGrossNew: number
  monthlyGrossIncrease: number
  estimatedMonthlyInHandCurrent: number
  estimatedMonthlyInHandNew: number
  monthlyInHandIncrease: number
}

export function calculateSalaryHike(
  currentCtc: number,
  hikeValue: number,
  mode: 'percentage' | 'offeredCtc'
): SalaryHikeResult {
  let newCtc = 0
  let hikePercentage = 0
  let absoluteHikeAnnual = 0

  if (mode === 'percentage') {
    hikePercentage = hikeValue
    absoluteHikeAnnual = (currentCtc * hikePercentage) / 100
    newCtc = currentCtc + absoluteHikeAnnual
  } else {
    newCtc = hikeValue
    absoluteHikeAnnual = newCtc - currentCtc
    hikePercentage = currentCtc > 0 ? (absoluteHikeAnnual / currentCtc) * 100 : 0
  }

  const monthlyGrossCurrent = Math.round(currentCtc / 12)
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

  const estimatedMonthlyInHandCurrent = estimateInHandMonthly(currentCtc)
  const estimatedMonthlyInHandNew = estimateInHandMonthly(newCtc)
  const monthlyInHandIncrease = estimatedMonthlyInHandNew - estimatedMonthlyInHandCurrent

  return {
    currentCtc,
    newCtc: Math.round(newCtc),
    absoluteHikeAnnual: Math.round(absoluteHikeAnnual),
    hikePercentage: Number(hikePercentage.toFixed(2)),
    monthlyGrossCurrent,
    monthlyGrossNew,
    monthlyGrossIncrease,
    estimatedMonthlyInHandCurrent,
    estimatedMonthlyInHandNew,
    monthlyInHandIncrease,
  }
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
  const monthlyGross = Math.round(annualCtc / 12)
  // Basic is typically 40% to 50% of CTC
  const basicAnnual = annualCtc * 0.5
  // EPF: 12% of basic (capped optionally or uncapped)
  const monthlyEpfDeduction = Math.min(1800, Math.round((basicAnnual * 0.12) / 12))
  const monthlyProfessionalTax = 200

  // Indian New Tax Regime (FY 2024-25 / 2025-26):
  // Standard Deduction: ₹75,000
  // Slabs: 0-3L (0%), 3-7L (5%), 7-10L (10%), 10-12L (15%), 12-15L (20%), >15L (30%)
  // Section 87A rebate: zero tax if taxable income <= ₹7,00,000 (i.e. CTC <= ₹7,75,000)
  const standardDeduction = regime === 'new' ? 75000 : 50000
  const taxableIncome = Math.max(0, annualCtc - standardDeduction)

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

  return {
    annualCtc,
    monthlyGross,
    monthlyEpfDeduction,
    monthlyProfessionalTax,
    monthlyTdsIncomeTax,
    totalMonthlyDeductions,
    monthlyInHand,
    annualInHand,
    totalAnnualTax: Math.round(totalAnnualTax),
  }
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
  const totalMonths = tenureYears > 0 ? tenureYears * 12 : 0

  if (loanAmount <= 0 || annualInterestRatePct <= 0 || tenureYears <= 0) {
    return {
      monthlyEmi: 0,
      totalPrincipal: 0,
      totalInterest: 0,
      totalAmountPayable: 0,
      totalPayment: 0,
      interestPercentage: 0,
      interestRatioPercentage: 0,
      tenureMonths: totalMonths,
    }
  }

  const monthlyRate = annualInterestRatePct / 12 / 100

  const emi =
    (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
    (Math.pow(1 + monthlyRate, totalMonths) - 1)

  const totalAmountPayable = emi * totalMonths
  const totalInterest = totalAmountPayable - loanAmount
  const interestPercentage = Number(((totalInterest / totalAmountPayable) * 100).toFixed(1))

  return {
    monthlyEmi: Math.round(emi),
    totalPrincipal: Math.round(loanAmount),
    totalInterest: Math.round(totalInterest),
    totalAmountPayable: Math.round(totalAmountPayable),
    totalPayment: Math.round(totalAmountPayable),
    interestPercentage,
    interestRatioPercentage: interestPercentage,
    tenureMonths: totalMonths,
  }
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
  gstRatePct: 5 | 12 | 18 | 28 = 18,
  isInclusive: boolean = false
): GstResult {
  let gstAmount = 0
  let finalAmount = 0

  if (isInclusive) {
    finalAmount = amount
    gstAmount = amount - amount / (1 + gstRatePct / 100)
  } else {
    gstAmount = (amount * gstRatePct) / 100
    finalAmount = amount + gstAmount
  }

  const cgstAmount = gstAmount / 2
  const sgstAmount = gstAmount / 2

  return {
    originalAmount: Math.round(amount),
    gstRatePct,
    gstAmount: Number(gstAmount.toFixed(2)),
    cgstAmount: Number(cgstAmount.toFixed(2)),
    sgstAmount: Number(sgstAmount.toFixed(2)),
    finalAmount: Number(finalAmount.toFixed(2)),
    isInclusive,
  }
}

export interface SipResult {
  monthlyInvestment: number
  investedAmount: number
  estimatedReturns: number
  totalMaturityValue: number
}

export function calculateSip(
  monthlyInvestment: number,
  expectedReturnRatePct: number,
  tenureYears: number
): SipResult {
  const i = expectedReturnRatePct / 12 / 100
  const n = tenureYears * 12

  const totalMaturityValue = monthlyInvestment * (((Math.pow(1 + i, n) - 1) / i) * (1 + i))
  const investedAmount = monthlyInvestment * n
  const estimatedReturns = totalMaturityValue - investedAmount

  return {
    monthlyInvestment,
    investedAmount: Math.round(investedAmount),
    estimatedReturns: Math.round(estimatedReturns),
    totalMaturityValue: Math.round(totalMaturityValue),
  }
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
  sqm: number
  acre: number
  guntha: number
  ground: number
  bigha: number
  hectare: number
}

export function convertLandArea(value: number, fromUnit: LandUnit): LandConversionResult {
  const sqft = value * LAND_CONVERSION_FACTORS_SQFT[fromUnit]

  return {
    sqft: Number(sqft.toFixed(2)),
    cent: Number((sqft / LAND_CONVERSION_FACTORS_SQFT.cent).toFixed(3)),
    sqm: Number((sqft / LAND_CONVERSION_FACTORS_SQFT.sqm).toFixed(2)),
    acre: Number((sqft / LAND_CONVERSION_FACTORS_SQFT.acre).toFixed(4)),
    guntha: Number((sqft / LAND_CONVERSION_FACTORS_SQFT.guntha).toFixed(3)),
    ground: Number((sqft / LAND_CONVERSION_FACTORS_SQFT.ground).toFixed(3)),
    bigha: Number((sqft / LAND_CONVERSION_FACTORS_SQFT.bigha).toFixed(3)),
    hectare: Number((sqft / LAND_CONVERSION_FACTORS_SQFT.hectare).toFixed(4)),
  }
}

export interface CarpetAreaResult {
  superBuiltUpAreaSqft: number
  loadingPercentage: number
  carpetAreaSqft: number
  builtUpAreaSqft: number
  usableSpaceRatioPct: number
}

export function calculateCarpetArea(
  superBuiltUpAreaSqft: number,
  loadingPercentage: number = 25
): CarpetAreaResult {
  // RERA Carpet Area formula:
  // Carpet Area = Super Built-up / (1 + Loading / 100)
  const carpetAreaSqft = Math.round(superBuiltUpAreaSqft / (1 + loadingPercentage / 100))
  // Built-up includes internal walls and balcony (~12% over carpet)
  const builtUpAreaSqft = Math.round(carpetAreaSqft * 1.12)
  const usableSpaceRatioPct = Number(((carpetAreaSqft / superBuiltUpAreaSqft) * 100).toFixed(1))

  return {
    superBuiltUpAreaSqft,
    loadingPercentage,
    carpetAreaSqft,
    builtUpAreaSqft,
    usableSpaceRatioPct,
  }
}

export interface ExperienceResult {
  years: number
  months: number
  days: number
  formattedExperience: string
  totalCalendarDays: number
  totalWorkingDaysApprox: number
  effectiveMonths: number
}

export function calculateExperience(
  startDateStr: string,
  endDateStr: string,
  isCurrentlyWorking: boolean,
  careerGapMonths: number = 0
): ExperienceResult {
  const start = new Date(startDateStr)
  const end = isCurrentlyWorking ? new Date() : new Date(endDateStr)

  if (isNaN(start.getTime()) || isNaN(end.getTime()) || end < start) {
    return {
      years: 0,
      months: 0,
      days: 0,
      formattedExperience: 'Select valid start & end dates',
      totalCalendarDays: 0,
      totalWorkingDaysApprox: 0,
      effectiveMonths: 0,
    }
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

  if (careerGapMonths > 0) {
    let totalM = y * 12 + m
    totalM = Math.max(0, totalM - careerGapMonths)
    y = Math.floor(totalM / 12)
    m = totalM % 12
  }

  const totalCalendarDays = Math.max(0, Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) - careerGapMonths * 30.4)
  const totalWorkingDaysApprox = Math.round(totalCalendarDays * (5 / 7))
  const effectiveMonths = Number((y * 12 + m + d / 30.4).toFixed(1))

  return {
    years: y,
    months: m,
    days: d,
    formattedExperience: `${y} Years, ${m} Months, ${d} Days`,
    totalCalendarDays,
    totalWorkingDaysApprox,
    effectiveMonths,
  }
}

// ==================== GENERATOR FUEL COST ====================
export interface GeneratorFuelResult {
  kvaRating: number
  loadPercentage: number
  hoursRun: number
  hourlyLitres: number
  hourlyCost: number
  totalLitres: number
  totalCost: number
  effectiveCostPerUnit: number
  totalUnitsKwh: number
}

export function calculateGeneratorFuel(
  kvaRating: number,
  loadPercentage: number = 75,
  hoursRun: number = 4,
  dieselPrice: number = 90
): GeneratorFuelResult {
  // Approximate standard industrial specific fuel consumption: ~0.22 - 0.25 L/kVA/hr at 100% load
  // Formula: base idle (0.04 * kva) + load curve (0.20 * kva * loadFactor)
  const loadFactor = Math.min(1, Math.max(0.2, loadPercentage / 100))
  const hourlyLitres = Number((kvaRating * (0.04 + 0.20 * loadFactor)).toFixed(2))
  const hourlyCost = Math.round(hourlyLitres * dieselPrice)
  const totalLitres = Number((hourlyLitres * hoursRun).toFixed(2))
  const totalCost = Math.round(totalLitres * dieselPrice)

  // Power generated: kVA * 0.8 power factor * loadFactor * hours
  const totalUnitsKwh = Number((kvaRating * 0.8 * loadFactor * hoursRun).toFixed(1))
  const effectiveCostPerUnit = totalUnitsKwh > 0 ? Number((totalCost / totalUnitsKwh).toFixed(2)) : 0

  return {
    kvaRating,
    loadPercentage,
    hoursRun,
    hourlyLitres,
    hourlyCost,
    totalLitres,
    totalCost,
    effectiveCostPerUnit,
    totalUnitsKwh,
  }
}

// ==================== EXCAVATOR WORKING COST ====================
export interface ExcavatorCostResult {
  hoursWorked: number
  hireMode: 'wet' | 'dry'
  machineRent: number
  dieselLitresTotal: number
  dieselCost: number
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
  const machineRent = Math.round(hoursWorked * hourlyRate)
  const bataCost = Math.round(operatorBataPerDay * days)

  let dieselLitresTotal = 0
  let dieselCost = 0

  if (hireMode === 'dry') {
    dieselLitresTotal = Number((hoursWorked * litresPerHour).toFixed(1))
    dieselCost = Math.round(dieselLitresTotal * dieselPrice)
  }

  const totalCost = machineRent + dieselCost + bataCost
  const effectiveHourlyCost = hoursWorked > 0 ? Math.round(totalCost / hoursWorked) : 0

  return {
    hoursWorked,
    hireMode,
    machineRent,
    dieselLitresTotal,
    dieselCost,
    bataCost,
    totalCost,
    effectiveHourlyCost,
  }
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
  const safeDays = Math.max(1, workingDays)
  const safeHours = Math.max(1, dailyHours)

  const dailyWage = Math.round(monthlySalary / safeDays)
  const hourlyWage = Number((dailyWage / safeHours).toFixed(2))
  const overtimeHourlyRate = Number((hourlyWage * overtimeMultiplier).toFixed(2))
  const overtimeEarnings = Math.round(overtimeHours * overtimeHourlyRate)
  const totalTakeHome = monthlySalary + overtimeEarnings

  return {
    monthlySalary,
    workingDays,
    dailyWage,
    hourlyWage,
    overtimeHours,
    overtimeMultiplier,
    overtimeHourlyRate,
    overtimeEarnings,
    totalTakeHome,
  }
}

// ==================== PERCENTAGE & DISCOUNT ====================
export interface PercentageResult {
  baseValue: number
  percentRate: number
  calculatedAmount: number
  finalWithAddition: number
  finalWithDiscount: number
}

export function calculatePercentage(baseValue: number, percentRate: number): PercentageResult {
  const calculatedAmount = Number(((baseValue * percentRate) / 100).toFixed(2))
  const finalWithAddition = Number((baseValue + calculatedAmount).toFixed(2))
  const finalWithDiscount = Number((Math.max(0, baseValue - calculatedAmount)).toFixed(2))

  return {
    baseValue,
    percentRate,
    calculatedAmount,
    finalWithAddition,
    finalWithDiscount,
  }
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
  const safeMileage = Math.max(1, mileageKmPerLitre)
  const fuelLitres = Number((distanceKm / safeMileage).toFixed(1))
  const fuelCost = Math.round(fuelLitres * fuelPrice)
  const totalCost = fuelCost + tollEstimate + mealsAndOther
  const costPerKm = Number((totalCost / Math.max(1, distanceKm)).toFixed(2))
  const costPerPerson = Math.round(totalCost / Math.max(1, passengers))

  return {
    distanceKm,
    fuelLitres,
    fuelCost,
    tollEstimate,
    mealsAndOther,
    totalCost,
    costPerKm,
    costPerPerson,
  }
}
