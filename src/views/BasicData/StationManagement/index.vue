<template>
  <div class="list-header">
    <el-form :inline="true" :model="filterForm" @submit.prevent>
      <el-form-item label="产线">
        <el-select v-model="filterForm.LineName" filterable>
          <el-option v-for="line of store.getters.lines" :key="line.name" :label="line.name" :value="line.name" />
        </el-select>
      </el-form-item>
      <el-form-item label="站位编号">
        <el-input v-model="filterForm.StationCode" />
      </el-form-item>
      <el-form-item label="站位名称">
        <el-input v-model="filterForm.StationName" />
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
      :header-row-style="{ color: '#333', textAlgin: 'center', backgroundColor: '#fafafa' }"
      :row-style="({ rowIndex }) => (rowIndex % 2 === 0 ? '' : { backgroundColor: '#fafafa' })"
      :header-cell-style="{ backgroundColor: '#fafafa' }"
    >
      <el-table-column type="selection" width="50" />
      <el-table-column prop="Line.LineName" label="产线" width="120" sortable="custom">
        <template #default="scope">
          <span>{{ scope.row.LineName }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="StationCode" label="站位编号" width="120" sortable="custom" />
      <el-table-column prop="StationName" label="站位名称" width="120" sortable="custom" />
      <el-table-column prop="Machine.MachineGroup.MachineGroupName" label="设备组" width="120" sortable="custom">
        <template #default="scope">
          <span>{{ scope.row.MachineGroupName }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="Lane" label="轨道编号" width="120" sortable="custom" />
      <el-table-column prop="Sequence" label="顺序" width="200" sortable="custom" />
      <el-table-column prop="Status" label="状态" width="120" sortable="custom">
        <template #default="scope">
          <el-switch
            :active-value="1"
            :inactive-value="0"
            v-model="scope.row.Status"
            @change="(status) => handleSwitchStatus(scope.row, status)"
          />
        </template>
      </el-table-column>
      <el-table-column prop="CreateDate" label="创建时间" width="160" sortable="custom" />
      <el-table-column prop="CreateBy" label="创建人" width="120" sortable="custom" />
      <el-table-column prop="ModifyDate" label="修改时间" width="160" sortable="custom" />
      <el-table-column prop="ModifyBy" label="修改人" width="120" sortable="custom" />
      <el-table-column prop="Remark" label="备注" width="200" sortable="custom" />
      <el-table-column fixed="right" label="操作" width="180">
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

  <StationForm v-model="formVisible" v-if="formVisible" @closeForm="closeForm" :editItem="editItem" />
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import StationForm from './components/StationForm/index.vue'
import { deleteStation, getStationPageList, batchDeleteStation, editStation } from '@/api/station'
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
  orderCol: 'Line.LineName',
})

const filterForm = reactive({
  LineName: '',
  StationCode: '',
  StationName: '',
})

const tableData = reactive({ paginationMetadata: { totalCount: 0 }, list: [], loading: false })

const formVisible = ref(false)
const editItem = ref(null)

const store = useStore()

let selectedIds = ref([])

const refresh = async () => {
  tableData.loading = true
  try {
    const response = await getStationPageList({
      ...queryParams,
      sortOrder: formatSortOrder(queryParams.sortOrder),
      ...filterForm,
    })
    const { paginationMetadata, value } = response
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
  } finally {
    tableData.loading = false
  }
}

const handleSwitchStatus = (row, status) => {
  row.status = +status
  tableData.list = tableData.list
  editStation(row.Guid, {
    ...row,
    Status: +status,
    CreateDate: undefined,
    CreateBy: undefined,
    ModifyDate: undefined,
    ModifyBy: undefined,
  }).then()
}

onMounted(() => {
  refresh()
  store.dispatch('machine/getMachineGroups')
  store.dispatch('line/getLines')
  bus.on('refresh', refresh)
})

const resetFilterForm = () => {
  filterForm.LineName = ''
  filterForm.StationCode = ''
  filterForm.StationName = ''
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
      await deleteStation(row.Guid)
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
      await batchDeleteStation(selectedIds.value)
      ElMessage({
        type: 'success',
        message: t('common.deleteSuccessfully'),
      })
      refresh()
    })
    .catch(() => {
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
