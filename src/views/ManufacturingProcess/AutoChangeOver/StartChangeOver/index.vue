<template>
  <div class="list-header">
    <el-form ref="formRef" label-width="120px" :model="form" @submit.prevent :rules="rule">
      <el-row>
        <el-col :span="5">
          <el-form-item :label="t('changeover.line')" prop="LineGuid">
            <el-select style="width: 90%" v-model="form.LineGuid" filterable>
              <el-option v-for="line of store.getters.lines" :key="line.name" :label="line.name" :value="line.id" />
            </el-select>
          </el-form-item>
          <el-form-item :label="t('changeover.workOrder')" prop="WorkOrderNo">
            <el-input style="width: 90%" v-model="form.WorkOrderNo" />
          </el-form-item>
          <el-form-item :label="t('changeover.programName')" prop="ProgramName">
            <el-input style="width: 90%" v-model="form.ProgramName" />
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item :label="t('changeover.pcbPn')" prop="PcbPn">
            <el-select style="width: 90%" v-model="form.PcbPn" filterable>
              <el-option
                v-for="pcbInfo of optionalPcbInfos"
                :key="pcbInfo.Guid"
                :label="pcbInfo.PcbPn"
                :value="pcbInfo.PcbPn"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="t('changeover.side')" prop="Side">
            <el-select style="width: 90%" v-model="form.Side">
              <el-option label="T" value="T" />
              <el-option label="B" value="B" />
            </el-select>
          </el-form-item>
          <el-form-item :label="t('changeover.quantity')" prop="Quantity">
            <el-input-number style="width: 90%" v-model="form.Quantity" :controls="false" :step-strictly="true" />
          </el-form-item>
        </el-col>
        <el-col :span="6" class="flex-center">
          <el-button
            :loading="isRunning"
            style="font-size: 14px"
            size="large"
            type="success"
            @click="() => submitForm(formRef)"
          >
            <el-icon>
              <i class="ri-play-line"></i>
            </el-icon>
            <span>{{ t('changeover.start') }}</span>
          </el-button>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script setup>
import { reactive, onMounted, ref, computed } from 'vue'
import { useStore } from 'vuex'
import { startChangeOver } from '@/api/change-over'
import { ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const form = reactive({
  LineGuid: '',
  PcbPn: '',
  WorkOrderNo: '',
  Side: 'T',
  ProgramName: '',
  Quantity: undefined,
})

const rule = ref({
  LineGuid: [{ required: true, message: t('changeover.lineRequired'), trigger: 'blur' }],
  WorkOrderNo: [{ required: true, message: t('changeover.workOrderRequired'), trigger: 'blur' }],
  PcbPn: [{ required: true, message: t('changeover.pcbPnRequired'), trigger: 'change' }],
  Side: [{ required: true }],
  ProgramName: [{ required: true, message: t('changeover.programNameRequired'), trigger: 'blur' }],
  Quantity: [{ required: true, message: t('changeover.quantityRequired'), trigger: 'blur' }],
})

const formRef = ref(null)

const isRunning = ref(false)

const store = useStore()

const optionalPcbInfos = computed(() => store.getters.pcbInfos.filter((i) => i.Side === form.Side))

onMounted(() => {
  store.dispatch('line/getLines')
  store.dispatch('pcb/getPcbInfos')
})

const submitForm = (formEl) => {
  if (!formEl) {
    return
  }
  formEl.validate(async (valid, fields) => {
    if (valid) {
      isRunning.value = true
      try {
        await startChangeOver(form)
        ElMessage({
          type: 'success',
          message: t('changeover.startChangeover'),
        })
      } catch (error) {
        ElMessage({
          type: 'error',
          message: t('changeover.startFailed'),
        })
      } finally {
        isRunning.value = false
      }
    }
  })
}
</script>

<style lang="scss" scoped>
.list-header {
  padding: 16px 12px;
  border-radius: 8px;
  background-color: var(--card-bg-color);
  margin-bottom: 16px;
  :deep .el-form-item__label {
    color: var(--card-label-color);
  }
}
.el-form-item {
  margin-bottom: 16px;
}

.list-wrapper {
  border-radius: 8px;
  padding: 16px 12px;
  background-color: var(--card-bg-color);
}

.flex-center {
  display: flex;
  margin-left: 16px;
  align-items: center;
}
</style>
