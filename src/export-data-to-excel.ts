/*
 * @Author: WeijianXu weijian.xu@unidt.com
 * @Date: 2024-04-17 14:58:47
 * @LastEditors: WeijianXu weijian.xu@unidt.com
 * @LastEditTime: 2024-04-23 11:32:08
 * @FilePath: \output-verbatimd:\app\me\export-x-to-excel\src\export-data-to-excel.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { sheet_from_arrays, s2ab } from './utils';
import { CellValue } from '../types/index.d';

/**
 * 按照传入的数据格式导出Excel
 *
 * @param th 表格头部数据
 * @param jsonData 表格主体数据
 * @param title 表格名称
 */
export default function export_data_to_excel(
  th: (string | number)[],
  jsonData: CellValue[][],
  title = 'export-table',
) {
  /* original data */

  const data = jsonData;
  data.unshift(th);
  const ws_name = 'SheetJS';

  const wb = XLSX.utils.book_new(),
    ws = sheet_from_arrays(data);

  /* add worksheet to workbook */
  wb.SheetNames.push(ws_name);
  wb.Sheets[ws_name] = ws;

  const wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: false, type: 'binary' });
  saveAs(new Blob([s2ab(wbout)], { type: 'application/octet-stream' }), title + '.xlsx');
}
