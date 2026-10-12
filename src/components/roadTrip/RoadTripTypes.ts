export type VehicleType = 'hatchback' | 'sedan' | 'suv' | 'motorcycle' | 'bus' | 'truck'
export type FuelType = 'petrol' | 'diesel' | 'cng' | 'ev'

export interface VehicleConfig {
  id: VehicleType
  name: string
  subtitle: string
  defaultMileage: number
  fuelType: FuelType
  defaultFuelPrice: number
  tollMultiplier: number // NHAI per km rate
  tollClassLabel: string
  tankSizeLitres: number
  seatingCapacity: number
  description: string
}

export interface RoutePreset {
  id: string
  name: string
  from: string
  to: string
  distanceKm: number
  estimatedTollCar: number
  days: number
  highwayName: string
  tag: string
  scenicNote: string
}

export const VEHICLE_CONFIGS: Record<VehicleType, VehicleConfig> = {
  hatchback: {
    id: 'hatchback',
    name: 'Hatchback',
    subtitle: 'Compact 5-Door (Swift, i20, Altroz)',
    defaultMileage: 18.0,
    fuelType: 'petrol',
    defaultFuelPrice: 102,
    tollMultiplier: 1.95,
    tollClassLabel: 'Car / Jeep / Van (NHAI Class 4)',
    tankSizeLitres: 37,
    seatingCapacity: 4,
    description: 'Agile & fuel-efficient for weekend road trips on state & national highways.',
  },
  sedan: {
    id: 'sedan',
    name: 'Sedan',
    subtitle: 'Executive Saloon (City, Verna, Virtus)',
    defaultMileage: 16.0,
    fuelType: 'petrol',
    defaultFuelPrice: 102,
    tollMultiplier: 1.95,
    tollClassLabel: 'Car / Saloon (NHAI Class 4)',
    tankSizeLitres: 45,
    seatingCapacity: 4,
    description: 'High-speed cruising comfort with aerodynamic expressway stability.',
  },
  suv: {
    id: 'suv',
    name: 'SUV / Crossover',
    subtitle: 'High Stance (Creta, Thar, Scorpio-N, Safari)',
    defaultMileage: 13.0,
    fuelType: 'diesel',
    defaultFuelPrice: 90,
    tollMultiplier: 1.95,
    tollClassLabel: 'SUV / LMV (NHAI Class 4)',
    tankSizeLitres: 55,
    seatingCapacity: 5,
    description: 'Higher ground clearance ideal for ghats, broken patches & monsoon drives.',
  },
  motorcycle: {
    id: 'motorcycle',
    name: 'Motorcycle',
    subtitle: 'Cruiser / Tourer (Royal Enfield, Duke, Dominar)',
    defaultMileage: 40.0,
    fuelType: 'petrol',
    defaultFuelPrice: 102,
    tollMultiplier: 0.0,
    tollClassLabel: '2-Wheeler (Toll Exempt on NHAI)',
    tankSizeLitres: 14,
    seatingCapacity: 2,
    description: 'Free NHAI toll passage on most national highways (check expressway restrictions).',
  },
  bus: {
    id: 'bus',
    name: 'Bus / Tempo',
    subtitle: 'Group Van / Coach (Traveller, Volvo, Urbania)',
    defaultMileage: 4.5,
    fuelType: 'diesel',
    defaultFuelPrice: 90,
    tollMultiplier: 6.6,
    tollClassLabel: '2-Axle Bus (NHAI Class 5)',
    tankSizeLitres: 120,
    seatingCapacity: 12,
    description: 'Designed for large family reunions, corporate outings & pilgrim groups.',
  },
  truck: {
    id: 'truck',
    name: 'Truck / Hauler',
    subtitle: 'Commercial Carrier (Prima, Eicher, BharatBenz)',
    defaultMileage: 3.5,
    fuelType: 'diesel',
    defaultFuelPrice: 90,
    tollMultiplier: 7.1,
    tollClassLabel: 'Commercial Vehicle (NHAI Class 6)',
    tankSizeLitres: 200,
    seatingCapacity: 3,
    description: 'Commercial freight logistics across interstate freight corridors.',
  },
}

export const FUEL_RATES: Record<FuelType, { name: string; unit: string; defaultPrice: number; icon: string }> = {
  petrol: { name: 'Petrol', unit: '₹/L', defaultPrice: 102, icon: '⛽' },
  diesel: { name: 'Diesel', unit: '₹/L', defaultPrice: 90, icon: '🛢️' },
  cng: { name: 'CNG', unit: '₹/kg', defaultPrice: 82, icon: '💨' },
  ev: { name: 'EV Charging', unit: '₹/kWh', defaultPrice: 16, icon: '⚡' },
}

export const POPULAR_ROUTES: RoutePreset[] = [
  {
    id: 'delhi-jaipur',
    name: 'Delhi → Jaipur',
    from: 'New Delhi',
    to: 'Jaipur',
    distanceKm: 280,
    estimatedTollCar: 450,
    days: 1,
    highwayName: 'NH 48 / NE 4',
    tag: 'Pink City Run',
    scenicNote: 'Smooth expressway cruising with famous highway dhabas at Murthal & Neemrana.',
  },
  {
    id: 'mumbai-goa',
    name: 'Mumbai → Goa',
    from: 'Mumbai',
    to: 'Panaji, Goa',
    distanceKm: 590,
    estimatedTollCar: 850,
    days: 2,
    highwayName: 'NH 66 / NH 48',
    tag: 'Konkan Coastline',
    scenicNote: 'Breathtaking Western Ghats vistas, cashew groves & lush coastal river bridges.',
  },
  {
    id: 'blr-wayanad',
    name: 'Bengaluru → Wayanad',
    from: 'Bengaluru',
    to: 'Wayanad',
    distanceKm: 285,
    estimatedTollCar: 330,
    days: 1,
    highwayName: 'NH 275 / NH 766',
    tag: 'Rainforest Ghats',
    scenicNote: 'Access-controlled Mysuru 10-lane expressway leading into misty Bandipur tiger corridor.',
  },
  {
    id: 'chennai-pondicherry',
    name: 'Chennai → Pondicherry',
    from: 'Chennai',
    to: 'Pondicherry',
    distanceKm: 155,
    estimatedTollCar: 120,
    days: 1,
    highwayName: 'East Coast Road (ECR)',
    tag: 'Ocean Highway',
    scenicNote: 'Uninterrupted coastal drive along the Bay of Bengal with fresh sea breeze.',
  },
  {
    id: 'delhi-manali',
    name: 'Delhi → Manali',
    from: 'Delhi',
    to: 'Manali',
    distanceKm: 540,
    estimatedTollCar: 680,
    days: 2,
    highwayName: 'NH 44 / NH 21',
    tag: 'Himalayan Ascent',
    scenicNote: 'Kiratpur-Manali four-lane corridors along roaring Beas river into pine mountains.',
  },
  {
    id: 'pune-mahabaleshwar',
    name: 'Pune → Mahabaleshwar',
    from: 'Pune',
    to: 'Mahabaleshwar',
    distanceKm: 120,
    estimatedTollCar: 190,
    days: 1,
    highwayName: 'NH 48 / SH 72',
    tag: 'Strawberry Hill',
    scenicNote: 'Ascending scenic Khambatki & Pasarni Ghats into cool Sahyadri plateau.',
  },
  {
    id: 'blr-ooty',
    name: 'Bengaluru → Ooty',
    from: 'Bengaluru',
    to: 'Ooty',
    distanceKm: 275,
    estimatedTollCar: 320,
    days: 1,
    highwayName: 'NH 275 / Kalhatty',
    tag: 'Queen of Hills',
    scenicNote: 'Pass through Nilgiri biosphere with 36 thrilling hairpin curves via Masinagudi.',
  },
  {
    id: 'hyd-hampi',
    name: 'Hyderabad → Hampi',
    from: 'Hyderabad',
    to: 'Hampi',
    distanceKm: 370,
    estimatedTollCar: 440,
    days: 1,
    highwayName: 'NH 44 / NH 67',
    tag: 'Heritage Trail',
    scenicNote: 'Vast Deccan plains opening up into Tungabhadra river valley & boulder ruins.',
  },
]
