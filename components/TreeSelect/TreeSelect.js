import Component from '../Component/index'
import Field from '../Field/index'
import Icon from '../Icon/index'
import { extend, isNullish, isString } from '../util/index'
import TreeSelectPopup from './TreeSelectPopup'

class TreeSelect extends Field {
  constructor(props, ...mixins) {
    super(Component.extendProps(TreeSelect.defaults, props), ...mixins)
  }

  _created() {
    super._created()
    this.items = []
    if (this.props.treeCheckable) {
      this.props.multiple = true
    }
    this.tempValue = this.props.value
  }

  _config() {
    this.getOptionsMap()
    const children = this._getContentChildren()
    this.setProps({
      control: {
        children,
      },
    })

    super._config()
  }

  _rendered() {
    this.popup = new TreeSelectPopup({
      trigger: this.control,
      nodeCheckable: this.props.multiple && this._getPopupNodeCheckable(),
      onShow: () => {
        if (!this.props.multiple) {
          this.tree.update({
            nodeSelectable: this._getPopupNodeSelectable(),
          })
        }
      },
    })

    this._valueChange({ newValue: this.currentValue })
  }

  // 存一份 {key: optionItem} 的数据
  getOptionsMap() {
    this.optionMap = this.getList()
  }

  // 树结构扁平化为数组数据
  getList() {
    const { treeDataFields } = this.props
    let { options } = this.props
    const optionMap = {}
    function mapTree(data, parentKey) {
      return data.forEach(function (item) {
        const _fieldKey = treeDataFields.key
        const _fieldText = treeDataFields.text
        const _parentKey = treeDataFields.parentKey

        optionMap[item[_fieldKey]] = {
          key: item[_fieldKey],
          [_fieldKey]: item[_fieldKey],
          [_fieldText]: item[_fieldText],
          [_parentKey]: parentKey,
        }
        if (item.children && item.children.length > 0) {
          mapTree(item.children, item[_fieldKey])
        }
      })
    }

    // popup中的tree组件，options从其中获取
    if (this.tree) {
      options = this.tree.getData()
    }

    mapTree(options)
    return optionMap
  }

  _getContentChildren() {
    const { showArrow, placeholder, allowClear } = this.props
    const that = this
    const children = []

    this._normalizeSearchable()

    // _content: 所选择的数据的展示
    children.push({
      classes: { 'nom-tree-select-content': true },
      _created() {
        that._content = this
      },
      children: this._getContentBadges(),
    })

    // placeholder
    if (isString(placeholder)) {
      children.push({
        _created() {
          that.placeholder = this
        },
        classes: { 'nom-tree-select-placeholder': true },
        children: placeholder,
      })
    }

    // 箭头
    if (showArrow) {
      children.push({
        component: Icon,
        type: 'down',
        classes: {
          'nom-tree-select-arrow': true,
        },
      })
    }

    if (allowClear) {
      children.push({
        component: Icon,
        type: 'times',
        classes: {
          'nom-tree-select-clear': true,
          'nom-field-clear-handler': true,
        },
        hidden: true,
        ref: (c) => {
          this.clearIcon = c
        },
        onClick: (args) => {
          this._setValue(null)
          this.props.allowClear && this.clearIcon.hide()
          this.popup && this.popup.animateHide()
          args.event && args.event.stopPropagation()
        },
      })
    }
    return children
  }

  _normalizeSearchable() {
    const { searchable } = this.props
    if (searchable) {
      this.setProps({
        searchable: Component.extendProps(
          {
            placeholder: null,
            filter: ({ inputValue, options }) => {
              if (!inputValue) return options
              const { key, text, parentKey } = this.props.treeDataFields

              // 1.先遍历一次 将结果符合搜索条件的结果(包含其祖先)放至 filteredMap中
              const reg = new RegExp(inputValue, 'i')
              const filteredMap = new Map()
              Object.entries(this.optionMap).forEach(([optKey, optValue]) => {
                // 判断输入关键字 和 option的text
                if (reg.test(optValue[text])) {
                  filteredMap.set(optKey, { ...optValue, __filterNode: true })
                  // 将搜索结果的祖先节点都加入 filteredMap 中
                  let optParentKey = optValue[parentKey]
                  while (optParentKey) {
                    const parent = this.optionMap[optParentKey]
                    // parent 符合搜索条件(已经在map中)则不重新 set
                    if (!filteredMap.get(optParentKey)) {
                      filteredMap.set(optParentKey, parent)
                    }
                    optParentKey = parent && parent[parentKey]
                  }
                }
              })

              // 从 filteredMap 中取出满足的options(包含祖先和孩子节点)的值
              function getFileterOptions(list) {
                const res = []
                list.forEach((opt) => {
                  const filterOpt = filteredMap.get(opt[key])
                  if (filterOpt) {
                    const obj = { ...opt }
                    if (filterOpt.__filterNode) obj.__filterNode = filterOpt.__filterNode
                    // 递归判断children
                    // 没有符合搜索条件的, 则直接使用原children
                    if (opt.children) {
                      const _children = getFileterOptions(opt.children)
                      obj.children = _children.length ? _children : opt.children
                    }
                    res.push(obj)
                  }
                })
                return res
              }

              return getFileterOptions(options)
            },
          },
          searchable,
        ),
      })
    }
  }

  _getContentBadges() {
    const { treeDataFields } = this.props
    if (!isNullish(this.currentValue) && !Array.isArray(this.currentValue)) {
      this.currentValue = [this.currentValue]
    }
    const { currentValue } = this
    const items = []
    const that = this
    if (currentValue && currentValue.length) {
      currentValue.forEach((curValue) => {
        const curOption = this.optionMap[curValue]
        if (curOption) {
          items.push({
            component: 'Tag',
            type: 'square',
            size: 'xs',
            text: curOption[treeDataFields.text],
            key: curOption[treeDataFields.key],
            removable:
              that.props.multiple &&
              function (param) {
                that._setValue(
                  currentValue.filter(function (k) {
                    return k !== param
                  }),
                )
              },
          })
        }
      })
    }
    return items
  }

  // 弹窗的nodeSelectable的配置
  _getPopupNodeSelectable() {
    const { multiple, treeSelectable } = this.props
    const { currentValue } = this
    if (multiple) return false

    return Component.extendProps({ onlyleaf: this.props.onlyleaf }, treeSelectable, {
      selectedNodeKey: currentValue && currentValue[0],
      onNodeSelect: ({ nodeData }) => {
        this._setValue([nodeData.key])
      },
    })
  }

  // 弹窗的nodeCheckable的配置
  _getPopupNodeCheckable() {
    const { multiple, treeCheckable } = this.props
    const { currentValue } = this

    if (!multiple && !treeCheckable) return false
    // 多选则展示复选框
    return Component.extendProps(treeCheckable, {
      checkedNodeKeys: currentValue,
      onCheckChange: () => {
        const checkedKeys = this.tree.getCheckedNodeKeys()
        this._setValue(checkedKeys)
      },
    })
  }

  _setValue(value, options) {
    this.tempValue = value
    if (options === false) {
      options = { triggerChange: false }
    } else {
      options = extend({ triggerChange: true }, options)
    }

    if (options.triggerChange) {
      this._onValueChange()
    }
    this._content.update({ children: this._getContentBadges() })

    // 多选: 每次setValue后更新选中状态
    if (this.props.multiple) {
      this.popup.update({
        nodeCheckable: this._getPopupNodeCheckable(),
      })
    } else {
      // 单选: 点击后即关闭popup,在onShow中更新
      this.popup.animateHide()
    }
  }

  // getValue时根据选中的节点返回
  _getValue() {
    if (this.props.multiple === false) {
      if (Array.isArray(this.tempValue)) {
        return this.tempValue[0]
      }
    }
    return this.tempValue
  }

  _valueChange(changed) {
    const { newValue } = changed
    // 空数组 || null || undefined
    const isNewValueClear = (Array.isArray(newValue) && !newValue.length) || isNullish(newValue)

    if (this.props.allowClear) {
      // newValue为空 ? icon隐藏 : 展示清空icon
      isNewValueClear ? this.clearIcon.hide() : this.clearIcon.show()
    }
    if (this.placeholder) {
      isNewValueClear ? this.placeholder.show() : this.placeholder.hide()
    }
  }
}

TreeSelect.defaults = {
  options: [],
  allowClear: false,
  placeholder: '请选择',
  // tree的select事件的配置
  treeSelectable: {},
  multiple: false,
  // 复选框模式，即为多选
  treeCheckable: false,
  treeDataFields: {
    key: 'value',
    text: 'text',
    children: 'children',
    parentKey: 'parentKey',
  },
  onlyleaf: false,
  showArrow: true,
}

Component.register(TreeSelect)

export default TreeSelect
