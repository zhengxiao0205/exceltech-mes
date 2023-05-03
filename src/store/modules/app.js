export default {
  namespaced: true,
  state: {
    visitedRoutes: [],
  },
  mutations: {
    addVisitedRoutes(state, route) {
      state.visitedRoutes.push(route)
    },
    removeVisitedRoutes(state, route) {
      state.visitedRoutes = state.visitedRoutes.filter((i) => i.name !== route.name)
    }
  },
}
