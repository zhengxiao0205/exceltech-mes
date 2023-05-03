import { formatNameIdMapToArray } from '@/utils/common'
import { getLineNames } from '@/api/line'

export default {
  namespaced: true,
  state: {
    lines: [], // 产线信息
  },
  mutations: {
    setLines(state, value) {
      state.lines = value
    },
  },
  actions: {
    getLines(context) {
      return new Promise(async (resolve) => {
        const lineNameMap = await getLineNames()
        const lines = formatNameIdMapToArray(lineNameMap)
        context.commit('setLines', lines)
        resolve('success')
      })
    },
  },
}
