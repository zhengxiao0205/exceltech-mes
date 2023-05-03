<template>
  <div class="item-wrapper">
    <div class="item-bg">
      <el-icon class="close-icon" @click="() => handleRemoveItem('CycletimeStatistics')">
        <i class="ri-close-line"></i>
      </el-icon>
      <h3 class="title">
        <span class="label"> Cycle Time 统计 </span>
      </h3>
      <div class="statistics">
        <div class="info-item">
          <div class="label">25%位值</div>
          <div class="value">21s</div>
        </div>
        <div class="info-item">
          <div class="label">中位值</div>
          <div class="value">22s</div>
        </div>
        <div class="info-item">
          <div class="label">75%位值</div>
          <div class="value">26s</div>
        </div>
        <div class="info-item">
          <div class="label">平均值</div>
          <div class="value">23.6s</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const emits = defineEmits(['removeItem'])
const handleRemoveItem = (i) => {
  emits('removeItem', i)
}
</script>

<style lang="scss" scoped>
.title {
  color: #c7c7d9;
  font-size: 24px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
}

.statistics {
  margin-top: 36px;
  display: flex;
  user-select: none;
  .info-item {
    flex: 1;
    color: #c7c7d9;
    .label {
      font-size: 24px;
      margin-bottom: 24px;
    }

    .value {
      font-size: 32px;
    }
  }
}
</style>
