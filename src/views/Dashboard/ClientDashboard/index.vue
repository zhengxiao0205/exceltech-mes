<template>
  <div class="dashboard-bg">
    <div
      class="dashboard-wrapper"
      :style="{
        transform,
      }"
    >
      <div class="header">
        <img src="@/assets/logo.png" class="logo" />
        <h1
          class="title"
          :style="{ fontSize: locale === 'en' ? '32px' : '38px', letterSpacing: locale === 'en' ? '2px' : '9px' }"
        >
          <span>{{ t('dashboard.title') }}</span>
        </h1>
      </div>
      <div class="content">
        <div class="video-level">
          <div class="left">
            <div class="item">
              <DashboardItem :title="t('dashboard.targetCompletionRate')">
                <PlanAchievingRateChart :viewType="viewType" />
              </DashboardItem>
            </div>
            <div class="item">
              <DashboardItem :title="t('dashboard.oee')">
                <OEEChart :viewType="viewType" />
              </DashboardItem>
            </div>
          </div>
          <div class="video-wrapper">
            <div class="video-box">
              <el-space :size="24" class="switch-container">
                <div
                  :class="`switch-button ${viewType === 'SMT' ? 'active' : ''}`"
                  @click="() => switchViewType('SMT')"
                >
                  {{ t('dashboard.smtZone') }}
                </div>
                <div
                  :class="`switch-button ${viewType === 'Line1' ? 'active' : ''}`"
                  @click="() => switchViewType('Line1')"
                >
                  Line1
                </div>
                <div
                  :class="`switch-button ${viewType === 'Line2' ? 'active' : ''}`"
                  @click="() => switchViewType('Line2')"
                >
                  Line2
                </div>
                <div
                  :class="`switch-button ${viewType === 'Line3' ? 'active' : ''}`"
                  @click="() => switchViewType('Line3')"
                >
                  Line3
                </div>
                <div
                  :class="`switch-button ${viewType === 'Line4' ? 'active' : ''}`"
                  @click="() => switchViewType('Line4')"
                >
                  Line4
                </div>
                <div
                  :class="`switch-button ${viewType === 'Line5' ? 'active' : ''}`"
                  @click="() => switchViewType('Line5')"
                >
                  Line5
                </div>
              </el-space>
              <video controls autoplay muted loop>
                <source src="@/assets/videos/video.mp4" type="video/mp4" />
              </video>
            </div>
          </div>
          <div class="right">
            <div class="item">
              <DashboardItem :title="t('dashboard.spiPassRate')">
                <SPIChart :viewType="viewType" />
              </DashboardItem>
            </div>
            <div class="item">
              <DashboardItem :title="t('dashboard.aoiPassRate')">
                <AOIChart :viewType="viewType" />
              </DashboardItem>
            </div>
          </div>
        </div>
        <div class="bottom-level">
          <div class="item">
            <DashboardItem :title="t('dashboard.mispicks')">
              <KickoutChart :viewType="viewType" />
            </DashboardItem>
          </div>
          <div class="item" v-if="viewType === 'SMT'">
            <DashboardItem :title="t('dashboard.secureCalendar')">
              <SecurityCalendar :renderAnimation="isFirstView" />
            </DashboardItem>
          </div>
          <div class="item" v-if="viewType === 'SMT'">
            <DashboardItem :title="t('dashboard.employeeSkills')">
              <StaffSkillList />
            </DashboardItem>
          </div>
          <div class="big-item" v-if="viewType !== 'SMT'">
            <DashboardBigItem>
              <LineSituation />
            </DashboardBigItem>
          </div>
          <div class="item">
            <DashboardItem :title="t('dashboard.productDefectPPM')">
              <PPMChart :viewType="viewType" />
            </DashboardItem>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import DashboardItem from './components/DashboardItem'
import DashboardBigItem from './components/DashboardBigItem'
import PlanAchievingRateChart from './components/PlanAchievingRateChart'
import OEEChart from './components/OEEChart'
import KickoutChart from './components/KickoutChart'
import SPIChart from './components/SPIChart'
import AOIChart from './components/AOIChart'
import PPMChart from './components/PPMChart'
import StaffSkillList from './components/StaffSkillList'
import SecurityCalendar from './components/SecurityCalendar'
import LineSituation from './components/LineSituation'

import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()

// 厂级和线级看板视角切换
const viewType = ref('SMT')
const isFirstView = ref(true) // 是否是页面第一次加载看板, 如果不是第一次，则安全日历动画效果不渲染
const switchViewType = (value) => {
  viewType.value = value
  isFirstView.value = false
  clearInterval(interval)
  intervalSwitch()
}

// 响应式解决方案 scale
const transform = ref('')
const changeScale = () => {
  const body = document.documentElement
  const scaleW = body.clientWidth / 1920
  const scaleH = body.clientHeight / 1080
  const scale = scaleW < scaleH ? scaleW : scaleH
  transform.value = `scale(${scale}) translate(-50%, -50%)`
}

// 每隔一段时间自动在厂级和线级视角之前切换
let interval = 0
const intervalSwitch = () => {
  interval = setInterval(() => {
    viewType.value = viewType.value === 'SMT' ? 'Line1' : 'SMT'
  }, 18000)
}

onMounted(() => {
  changeScale()
  window.addEventListener('resize', changeScale)
  intervalSwitch()
})

onUnmounted(() => {
  window.removeEventListener('resize', changeScale)
  clearInterval(interval)
})
</script>

<style lang="scss" scoped>
.dashboard-bg {
  width: 100vw;
  height: 100vh;
  background: url('@/assets/images/dashboard-background.png') no-repeat;
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
    background: url('@/assets/images/dashboard-header.png') no-repeat;
    background-size: 100%;
    height: 90px;

    .logo {
      position: absolute;
      left: 32px;
      top: -14px;
    }

    .title {
      font-size: 38px;
      letter-spacing: 9px;
      color: #00fefe;
      padding-top: 12px;
      text-align: center;
    }
  }

  .content {
    height: 990px;
    .video-level {
      height: 660px;
      display: flex;
      .left {
        flex: 1;
        .item {
          height: 315px;
          padding-bottom: 15px;
        }
      }
      .video-wrapper {
        flex: 2;
        display: flex;
        align-items: center;
        justify-content: center;
        .video-box {
          width: 940px;
          height: 578px;
          .switch-container {
            margin-bottom: 24px;
            .switch-button {
              font-size: 24px;
              user-select: none;
              cursor: pointer;
              background-color: transparent;
              color: #00fdfd;
              border: 1px solid #0091a3;
              display: flex;
              align-items: center;
              justify-content: center;
              width: 120px;
              height: 48px;
              transition: all 0.5s;

              &.active {
                background-color: #0091a3;
                color: #fff;
              }
            }
          }

          video {
            width: 940px;
            height: 530px;
          }
        }
      }
      .right {
        flex: 1;
        .item {
          height: 315px;
          padding-bottom: 15px;
        }
      }
    }

    .bottom-level {
      height: 330px;
      display: flex;
      .item {
        flex: 1;
        height: 315px;
        padding-bottom: 15px;
      }

      .big-item {
        flex: 2;
        height: 315px;
        padding-bottom: 15px;
      }
    }
  }
}
</style>
