define([
  './basic.js',
  './styles.js',
  './ellipsis.js',
  './sort.js',
  './filter.js',
  './row-sortable.js',
  './resizable.js',
  './frozen-header.js',
  './colspan.js',
  './auto-merge.js',
  './multiple-header.js',
  './sticky.js',
  './sticky-window.js',
  './row-checkable.js',
  './row-checkable-events.js',
  './row-checkable-render.js',
  './custom-columns.js',
  './tree-grid.js',
  './tree-grid-flat-data.js',
  './tree-grid-indicator.js',
  './row-expandable.js',
  './nest-grid.js',
  './append-row.js',
], function () {
  return {
    title: 'Grid',
    subtitle: '高级表格',
    demos: Array.prototype.slice.call(arguments),
  }
})
