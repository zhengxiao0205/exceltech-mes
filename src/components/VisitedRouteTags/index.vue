<template>
  <div class="tags-wrapper">
    <div
      class="tab-item"
      v-for="tag of visitedRoutes"
      :key="tag.name"
      closable
      type="info"
      size="large"
      :class="`tag-item ${route.name === tag.name ? 'active' : ''} `"
      @click="() => handleClickTag(tag)"
    >
      <span class="tag-name">{{ t(tag.name) }}</span>
      <el-icon class="close-icon" @click="(e) => handleCloseTag(e, tag)">
        <i class="ri-close-line"></i>
      </el-icon>
    </div>
  </div>
</template>

<script setup>
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { computed } from 'vue'

import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const store = useStore()

const router = useRouter()

const route = useRoute()

const handleClickTag = (tag) => {
  router.push(tag.href)
}
const handleCloseTag = (e, tag) => {
  e.stopPropagation()
  store.commit('app/removeVisitedRoutes', tag)
}
const visitedRoutes = computed(() => store.getters.visitedRoutes || [])
</script>

<style lang="scss" scoped>
.tags-wrapper {
  border-radius: 4px 4px 0 0;
  display: inline-block;
  .tag-item {
    cursor: pointer;
    user-select: none;
    padding: 0 16px;
    height: 42px;
    line-height: 42px;
    font-size: 14px;
    color: var(--header-text-color);
    background-color: transparent;
    display: inline-block;
    border-radius: 6px 6px 0 0;

    &.active {
      color: var(--tag-active-text-color);
      background-color: var(--tag-active-bg-color);
    }

    .close-icon {
      position: relative;
      margin-left: 8px;
      top: 2px;
      border-radius: 50%;
      &:hover {
        background-color: #c0c4cc;
        color: #fff;
      }
    }
  }
}
</style>
