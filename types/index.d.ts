import { Range as XlsxAange } from 'xlsx/types/index.d';

export type Range = XlsxAange;
/**
 * 按照传入的数据格式导出Excel
 *
 * @param th 表格头部数据
 * @param jsonData 表格主体数据
 * @param title 表格名称
 */
export declare type export_data_to_excel = (
  th: (string | number | null)[],
  jsonData: (string | number | null)[][],
  title?: string,
) => void;

/**
 * 将 `generate_table_array` 获取的数据传入；适用于拼接多个 table
 *
 * @param tableArray 使用 `generate_table_array` 方法生成的数据列表
 * @param title 表格名称
 */
export declare type export_table_array_to_excel = (
  tableArray: [(string | number | null)[][], Range[]],
  title?: string,
) => void;

/**
 * 导出指定 id 的表格
 *
 * @param id 表格元素 Table 所使用的 id 属性值
 * @param title 表格名称
 */
export declare type export_table_to_excel = (id: string, title?: string) => void;

/**
 * 根据表格元素Table生成导出Excel所需的数据对象
 * @param table 表格元素对象
 * @returns 导出Excel所需的数据对象
 */
export declare type generate_table_array = (
  table?: HTMLElement | null,
) => [(string | number | null)[][], Range[]];
