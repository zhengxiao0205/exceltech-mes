<template>
  <div class="wrapper">
    <el-space class="product" :size="24">
      <span class="label">{{ t('dashboard.model') }}</span>
      <span class="text">20230330JK52C</span>
    </el-space>
    <el-space class="situation" :size="80">
      <div class="situation-item">
        <div class="label">{{ t('dashboard.progress') }}</div>
        <div class="value">50%</div>
        <div class="info">300/600</div>
      </div>

      <div class="situation-item">
        <div class="label">{{ t('dashboard.downTime') }}</div>
        <div class="value">20m 35s</div>
        <div class="info">{{ t('dashboard.downTimes') }} 15</div>
      </div>
      <div class="situation-item">
        <div class="label">{{ t('dashboard.changeOver') }}</div>
        <div class="value">23m 12s</div>
        <div class="info">{{ t('dashboard.finishedTime') }} 17:23</div>
      </div>
      <div class="situation-item">
        <div class="label">CycleTime</div>
        <div class="value">22s</div>
        <div class="info">{{ t('dashboard.median') }} 23.4s</div>
      </div>
    </el-space>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<style lang="scss" scoped>
.wrapper {
  width: 100%;
  height: 100%;
  padding-left: 64px;

  .product {
    height: 136px;
    display: flex;
    line-height: 136px;

    .label {
      color: #8ea5bb;
      font-size: 26px;
    }

    .text {
      color: #fff;
      font-size: 36px;
      font-weight: bold;
    }
  }

  .situation {
    margin-top: 12px;
    .situation-item {
      text-align: center;
      .label {
        color: #a9b9c9;
        font-size: 24px;
        margin-bottom: 16px;
        line-height: 24px;
      }

      .value {
        color: #fff;
        font-size: 36px;
        margin-bottom: 25px;
        line-height: 36px;
      }

      .info {
        color: #a9b9c9;
        font-size: 22px;
        line-height: 20px;
      }
    }
  }
}
</style>
