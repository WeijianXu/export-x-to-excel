import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { sheet_from_arrays, s2ab } from './utils';

/**
 * 按照传入的数据格式导出Excel
 *
 * @param th 表格头部数据
 * @param jsonData 表格主体数据
 * @param title 表格名称
 */
export default function export_data_to_excel(th: any[], jsonData: any[], title = 'export-table') {
  /* original data */

  var data = jsonData;
  data.unshift(th);
  var ws_name = 'SheetJS';

  var wb = XLSX.utils.book_new(),
    ws = sheet_from_arrays(data);

  /* add worksheet to workbook */
  wb.SheetNames.push(ws_name);
  wb.Sheets[ws_name] = ws;

  var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: false, type: 'binary' });
  saveAs(new Blob([s2ab(wbout)], { type: 'application/octet-stream' }), title + '.xlsx');
}
