/*
 * @Author: WeijianXu weijian.xu@unidt.com
 * @Date: 2024-04-17 14:58:47
 * @LastEditors: WeijianXu weijian.xu@unidt.com
 * @LastEditTime: 2024-04-23 11:30:52
 * @FilePath: \output-verbatimd:\app\me\export-x-to-excel\src\generate-table-array.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Range } from 'xlsx/types/index.d';
import { CellValue } from '../types/index.d';

/**
 * 根据表格元素Table生成导出Excel所需的数据对象
 * @param table 表格元素对象
 * @returns 导出Excel所需的数据对象
 */
export default function generate_table_array(
  table?: HTMLElement | null,
): [CellValue[][], Range[]] {
  if (!table) {
    return [[], []];
  }
  const out: CellValue[][] = [];
  // 匹配第一个 thead 的所有 tr
  const theadRows = table.querySelector('thead')?.querySelectorAll('tr') || [];
  // 匹配第一个 tbody 的所有 tr
  const tbodyRows = table.querySelector('tbody')?.querySelectorAll('tr') || [];

  const rows: HTMLTableRowElement[] = [...theadRows, ...tbodyRows];

  const ranges: Range[] = [];
  for (let R = 0; R < rows.length; ++R) {
    const outRow: CellValue[] = [];
    const row = rows[R];
    const thColumns = row.querySelectorAll('th'); // 表格头部单元格
    const tdColumns = row.querySelectorAll('td'); // 表格主体单元格
    const columns = thColumns && thColumns.length ? thColumns : tdColumns;
    for (let C = 0; C < columns.length; ++C) {
      const cell = columns[C];
      const colspan = +(cell.getAttribute('colspan') || 1);
      const rowspan = +(cell.getAttribute('rowspan') || 1);
      let cellValue: CellValue = cell.innerText || cell.textContent || '';
      // 处理数字，数字太大，不处理成数字
      const cv = cellValue.replace(/,/mg, '').trim(); // 处理千分位
      if (cellValue !== '' && cv === (+cv).toString()) {
        if (+cv < Number.MAX_VALUE) {
          cellValue = +cv;
        } else {
          cellValue = cv; // 数值太大，仍然显示成字符串
        }
      } else {
        cellValue = cellValue.trim(); // 去掉首尾空格
      }

      //Skip ranges
      const specialCols: Record<number, Range> = {};
      ranges.forEach(function (range) {
        if (R >= range.s.r && R <= range.e.r) {
          // range 所在单元格，行数落在目标 cell 上
          if (outRow.length >= range.s.c && outRow.length <= range.e.c) {
            for (let i = 0; i <= range.e.c - range.s.c; ++i) outRow.push(undefined);
          } else {
            // 但是 outRow 还没有补够 null，下次补够后再加上
            specialCols[range.s.c] = range;
          }
          // 之前没有补够的，现在要补上
          if (specialCols[outRow.length]) {
            const specialRange = specialCols[outRow.length];
            if (outRow.length >= specialRange.s.c && outRow.length <= specialRange.e.c) {
              for (let i = 0; i <= specialRange.e.c - specialRange.s.c; ++i) outRow.push(undefined);
            }
          }
        }
      });

      //Handle Row Span
      if (rowspan || colspan) {
        ranges.push({
          s: { r: R, c: outRow.length },
          e: { r: R + rowspan - 1, c: outRow.length + colspan - 1 },
        });
      }

      //Handle Value
      outRow.push(cellValue !== '' ? cellValue : undefined);

      //Handle Colspan
      if (colspan) for (let k = 0; k < colspan - 1; ++k) outRow.push(undefined);
    }
    out.push(outRow);
  }
  return [out, ranges];
}
