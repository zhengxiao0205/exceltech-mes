<template>
  <div class="menu">
    <SideMenu :menuCollapse="menuCollapse"></SideMenu>
  </div>
  <div :class="`content ${menuCollapse ? '' : 'active'}`">
    <Header :menuCollapse="menuCollapse" @switchMenu="switchMenu"/>
    <Body />
  </div>
</template>

<script setup>
import SideMenu from './components/SideMenu'
import Header from './components/Header'
import Body from './components/Body'
import { ref } from 'vue'

const menuCollapse = ref(true)

const switchMenu = () => {
  menuCollapse.value = !menuCollapse.value
}
</script>

<style lang="scss" scoped>
.menu {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  background-color: var(--menu-bg-color);
}
.content {
  padding-left: 200px;
  transition: padding-left 0.4s;

  &.active {
    padding-left: 64px;
  }
}
</style>
