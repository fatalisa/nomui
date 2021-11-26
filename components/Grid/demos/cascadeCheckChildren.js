define([], function () {
  return {
    title: '级联取消勾选子节点',
    file: 'cascadeUncheckChildren',
    demo: function () {
      return {
        children: [
          {
            component: 'Grid',
            rowCheckable: true,
            treeConfig: {
              flatData: true,
              parentField: 'parentKey',
              treeNodeColumn: 'class',
              showCheckAll: true,
              cascade: false,
              cascadeUncheckChildren: true,
            },
            columns: [
              {
                field: 'class',
                title: '班级',
              },
              {
                field: 'count',
                title: '人数',
                width: 200,
              },
            ],
            data: [
              {
                id: '1',
                class: '小学',
                count: '-',
              },
              {
                id: '1.1',
                class: '一年级',
                count: '-',
                parentKey: '1',
              },
              {
                id: '1.1.1',
                class: '1班',
                count: 30,
                parentKey: '1.1',
              },
              {
                id: '1.1.2',
                class: '2班',
                count: 31,
                parentKey: '1.1',
              },
              {
                id: '2',
                class: '二年级',
                count: '-',
              },
              {
                id: '2.1',
                class: '1班',
                count: '-',
                parentKey: '2',
              },
              {
                id: '3',
                class: '中学',
                count: '-',
              },
              {
                id: '3.1',
                class: '七年级',
                count: '-',
                parentKey: '3',
              },
              {
                id: '3.1.1',
                class: '1班',
                count: '-',
                parentKey: '3',
              },
              {
                id: '4',
                class: '大学',
                count: '-',
              },
            ],
          },
        ],
      }
    },
  }
})
