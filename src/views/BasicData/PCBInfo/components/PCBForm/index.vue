<template>
  <el-dialog
    :model-value="formVisible"
    width="600px"
    :title="editItem ? t('pcb.editPcb') : t('pcb.addPcb')"
    @close="closeForm"
    :close-on-click-modal="false"
  >
    <el-form ref="formRef" :model="form" label-width="122px" :rules="rule">
      <el-row>
        <el-col :span="12">
          <el-form-item :label="t('pcb.pcbPn')" prop="PcbPn">
            <el-input v-model="form.PcbPn" ref="firstInputRef" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="t('pcb.productName')" prop="ProductName">
            <el-select v-model="form.ProductName" filterable>
              <el-option
                v-for="productName of productNames"
                :key="productName"
                :label="productName"
                :value="productName"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item :label="t('pcb.pcbWidth')" prop="PcbWidth">
            <el-input-number style="width: 100%" v-model="form.PcbWidth" :controls="false" :precision="2" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="t('pcb.pcbLength')" prop="PcbLength">
            <el-input-number style="width: 100%" v-model="form.PcbLength" :controls="false" :precision="2" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item :label="t('pcb.pcbThickness')" prop="PcbThickness">
            <el-input-number style="width: 100%" v-model="form.PcbThickness" :controls="false" :precision="2" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item :label="t('pcb.side')" prop="Side">
            <el-select v-model="form.Side">
              <el-option label="T" value="T" />
              <el-option label="B" value="B" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item :label="t('pcb.arrayCount')" prop="ArrayCount">
            <el-input-number style="width: 100%" v-model="form.ArrayCount" :controls="false" :step-strictly="true" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="t('pcb.conveyorWidth')" prop="ConveyorWidth">
            <el-input-number style="width: 100%" v-model="form.ConveyorWidth" :controls="false" :precision="2" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item :label="t('pcb.description')" prop="PcbDescription">
        <el-input v-model="form.PcbDescription" />
      </el-form-item>

      <el-form-item :label="t('common.remark')" prop="Remark">
        <el-input v-model="form.Remark" type="textarea" :rows="3" />
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
import { getProductNames } from '@/api/product'
import { createPcbInfo, editPcbInfo } from '@/api/pcb-info'
import { ElMessage } from 'element-plus'
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

const productNames = ref([])

const isSaving = ref(false)

const form = reactive({
  PcbPn: '',
  ProductName: '',
  PcbWidth: undefined,
  PcbLength: undefined,
  PcbThickness: undefined,
  Side: 'T',
  PcbDescription: '',
  ArrayCount: undefined,
  ConveyorWidth: undefined,
  Remark: '',
})

const rule = ref({
  PcbPn: [{ required: true, message: t('pcb.pcbPnRequired'), trigger: 'blur' }],
  ProductName: [{ required: true, message: t('pcb.productNameRequired'), trigger: 'blur' }],
  PcbWidth: [{ required: true, message: t('pcb.pcbWidthRequired'), trigger: 'blur' }],
  ArrayCount: [{ required: true, message: t('pcb.arrayCountRequired'), trigger: 'blur' }],
  ConveyorWidth: [{ required: true, message: t('pcb.conveyorWidthRequired'), trigger: 'blur' }],
})

onMounted(async () => {
  nextTick(() => {
    firstInputRef.value.focus()
  })
  if (editItem) {
    form.PcbPn = editItem.PcbPn
    form.ProductName = editItem.ProductName
    form.PcbWidth = editItem.PcbWidth
    form.PcbLength = editItem.PcbLength
    form.PcbThickness = editItem.PcbThickness
    form.Side = editItem.Side
    form.PcbDescription = editItem.PcbDescription
    form.ArrayCount = editItem.ArrayCount
    form.ConveyorWidth = editItem.ConveyorWidth
    form.Remark = editItem.Remark
  }
  productNames.value = await getProductNames()
})

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
    await editPcbInfo(editItem.Guid, { ...form, Guid: editItem.Guid })
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
    await createPcbInfo(form)
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
