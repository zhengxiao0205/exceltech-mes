<template>
  <div class="item-wrapper">
    <div class="item-bg">
      <el-icon class="close-icon" @click="() => handleRemoveItem('ProductionPlan')">
        <i class="ri-close-line"></i>
      </el-icon>
      <h3 class="title">
        <span class="label"> 生产计划 </span>
      </h3>
      <div class="table">
        <div class="table-column">
          <span class="line">产线</span>
          <span class="code">产品编码</span>
          <span class="qty">数量</span>
          <span class="finish-qty">完工数</span>
          <span class="finish-rate">完工率</span>
        </div>
        <div class="table-body">
          <div class="row odd">
            <span class="line">SMT01</span>
            <span class="code">PCB20230421</span>
            <span class="qty">700</span>
            <span class="finish-qty">350</span>
            <span class="finish-rate">50%</span>
          </div>

          <div class="row even">
            <span class="line">SMT01</span>
            <span class="code">PCB20230421</span>
            <span class="qty">700</span>
            <span class="finish-qty">350</span>
            <span class="finish-rate">50%</span>
          </div>
          <div class="row odd">
            <span class="line">SMT01</span>
            <span class="code">PCB20230421</span>
            <span class="qty">700</span>
            <span class="finish-qty">350</span>
            <span class="finish-rate">50%</span>
          </div>
          <div class="row even">
            <span class="line">SMT01</span>
            <span class="code">PCB20230421</span>
            <span class="qty">700</span>
            <span class="finish-qty">350</span>
            <span class="finish-rate">50%</span>
          </div>
          <div class="row odd">
            <span class="line">SMT01</span>
            <span class="code">PCB20230421</span>
            <span class="qty">700</span>
            <span class="finish-qty">350</span>
            <span class="finish-rate">50%</span>
          </div>
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
}

.table {
  user-select: none;
  .line {
    width: 88px;
  }

  .code {
    width: 112px;
  }

  .qty {
    width: 70px;
  }

  .finish-qty {
    width: 70px;
  }

  .finish-rate {
    width: 70px;
  }
  .table-column,
  .row {
    display: flex;
    background-color: #8da8b4;
    height: 41.9px;
    font-size: 20px;
    align-items: center;
    text-align: center;
  }

  .row {
    font-size: 18px;
    &.even {
      background-color: #8da8b4;
    }

    &.odd {
      background-color: #e7eaf7;
    }
  }
}
</style>
