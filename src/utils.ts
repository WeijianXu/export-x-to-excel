import * as XLSX from 'xlsx';
import { CellObject } from 'xlsx/types/index.d';

export function datenum(v: string, date1904 = false) {
  if (date1904) v += 1462;
  const epoch = Date.parse(v);
  return (epoch - new Date(Date.UTC(1899, 11, 30)).getTime()) / (24 * 60 * 60 * 1000);
}

export function sheet_from_arrays(data: (string | number | null)[][]) {
  const ws: Record<string, unknown> = {};
  const range = { s: { c: 10000000, r: 10000000 }, e: { c: 0, r: 0 } };
  for (let R = 0; R != data.length; R += 1) {
    for (let C = 0; C != data[R].length; C += 1) {
      if (range.s.r > R) {
        range.s.r = R;
      }
      if (range.s.c > C) {
        range.s.c = C;
      }
      if (range.e.r < R) {
        range.e.r = R;
      }
      if (range.e.c < C) {
        range.e.c = C;
      }
      const v = data[R][C] !== null && data[R][C] !== undefined ? data[R][C] : null;
      const cell: CellObject = { t: 's', v };
      if (cell.v == null) continue;
      const cell_ref = XLSX.utils.encode_cell({ c: C, r: R });

      if (typeof cell.v === 'number') {
        cell.t = 'n';
      } else if (typeof cell.v === 'boolean') {
        cell.t = 'b';
      } else if (cell.v instanceof Date) {
        cell.t = 'd';
        cell.z = XLSX.SSF._table[14];
        cell.v = datenum(cell.v.toString());
      } else {
        cell.t = 's';
      }

      ws[cell_ref] = cell;
    }
  }
  if (range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range);
  return ws;
}

export function s2ab(s: string) {
  const buf = new ArrayBuffer(s.length);
  const view = new Uint8Array(buf);
  for (let i = 0; i != s.length; ++i) {
    view[i] = s.charCodeAt(i) & 0xff;
  }
  return buf;
}
