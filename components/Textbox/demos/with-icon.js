define([], function () {

    return {
        title: '带图标',
        file: 'with-icon',
        demo: function () {
            return {
                component: 'Rows',
                items: [
                    {
                        component: 'Textbox',
                        leftIcon: 'person',
                        placeholder: '左图标',
                    },
                    {
                        component: 'Textbox',
                        rightIcon: 'check',
                        placeholder: '右图标',
                    },
                    {
                        component: 'Textbox',
                        leftIcon: 'person',
                        rightIcon: 'check',
                        placeholder: '左右图标',
                    }
                ]
            }
        }
    }

})