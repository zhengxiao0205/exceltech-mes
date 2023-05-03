import { getPcbInfoBasicInfos } from '@/api/pcb-info'

export default {
  namespaced: true,
  state: {
    pcbInfos: [], // 数据库中所有的pcb板信息
  },
  mutations: {
    setPcbInfos(state, value) {
      state.pcbInfos = value
    },
  },
  actions: {
    getPcbInfos(context) {
      return new Promise(async (resolve) => {
        const result = await getPcbInfoBasicInfos()
        context.commit('setPcbInfos', result)
        resolve('success')
      })
    },
  },
}
