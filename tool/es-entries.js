const fs = require('fs');
const path = require('path');
const { pathJoin } = require('./utils');

const readLine = require('readline');

/**
 * 按行读取文件内容
 *
 * @param fReadName 文件名路径
 * @param relatePath 组件文件夹相对路径
 *
 * @return 字符串数组
 */
async function readFileToEntries(fReadName, relateDir) {
  const relatePath = relateDir ? path.join(__dirname, relateDir) : path.join(fReadName, '..');
  let entries = {};
  // export { default as A } from '**'
  const regDef = /^export\s+\{\s+default\s+as\s+(\w+)\s+\}\s+from\s+['"]([./-\w]+)['"];?$/;

  // export { A, B, C } from '**'
  const regLot = /^export\s+\{([\w+,\s]+)\}\s+from\s+['"]([./-\w]+)['"];?$/;
  try {
    const readObj = readLine.createInterface({
      input: fs.createReadStream(fReadName),
    });

    // 同步方式，读取每一行的内容
    for await (const line of readObj) {
      if (regDef.test(line)) {
        line.match(regDef);
        // console.log(RegExp.$1, RegExp.$2);
        const isFormNodeModules = RegExp.$2.indexOf('./') !== 0;
        const itemPath = !isFormNodeModules
          ? path.join(relatePath, RegExp.$2.replace('./', ''))
          : path.join(__dirname, '../node_modules/', RegExp.$2);
        // 驼峰转连字符，避免按需加载工具不能识别；
        let itemName = RegExp.$1.replace(/([A-Z])/g, '-$1').toLowerCase();
        // 去掉第一个-
        itemName = itemName.indexOf('-') === 0 ? itemName.substring(1) : itemName;
        entries[itemName] = itemPath + '.ts'; // TODO 暂时只支持 .ts 文件入口文件
      } else if (regLot.test(line)) {
        line.match(regLot);
        // A, B, C
        // console.log('reg lot', RegExp.$1, RegExp.$2);
        const itemPath = path.join(relatePath, RegExp.$2.replace('./', ''));
        const detailEntries = await readFileToEntries(itemPath);
        entries = {
          ...entries,
          ...detailEntries,
        };
      }
    }
    return entries;
    /* readObj.on('line', function (line) {
        // arr.push(line);
        if (reg.test(line)) {
          line.match(reg);
          console.log(RegExp.$1, RegExp.$2);
          entries[RegExp.$1] = path.join(__dirname, '../src/components', RegExp.$2);
        }
      });
      readObj.on('close', function () {
        console.log('readLine close....');
        resolve(entries);
      }); */
  } catch (error) {
    console.log('read error: ', relatePath, fReadName, error);
  }
}

async function setEntries() {
  // 拿到所有 sz-design 组件入口
  const esEntries = await readFileToEntries(pathJoin('src/index.ts'));

  return {
    index: pathJoin('src/index.ts'), // 全局入口
    // 各个组件入口
    ...esEntries,
  };
}
setEntries().then((entries) => {
  // console.log('es entries: \n', entries);
  fs.writeFile(pathJoin('tool/es-entries.json'), JSON.stringify(entries, null, 2), (err) => {
    if (err) throw err;
    console.log('es-entries.json has been saved!');
  });
});
