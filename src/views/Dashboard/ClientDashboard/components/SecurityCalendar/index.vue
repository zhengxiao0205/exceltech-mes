<template>
  <div class="wrapper">
    <div id="security-calendar">
      <div class="numbers">
        <div class="number-item" v-for="(item, index) of numbers" :key="index">
          <span :style="{ transform: `translate(0, -${item}0%)` }">0123456789</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
const props = defineProps({
  renderAnimation: {
    type: Boolean,
    default: true,
  },
})
const { renderAnimation } = props
const numbers = renderAnimation ? ref([0, 0, 0, 0]) : ref([0, 3, 7, 9])
onMounted(() => {
  setTimeout(() => {
    numbers.value = [0, 3, 7, 9]
  }, 1200)
})
</script>
<style lang="scss" scoped>
.wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  #security-calendar {
    .numbers {
      display: flex;
      user-select: none;
      .number-item {
        width: 72px;
        height: 72px;
        overflow: hidden;
        background-color: #0092a6;
        margin: 0 12px;
        border-radius: 4px;
        padding: 12px 0;
        span {
          writing-mode: vertical-rl;
          text-orientation: upright;
          font-size: 64px;
          color: #fff;
          transition: transform ease-in-out;
          transition-duration: 2s;
          letter-spacing: 12px;
        }
      }
    }
  }
}
</style>
