<template>
  <div class="header">
    <div class="header-left">
      <div class="fold-menu" @click="switchMenu">
        <el-icon v-if="menuCollapse"><i class="ri-menu-fold-fill"></i></el-icon>
        <el-icon v-else><i class="ri-menu-unfold-fill"></i></el-icon>
      </div>
      <div class="route-tags">
        <VisitedRouteTags />
      </div>
    </div>
    <div class="header-right">
      <el-dropdown @command="handleSwitchLanguage">
        <el-icon><i class="ri-translate"></i></el-icon>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="zh">中文</el-dropdown-item>
            <el-dropdown-item command="en">English</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

      <el-dropdown @command="handleSwitchTheme">
        <el-icon><i class="ri-sun-line"></i></el-icon>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="default">默认</el-dropdown-item>
            <el-dropdown-item command="light">亮色</el-dropdown-item>
            <el-dropdown-item command="dark">暗色</el-dropdown-item>
            <el-dropdown-item command="science">科幻</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <el-icon><i class="ri-user-line"></i></el-icon>
      <el-icon><i class="ri-logout-circle-r-line"></i></el-icon>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import storage from '@/utils/storage'
import { onMounted } from 'vue'
import VisitedRouteTags from '@/components/VisitedRouteTags'
const props = defineProps({
  menuCollapse: { type: Boolean },
})
const emit = defineEmits(['switchMenu'])

const switchMenu = () => emit('switchMenu')

const { locale } = useI18n()

const handleSwitchLanguage = (lang) => {
  locale.value = lang
  storage.set('lang', lang)
}

onMounted(() => {
  const theme = storage.get('theme') || 'light'
  handleSwitchTheme(theme)
})

const handleSwitchTheme = (theme) => {
  storage.set('theme', theme)
  document.documentElement.setAttribute('theme', theme)
}
</script>

<style lang="scss" scoped>
.header {
  height: 50px;
  background-color: var(--header-bg-color);
  color: var(--header-text-color);
  display: flex;
  justify-content: space-between;

  .header-left {
    padding-left: 16px;
    cursor: pointer;
    font-size: 20px;
    display: flex;

    .fold-menu {
      line-height: 50px;
      padding-top: 3px;
    }

    .route-tags {
      padding-top: 8px;
      margin-left: 16px;
    }
  }

  .title {
    font-size: 20px;
    font-weight: bold;
    letter-spacing: 2px;
  }

  .header-right {
    font-size: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    .el-icon {
      cursor: pointer;
      font-size: 24px;
      color: var(--header-text-color);
      margin-right: 18px;
    }
  }
}
</style>
