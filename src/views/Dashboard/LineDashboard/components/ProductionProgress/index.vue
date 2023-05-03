<template>
  <div class="item-wrapper">
    <div class="item-bg">
      <el-icon class="close-icon" @click="() => handleRemoveItem('ProductionProgress')">
        <i class="ri-close-line"></i>
      </el-icon>
      <h3 class="title">当前产品名称 : <span class="value">39410T</span></h3>
      <div id="progress-chart"></div>
    </div>
  </div>
</template>

<script setup>
import * as echarts from 'echarts'
import { onMounted } from 'vue'
import { option } from './option'

let myChart = null

onMounted(() => {
  myChart = echarts.init(document.getElementById('progress-chart'))
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
  font-size: 22px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;

  .value {
    color: #5bcc51;
    font-size: 32px;
    margin-left: 6px;
  }
}

#progress-chart {
  width: 100%;
  height: 256px;
}
</style>
