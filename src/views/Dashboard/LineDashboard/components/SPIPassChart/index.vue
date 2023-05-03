<template>
  <div class="item-wrapper">
    <div class="item-bg">
      <el-icon class="close-icon" @click="() => handleRemoveItem('SPIPassChart')">
        <i class="ri-close-line"></i>
      </el-icon>
      <div id="spi-pass-chart"></div>
    </div>
  </div>
</template>

<script setup>
import * as echarts from 'echarts'
import { onMounted } from 'vue'
import { option } from './option'

let myChart = null

onMounted(() => {
  myChart = echarts.init(document.getElementById('spi-pass-chart'))
  myChart.setOption(option)
})

const emits = defineEmits(['removeItem'])
const handleRemoveItem = (i) => {
  emits('removeItem', i)
}
</script>

<style lang="scss" scoped>
.title {
  color: #c7c7d9;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  .label {
    color: #c7c7d9;
    font-size: 22px;
  }
}

#spi-pass-chart {
  width: 100%;
  height: 224px;
}
</style>
