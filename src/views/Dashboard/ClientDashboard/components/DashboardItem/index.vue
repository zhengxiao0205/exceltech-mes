<template>
  <div class="item-wrapper">
    <h4 class="title">{{ title }}</h4>
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
const { title } = defineProps({
  title: {
    type: String,
    default: '计划达成率',
  },
})
</script>

<style lang="scss" scoped>
.item-wrapper {
  width: 100%;
  height: 100%;
  background: url('@/assets/images/dashboard-item.png') no-repeat;
  background-size: cover;

  .title {
    font-size: 18px;
    color: #eee;
    padding-left: 24px;
    letter-spacing: 1px;
    line-height: 44px;
  }


  .content {
    height: 271px;
  }
}
</style>
