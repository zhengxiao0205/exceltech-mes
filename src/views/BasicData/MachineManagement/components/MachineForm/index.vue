<template>
  <el-dialog
    :model-value="formVisible"
    width="560px"
    :title="editItem ? t('machine.editMachine') : t('machine.addMachine')"
    @close="closeForm"
    :close-on-click-modal="false"
  >
    <el-form ref="formRef" :model="form" label-width="100px" :rules="rule">
      <el-row>
        <el-col :span="12">
          <el-form-item :label="t('machine.code')" prop="MachineId">
            <el-input v-model="form.MachineId" ref="firstInputRef" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="t('machine.group')" prop="MachineGroupGuid">
            <el-select v-model="form.MachineGroupGuid" @change="handleSelectMachineGroup">
              <el-option
                v-for="machineGroup of store.getters.machineGroups"
                :key="machineGroup.Guid"
                :label="machineGroup.MachineName"
                :value="machineGroup.Guid"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item :label="t('machine.type')" prop="MachineType">
            <el-select v-model="form.MachineType" disabled placeholder=" ">
              <el-option
                v-for="machineType of useStore().getters.machineTypes"
                :key="machineType"
                :label="machineType"
                :value="machineType"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="t('machine.vendor')" prop="Vendor">
            <el-input v-model="form.Vendor" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item :label="t('machine.model')" prop="Model">
            <el-input v-model="form.Model" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="t('machine.laneCount')" prop="LaneCount">
            <el-input-number style="width: 100%" v-model="form.LaneCount" :controls="false" :step-strictly="true" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item :label="t('machine.ip')" prop="Ip">
            <el-input style="width: 100%" v-model="form.Ip" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="t('machine.port')" prop="Port">
            <el-input-number style="width: 100%" v-model="form.Port" :controls="false" :step-strictly="true" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item :label="t('machine.remark')" prop="Remark">
        <el-input width="100%" v-model="form.Remark" type="textarea" :rows="3" />
      </el-form-item>
    </el-form>

    <el-row justify="end">
      <el-button @click="closeForm">{{ t('common.cancel') }}</el-button>
      <el-button type="primary" @click="() => submitForm(formRef)" :loading="isSaving">{{
        t('common.confirm')
      }}</el-button>
    </el-row>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue'
import { createMachine, editMachine } from '@/api/machine'
import { ElMessage } from 'element-plus'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const emits = defineEmits(['closeForm'])

const props = defineProps({
  editItem: {
    type: Object,
    default: () => {},
  },
  formVisible: {
    type: Boolean,
    default: false,
  },
})

const { editItem } = props

const formRef = ref(null)

const firstInputRef = ref(null)

const store = useStore()

const isSaving = ref(false)

const form = reactive({
  MachineId: '',
  MachineGroupGuid: '',
  MachineType: '',
  Vendor: '',
  Model: '',
  LaneCount: undefined,
  Ip: '',
  Port: undefined,
  Remark: '',
})

const rule = reactive({
  MachineId: [{ required: true, message: t('machine.codeRequired'), trigger: 'blur' }],
  MachineGroupGuid: [{ required: true, message: t('machine.groupRequired'), trigger: 'change' }],
  Ip: [
    {
      pattern: /^((25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))$/,
      message: t('machine.ipValid'),
      trigger: 'blur',
    },
    {
      required: false,
      message: t('machine.ipRequired'),
      trigger: 'blur',
    },
  ],
  Port: [
    {
      type: 'number',
      min: 0,
      max: 65536,
      trigger: 'blur',
      message: t('machine.portValid'),
    },
    {
      required: false,
      message: t('machine.portRequired'),
      trigger: 'blur',
    },
  ],
})

onMounted(async () => {
  nextTick(() => {
    firstInputRef.value.focus()
  })
  if (editItem) {
    form.MachineId = editItem.MachineId
    form.MachineGroupGuid = editItem.MachineGroupGuid
    form.MachineType = editItem.MachineType
    form.Vendor = editItem.Vendor
    form.Model = editItem.Model
    form.LaneCount = editItem.LaneCount
    form.Ip = editItem.Ip
    form.Port = editItem.Port
    form.Remark = editItem.Remark
  }
})

const handleSelectMachineGroup = (e) => {
  form.MachineType = store.getters.machineGroups.find((i) => i.Guid === e).MachineType
  rule.Ip[1].required = form.MachineType === '轨道'
  rule.Port[1].required = form.MachineType === '轨道'
}

const closeForm = () => {
  emits('closeForm')
}

const submitForm = async (formEl) => {
  if (!formEl) {
    return
  }
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      isSaving.value = true
      if (editItem) {
        await handleEdit()
      } else {
        await handleCreate()
      }
      isSaving.value = false
    }
  })
}

const handleEdit = async () => {
  try {
    await editMachine(editItem.Guid, { ...form, Guid: editItem.Guid })
    ElMessage({
      type: 'success',
      message: t('common.editSuccessfully'),
    })
    emits('closeForm', true)
  } catch (error) {
    ElMessage({
      type: 'error',
      message: t('common.editFailed'),
    })
    isSaving.value = false
  }
}

const handleCreate = async () => {
  try {
    await createMachine(form)
    ElMessage({
      type: 'success',
      message: t('common.addSuccessfully'),
    })
    emits('closeForm', true)
  } catch (error) {
    ElMessage({
      type: 'error',
      message: t('common.addFailed'),
    })
  }
}
</script>
