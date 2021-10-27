define([], function () {
  return {
    title: '可勾选',
    file: 'checkable',
    description: '通过 `nodeCheckable` 配置可勾选行为',
    demo: function () {
      let treeRef = null

      return {
        component: 'Rows',
        items: [
          {
            component: 'Cols',
            items: [
              {
                component: 'Checkbox',
                text: '显示全选',
                onValueChange: ({ newValue }) => {
                  treeRef.update({ nodeCheckable: { showCheckAll: newValue } })
                },
              },
              {
                component: 'Checkbox',
                text: '级联选中父节点',
                value: true,
                onValueChange: ({ newValue }) => {
                  treeRef.update({ nodeCheckable: { cascadeCheckParent: newValue } })
                },
              },
              {
                component: 'Checkbox',
                text: '级联取消选中子节点',
                value: true,
                onValueChange: ({ newValue }) => {
                  treeRef.update({ nodeCheckable: { cascadeUncheckChildren: newValue } })
                },
              },
              {
                component: 'Button',
                text: '获取选中节点键值数组',
                onClick: () => {
                  console.log(treeRef.getCheckedNodeKeys())
                },
              },
              {
                component: 'Button',
                text: '获取选中节点数据（树形）',
                onClick: () => {
                  console.log(treeRef.getCheckedNodesData())
                },
              },
            ],
          },
          {
            component: 'Tree',
            ref: (c) => {
              treeRef = c
            },
            nodeCheckable: {
              checkedNodeKeys: ['节点 1', '节点 1.1', '节点 2.1'],
            },
            dataFields: {
              key: 'text',
            },
            data: [
              {
                text: '节点 1',
                children: [
                  { text: '节点 1.1', children: [{ text: '节点 1.1.1' }, { text: '节点 1.2' }] },
                ],
              },
              {
                text: '节点 2',
                children: [{ text: '节点 2.1' }, { text: '节点 2.2' }],
              },
            ],
          },
        ],
      }
    },
  }
})
