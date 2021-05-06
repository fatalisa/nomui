define([], function () {
    return {
        title: '替换上一页和下一页以及缩略字符',
        file: 'icon-text',
        demo: function () {
            return {
                children: [
                    {
                        component: 'Pager',
                        totalCount: 100,
                        texts: {
                            prev: '<',
                            next: '>',
                            ellipse: '......'
                        },
                        onPageChange: function (e) {
                            e.sender.update(e)
                            console.log(e)
                        }
                    }
                ]
            };
        }
    };
});