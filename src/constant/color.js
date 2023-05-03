import * as echarts from 'echarts'

export const chartPrimaryColor = new echarts.graphic.LinearGradient(0, 0, 0, 1, [
  { offset: 0, color: '#008EA3' },
  { offset: 0.6, color: '#0097A8' },
  { offset: 1, color: '#00BFB1' },
])

export const chartWarningColor = new echarts.graphic.LinearGradient(0, 0, 0, 1, [
  { offset: 1, color: '#fd666d' },
])
