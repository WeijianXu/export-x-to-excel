import { Range } from 'xlsx/types/index.d';

export default function generate_table_array(table?: HTMLElement | null): [any[], Range[]] {
  if (!table) {
    return [[], []];
  }
  const out: any[] = [];
  // 匹配第一个 thead 的所有 tr
  const theadRows = table.querySelector('thead')?.querySelectorAll('tr') || [];
  // 匹配第一个 tbody 的所有 tr
  const tbodyRows = table.querySelector('tbody')?.querySelectorAll('tr') || [];

  const rows: HTMLTableRowElement[] = [...theadRows, ...tbodyRows];

  const ranges: Range[] = [];
  for (let R = 0; R < rows.length; ++R) {
    const outRow = [];
    const row = rows[R];
    const thColumns = row.querySelectorAll('th'); // 表格头部单元格
    const tdColumns = row.querySelectorAll('td'); // 表格主体单元格
    const columns = thColumns && thColumns.length ? thColumns : tdColumns;
    for (let C = 0; C < columns.length; ++C) {
      const cell = columns[C];
      let colspan = +(cell.getAttribute('colspan') || 1);
      let rowspan = +(cell.getAttribute('rowspan') || 1);
      let cellValue: any = cell.innerText || cell.textContent || '';
      // 处理数字，数字太大，不处理成数字
      const cv = cellValue.replaceAll(',', ''); // 处理千分位
      if (cellValue !== '' && cv === (+cv).toString() && +cv < 10000000) {
        cellValue = +cv;
      }

      //Skip ranges
      const specialCols: Record<number, Range> = {};
      ranges.forEach(function (range) {
        if (R >= range.s.r && R <= range.e.r) {
          // range 所在单元格，行数落在目标 cell 上
          if (outRow.length >= range.s.c && outRow.length <= range.e.c) {
            for (let i = 0; i <= range.e.c - range.s.c; ++i) outRow.push(null);
          } else {
            // 但是 outRow 还没有补够 null，下次补够后再加上
            specialCols[range.s.c] = range;
          }
          // 之前没有补够的，现在要补上
          if (specialCols[outRow.length]) {
            const specialRange = specialCols[outRow.length];
            if (outRow.length >= specialRange.s.c && outRow.length <= specialRange.e.c) {
              for (let i = 0; i <= specialRange.e.c - specialRange.s.c; ++i) outRow.push(null);
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
      outRow.push(cellValue !== '' ? cellValue : null);

      //Handle Colspan
      if (colspan) for (let k = 0; k < colspan - 1; ++k) outRow.push(null);
    }
    out.push(outRow);
  }
  return [out, ranges];
}
