module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          edge: '17',
          firefox: '60',
          chrome: '67',
          safari: '11.1',
        },
        useBuiltIns: 'usage',
        corejs: '3.6.4',
      },
      'stage-3',
    ],
    '@babel/preset-typescript',
  ],
  // 可以告诉 babel-preset-env 面向我们使用的 Node 版本，跳过转译不必要的特性使得测试启动更快。
  env: {
    test: {
      presets: [['@babel/preset-env', { targets: { node: 'current' } }]],
    },
  },
};
