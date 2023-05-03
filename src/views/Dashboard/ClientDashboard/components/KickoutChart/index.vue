<template>
  <div class="wrapper">
    <div id="kickout-chart"></div>
  </div>
</template>

<script setup>
import * as echarts from 'echarts'
import { onMounted, watch, toRefs, ref } from 'vue'
import { smtOption, lineOption } from './option'

const props = defineProps({
  viewType: {
    type: String,
    default: 'SMT',
  },
})

const { viewType } = toRefs(props)

let chartsOption = ref(null)

let myChart = null

onMounted(() => {
  myChart = echarts.init(document.getElementById('kickout-chart'))
  renderChart()
})

watch(
  () => viewType.value,
  () => {
    renderChart()
  }
)

const renderChart = () => {
  chartsOption.value = viewType.value === 'SMT' ? smtOption : lineOption
  myChart.setOption(chartsOption.value, true)

  const randomData = chartsOption.value.series[0].data.map((item) => {
    const array = [-0.01, 0, 0.01]
    const plusNumber = array[Math.floor(Math.random() * array.length)]
    return Math.round((item + plusNumber) * 100) / 100
  })
  myChart.setOption({ series: [{ data: randomData }] })
}
</script>

<style lang="scss" scoped>
.wrapper {
  width: 100%;
  height: 100%;
  #kickout-chart {
    width: 100%;
    height: 100%;
  }
}
</style>
