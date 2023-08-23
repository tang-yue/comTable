<script setup lang="ts">
import { reactive, ref } from 'vue'
import comTable from './components/Table/index.vue'

const columns = reactive([
   {
    prop: "name",
    label: "商品名称",
    width: 190
  },
  {
    prop: "categoryName",
    label: "商品分类",
    width: 190
  },
  {
    prop: "status",
    label: "状态",
    width: 190
  },
])
const getTableList = (): any => {

}
const dataCallback = () => {

}
const pageable = reactive({
  pageNum: 1,
  pageSize: 10,
  total: 0
})
const pageLoading = ref(false)
const handleSizeChange = () => {

}
const handleCurrentChange = () => {

}
const tableData = reactive([
  {
    name: '商品1',
    categoryName: '分类1',
    status: '上架'
  },
  {
    name: '商品2',
    categoryName: '分类2',
    status: '下架'
  },
  {
    name: '商品3',
    categoryName: '分类3',
    status: '上架'
  },
  {
    name: '商品4',
    categoryName: '分类4',
    status: '下架'
  }
])
const operate = (type: string, row: any) => {
  console.log(type, row)
}

</script>

<template>
  <div>
    <com-table
      :columns="columns"
      :requestApi="getTableList"
      :dataCallback="dataCallback"
      :pageable="pageable"
      :pageLoading="pageLoading"
      :handleSizeChange="handleSizeChange"
      :handleCurrentChange="handleCurrentChange"
      :tableData="tableData"
    >
      <template #operation="{row}">
        <el-button type="primary" link v-if="row.status === 1 || row.status === 3" @click="operate('publish', row)">上架</el-button>
        <el-button type="primary" link v-if="row.status === 2" @click="operate('unPublish', row)">下架</el-button>
        <el-button type="primary" link @click="operate('edit', row)">编辑</el-button>
      </template>
      <template #empty>
        <div>暂无商品</div>
      </template>
    </com-table>
  </div>
</template>

<style scoped>
</style>
