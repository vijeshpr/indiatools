import React from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { getToolBySlug } from '../data/tools'

// Vehicle Calculators
import { VehicleMileageTool } from '../calculators/VehicleMileageTool'
import { FuelCostTool } from '../calculators/FuelCostTool'
import { TripCostTool } from '../calculators/TripCostTool'
import { MonthlyVehicleRunningCostTool } from '../calculators/MonthlyVehicleRunningCostTool'
import { PetrolVsDieselTool } from '../calculators/PetrolVsDieselTool'
import { EvVsPetrolTool } from '../calculators/EvVsPetrolTool'
import { JcbFuelCostTool } from '../calculators/JcbFuelCostTool'
import { VehicleServiceCostTool } from '../calculators/VehicleServiceCostTool'
import { RoadTripTool } from '../calculators/RoadTripTool'

// Construction Calculators
import { CementCalculatorTool } from '../calculators/CementCalculatorTool'
import { ConcreteCalculatorTool } from '../calculators/ConcreteCalculatorTool'
import { BrickCalculatorTool } from '../calculators/BrickCalculatorTool'
import { TileCalculatorTool } from '../calculators/TileCalculatorTool'
import { PaintCalculatorTool } from '../calculators/PaintCalculatorTool'
import { ConstructionCostTool } from '../calculators/ConstructionCostTool'
import { ExcavatorCostTool } from '../calculators/ExcavatorCostTool'

// Power & Energy Calculators
import { ElectricityCostTool } from '../calculators/ElectricityCostTool'
import { AcCostTool } from '../calculators/AcCostTool'
import { FanCostTool } from '../calculators/FanCostTool'
import { InverterBackupTool } from '../calculators/InverterBackupTool'
import { SolarPanelTool } from '../calculators/SolarPanelTool'
import { WaterTankTool } from '../calculators/WaterTankTool'
import { LpgUsageTool } from '../calculators/LpgUsageTool'
import { GeneratorFuelTool } from '../calculators/GeneratorFuelTool'

// Salary & Money Calculators
import { SalaryHikeTool } from '../calculators/SalaryHikeTool'
import { InHandSalaryTool } from '../calculators/InHandSalaryTool'
import { EmiCalculatorTool } from '../calculators/EmiCalculatorTool'
import { GstCalculatorTool } from '../calculators/GstCalculatorTool'
import { SipCalculatorTool } from '../calculators/SipCalculatorTool'
import { DailyWageTool } from '../calculators/DailyWageTool'
import { PercentageDiscountTool } from '../calculators/PercentageDiscountTool'
import { ExperienceTool } from '../calculators/ExperienceTool'

// Land & Survey Calculators
import { CentToSqftTool } from '../calculators/CentToSqftTool'
import { AcreConverterTool } from '../calculators/AcreConverterTool'
import { CarpetAreaTool } from '../calculators/CarpetAreaTool'
import { LandAreaTool } from '../calculators/LandAreaTool'

// Image & Document Tools
import { Photo50KBTool } from '../imageTools/Photo50KBTool'
import { Photo100KBTool } from '../imageTools/Photo100KBTool'
import { ExactKBTool } from '../imageTools/ExactKBTool'
import { SignatureResizerTool } from '../imageTools/SignatureResizerTool'
import { PassportPhotoTool } from '../imageTools/PassportPhotoTool'
import { ImageToPdfTool } from '../imageTools/ImageToPdfTool'

const TOOL_COMPONENTS: Record<string, React.ComponentType> = {
  // Vehicle
  'vehicle-mileage': VehicleMileageTool,
  'fuel-cost': FuelCostTool,
  'trip-cost': TripCostTool,
  'monthly-vehicle-running-cost': MonthlyVehicleRunningCostTool,
  'petrol-vs-diesel': PetrolVsDieselTool,
  'ev-vs-petrol': EvVsPetrolTool,
  'jcb-fuel-cost': JcbFuelCostTool,
  'vehicle-service-cost': VehicleServiceCostTool,
  'road-trip-planner': RoadTripTool,

  // Construction
  'cement-calculator': CementCalculatorTool,
  'concrete-calculator': ConcreteCalculatorTool,
  'brick-calculator': BrickCalculatorTool,
  'tile-calculator': TileCalculatorTool,
  'paint-calculator': PaintCalculatorTool,
  'construction-cost': ConstructionCostTool,
  'excavator-cost': ExcavatorCostTool,

  // Power & Energy
  'electricity-cost': ElectricityCostTool,
  'ac-electricity-cost': AcCostTool,
  'fan-electricity-cost': FanCostTool,
  'inverter-backup': InverterBackupTool,
  'solar-panel': SolarPanelTool,
  'water-tank-capacity': WaterTankTool,
  'lpg-usage': LpgUsageTool,
  'generator-fuel-cost': GeneratorFuelTool,

  // Salary & Money
  'salary-hike': SalaryHikeTool,
  'in-hand-salary': InHandSalaryTool,
  'emi-calculator': EmiCalculatorTool,
  'gst-calculator': GstCalculatorTool,
  'sip-calculator': SipCalculatorTool,
  'daily-wage': DailyWageTool,
  'percentage-calculator': PercentageDiscountTool,
  'experience-calculator': ExperienceTool,

  // Land & Survey
  'cent-to-sqft': CentToSqftTool,
  'acre-converter': AcreConverterTool,
  'carpet-area': CarpetAreaTool,
  'land-area': LandAreaTool,

  // Photo & Documents
  '50kb-photo': Photo50KBTool,
  '100kb-photo': Photo100KBTool,
  'exact-kb-compressor': ExactKBTool,
  'signature-resizer': SignatureResizerTool,
  'passport-photo': PassportPhotoTool,
  'image-to-pdf': ImageToPdfTool,
}

export const ToolDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()
  if (!slug) return <Navigate to="/tools" replace />

  const tool = getToolBySlug(slug)
  if (!tool) return <Navigate to="/tools" replace />

  const Component = TOOL_COMPONENTS[slug]
  if (!Component) return <Navigate to="/tools" replace />

  return <Component />
}
