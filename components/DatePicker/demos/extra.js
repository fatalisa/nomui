define([], function () {
  return {
    title: '额外工具栏',
    file: 'extra',
    demo: function () {
      let dpref = null
      return {
        children: {
          component: 'DatePicker',
          placeholder: '额外工具栏',
          ref: (c) => {
            dpref = c
          },
          showNow: false,
          extraTools: [
            {
              component: 'Button',
              size: 'small',
              text: '至今',
              onClick: () => {
                dpref.setValue('至今')
                dpref.close()
              },
            },
            {
              component: 'Button',
              size: 'small',
              text: '圣诞节',
              onClick: () => {
                dpref.setValue('2022-12-25')
                dpref.close()
              },
            },
          ],
        },
      }
    },
  }
})
