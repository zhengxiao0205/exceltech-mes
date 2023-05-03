<template>
  <div class="item-wrapper">
    <div class="item-bg">
      <el-icon class="close-icon" @click="() => handleRemoveItem('AOIDefectChart')">
        <i class="ri-close-line"></i>
      </el-icon>
      <h3 class="title">
        <span class="label"> AOI不良统计 </span>
      </h3>
      <div id="aoi-defect-chart"></div>
    </div>
  </div>
</template>

<script setup>
import * as echarts from 'echarts'
import { onMounted } from 'vue'
import { option } from './option'

let myChart = null

onMounted(() => {
  myChart = echarts.init(document.getElementById('aoi-defect-chart'))
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

#aoi-defect-chart {
  width: 100%;
  height: 254px;
}
</style>
