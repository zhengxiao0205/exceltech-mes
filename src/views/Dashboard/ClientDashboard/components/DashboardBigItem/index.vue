<template>
  <div class="item-wrapper">
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup></script>

<style lang="scss" scoped>
.item-wrapper {
  width: 100%;
  height: 100%;
  background: url('@/assets/images/dashboard-big-item.png') no-repeat;
  background-size: cover;

  .content {
    height: 271px;
  }
}
</style>
