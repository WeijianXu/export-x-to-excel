/*
 * @Author: WeijianXu weijian.xu@unidt.com
 * @Date: 2024-04-22 17:45:54
 * @LastEditors: WeijianXu weijian.xu@unidt.com
 * @LastEditTime: 2024-04-23 12:20:19
 * @FilePath: \\test.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const { export_data_to_excel } = require('../dist/export-x-to-excel.cjs');
const glob = require('glob-all');
const { Blob } = require('node:buffer');
global.Blob = Blob;

describe('Checking export-x-to-excel', () => {
  it('should export data correctly', (done) => {
    
    try {
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

      done();
    } catch (error) {
      throw new Error('no xlsx files generated');
    }

    /* setTimeout(() => {
      const files = glob.sync([
        './test.xlsx',
      ]);
  
      if (files.length > 0) {
        done();
      } else {
        throw new Error('no xlsx files generated');
      }
    }, 2000); */

  });
});
