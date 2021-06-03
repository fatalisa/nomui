define([
  './basic.js',
  './selectable.js',
  './checkable.js',
  './sortable.js',
  './flat-data.js',
  './icon.js',
  './node-defaults.js',
  './fit.js',
  './scroll-to.js',
], function () {
  return {
    title: 'Tree',
    subtitle: '树',
    demos: Array.prototype.slice.call(arguments),
  }
})
