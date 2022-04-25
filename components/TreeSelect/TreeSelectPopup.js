import Component from '../Component/index'
import Layout from '../Layout/index'
import Popup from '../Popup/index'
import Textbox from '../Textbox/index'
import { clone } from '../util/index'

class TreeSelectPopup extends Popup {
  constructor(props, ...mixins) {
    const defaults = {}

    super(Component.extendProps(defaults, props), ...mixins)
  }

  _created() {
    super._created()
    this.selectControl = this.opener.parent.parent
  }

  _config() {
    const that = this
    const { nodeSelectable, nodeCheckable } = that.props

    const { searchable, options, treeDataFields, flatOptions, multiple } = this.selectControl.props

    this.setProps({
      attrs: {
        style: {
          width: `${this.selectControl.control.offsetWidth()}px`,
        },
      },
      children: {
        component: Layout,
        header: searchable
          ? {
              children: {
                component: Textbox,
                placeholder: searchable.placeholder,
                _created: (inst) => {
                  this.selectControl.searchBox = inst
                },
                onValueChange: ({ newValue }) => {
                  this.timer && clearTimeout(this.timer)
                  this.timer = setTimeout(() => {
                    const loading = new nomui.Loading({
                      container: this.selectControl.tree.parent,
                    })
                    const result = searchable.filter({
                      inputValue: newValue,
                      options: options,
                    })
                    if (result && result.then) {
                      return result
                        .then((value) => {
                          this.selectControl.tree.update({ data: value })
                          // 更新 optionsMap
                          this.selectControl.getOptionsMap()
                          loading && loading.remove()
                        })
                        .catch(() => {
                          loading && loading.remove()
                        })
                    }
                    loading && loading.remove()

                    result && this.selectControl.tree.update({ data: result })
                  }, 300)
                },
              },
            }
          : null,
        body: {
          children: {
            component: 'Tree',
            expandable: {
              byIndicator: true,
            },
            data: clone(options),
            dataFields: treeDataFields,
            flatData: flatOptions,
            multiple,
            nodeSelectable,
            nodeCheckable,
            _created: function () {
              that.selectControl.tree = this
            },
          },
        },
      },
    })

    super._config()
  }

  animateHide() {
    let animateName
    if (this.element.getAttribute('offset-y') !== '0') {
      animateName = 'nom-tree-select-animate-bottom-hide'
    } else {
      animateName = 'nom-tree-select-animate-top-hide'
    }
    this.addClass(animateName)
    setTimeout(() => {
      this.hide()
      this.removeClass(animateName)
    }, 120)
  }

  _rendered() {
    if (this.element.getAttribute('offset-y') !== '0') {
      this.element.classList.add('nom-tree-select-animate-bottom-show')
    } else {
      this.element.classList.add('nom-tree-select-animate-top-show')
    }
  }

  _show() {
    super._show()
    this.selectControl.searchBox && this.selectControl.searchBox.focus()
  }
}

Component.register(TreeSelectPopup)

export default TreeSelectPopup
