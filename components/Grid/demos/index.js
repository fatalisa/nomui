define([
  './basic.js',
  './styles.js',
  './frozen-header.js',
  './colspan.js',
  './multiple-header.js',
  './custom-columns.js',
], function () {
  return {
    title: 'Grid',
    subtitle: '高级表格',
    demos: Array.prototype.slice.call(arguments),
  }
})
