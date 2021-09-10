define([], function () {
  return {
    title: '字段组值',
    file: 'value',
    demo: function () {
      let group = null

      return {
        children: {
          component: 'Form',
          ref: (c) => {
            group = c
          },
          value: {
            country: '我是中国人',
            name: 'Jerry',
          },
          fields: [
            {
              component: 'StaticText',
              name: 'country',
              label: '国家',
            },
            {
              component: 'Textbox',
              name: 'name',
              label: '姓名',
              required: true,
              disabled: true,
              rules: [
                { type: 'identifier' },
                { type: 'minlength', value: 2 },
                { type: 'maxlength', value: 12 },
              ],
            },
            {
              component: 'Numberbox',
              name: 'age',
              label: '年龄',
              required: true,
              min: 0,
              max: 100,
            },
            {
              component: 'Textbox',
              name: 'email',
              label: 'Email',
              required: true,
              rules: [{ type: 'email', message: 'Email 格式不正确' }],
            },
            {
              component: 'RadioList',
              name: 'gender',
              label: '性别',
              value: 0,
              options: [
                { text: '男', value: 0 },
                { text: '女', value: 1 },
              ],
            },
            {
              component: 'DatePicker',
              name: 'birthDate',
              label: '出生日期',
            },
            {
              component: 'CheckboxList',
              name: 'hobbies',
              label: '爱好',
              value: [1, 3],
              options: [
                { text: '唱歌', value: 1 },
                { text: '跳舞', value: 2 },
                { text: '旅游', value: 3 },
              ],
            },
            {
              component: 'Select',
              name: 'city',
              label: '城市',
              value: 3,
              options: [
                { text: '北京', value: 1 },
                { text: '上海', value: 2 },
                { text: '广州', value: 3 },
              ],
            },
            {
              component: 'Rate',
              label: '性格评分',
              value: 3,
              name: 'characterRate',
            },
            {
              component: 'TreeSelect',
              name: 'dept',
              required: true,
              label: '部门权限',
              value: '0-0',
              allowClear: true,
              multiple: true,
              options: [
                {
                  text: '总经办',
                  key: '0-0',
                  children: [
                    {
                      text: '人事部',
                      key: '0-0-1',
                    },
                    {
                      text: '行政部',
                      key: '0-0-2',
                    },
                  ],
                },
                {
                  text: '技术中心',
                  key: '0-1',
                  children: [
                    {
                      text: '后端组',
                      key: '0-1-1',
                      children: [
                        {
                          text: '开发一组',
                          key: '0-1-1-1',
                        },
                        {
                          text: '开发二组',
                          key: '0-1-1-2',
                        },
                      ],
                    },
                    {
                      text: '前端组',
                      key: '0-1-2',
                    },
                  ],
                },
              ],
            },
            {
              component: 'Field',
              label: '',
              control: {
                component: 'Cols',
                items: [
                  {
                    component: 'Button',
                    type: 'primary',
                    text: '提 交',
                    onClick: () => {
                      group.validate()
                      console.log(group.getValue())
                    },
                  },
                  {
                    component: 'Button',
                    text: '重 置',
                    onClick: () => {
                      group.reset()
                    },
                  },
                  {
                    component: 'Button',
                    text: '清除',
                    onClick: () => {
                      group.clear()
                    },
                  },
                ],
              },
            },
          ],
        },
      }
    },
  }
})
