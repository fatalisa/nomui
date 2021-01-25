define(
  [
    './basic.js',
    './label-align.js',
    './value.js',
  ],
  function () {

    return {
      title: 'Field',
      subtitle: '字段',
      demos: Array.prototype.slice.call(arguments),
    }

  })
