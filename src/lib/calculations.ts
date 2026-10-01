// Pure calculation functions for India Practical Tools
// All formulas use genuine Indian benchmarks and standards

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
  // Approx 2.31 kg CO2 per litre of petrol, 2.68 kg for diesel (using 2.45kg avg)
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
  
  // Standard Indian telescopic slab approximation if ratePerUnit is default
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
  // Indian central electricity authority factor: 0.82 kg CO2 per kWh
  const carbonFootprintKg = monthlyUnitsKwh * 0.82

  return {
    monthlyUnitsKwh: Math.round(monthlyUnitsKwh),
    dailyUnitsKwh: Number(dailyUnitsKwh.toFixed(2)),
    estimatedMonthlyBill: Math.round(estimatedMonthlyBill),
    estimatedAnnualBill: Math.round(estimatedAnnualBill),
    carbonFootprintKg: Math.round(carbonFootprintKg),
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
  batteryVoltage: number, // 12V or 24V
  inverterEfficiencyPct: number = 85,
  depthOfDischargePct: number = 80 // 80% for lead-acid/tubular, 95% for lithium
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

  // 1 kW solar generates ~4.0 units/day in India (assuming 5 peak sun hours * 0.8 derating)
  const generationFactorPerKw = sunHours * 0.78
  const rawKwNeeded = dailyUnitsNeeded / generationFactorPerKw
  const systemCapacityKw = Math.max(1, Number(rawKwNeeded.toFixed(1)))

  // Panel count
  const panelCapacityKw = panelWattage / 1000
  const panelCount = Math.max(2, Math.ceil(systemCapacityKw / panelCapacityKw))
  const actualSystemKw = Number((panelCount * panelCapacityKw).toFixed(2))

  // In India: 1 kW requires ~80-100 sq.ft of shadow-free rooftop area
  const roofAreaSqft = Math.round(panelCount * 25)

  const dailyUnitsGenerated = Number((actualSystemKw * generationFactorPerKw).toFixed(1))
  const monthlyUnitsGenerated = Math.round(dailyUnitsGenerated * 30)

  const monthlySavingsRs = Math.round(monthlyUnitsGenerated * avgTariff)
  const annualSavingsRs = monthlySavingsRs * 12
  // 25-year cumulative factoring 0.6% annual module degradation
  const twentyFiveYearSavingsRs = Math.round(annualSavingsRs * 22)

  // PM Surya Ghar Muft Bijli Yojana Central Govt Subsidy:
  // 1 kW = ₹30,000, 2 kW = ₹60,000, 3 kW and above = ₹78,000 max
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

export type LandUnit = 'cent' | 'sqft' | 'sqm' | 'acre' | 'guntha' | 'ground' | 'bigha' | 'hectare'

export const LAND_CONVERSION_FACTORS_SQFT: Record<LandUnit, number> = {
  sqft: 1,
  cent: 435.6,
  sqm: 10.7639,
  acre: 43560,
  guntha: 1089, // 2.5 cents = 1089 sq ft
  ground: 2400, // Tamil Nadu 1 Ground = 2400 sq ft
  bigha: 14400, // Standard Bigha (UP/Bihar/Bengal standard benchmark)
  hectare: 107639, // 10,000 sq.m = 107,639.1 sq.ft
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

  // Thumb rules in Indian civil engineering:
  // Cement: ~0.4 bags/sq.ft, approx 16.4% cost
  // Steel: ~3.5 kg/sq.ft, approx 14.2% cost
  // Sand & Aggregates: approx 10.3% cost
  // Bricks / AAC Blocks: ~19 bricks/sq.ft, approx 10.0% cost
  // Flooring / Tiles: approx 10.0% cost
  // Fittings & Paint: approx 14.1% cost
  // Labor: approx 25.0% cost

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

  // Indian New Tax Regime 2024-25/2025-26 in-hand thumb rule estimator:
  // CTC contains PF (12% of basic ~ 50% CTC = ~6%), standard deduction ₹75,000, progressive slabs
  const estimateInHandMonthly = (ctc: number): number => {
    if (ctc <= 0) return 0
    if (ctc <= 775000) {
      // Zero tax with Section 87A rebate + ₹75,000 standard deduction
      // Only EPF deduction (~6% of CTC)
      return Math.round((ctc * 0.94) / 12)
    }
    // Approximate effective take home ratio for standard Indian white-collar payroll
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
    // Days in previous month
    const prevMonth = new Date(end.getFullYear(), end.getMonth(), 0)
    d += prevMonth.getDate()
  }

  if (m < 0) {
    y -= 1
    m += 12
  }

  // Deduct career gap
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
