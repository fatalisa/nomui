define(
    [
        './basic.js',
        './uistyle.js'
    ],
    function () {
        return {
            title: 'Tabs',
            subtitle: '选项卡',
            demos: Array.prototype.slice.call(arguments)
        }
    }
);