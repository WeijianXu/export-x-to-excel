import export_table_array_to_excel from './export-table-array-to-excel';
import generate_table_array from './generate-table-array';

/**
 * 导出指定 id 的表格
 *
 * @param id 表格元素 Table 所使用的 id 属性值
 * @param title 表格名称
 */
export default function export_table_to_excel(id: string, title?: string) {
  const theTable = document.getElementById(id);
  const oo = generate_table_array(theTable);
  export_table_array_to_excel(oo, title);
}
