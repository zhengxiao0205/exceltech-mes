<template>
  <div class="list-header">
    <el-form :inline="true" :model="filterForm" @submit.prevent>
      <el-form-item :label="t('machine.code')">
        <el-input v-model="filterForm.MachineId" />
      </el-form-item>
      <el-form-item :label="t('machine.group')">
        <el-select v-model="filterForm.MachineGroup">
          <el-option
            v-for="machineGroup of useStore().getters.machineGroups"
            :key="machineGroup.Guid"
            :label="machineGroup.MachineName"
            :value="machineGroup.MachineName"
          />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="refresh">
          <el-icon><i class="ri-search-line"></i></el-icon>
          <span>{{ t('common.search') }}</span>
        </el-button>
        <el-button @click="resetFilterForm">
          <el-icon>
            <i class="ri-refresh-line"></i>
          </el-icon>
          <span>{{ t('common.reset') }}</span>
        </el-button>
      </el-form-item>
    </el-form>
    <br />
    <el-row>
      <el-button type="warning" @click="() => openForm(null)">
        <el-icon><i class="ri-add-line"></i></el-icon>
        <span>{{ t('common.add') }}</span>
      </el-button>
      <el-button type="danger" @click="handleBatchDelete" :disabled="!selectedIds.length">
        <el-icon><i class="ri-delete-bin-7-line"></i></el-icon>
        <span>{{ t('common.batchDelete') }}</span>
      </el-button>
    </el-row>
  </div>

  <div class="list-wrapper">
    <el-table
      :data="tableData.list"
      style="height: 640px; opacity: 0.88"
      :border="true"
      :default-sort="{ prop: queryParams.orderCol, order: queryParams.sortOrder }"
      @selection-change="handleSelectionChange"
      @sort-change="sortChange"
      :empty-text="t('common.emptyText')"
      v-loading="tableData.loading"
      row-key="Guid"
      :scrollbar-always-on="true"
      :header-row-style="{ color: '#333', textAlgin: 'center', backgroundColor: '#fafafa' }"
      :row-style="({ rowIndex }) => (rowIndex % 2 === 0 ? '' : { backgroundColor: '#fafafa' })"
      :header-cell-style="{ backgroundColor: '#fafafa' }"
    >
      <el-table-column type="selection" width="50" />
      <el-table-column prop="MachineId" :label="t('machine.code')" width="120" sortable="custom" />
      <el-table-column prop="Ip" :label="t('machine.ip')" width="150" sortable="custom" />
      <el-table-column prop="Port" :label="t('machine.port')" width="110" sortable="custom" />
      <el-table-column prop="Vendor" :label="t('machine.vendor')" width="120" sortable="custom" />
      <el-table-column prop="Model" :label="t('machine.model')" width="200" sortable="custom" />
      <el-table-column prop="LaneCount" :label="t('machine.laneCount')" width="130" sortable="custom" />
      <el-table-column prop="MachineGroup.MachineGroupName" :label="t('machine.group')" width="120" sortable="custom">
        <template #default="scope">
          <span>{{ scope.row.MachineGroupName }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="MachineType" :label="t('machine.type')" width="120" />
      <el-table-column prop="CreateDate" :label="t('common.createDate')" width="160" sortable="custom" />
      <el-table-column prop="CreateBy" :label="t('common.createBy')" width="120" sortable="custom" />
      <el-table-column prop="ModifyDate" :label="t('common.modifyDate')" width="160" sortable="custom" />
      <el-table-column prop="ModifyBy" :label="t('common.modifyBy')" width="120" sortable="custom" />
      <el-table-column prop="Remark" :label="t('common.remark')" width="200" sortable="custom" />
      <el-table-column fixed="right" :label="t('common.operation')" width="180">
        <template #default="scope">
          <el-button size="small" type="primary" @click="() => openForm(scope.row)">
            <el-icon><i class="ri-edit-line"></i></el-icon>
            <span>{{ t('common.edit') }}</span>
          </el-button>
          <el-button size="small" type="danger" @click="() => handleDelete(scope.row)">
            <el-icon><i class="ri-delete-bin-7-line"></i></el-icon>
            <span>{{ t('common.delete') }}</span>
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      v-model:current-page="queryParams.pageIdx"
      v-model:page-size="queryParams.pageSize"
      :page-sizes="[10, 20, 50]"
      :background="true"
      layout="total, sizes, prev, pager, next"
      :total="tableData.paginationMetadata.totalCount"
      style="justify-content: center; margin-top: 16px"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
  <MachineForm v-model="formVisible" v-if="formVisible" @closeForm="closeForm" :editItem="editItem" />
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import MachineForm from './components/MachineForm/index.vue'
import { getMachinePageList, deleteMachine, batchDeleteMachine } from '@/api/machine'
import { ElMessage, ElMessageBox } from 'element-plus'
import { formatDate, formatSortOrder } from '@/utils/common'
import { useStore } from 'vuex'
import bus from '@/utils/bus'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const queryParams = reactive({
  pageIdx: 1,
  pageSize: 10,
  sortOrder: 'none',
  orderCol: 'machineId',
})

const filterForm = reactive({
  MachineId: '',
  MachineGroup: '',
})

const tableData = reactive({ paginationMetadata: { totalCount: 0 }, list: [], loading: false })

const formVisible = ref(false)
const editItem = ref(null)

let selectedIds = ref([])

const refresh = async () => {
  tableData.loading = true
  const { paginationMetadata, value } = await getMachinePageList({
    ...queryParams,
    sortOrder: formatSortOrder(queryParams.sortOrder),
    ...filterForm,
  })
  if (value.length === 0 && queryParams.pageIdx > 1) {
    queryParams.pageIdx--
    refresh()
    return
  }
  const tableList = value.map((item) => ({
    ...item,
    CreateDate: formatDate(item.CreateDate, 'YYYY/MM/DD HH:mm:ss'),
    ModifyDate: formatDate(item.ModifyDate, 'YYYY/MM/DD HH:mm:ss'),
  }))
  tableData.paginationMetadata = paginationMetadata
  tableData.list = tableList
  tableData.loading = false
}

onMounted(() => {
  refresh()
  useStore().dispatch('machine/getMachineGroups')
  useStore().dispatch('machine/getMachineTypes')
  bus.on('refresh', refresh)
})

const resetFilterForm = () => {
  filterForm.MachineId = ''
  filterForm.MachineGroup = ''
  refresh()
}

const sortChange = ({ prop, order }) => {
  queryParams.sortOrder = order
  queryParams.orderCol = prop
  refresh()
}

const handleSizeChange = (size) => {
  queryParams.pageSize = size
  refresh()
}

const handleCurrentChange = (page) => {
  queryParams.pageIdx = page
  refresh()
}

const handleSelectionChange = (selectedItems) => {
  selectedIds.value = selectedItems.map((item) => item.Guid)
}

const openForm = (item) => {
  editItem.value = item
  formVisible.value = true
}

const closeForm = (needRefresh) => {
  formVisible.value = false
  needRefresh && refresh()
}

const handleDelete = (row) => {
  ElMessageBox.confirm(t('common.singleDeleteMessage'), t('common.notice'), {
    confirmButtonText: t('common.delete'),
    cancelButtonText: t('common.cancel'),
    type: 'warning',
  })
    .then(async () => {
      tableData.loading = true
      await deleteMachine(row.Guid)
      ElMessage({
        type: 'success',
        message: t('common.deleteSuccessfully'),
      })
      refresh()
    })
    .catch((error) => {
      if (error !== 'cancel') {
        ElMessage({
          type: 'error',
          message: t('common.deleteFailed'),
        })
        tableData.loading = false
      }
    })
}

const handleBatchDelete = () => {
  ElMessageBox.confirm(t('common.batchDeleteMessage', [selectedIds.value.length]), t('common.notice'), {
    cconfirmButtonText: t('common.delete'),
    cancelButtonText: t('common.cancel'),
    type: 'warning',
  })
    .then(async () => {
      tableData.loading = true
      await batchDeleteMachine(selectedIds.value)
      ElMessage({
        type: 'success',
        message: t('common.deleteSuccessfully'),
      })
      refresh()
    })
    .catch((error) => {
      if (error !== 'cancel') {
        ElMessage({
          type: 'error',
          message: t('common.deleteFailed'),
        })
        tableData.loading = false
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
  margin-bottom: 0;
}

.list-wrapper {
  border-radius: 8px;
  padding: 16px 12px;
  background-color: var(--card-bg-color);
}
</style>
