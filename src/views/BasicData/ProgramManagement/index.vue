<template>
  <div class="list-header">
    <el-form :inline="true" :model="filterForm" @submit.prevent>
      <el-form-item label="设备组">
        <el-select v-model="filterForm.MachineGroupName">
          <el-option
            v-for="machineGroup of useStore().getters.mainMachineGroups"
            :key="machineGroup.Guid"
            :label="machineGroup.machineName"
            :value="machineGroup.machineName"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="程序名称">
        <el-input v-model="filterForm.ProgramName" />
      </el-form-item>
      <el-form-item label="PCB料号">
        <el-input v-model="filterForm.PcbPn" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="refresh">
          <el-icon> <i class="ri-search-line"></i></el-icon>
          <span>查询</span>
        </el-button>
        <el-button @click="resetFilterForm">
          <el-icon>
            <i class="ri-refresh-line"></i>
          </el-icon>
          <span>重置</span>
        </el-button>
      </el-form-item>
    </el-form>
    <br />
    <el-row>
      <el-button type="warning" @click="() => openForm(null)">
        <el-icon><i class="ri-add-line"></i></el-icon>
        <span>添加</span>
      </el-button>
      <el-button type="danger" @click="handleBatchDelete" :disabled="!selectedIds.length">
        <el-icon><i class="ri-delete-bin-7-line"></i></el-icon>
        <span>批量删除</span>
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
      <el-table-column prop="PcbInfo.PcbPn" label="PCB料号" width="180" sortable="custom">
        <template #default="scope">
          <span>{{ scope.row.PcbPn }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="Side" label="面别" width="180" />
      <el-table-column prop="MachineGroup.MachineGroupName" label="设备组" width="150" sortable="custom">
        <template #default="scope">
          <span>{{ scope.row.MachineGroupName }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="ProgramName" label="程序名称" width="150" sortable="custom" />
      <el-table-column prop="ProgramVer" label="程序版本" width="120" sortable="custom" />
      <el-table-column prop="CreateDate" label="创建时间" width="180" sortable="custom" />
      <el-table-column prop="CreateBy" label="创建人" width="150" sortable="custom" />
      <el-table-column prop="ModifyDate" label="修改时间" width="180" sortable="custom" />
      <el-table-column prop="ModifyBy" label="修改人" width="140" sortable="custom" />
      <el-table-column prop="Remark" label="备注" width="230" sortable="custom" />
      <el-table-column fixed="right" label="操作" width="180">
        <template #default="scope">
          <el-button size="small" type="primary" @click="() => openForm(scope.row)">
            <el-icon><i class="ri-edit-line"></i></el-icon>
            <span>编辑</span>
          </el-button>
          <el-button size="small" type="danger" @click="() => handleDelete(scope.row)">
            <el-icon><i class="ri-delete-bin-7-line"></i></el-icon>
            <span>删除</span>
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

  <ProgramForm v-model="formVisible" v-if="formVisible" @closeForm="closeForm" :editItem="editItem" />
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import ProgramForm from './components/ProgramForm/index.vue'
import { getProgramPageList, deleteProgram, batchDeleteProgram } from '@/api/program'
import { ElMessage, ElMessageBox } from 'element-plus'
import { formatDate, formatSortOrder } from '@/utils/common'
import { useStore } from 'vuex'
import bus from '@/utils/bus'

const queryParams = reactive({
  pageIdx: 1,
  pageSize: 10,
  sortOrder: 'none',
  orderCol: 'MachineId',
})

const filterForm = reactive({
  PcbPn: '',
  MachineGroupName: '',
  ProgramName: '',
})

const tableData = reactive({ paginationMetadata: { totalCount: 0 }, list: [], loading: false })

const formVisible = ref(false)
const editItem = ref(null)

let selectedIds = ref([])

const refresh = async () => {
  tableData.loading = true
  const { paginationMetadata, value } = await getProgramPageList({
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
  useStore().dispatch('pcb/getPcbInfos')
  bus.on('refresh', refresh)
})

const resetFilterForm = () => {
  filterForm.PcbPn = ''
  filterForm.MachineGroupName = ''
  filterForm.ProgramName = ''
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
  ElMessageBox.confirm('此操作将永久删除该记录. 是否继续?', '提示', {
    confirmButtonText: '删除',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      tableData.loading = true
      await deleteProgram(row.Guid)
      ElMessage({
        type: 'success',
        message: '删除成功',
      })
      refresh()
    })
    .catch((error) => {
      if (error !== 'cancel') {
        ElMessage({
          type: 'error',
          message: '删除失败',
        })
        tableData.loading = false
      }
    })
}

const handleBatchDelete = () => {
  ElMessageBox.confirm(`此操作将永久删除选中的${selectedIds.value.length}条记录. 是否继续?`, '提示', {
    confirmButtonText: '删除',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      tableData.loading = true
      await batchDeleteProgram(selectedIds.value)
      ElMessage({
        type: 'success',
        message: '删除成功',
      })
      refresh()
    })
    .catch((error) => {
      if (error !== 'cancel') {
        ElMessage({
          type: 'error',
          message: '删除失败',
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
