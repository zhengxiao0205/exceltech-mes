import { getMachineGroupBasicInfos, getMachineGroupTypes } from '@/api/machine-group'

export default {
  namespaced: true,
  state: {
    machineGroups: [], // 设备组
    machineTypes: [] // 设备类型
  },
  mutations: {
    setMachineGroups(state, value) {
      state.machineGroups = value
    },
    setMachineTypes(state, value) {
      state.machineTypes = value
    },
  },
  actions: {
    getMachineGroups(context) {
      return new Promise(async (resolve) => {
        const machineGroups = await getMachineGroupBasicInfos()
        context.commit('setMachineGroups', machineGroups)
        resolve('success')
      })
    },
    getMachineTypes(context) {
      return new Promise(async (resolve) => {
        const machineTypes = await getMachineGroupTypes()
        context.commit('setMachineTypes', machineTypes)
        resolve('success')
      })
    },
  },
}
