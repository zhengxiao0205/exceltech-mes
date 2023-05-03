<template>
  <div class="wrapper">
    <h3 class="title">可添加的图表项</h3>
    <div class="items-list">
      <div class="item" v-for="optionalItem of optionalItems" :key="optionalItem.i">
        <div class="left">
          <div class="name">
            {{ optionalItem.i }}
          </div>
          <div>大小: {{ optionalItem.w }} x {{ optionalItem.h }}</div>
        </div>
        <div class="right">
          <el-popover :visible="!!optionalItem.visible" :width="160">
            <template #reference>
              <el-icon class="icon" @click="() => handleEdit(optionalItem)">
                <i class="ri-settings-line"></i>
              </el-icon>
            </template>
            <el-form :model="form" class="login-form">
              <el-form-item label="宽度" prop="width">
                <el-input-number style="width: 100%" v-model="form.width" :controls="false" :step-strictly="true" />
              </el-form-item>
              <el-form-item label="高度" prop="height">
                <el-input-number style="width: 100%" v-model="form.height" :controls="false" :step-strictly="true" />
              </el-form-item>
              <el-button class="login-button" @click="() => handleCancel()"> 取消 </el-button>
              <el-button type="primary" class="login-button" @click="() => handleConfirm()"> 确认 </el-button>
            </el-form>
          </el-popover>

          <el-icon
            :class="{ disabled: !optionalItem.result, icon: true }"
            @click="() => handleAddToDashboard(optionalItem)"
          >
            <i class="ri-add-line"></i>
          </el-icon>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { handleAddItemToDashboard } from '@/utils/dashboard'
import { layoutArray } from '../../layout'
import { ref, onMounted, reactive } from 'vue'
const emits = defineEmits(['handleAddToDashboard'])

const props = defineProps({
  layout: {
    type: Object,
    default: () => {},
  },
})

const { layout } = props

const optionalItems = ref([])
let editItem = null

const form = reactive({
  width: '',
  height: '',
})

onMounted(() => {
  refreshOptionalItems()
})

const refreshOptionalItems = () => {
  const existingItems = layout.map((item) => item.i)
  optionalItems.value = layoutArray
    .filter((item) => !existingItems.includes(item.i))
    .map((item) => ({ ...item, result: handleAddItemToDashboard(item, layout) }))
}

const handleEdit = (optionalItem) => {
  editItem = optionalItem
  optionalItems.value.forEach((item) => (item.visible = false))
  optionalItem.visible = true
  form.width = optionalItem.w
  form.height = optionalItem.h
}

const handleCancel = () => {
  editItem.visible = false
}

const handleConfirm = () => {
  console.log(form)
}

const handleAddToDashboard = (optionalItem) => {
  if (optionalItem.result) {
    emits('handleAddToDashboard', { ...optionalItem, ...optionalItem.result })
  }
}
</script>
<style scoped lang="scss">
.wrapper {
  padding-top: 12px;
  .title {
    color: #00fdfd;
    margin-bottom: 16px;
  }

  .item {
    border: 1px solid #0097ad;
    color: #fff;
    display: flex;
    height: 64px;
    margin-bottom: 12px;
    justify-content: space-between;

    .left {
      width: 200px;
      padding-left: 12px;
      padding-top: 12px;

      .name {
        margin-bottom: 2px;
      }
    }

    .right {
      width: 52px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 22px;

      .icon {
        cursor: pointer;
        margin-right: 3px;

        &.disabled {
          cursor: not-allowed;
          color: rgba(255, 255, 255, 0.5);
        }
      }
    }
  }
}
</style>
