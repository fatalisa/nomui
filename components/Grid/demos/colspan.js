define([], function () {
  return {
    title: '行列合并',
    file: 'colspan',
    demo: function () {
      return {
        component: 'Grid',
        line: 'both',
        bordered: true,
        columns: [
          {
            field: 'name',
            title: '标题',
            width: 200,
            cellMerge: ({ index }) => {
              if (index === 2) {
                return {
                  rowSpan: 3,
                }
              }
              if (index > 2) {
                return {
                  rowSpan: 0,
                }
              }
            },
          },
          {
            field: 'author',
            title: '作者',
            colSpan: 2,
          },
          {
            field: 'originAuthor',
            title: '原作',
            colSpan: 0,
          },
          {
            field: 'sales',
            title: '销量',
          },

          {
            field: 'role',
            title: '主角',
            width: 500,
          },
        ],
        data: [
          {
            id: 1,
            name: '笑傲江湖',
            author: '金庸',
            originAuthor: '金庸',
            sales: 100000,
            role: '令狐冲',
          },
          {
            id: 2,
            name: '天龙八部',
            author: '金庸',
            originAuthor: '金庸',
            sales: 200000,
            role: '乔峰',
          },
          {
            id: 3,
            name: '射雕英雄传',
            author: '金庸',
            originAuthor: '金庸',
            sales: 80000,
            role: '郭靖',
          },
          {
            id: 4,
            name: '射雕英雄传',
            author: '金庸',
            originAuthor: '金庸',
            sales: 80000,
            role: '郭靖',
          },
          {
            id: 5,
            name: '射雕英雄传',
            author: '金庸',
            originAuthor: '金庸',
            sales: 80000,
            role: '郭靖',
          },
        ],
      }
    },
  }
})
