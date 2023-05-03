import { createRouter, createWebHistory } from 'vue-router'

import i18n from '@/i18n'
import store from '@/store'

const routes = [
  {
    path: '/',
    name: 'menu.home',
    component: () => import('@/views/Layout'),
    children: [
      {
        path: 'basic-data',
        name: 'menu.basicData',
        children: [
          {
            path: 'pcb-info',
            name: 'menu.pcbInfo',
            component: () => import('@/views/BasicData/PCBInfo'),
          },
          {
            path: 'station-management',
            name: 'menu.station',
            component: () => import('@/views/BasicData/StationManagement'),
          },
          {
            path: 'machine-management',
            name: 'menu.machine',
            component: () => import('@/views/BasicData/MachineManagement'),
          },
        ],
      },
      {
        path: 'manufacturing-process',
        name: 'menu.manufacture',
        children: [
          {
            path: 'auto-changeover',
            name: 'menu.autoChangeOver',
            children: [
              {
                path: 'start-changeover',
                name: 'menu.startChangeOver',
                component: () => import('@/views/ManufacturingProcess/AutoChangeOver/StartChangeOver'),
              },
              {
                path: 'changeover-list',
                name: 'menu.changeOverList',
                component: () => import('@/views/ManufacturingProcess/AutoChangeOver/ChangeOverList'),
              },
            ],
          },
        ],
      },
      {
        path: 'system-management',
        name: '系统管理',
      },
    ],
  },
  {
    path: '/login',
    name: '登录',
    component: () => import('@/views/Login'),
  },
  {
    path: '/dashboard',
    name: '运行数据中心看板',
    component: () => import('@/views/Dashboard/ClientDashboard'),
  },
  {
    path: '/line-dashboard',
    name: 'dashboard.lineDashboard',
    component: () => import('@/views/Dashboard/LineDashboard'),
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

router.afterEach((to, from, next) => {
  // 页面标题设置
  document.title = i18n.global.t(to.name)

  // 记录访问过的页面数据
  const visitedRoutes = store.getters.visitedRoutes
  if (!visitedRoutes.find((i) => i.name === to.name) && to.name !== '登录' && to.name) {
    store.commit('app/addVisitedRoutes', to)
  }
})

export default router
