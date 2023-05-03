<template>
  <el-menu
    :default-active="route.path"
    class="el-menu-vertical"
    active-text-color="var(--menu-active-color)"
    background-color="var(--menu-bg-color)"
    text-color="var(--menu-text-color)"
    :router="true"
    :collapse="!menuCollapse"
    @select="handleSelectMenu"
  >
    <el-menu-item v-if="menuCollapse">
      <template #title>
        <img src="@/assets/logo.png" style="width: 100%" />
      </template>
    </el-menu-item>
    <el-menu-item index="/">
      <el-icon>
        <i class="ri-home-3-line"></i>
      </el-icon>
      <span>{{ t('menu.home') }}</span>
    </el-menu-item>
    <el-sub-menu index="/basic-data">
      <template #title>
        <el-icon><i class="ri-table-alt-line"></i></el-icon>
        <span>{{ t('menu.basicData') }}</span>
      </template>
      <el-menu-item index="/basic-data/pcb-info"> {{ t('menu.pcbInfo') }} </el-menu-item>
      <el-menu-item index="/basic-data/station-management"> {{ t('menu.station') }} </el-menu-item>
      <el-menu-item index="/basic-data/machine-management"> {{ t('menu.machine') }} </el-menu-item>
    </el-sub-menu>
    <el-sub-menu index="/manufacturing-process">
      <template #title>
        <el-icon><i class="ri-tools-line"></i></el-icon>
        <span>{{ t('menu.manufacture') }}</span>
      </template>
      <el-sub-menu index="/manufacturing-process/auto-changeover">
        <template #title>
          <span>{{ t('menu.autoChangeOver') }}</span>
        </template>
        <el-menu-item index="/manufacturing-process/auto-changeover/start-changeover">
          {{ t('menu.startChangeOver') }}
        </el-menu-item>
        <el-menu-item index="/manufacturing-process/auto-changeover/changeover-list">
          {{ t('menu.changeOverList') }}
        </el-menu-item>
      </el-sub-menu>
    </el-sub-menu>
    <el-sub-menu index="/system-management">
      <template #title>
        <el-icon><i class="ri-settings-2-line"></i></el-icon>
        <span>{{ t('menu.system') }}</span>
      </template>
      <!-- <el-sub-menu index="/system-management/user-authority">
        <template #title>
          <span>用户权限管理</span>
        </template>
        <el-menu-item index="/system-management/user-authority/user-management"> 用户管理 </el-menu-item>
        <el-menu-item index="/system-management/user-authority/user-group-management">用户组管理</el-menu-item>
        <el-menu-item index="/system-management/user-authority/authority-management">权限管理</el-menu-item>
      </el-sub-menu> -->
    </el-sub-menu>
  </el-menu>
</template>

<script setup>
import { useRoute } from 'vue-router'
import bus from '@/utils/bus'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  menuCollapse: { type: Boolean },
})
const route = useRoute()

const handleSelectMenu = (e) => {
  if (route.fullPath === e) {
    bus.emit('refresh')
  }
}
</script>

<style lang="scss" scoped>
.el-menu-vertical {
  width: 64px;
  background-color: var(--menu-bg-color);
  border: none;
  overflow: auto;

  .el-menu-item:hover {
    background-color: var(--menu-hover-color);
  }

  .el-icon {
    margin-right: 2px;
  }

  &:not(.el-menu--collapse) {
    width: 200px;
    height: 100%;
  }

  :deep .el-sub-menu__title {
    transition-duration: 0s; // 自带的duration会导致切换主题颜色时很难看, 所以把duration设为0
  }
}
</style>
