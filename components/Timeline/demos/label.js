define([], function () {
  return {
    title: '标签',
    file: 'label',
    description: '使用 label 标签单独展示时间。',
    demo: function () {
      return {
        component: 'Rows',
        items: [
          {
            component: 'RadioList',
            options: [
              {
                text: 'left',
                value: 'left',
              },
              {
                text: 'right',
                value: 'right',
              },
              {
                text: 'alternate',
                value: 'alternate',
              },
            ],
            events: {
              valueChange: (changed) => {
                const labelTimeLine = this.refs.labelTimeLine
                labelTimeLine.update({
                  mode: changed.newValue || 'left',
                })
              },
            },
          },
          {
            component: 'Timeline',
            ref: 'labelTimeLine',
            items: [
              {
                label: '2015-09-01',
                children: 'Create a services',
              },
              {
                label: '2015-09-01 09:12:11',
                children: 'Solve initial network problems',
              },
              {
                children: 'Technical testing',
              },
              {
                label: '2015-09-01 09:12:11',
                children: 'Network problems being solved',
              },
            ],
          },
        ],
      }
    },
  }
})