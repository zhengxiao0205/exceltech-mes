<template>
  <el-dialog
    :model-value="formVisible"
    width="560px"
    :title="editItem ? '编辑程序信息' : '添加程序信息'"
    @close="closeForm"
    :close-on-click-modal="false"
  >
    <el-form ref="formRef" :model="form" label-width="100px" :rules="rule">
      <el-row>
        <el-col :span="12">
          <el-form-item label="程序名称" prop="ProgramName">
            <el-input v-model="form.ProgramName" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="程序版本" prop="ProgramVer">
            <el-input v-model="form.ProgramVer" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="面别" prop="Side">
            <el-select v-model="form.Side" @change="handleSelectSide">
              <el-option label="T" value="T" />
              <el-option label="B" value="B" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="PCB料号" prop="PcbInfoGuid">
            <el-select v-model="form.PcbInfoGuid" filterable>
              <el-option
                v-for="pcbInfo of optionalPcbInfos"
                :key="pcbInfo.Guid"
                :label="pcbInfo.PcbPn"
                :value="pcbInfo.Guid"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="设备组" prop="MachineGroupGuid">
            <el-select v-model="form.MachineGroupGuid">
              <el-option
                v-for="machineGroup of store.getters.MainMachineGroups"
                :key="machineGroup.Guid"
                :label="machineGroup.MachineName"
                :value="machineGroup.Guid"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="备注" prop="Remark">
        <el-input width="100%" v-model="form.Remark" type="textarea" :rows="3" />
      </el-form-item>
    </el-form>

    <el-row justify="end">
      <el-button @click="closeForm">取消</el-button>
      <el-button type="primary" @click="() => submitForm(formRef)" :loading="isSaving">确认</el-button>
    </el-row>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { createProgram, editProgram } from '@/api/program'
import { ElMessage } from 'element-plus'
import { useStore } from 'vuex'

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

const store = useStore()

const isSaving = ref(false)

const form = reactive({
  MachineGroupGuid: '',
  PcbInfoGuid: '',
  ProgramName: '',
  ProgramVer: '',
  Remark: '',
  Side: 'T',
})

const rule = ref({
  ProgramName: [{ required: true, message: '请输入程序名称', trigger: 'blur' }],
  MachineGroupGuid: [{ required: true, message: '请选择设备组', trigger: 'change' }],
  PcbInfoGuid: [{ required: true, message: '请选择pcb料号', trigger: 'change' }],
})

onMounted(async () => {
  if (editItem) {
    form.MachineGroupGuid = editItem.MachineGroupGuid
    form.PcbInfoGuid = editItem.PcbInfoGuid
    form.ProgramName = editItem.ProgramName
    form.ProgramVer = editItem.ProgramVer
    form.Remark = editItem.Remark
    form.Side = store.getters.pcbInfos.find((i) => i.Guid === editItem.PcbInfoGuid).Side
  }
})

const optionalPcbInfos = computed(() => store.getters.pcbInfos.filter((i) => i.Side === form.Side))

const handleSelectSide = () => {
  form.PcbInfoGuid = ''
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
    await editProgram(editItem.Guid, { ...form, Guid: editItem.Guid })
    ElMessage({
      type: 'success',
      message: '编辑成功',
    })
    emits('closeForm', true)
  } catch (error) {
    ElMessage({
      type: 'error',
      message: '编辑失败',
    })
    isSaving.value = false
  }
}

const handleCreate = async () => {
  try {
    await createProgram(form)
    ElMessage({
      type: 'success',
      message: '添加成功',
    })
    emits('closeForm', true)
  } catch (error) {
    ElMessage({
      type: 'error',
      message: '添加失败',
    })
  }
}
</script>
