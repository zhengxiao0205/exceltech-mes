<template>
  <div class="list-header">
    <el-form :inline="true" :model="filterForm" @submit.prevent>
      <el-form-item :label="t('changeover.line')">
        <el-select v-model="filterForm.LineName" filterable>
          <el-option v-for="line of store.getters.lines" :key="line.name" :label="line.name" :value="line.name" />
        </el-select>
      </el-form-item>
      <el-form-item :label="t('changeover.productName')">
        <el-input v-model="filterForm.ProductName" />
      </el-form-item>
      <el-form-item :label="t('changeover.pcbPn')">
        <el-input v-model="filterForm.PcbPn" />
      </el-form-item>
      <el-form-item :label="t('changeover.workOrder')">
        <el-input v-model="filterForm.WorkOrderNo" />
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
    <el-row> </el-row>
  </div>

  <div class="list-wrapper">
    <el-table
      :data="tableData.list"
      style="height: 640px; opacity: 0.88"
      :border="true"
      :default-sort="{ prop: queryParams.orderCol, order: queryParams.sortOrder }"
      @sort-change="sortChange"
      :empty-text="t('common.emptyText')"
      v-loading="tableData.loading"
      row-key="Guid"
      :scrollbar-always-on="true"
      :header-row-style="{ color: '#333', textAlgin: 'center', backgroundColor: '#fafafa' }"
      :row-style="({ rowIndex }) => (rowIndex % 2 === 0 ? '' : { backgroundColor: '#fafafa' })"
      :header-cell-style="{ backgroundColor: '#fafafa' }"
    >
      <el-table-column prop="LineName" :label="t('changeover.productName')" width="150" sortable="custom" />
      <el-table-column prop="StationCode" :label="t('changeover.stationCode')" width="140" sortable="custom" />
      <el-table-column prop="StationName" :label="t('changeover.stationName')" width="140" sortable="custom" />
      <el-table-column prop="MachineGroupName" :label="t('changeover.machineGroup')" width="150" sortable="custom" />
      <el-table-column prop="MachineType" :label="t('changeover.machineType')" width="140" sortable="custom" />
      <el-table-column prop="ProductCode" :label="t('changeover.productCode')" width="160" sortable="custom" />
      <el-table-column prop="ProductName" :label="t('changeover.productName')" width="150" sortable="custom" />
      <el-table-column prop="WorkOrderNo" :label="t('changeover.workOrder')" width="160" sortable="custom" />
      <el-table-column prop="PcbPn" :label="t('changeover.pcbPn')" width="140" sortable="custom" />
      <el-table-column prop="ProgramName" :label="t('changeover.programName')" width="160" sortable="custom" />
      <el-table-column prop="Sequence" :label="t('changeover.sequence')" width="120" sortable="custom" />
      <el-table-column prop="Ip" :label="t('changeover.ip')" width="140" sortable="custom" />
      <el-table-column prop="Port" :label="t('changeover.port')" width="100" sortable="custom" />
      <el-table-column prop="ChangedTime" :label="t('changeover.finishDate')" width="180" sortable="custom" />
      <el-table-column prop="CreateDate" :label="t('common.createDate')" width="180" sortable="custom" />
      <el-table-column prop="CreateBy" :label="t('common.createBy')" width="150" sortable="custom" />
      <el-table-column prop="ModifyDate" :label="t('common.modifyDate')" width="180" sortable="custom" />
      <el-table-column prop="ModifyBy" :label="t('common.modifyBy')" width="140" sortable="custom" />
      <el-table-column fixed="right" :label="t('changeover.status')" width="100">
        <template #default="scope">
          <span v-if="scope.row.Status !== 1">
            <el-tag type="danger" effect="dark"> {{ t('changeover.inProgress') }} </el-tag>
          </span>
          <span v-else>
            <el-tag type="success" effect="dark"> {{ t('changeover.finished') }} </el-tag>
          </span>
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
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import { getChangeOverList } from '@/api/change-over'
import { formatDate, formatSortOrder } from '@/utils/common'
import { useStore } from 'vuex'
import bus from '@/utils/bus'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const queryParams = reactive({
  pageIdx: 1,
  pageSize: 10,
  sortOrder: 'none',
  orderCol: 'PcbPn',
})

const filterForm = reactive({
  LineName: '',
  ProductName: '',
  PcbPn: '',
  WorkOrderNo: '',
})

const store = useStore()

const tableData = reactive({ paginationMetadata: { totalCount: 0 }, list: [], loading: false })

const refresh = async () => {
  tableData.loading = true
  const { paginationMetadata, value } = await getChangeOverList({
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
    ChangedTime: formatDate(item.ChangedTime, 'YYYY/MM/DD HH:mm:ss'),
  }))
  tableData.paginationMetadata = paginationMetadata
  tableData.list = tableList
  tableData.loading = false
}

onMounted(() => {
  store.dispatch('line/getLines')
  bus.on('refresh', refresh)
})

const resetFilterForm = () => {
  filterForm.LineName = ''
  filterForm.ProductName = ''
  filterForm.PcbPn = ''
  filterForm.WorkOrderNo = ''
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

  :deep .el-scrollbar__view {
    height: 100%;
  }
}
</style>
