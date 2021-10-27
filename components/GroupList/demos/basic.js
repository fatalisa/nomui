define([], function () {
  return {
    title: '基础用法',
    file: 'basic',
    demo: function () {
      return {
        component: 'Form',
        line: 'outline',
        striped: true,
        fields: [
          {
            component: 'GroupList',
            label: '教育经历',

            ref: (c) => {
              window.group = c
            },
            onValueChange: (args) => {
              console.log(args)
            },
            groupDefaults: {
              nowrap: true,
              fields: [
                {
                  component: 'Textbox',
                  name: 'school',
                  label: '学校名称',
                },
                {
                  component: 'Numberbox',
                  name: 'startYear',
                  label: '入学年份',
                },
              ],
            },

            value: [
              { school: '小学', age: '7' },
              { school: '大学', age: '18' },
            ],
          },
        ],
      }
    },
  }
})
