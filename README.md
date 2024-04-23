# export-to-excel

前端实现将表格导出成 Excel 文件。

## 使用场景

### 将页面上指定 `<Table>` 导出为 Excel 文件

```js
import { export_table_to_excel } from 'export-x-to-excel';

const tableElement = document.querySelector('#table');
const fileName = 'test.xlsx';
export_table_to_excel(tableElement, fileName);
```

### 将数据导入到 Excel 文件

```js
import { export_data_to_excel } from 'export-x-to-excel';

const th = ['name', 'age', 'position'];
const tData = [
  ['Zhang sang', 28, 'Manager'],
  ['Li si', 29, 'Engineer'],
  ['Wang wu', 24, 'Designer'],
  ['Zhao liu', 25, 'Programmer'],
  ['Chen qi', 23, 'Tester'],
];
const fileName = 'test.xlsx';
export_data_to_excel(th, tData, fileName);
```

### 将多个表格数据拼接输出

```js
import { generate_table_array, export_table_array_to_excel } from 'export-x-to-excel';

// 适用于部分UI框架表格，表格元素主体不连贯，如: `view-design`
const table01Data = generate_table_array(document.querySelector('#table-01'));
const table02Data = generate_table_array(document.querySelector('#table-02'));

export_table_array_to_excel([table01Data[0], [table01Data[1].concat(table02Data[1])]], 'test.xlsx');
```
