import React from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { getToolBySlug } from '../data/tools'

// Calculators
import { VehicleMileageTool } from '../calculators/VehicleMileageTool'
import { FuelCostTool } from '../calculators/FuelCostTool'
import { TripCostTool } from '../calculators/TripCostTool'
import { JcbFuelCostTool } from '../calculators/JcbFuelCostTool'
import { ElectricityCostTool } from '../calculators/ElectricityCostTool'
import { InverterBackupTool } from '../calculators/InverterBackupTool'
import { SolarPanelTool } from '../calculators/SolarPanelTool'
import { CentToSqftTool } from '../calculators/CentToSqftTool'
import { ConstructionCostTool } from '../calculators/ConstructionCostTool'
import { SalaryHikeTool } from '../calculators/SalaryHikeTool'
import { ExperienceTool } from '../calculators/ExperienceTool'

// Image Tools
import { Photo50KBTool } from '../imageTools/Photo50KBTool'
import { ExactKBTool } from '../imageTools/ExactKBTool'
import { SignatureResizerTool } from '../imageTools/SignatureResizerTool'
import { PassportPhotoTool } from '../imageTools/PassportPhotoTool'

const TOOL_COMPONENTS: Record<string, React.ComponentType> = {
  'vehicle-mileage': VehicleMileageTool,
  'fuel-cost': FuelCostTool,
  'trip-cost': TripCostTool,
  'jcb-fuel-cost': JcbFuelCostTool,
  'electricity-cost': ElectricityCostTool,
  'inverter-backup': InverterBackupTool,
  'solar-panel': SolarPanelTool,
  'cent-to-sqft': CentToSqftTool,
  'construction-cost': ConstructionCostTool,
  'salary-hike': SalaryHikeTool,
  'experience-calculator': ExperienceTool,
  '50kb-photo': Photo50KBTool,
  'exact-kb-compressor': ExactKBTool,
  'signature-resizer': SignatureResizerTool,
  'passport-photo': PassportPhotoTool,
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
