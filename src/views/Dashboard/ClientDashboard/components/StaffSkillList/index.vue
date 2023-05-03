<template>
  <div class="wrapper">
    <div class="scroll-container" :style="{ animationDuration: `${animationListData.length * 1.2}s` }">
      <div class="scroll-item" v-for="scrollItem of animationListData">
        <img src="@/assets/images/staff.png" class="avator" />
        <div class="content">
          <div class="name-level">
            <div>{{ t('dashboard.name') }}：{{ scrollItem.name }}</div>
            <div>{{ t('dashboard.level') }}：{{ scrollItem.level }}</div>
          </div>
          <div class="skill-time">
            <div>{{ t('dashboard.skill') }}：{{ scrollItem.skill }}</div>
            <div>{{ t('dashboard.expiryDate') }}：{{ scrollItem.dueTime }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const staffListData = [
  {
    name: '田友东',
    skill: 'SMT',
    level: 1,
    dueTime: '2023-09-30',
  },
  {
    name: '慎强',
    skill: 'SMT',
    level: 2,
    dueTime: '2023-10-01',
  },
  {
    name: '史经涛',
    skill: 'SMT',
    level: 1,
    dueTime: '2023-10-02',
  },
  {
    name: '王二亮',
    skill: 'SMT',
    level: 1,
    dueTime: '2023-09-30',
  },
  {
    name: '谭政',
    skill: 'SMT',
    level: 2,
    dueTime: '2023-10-01',
  },
  {
    name: '贾兴园',
    skill: 'MES',
    level: 2,
    dueTime: '2023-10-02',
  },
  {
    name: '吴革',
    skill: 'MES',
    level: 2,
    dueTime: '2023-09-30',
  },
  {
    name: '刘宏衫',
    skill: 'MES',
    level: 1,
    dueTime: '2023-10-01',
  },
  {
    name: '郑潇',
    skill: 'MES',
    level: 1,
    dueTime: '2023-10-02',
  },
]
const animationListData = [...staffListData, ...staffListData]
let startIndex = 0
const scrollData = ref([])
const refreshScrollData = () => {
  scrollData.value = staffListData.slice(startIndex, startIndex + 9)
}
refreshScrollData()
</script>
<style lang="scss" scoped>
.wrapper {
  width: 100%;
  height: 100%;
  overflow: hidden;
  .scroll-container {
    animation: move linear infinite;
    .scroll-item {
      display: flex;
      height: 78.33px;
      padding: 6px 0 5px 26px;
      .avator {
        width: 64px;
        border: 1px solid #fff;
      }

      .content {
        margin-left: 24px;
        display: flex;
        color: #fff;
        font-size: 18px;
        padding-top: 8px;
        line-height: 30px;

        .name-level {
          width: 128px;
        }
      }
    }
  }
}

@keyframes move {
  0% {
    transform: translateY(0%);
  }
  100% {
    transform: translateY(-50%);
  }
}

.scroll-container:hover {
  animation-play-state: paused;
}
</style>
