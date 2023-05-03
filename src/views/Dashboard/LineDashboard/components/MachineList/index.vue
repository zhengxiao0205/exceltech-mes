<template>
  <div class="item-wrapper">
    <div class="item-bg">
      <el-icon class="close-icon" @click="() => handleRemoveItem('MachineList')">
        <i class="ri-close-line"></i>
      </el-icon>
      <div id="machine-chart"></div>
    </div>
  </div>
</template>

<script setup>
import * as echarts from 'echarts'
import { onMounted } from 'vue'
import { option } from './option'

let myChart = null

const data = []
let time = new Date('2023-04-25 00:00:00')
let value = 92

onMounted(() => {
  myChart = echarts.init(document.getElementById('machine-chart'))
  myChart.setOption(option)
  for (let i = 0; i < (3600 * 8) / 60; i++) {
    data.push({ name: time.toString(), value: [time, value] })
    time = new Date(+time + 60 * 1000)
    const randomArray = value === 96 ? [-1, 0] : value === 82 ? [1, 0] : [-1, 0, 1]
    const plusNumber = randomArray[Math.floor(Math.random() * randomArray.length)]
    value += plusNumber
  }
  myChart.setOption({
    series: [{ data }],
  })

  setInterval(() => {
    data.splice(0, 1)
    data.push({ name: time.toString(), value: [time, value] })
    time = new Date(+time + 60 * 1000)
    const randomArray = value === 96 ? [-1, 0] : value === 82 ? [1, 0] : [-1, 0, 1]
    const plusNumber = randomArray[Math.floor(Math.random() * randomArray.length)]
    value += plusNumber
    myChart.setOption({
      series: [{ data }],
    })
  }, 1000)
})

const emits = defineEmits(['removeItem'])
const handleRemoveItem = (i) => {
  emits('removeItem', i)
}
</script>

<style lang="scss" scoped>
#machine-chart {
  width: 100%;
  height: 320px;
}
</style>
