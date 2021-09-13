define([], function () {
  return {
    title: '多选',
    file: 'multiple',
    description: '配置了 `multiple`或`nodeCheckable` 则开启多选。`nodeCheckable`配置同`Tree`组件',
    demo: function () {
      return {
        children: {
          component: 'TreeSelect',
          options: [
            {
              text: '总经办',
              value: '0-0',
              children: [
                {
                  text: '人事部',
                  value: '0-0-1',
                },
                {
                  text: '行政部',
                  value: '0-0-2',
                },
              ],
            },
            {
              text: '技术中心',
              value: '0-1',
              children: [
                {
                  text: '后端组',
                  value: '0-1-1',
                  children: [
                    {
                      text: '开发一组',
                      value: '0-1-1-1',
                    },
                    {
                      text: '开发二组',
                      value: '0-1-1-2',
                    },
                  ],
                },
                {
                  text: '前端组',
                  value: '0-1-2',
                },
              ],
            },
          ],
          value: ['0-0', '0-0-1'],
          treeCheckable: {},
        },
      }
    },
  }
})
