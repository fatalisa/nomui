define([], function () {
  return {
    title: '基础用法',
    file: 'basic',
    demo: function () {
      return {
        component: 'Cols',
        align: 'start',
        items: [
          {
            component: 'Anchor',
            sticky: this.parent,
            content: this.parent,
            items: [
              { text: '锚点1', key: 'div1' },
              {
                text: '锚点2',
                key: 'div2',
                items: [
                  { text: '锚点2-1', key: 'div2-1' },
                  {
                    text: '锚点2-2',
                    key: 'div2-2',
                  },
                ],
              },
              { text: '锚点3', key: 'div3' },
              { text: '锚点4', key: 'div4' },
            ],
          },
          {
            component: 'Rows',
            items: [
              {
                component: 'AnchorContent',
                key: 'div1',
                attrs: {
                  style: {
                    height: '500px',
                  },
                },
                children: 'div1',
              },
              {
                component: 'AnchorContent',
                key: 'div2',
                attrs: {
                  style: {
                    height: '500px',
                  },
                },
                children: 'div2',
              },
              {
                component: 'AnchorContent',
                key: 'div3',
                attrs: {
                  style: {
                    height: '500px',
                  },
                },
                children: 'div3',
              },
              {
                component: 'AnchorContent',
                key: 'div4',
                attrs: {
                  style: {
                    height: '500px',
                  },
                },
                children: 'div4',
              },
            ],
          },
        ],
      }
    },
  }
})
