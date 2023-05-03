<template>
  <el-dialog
    :model-value="formVisible"
    width="560px"
    :title="editItem ? '编辑站位信息' : '添加站位信息'"
    @close="closeForm"
    :close-on-click-modal="false"
  >
    <el-form ref="formRef" :model="form" label-width="100px" :rules="rule">
      <el-row>
        <el-col :span="12">
          <el-form-item label="产线" prop="LineGuid">
            <el-select v-model="form.LineGuid" filterable>
              <el-option v-for="line of store.getters.lines" :key="line.name" :label="line.name" :value="line.id" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="顺序" prop="Sequence">
            <el-input-number style="width: 100%" v-model="form.Sequence" :controls="false" :step-strictly="true" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="站位编号" prop="StationCode">
            <el-input v-model="form.StationCode" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="站位名称" prop="StationName">
            <el-input v-model="form.StationName" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="设备组" prop="MachineGroupName">
            <el-select v-model="form.MachineGroupName" @change="handleSelectMachineGroup">
              <el-option
                v-for="machineGroup of store.getters.machineGroups"
                :key="machineGroup.Guid"
                :label="machineGroup.MachineName"
                :value="machineGroup.MachineName"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="设备编号" prop="MachineGuid">
            <el-select v-model="form.MachineGuid" filterable>
              <el-option
                v-for="machine of machineData.optionalMachines"
                :label="machine.Id"
                :value="machine.Guid"
                :key="machine.Guid"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="轨道编号" prop="Lane">
            <el-input-number style="width: 100%" v-model="form.Lane" :controls="false" :step-strictly="true" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="备注" prop="Remark">
        <el-input width="100%" v-model="form.Remark" type="textarea" :rows="3" />
      </el-form-item>
    </el-form>

    <el-row justify="end">
      <el-button @click="closeForm">取消</el-button>
      <el-button :loading="isSaving" type="primary" @click="() => submitForm(formRef)">确认</el-button>
    </el-row>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { getMachineIdsWithGroup } from '@/api/machine'
import { createStation, editStation } from '@/api/station'
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

const machineData = reactive({ machines: [], optionalMachines: [] })

const store = useStore()

const isSaving = ref(false)

const form = reactive({
  LineGuid: '',
  StationCode: '',
  StationName: '',
  MachineGroupName: '',
  MachineGuid: '',
  Lane: 1,
  Sequence: undefined,
  Remark: '',
})

const rule = ref({
  LineGuid: [{ required: true, message: '请选择产线', trigger: 'change' }],
  StationCode: [{ required: true, message: '请输入站位编号', trigger: 'blur' }],
  MachineGroupName: [{ required: true, message: '请选择设备类型', trigger: 'change' }],
  MachineGuid: [{ required: true, message: '请选择设备编号', trigger: 'change' }],
  Lane: [{ required: true, message: '请输入轨道编号', trigger: 'blur' }],
  Sequence: [{ required: true, message: '请输入顺序', trigger: 'blur' }],
})

onMounted(async () => {
  if (editItem) {
    form.LineGuid = editItem.LineGuid
    form.StationCode = editItem.StationCode
    form.StationName = editItem.StationName
    form.MachineGroupName = editItem.MachineGroupName
    form.Lane = editItem.Lane
    form.Sequence = editItem.Sequence
    form.Remark = editItem.Remark
  }

  machineData.machines = await getMachineIdsWithGroup()

  if (editItem) {
    machineData.optionalMachines = machineData.machines.filter((i) => i.Group === editItem.MachineGroupName)
    form.MachineGuid = editItem.MachineGuid
  }
})

const handleSelectMachineGroup = (e) => {
  form.MachineGuid = ''
  machineData.optionalMachines = machineData.machines.filter((i) => i.Group === e)
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
    await editStation(editItem.Guid, { ...form, Guid: editItem.Guid })
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
  }
}

const handleCreate = async () => {
  try {
    await createStation(form)
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
