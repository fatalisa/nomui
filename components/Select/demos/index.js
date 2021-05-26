define([
  './basic.js',
  './disabled-option.js',
  './disabled.js',
  './multiple.js',
  './value.js',
  './show-array.js',
  './custom.js',
  './searchable-local.js',
  './searchable-remote.js',
  './other.js',
], function () {
  return {
    title: 'Select',
    subtitle: '下拉选择',
    demos: Array.prototype.slice.call(arguments),
  }
})
