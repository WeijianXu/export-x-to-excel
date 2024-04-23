/*
 * @Author: WeijianXu weijian.xu@unidt.com
 * @Date: 2024-04-17 14:58:47
 * @LastEditors: WeijianXu weijian.xu@unidt.com
 * @LastEditTime: 2024-04-23 11:31:23
 * @FilePath: \output-verbatimd:\app\me\export-x-to-excel\src\export-table-array-to-excel.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import * as XLSX from 'xlsx';
import { Range } from 'xlsx/types/index.d';
import { saveAs } from 'file-saver';
import { sheet_from_arrays, s2ab } from './utils';
import { CellValue } from '../types/index.d';

/**
 * 将 `generate_table_array` 获取的数据传入；适用于拼接多个 table
 *
 * @param tableArray 使用 `generate_table_array` 方法生成的数据列表
 * @param title 表格名称
 */
export default function export_table_array_to_excel(
  tableArray: [CellValue[][], Range[]],
  title = 'export-table',
) {
  const ranges = tableArray[1];

  /* original data */
  const data = tableArray[0];
  const ws_name = 'SheetJS';
  // console.log(JSON.stringify(tableArray));
  const wb = XLSX.utils.book_new(),
    ws = sheet_from_arrays(data);

  /* add ranges to worksheet */
  // ws['!cols'] = ['apple', 'banan'];
  ws['!merges'] = ranges;

  /* add worksheet to workbook */
  wb.SheetNames.push(ws_name);
  wb.Sheets[ws_name] = ws;

  const wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: false, type: 'binary' });
  saveAs(new Blob([s2ab(wbout)], { type: 'application/octet-stream' }), title + '.xlsx');
}
