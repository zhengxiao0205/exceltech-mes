<template>
  <div class="dashboard-bg" @mousemove="(e) => handleDragging(e)" @mouseup="() => handleEndDragging()">
    <div
      class="dashboard-wrapper"
      :style="{
        transform,
      }"
    >
      <div class="header">
        <div class="add-button" @click="() => openDrawer()">添加表单项</div>
        <h1>Exceltech Intelligence Factory Line Monitor</h1>
      </div>
      <div class="content">
        <div class="grid-layout">
          <div
            class="grid-item"
            v-for="item in layout"
            :key="item.i"
            :style="{
              width: item.w * 120 + 'px',
              height: item.h * 80 + 'px',
              transform: `translate(${item.translateX}px, ${item.translateY}px)`,
              zIndex: draggingItem && draggingItem.i === item.i ? 1000 : 1,
              transition: `transform ${isDragging ? 0 : 0.3}s`,
            }"
            @mousedown="(e) => handleStartDragging(e, item)"
          >
            <component @removeItem="(i) => handleRemoveItem(i)" :is="layoutMap[item.i]" />
          </div>
        </div>
      </div>
    </div>
  </div>
  <el-drawer v-if="drawer" v-model="drawer" direction="ltr" :with-header="false" modal-class="dashboard-left-drawer" size="320">
    <template #default><LeftDrawer :layout="layout" @handleAddToDashboard="(item) => handleAddToDashboard(item)" /> </template>
  </el-drawer>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { layoutMap, layoutArray } from './layout'
import { getMaxCoincideItem, handleExchangePosition, handleDragToEmpty } from '@/utils/dashboard'
import LeftDrawer from './components/LeftDrawer'

// 为响应不同大小屏幕而设置的看板放大或缩小的比例
let scale = 1

// 横向16格 纵向12格
const layout = reactive([...layoutArray])

// 给item设置translate偏移量
const setItemTranslate = (item) => {
  item.translateX = item.offsetX + item.x * 120
  item.translateY = item.offsetY + item.y * 80
}

layout.forEach((item) => {
  item.offsetX = 0
  item.offsetY = 0
  setItemTranslate(item)
})

const isDragging = ref(false)

// 存储鼠标按下时的坐标
let startX = 0
let startY = 0

const draggingItem = ref(null)

const handleStartDragging = (e, item) => {
  isDragging.value = true
  draggingItem.value = item

  startX = e.clientX
  startY = e.clientY
}

const handleDragging = (e) => {
  if (isDragging.value) {
    draggingItem.value.offsetX = (e.clientX - startX) / scale
    draggingItem.value.offsetY = (e.clientY - startY) / scale
    setItemTranslate(draggingItem.value)
  }
}

const handleEndDragging = () => {
  if (!isDragging.value) {
    return
  }
  isDragging.value = false

  const item = draggingItem.value
  // 结束拖拽后，进行重合度算法判断，和页面中哪个元素的重合度最高
  const maxCoincideItem = getMaxCoincideItem(item, layout)

  if (!maxCoincideItem || maxCoincideItem.ratio < 0.2) {
    // 如果最大重合度小于0.2，或者没有重合元素，则判定为是拖拽到空白区域
    const result = handleDragToEmpty(item, layout)
    if (result) {
      item.x = result.draggingItem.x
      item.y = result.draggingItem.y
    }
    item.offsetX = 0
    item.offsetY = 0
    setItemTranslate(item)
  } else {
    const targetItem = maxCoincideItem.item
    // 需要判断拖拽元素和目标元素的位置关系，是上下相邻，还是左右相邻，还是不相邻
    const result = handleExchangePosition(item, targetItem)
    if (result) {
      item.x = result.draggingItem.x
      item.y = result.draggingItem.y
      targetItem.x = result.targetItem.x
      targetItem.y = result.targetItem.y
      setItemTranslate(targetItem)
    }
    item.offsetX = 0
    item.offsetY = 0
    setItemTranslate(item)
  }
}

const handleRemoveItem = (i) => {
  const removeIndex = layout.findIndex((item) => item.i === i)
  layout.splice(removeIndex, 1)
}

const drawer = ref(false)
const openDrawer = () => {
  drawer.value = true
}

const handleAddToDashboard = (item) => {
  item.offsetX = 0
  item.offsetY = 0
  setItemTranslate(item)
  layout.push(item)
  drawer.value = false
}

// 响应式解决方案 scale
const transform = ref('')
const changeScale = () => {
  const body = document.documentElement
  const scaleW = body.clientWidth / 1920
  const scaleH = body.clientHeight / 1080
  scale = scaleW < scaleH ? scaleW : scaleH
  transform.value = `scale(${scale}) translate(-50%, -50%)`
}

onMounted(() => {
  changeScale()
  window.addEventListener('resize', changeScale)
})

onUnmounted(() => {
  window.removeEventListener('resize', changeScale)
})
</script>

<style lang="scss">
.dashboard-bg {
  width: 100vw;
  height: 100vh;
  background: #646464;
  background-size: cover;
}
.dashboard-wrapper {
  width: 1920px;
  height: 1080px;
  position: fixed;
  transform-origin: left top;
  left: 50%;
  top: 50%;

  .header {
    height: 120px;
    padding: 6px;
    box-sizing: border-box;
    h1 {
      background-color: #3b3b3b;
      height: 108px;
      line-height: 100px;
      color: #f1f1f1;
      text-align: center;
      user-select: none;
    }

    .add-button {
      position: absolute;
      left: 32px;
      top: 8px;
      font-size: 24px;
      user-select: none;
      cursor: pointer;
      border: 1px solid #00fefe;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 160px;
      height: 40px;
      background-color: transparent;
      color: #00fefe;
    }
  }

  .content {
    height: 960px;

    .grid-layout {
      width: 100%;
      height: 100%;
      position: relative;

      .grid-item {
        position: absolute;
        .item-wrapper {
          width: 100%;
          height: 100%;
          box-sizing: border-box;
          padding: 6px;
          cursor: pointer;

          .item-bg {
            width: 100%;
            height: 100%;
            background-color: #3b3b3b;
            text-align: center;
            .close-icon {
              position: absolute;
              color: #fff;
              font-size: 28px;
              cursor: pointer;
              right: 8px;
              top: 10px;
              z-index: 1;
            }
          }
        }
      }
    }
  }
}
</style>
