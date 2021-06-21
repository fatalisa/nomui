import Component from '../Component/index'
import { extend, isFunction, isPlainObject } from '../util/index'
import ListItemWrapper from './ListItemWrapper'

class ListContent extends Component {
  constructor(props, ...mixins) {
    const defaults = {
      tag: 'ul',
    }

    super(Component.extendProps(defaults, props), ...mixins)
  }

  _created() {
    this.list = this.parent
    this.list.content = this
  }

  _config() {
    this._addPropStyle('gutter', 'line', 'align', 'justify', 'cols')
    const { items, wrappers, wrapperDefaults, virtual, data, itemRender } = this.list.props
    const children = []

    if (Array.isArray(data) && data.length > 0) {
      let realItemRender = itemRender
      if (!isFunction(itemRender)) {
        realItemRender = ({ itemData }) => {
          return {
            children: itemData,
          }
        }
      }
      for (let i = 0; i < data.length; i++) {
        const itemData = data[i]
        let itemProps = realItemRender({ itemData, list: this.list })
        if (!isPlainObject(itemProps)) {
          itemProps = {}
        }
        children.push({ component: ListItemWrapper, item: itemProps, data: itemData })
      }
    } else if (Array.isArray(wrappers) && wrappers.length > 0) {
      for (let i = 0; i < wrappers.length; i++) {
        let wrapper = wrappers[i]
        wrapper = Component.extendProps(
          {},
          { component: ListItemWrapper },
          wrapperDefaults,
          wrapper,
        )
        children.push(wrapper)
      }
    } else if (Array.isArray(items) && items.length > 0) {
      for (let i = 0; i < items.length; i++) {
        if (
          this.list.props.disabledItems.length &&
          this.list.props.disabledItems.includes(items[i].key)
        ) {
          children.push({ component: ListItemWrapper, item: items[i], disabled: true })
        } else {
          children.push({ component: ListItemWrapper, item: items[i] })
        }
      }
    }

    // 开启虚拟列表功能
    if ((virtual === true || typeof virtual === 'number') && children.length !== 0) {
      this.list.virtual.listData = children
      this.setProps({
        classes: {
          'nom-virtual-list-content': true,
        },
        children: this.list.virGetList(this.list.virVisibleData()),
        childDefaults: wrapperDefaults,
      })
      // if (this.list.virtual.selectedItems) {
      //   clearTimeout(this.list.virtual.selectedTimer)
      //   this.list.virtual.selectedTimer = setTimeout(() => {
      //     const arry = this.list.virtual.selectedItems.map((item) => {
      //       return item.value
      //     })
      //     console.log(arry)
      //     this.list.selectItems(arry, {
      //       triggerSelect: false,
      //       triggerSelectionChange: false,
      //     })
      //   }, 500)
      // }
    } else {
      this.setProps({
        children: children,
        childDefaults: wrapperDefaults,
      })
    }
  }

  getItem(param) {
    let retItem = null

    if (param instanceof Component) {
      return param
    }

    if (isFunction(param)) {
      for (const key in this.itemRefs) {
        if (this.itemRefs.hasOwnProperty(key)) {
          if (param.call(this.itemRefs[key]) === true) {
            retItem = this.itemRefs[key]
            break
          }
        }
      }
    } else {
      return this.itemRefs[param]
    }

    return retItem
  }

  selectItem(param, selectOption) {
    const item = this.getItem(param)

    item && item.select(selectOption)
  }

  selectItems(param, selectOption) {
    selectOption = extend(
      {
        triggerSelect: true,
        triggerSelectionChange: true,
      },
      selectOption,
    )
    let itemSelectionChanged = false
    param = Array.isArray(param) ? param : [param]
    for (let i = 0; i < param.length; i++) {
      itemSelectionChanged =
        this.selectItem(param[i], {
          triggerSelect: selectOption.triggerSelect,
          triggerSelectionChange: false,
        }) || itemSelectionChanged
    }
    if (selectOption.triggerSelectionChange === true && itemSelectionChanged) {
      this._onItemSelectionChange()
    }
    return itemSelectionChanged
  }

  selectAllItems(selectOption) {
    return this.selectItems(this.getChildren(), selectOption)
  }

  unselectItem(param, unselectOption) {
    unselectOption = extend(
      {
        triggerUnselect: true,
        triggerSelectionChange: true,
      },
      unselectOption,
    )
    const item = this.getItem(param)
    item && item.unselect(unselectOption)
  }

  unselectItems(param, unselectOption) {
    unselectOption = extend(
      {
        triggerUnselect: true,
        triggerSelectionChange: true,
      },
      unselectOption,
    )
    let itemSelectionChanged = false
    if (Array.isArray(param)) {
      for (let i = 0; i < param.length; i++) {
        itemSelectionChanged =
          this.unselectItem(param[i], {
            triggerUnselect: unselectOption.triggerUnselect,
            triggerSelectionChange: false,
          }) || itemSelectionChanged
      }
    }
    if (unselectOption.triggerSelectionChange && itemSelectionChanged) {
      this._onItemSelectionChange()
    }
    return itemSelectionChanged
  }

  unselectAllItems(unselectOption) {
    return this.unselectItems(this.getAllItems(), unselectOption)
  }

  getAllItems() {
    const items = []
    const children = this.getChildren()
    for (let i = 0; i < children.length; i++) {
      const itemWrapper = children[i]
      items.push(itemWrapper.item)
    }
    return items
  }

  _onItemSelectionChange() {
    this._callHandler(this.props.onItemSelectionChange)
  }

  getSelectedItem() {
    return this.selectedItem
  }

  getSelectedItems() {
    const selectedItems = []
    const children = this.getChildren()
    for (let i = 0; i < children.length; i++) {
      const { item } = children[i]
      if (item.props.selected) {
        selectedItems.push(item)
      }
    }
    return selectedItems
  }

  appendItem(itemProps) {
    itemProps = Component.extendProps({}, this.props.itemDefaults, itemProps)
    const itemWrapperProps = { component: ListItemWrapper, item: itemProps }
    this.appendChild(itemWrapperProps)
  }

  removeItem(param) {
    const item = this.getItem(param)
    if (item !== null) {
      item.wrapper.remove()
    }
  }

  removeItems(param) {
    if (Array.isArray(param)) {
      for (let i = 0; i < param.length; i++) {
        this.removeItem(param[i])
      }
    }
  }
}

Component.register(ListContent)

export default ListContent
