<template>
  <component :is="renderLoop(column)"></component>
</template>

<script lang="tsx" setup name="TableColumn">
import { useSlots } from "vue";
import type { ColumnProps } from './interface'
import { formatValue, handleRowAccordingToProp } from '@/utils/table'

defineProps<{ column: ColumnProps }>()

const slots = useSlots()

// 渲染表格数据
const renderCellData = (item: ColumnProps, scope: { [key: string]: any }) => {
  return formatValue(handleRowAccordingToProp(scope.row, item.prop!))
}

// 获取 tag 类型 暂时不太需要

const renderLoop = (item: ColumnProps) => {
  return (
    <>
      {item.isShow && (
        <el-table-column
          {...item}
          align={item.align ?? "center"}
          showOverflowTooltip={item.showOverflowTooltip ?? item.prop !== "operation"}
        >
          {{
            default: (scope: any) => {
              if (item._children) return item._children.map((child: ColumnProps) => renderLoop(child));
              if (item.render) return item.render(scope);
              if (slots[item.prop!]) return slots[item.prop!]!(scope);
              return renderCellData(item, scope);
            },
            header: () => {
              if (item.headerRender) return item.headerRender(item);
              if (slots[`${item.prop}Header`]) return slots[`${item.prop}Header`]!({ row: item });
              return item.label;
            }
          }}
        </el-table-column>
      )}
    </>
  );
};
</script>