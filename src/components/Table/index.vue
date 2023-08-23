<template>
  <!-- 表格 -->
  <div class="card table-main">
    <!-- 表格头部 -->
    <div class="table-header">
      <div class="header-button-lf">
				<slot name="tableHeader" :selectedListIds="selectedListIds" :selectedList="selectedList" :isSelected="isSelected"></slot>
      </div>
    </div>
    <!-- 表格主体 -->
    <el-table
      ref="tableRef"
      v-bind="$attrs"
      :data="tableData"
      :border="border"
      :row-key="getRowKeys"
      v-loading="pageLoading"
      :height="height"
      @selection-change="selectionChange"
    >
      <!-- 默认插槽 -->
      <slot></slot>
      <template v-for="item in tableColumns" :key="item">
        <!-- 表格多选 -->
        <el-table-column
          v-bind="item"
          :align="item.align || 'center'"
          :reserve-selection="item.type == 'selection'"
          v-if="item.type == 'selection' || item.type == 'index'"
        >
        </el-table-column>
        <!-- 普通 tableColumn 部分 -->
         <TableColumn v-if="!item.type && item.prop && item.isShow" :column="item">
          <template v-for="slot in Object.keys($slots)" #[slot]="scope">
            <slot :name="slot" :row="scope.row"></slot>
          </template>
        </TableColumn>
      </template>
      <!-- 插入表格最后一行之后的插槽 -->
      <template #append>
        <slot name="append"></slot>
      </template>
      <!-- 表格无数据情况 -->
      <template #empty>
				<div class="table-empty">
					<slot name="empty">
						<!-- <img src="@/assets/images/notData.png" alt="notData" /> -->
						<!-- <div>暂无数据</div> -->
					</slot>
				</div>
			</template>
    </el-table>
    <slot name="pagination">
      <Pagination
				v-if="pagination"
				:pageable="pageable"
				:handleSizeChange="handleSizeChange"
				:handleCurrentChange="handleCurrentChange"
			/>
    </slot>
  </div>
</template>

<script setup lang="ts" name="commonTable">
import { ref } from 'vue'
import { ElTable } from "element-plus";
import type { TableProps } from "element-plus";
import type { ColumnProps, Table } from "./interface";
import { useSelection } from './hooks/useSelection'
import TableColumn from './TableColumn.vue'
import Pagination from './Pagination.vue'

// 搜索参数/表格数据(或者采用接口的形式) 通过外部传进来
interface ProTableProps extends Partial<Omit<TableProps<any>, "data">> {
  columns: ColumnProps[]; // 列配置项
  requestApi: (params: any) => Promise<any>; // 请求表格数据的api ==> 必传
  dataCallback?: (data: any) => any; // 返回数据的回调函数，可以对数据进行处理 ==> 非必传
  handleSizeChange: (size: number) => void;
  handleCurrentChange: (params: any) => any;
  pageable: Table.Pageable; // 分页参数 ==> 非必传
  tableData: any[]; // 表格数据 ==> 非必传
  pagination?: boolean; // 是否需要分页组件 ==> 非必传（默认为true)
  border?: boolean; // 是否带有纵向边框 ==> 非必传（默认为true）
  selectId?: string; // 当表格数据多选时，所指定的 id ==> 非必传（默认为 id)
  pageLoading?: boolean; // 表格加载状态 ==> 非必传（默认为false)
  height?: string | number; // 表格高度 ==> 非必传
}

const props = withDefaults(defineProps<ProTableProps>(), {
  columns: () => [],
  pagination: true,
  border: true,
  tableData: () => [],
  selectId: "id",
  pageLoading: false,
  height: 'calc(10.8rem - 240px)'
})

// console.log(props)
// 监听props改变,执行相应的操作
// watch(() => props.pageLoading, () => {
//   console.log(props.pageLoading, 'props')
// }, { deep: true })

// 表格 DOM 元素
const tableRef = ref<InstanceType<typeof ElTable> | null>(null);

// 表格多选 Hooks 是需要的
const { selectionChange, getRowKeys, selectedList, selectedListIds, isSelected } = useSelection(props.selectId);
  
// 清空选中数据列表
const clearSelection = () => tableRef.value!.clearSelection();

// 监听页面 initParam 改化，重新获取表格数据
// watch(() => props.tableData, { deep: true });

// 接受 columns 并设置为响应式
const tableColumns = ref<ColumnProps[]>(props.columns);

// 扁平化 columns
const flatColumnsFunc = (columns: ColumnProps[], flatArr: ColumnProps[] = []) => {
	columns.forEach(async col => {
		if (col._children?.length) flatArr.push(...flatColumnsFunc(col._children));
		flatArr.push(col);

		// 给每一项 column 添加 isShow && isFilterEnum 默认属性
		col.isShow = col.isShow ?? true;
		// col.isFilterEnum = col.isFilterEnum ?? true;

		// 设置 enumMap
		// setEnumMap(col);
	});
	return flatArr.filter(item => !item._children?.length);
};

flatColumnsFunc(tableColumns.value);

defineExpose({
  element: tableRef,
  clearSelection
})
</script>

<style lang="less" scoped>
:deep(.el-table__body-wrapper) {
  overflow: hidden;
  overflow-x: auto !important;
}
</style>