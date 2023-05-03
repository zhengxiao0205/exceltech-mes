<template>
  <el-config-provider :locale="elementPlusLocale">
    <router-view />
  </el-config-provider>
</template>

<script setup>
import { ElConfigProvider } from 'element-plus'
import { ref, watch, onMounted } from 'vue'

import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import en from 'element-plus/dist/locale/en.mjs'
import { useI18n } from 'vue-i18n'
import storage from '@/utils/storage'

/**
 * 对element plus进行国际化
 */
const { locale } = useI18n()
const elementPlusLocale = ref(zhCn)
onMounted(() => {
  setElementLocale(storage.get('lang') || 'zh')
})
watch(
  () => locale.value,
  (lang) => setElementLocale(lang)
)
const setElementLocale = (lang) => {
  elementPlusLocale.value = lang === 'zh' ? zhCn : en
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  box-sizing: border-box;
}

h1,
h2,
h3,
h4,
h5,
h6 {
  margin: 0;
}

body {
  margin: 0;
  min-height: 100vh;
  background: var(--body-bg);
}

// 对项目中所有的数字输入框el-input-number中的数字居左
.el-input-number {
  .el-input__inner {
    text-align: left;
  }
}

// 看板左侧拉出的配置抽屉的背景色
.dashboard-left-drawer {
  .el-drawer {
    padding: 0;
    background-color: rgba(0, 14, 40, 0.8);
  }
}
</style>
