import AOIDefectChart from './components/AOIDefectChart'
import AOIPassChart from './components/AOIPassChart'
import CycletimeChart from './components/CycletimeChart'
import CycletimeStatistics from './components/CycletimeStatistics'
import DefectPPMChart from './components/DefectPPMChart'
import MachineList from './components/MachineList'
import OEEChart from './components/OEEChart'
import ProductionPlan from './components/ProductionPlan'
import ProductionProgress from './components/ProductionProgress'
import SPIPassChart from './components/SPIPassChart'

export const layoutMap = {
  ProductionProgress,
  OEEChart,
  AOIPassChart,
  DefectPPMChart,
  SPIPassChart,
  ProductionPlan,
  AOIDefectChart,
  CycletimeStatistics,
  CycletimeChart,
  MachineList,
}

export const layoutArray = [
  { x: 0, y: 0, w: 4, h: 4, i: 'ProductionProgress' },
  { x: 0, y: 4, w: 4, h: 4, i: 'ProductionPlan' },
  { x: 0, y: 8, w: 4, h: 4, i: 'AOIDefectChart' },
  { x: 4, y: 0, w: 8, h: 3, i: 'CycletimeStatistics' },
  { x: 4, y: 3, w: 8, h: 5, i: 'CycletimeChart' },
  { x: 4, y: 8, w: 8, h: 4, i: 'MachineList' },
  { x: 12, y: 0, w: 4, h: 3, i: 'OEEChart' },
  { x: 12, y: 3, w: 4, h: 3, i: 'AOIPassChart' },
  { x: 12, y: 6, w: 4, h: 3, i: 'SPIPassChart' },
  { x: 12, y: 9, w: 4, h: 3, i: 'DefectPPMChart' },
]
