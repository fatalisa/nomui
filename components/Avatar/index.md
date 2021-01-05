# API

| 参数  | 说明                             | 类型      | 默认值  |
| ----- | -------------------------------- | --------- | ------- | ------ | --- | ---- | ------- |
| alt   | 图像无法显示时的替代文本         | `string`  | -       |
| gap   | 字符类型距离左右两侧边界单位像素 | `number`  | 4       |
| icon  | 设置头像的自定义图标             | `string`  | -       |
| shape | 指定头像的形状                   | `circle   | square` | circle |
| size  | 设置头像的大小                   | `number   | xs      | sm     | lg  | xl ` | default |
| src   | 图片类头像的资源地址或者图片元素 | `string ` | -       |
| text  | 头像显示的内容                   | `string ` | -       |

> Tip：优先级 src > icon > text