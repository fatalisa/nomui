define([], function () {
  return {
    title: '可选中',
    file: 'selectable',
    description: '通过 `nodeSelectable` 配置可选中行为',
    demo: function () {
      let treeRef = null,
        selectedInfoRef = null

      let selectedNode = null

      const updateSelectedInfo = () => {
        selectedInfoRef.update()
      }

      return {
        component: 'Rows',
        items: [
          {
            component: 'Cols',
            items: [
              {
                component: 'Checkbox',
                text: '点击节点选中',
                value: true,
                onValueChange: ({ newValue }) => {
                  treeRef.update({ nodeSelectable: { byClick: newValue } })
                },
              },
              {
                component: 'Checkbox',
                text: '仅叶子节点可选中',
                value: false,
                onValueChange: ({ newValue }) => {
                  treeRef.update({ nodeSelectable: { onlyleaf: newValue } })
                },
              },
              {
                component: 'Button',
                text: '选中节点：层级 2.1',
                onClick: () => {
                  treeRef.selectNode('层级 2.1')
                },
              },
            ],
          },
          {
            ref: (c) => {
              selectedInfoRef = c
            },
            styles: {
              color: 'lgray',
              padding: '1',
            },
            _config: (inst) => {
              const info = selectedNode !== null ? selectedNode.key : '未选中节点'
              inst.setProps({
                children: `选中节点：${info}`,
              })
            },
          },
          {
            component: 'Tree',
            ref: (c) => {
              treeRef = c
            },
            initExpandLevel: -1,
            dataFields: {
              key: 'text',
            },
            data: [
              {
                text: '层级 1',
                children: [
                  { text: '层级 1.1', children: [{ text: '层级 1.1.1' }, { text: '层级 1.1.2' }] },
                  { text: '层级 1.2' },
                ],
              },
              {
                text: '层级 2',
                children: [{ text: '层级 2.1' }, { text: '层级 2.2' }],
              },
            ],
            nodeSelectable: {
              onNodeSelect: ({ node }) => {
                selectedNode = node
                updateSelectedInfo()
              },
            },
          },
        ],
      }
    },
  }
})
