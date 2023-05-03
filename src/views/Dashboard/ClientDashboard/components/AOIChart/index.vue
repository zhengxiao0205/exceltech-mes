<template>
  <div class="wrapper">
    <div id="aoi-chart"></div>
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
  myChart = echarts.init(document.getElementById('aoi-chart'))
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
    const array = [-1, 0, 1]
    const plusNumber = array[Math.floor(Math.random() * array.length)]
    return item + plusNumber
  })
  myChart.setOption({ series: [{ data: randomData }] })
}
</script>

<style lang="scss" scoped>
.wrapper {
  width: 100%;
  height: 100%;
  #aoi-chart {
    width: 100%;
    height: 100%;
  }
}
</style>
