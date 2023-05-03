import app from './modules/app'
import { createStore } from 'vuex'
import line from './modules/line'
import machine from './modules/machine'
import pcb from './modules/pcb'

export default createStore({
  modules: {
    app,
    machine,
    pcb,
    line,
  },
  getters: {
    visitedRoutes: (state) => state.app.visitedRoutes,
    machineGroups: (state) => state.machine.machineGroups,
    mainMachineGroups: (state) => state.machine.machineGroups.filter((i) => i.machineType !== '轨道'), // 主设备的设备类型
    machineTypes: (state) => state.machine.machineTypes,
    pcbInfos: (state) => state.pcb.pcbInfos,
    lines: (state) => state.line.lines,
  },
})
