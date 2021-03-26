import Component from '../Component/index'
import Field from '../Field/index'
import List from './DefaultOptionList'
import { extend } from '../util/index'

class CheckboxList extends Field {
  constructor(props, ...mixins) {
    const defaults = {
      options: [],
    }

    super(Component.extendProps(defaults, props), ...mixins)
  }

  _config() {
    this.setProps({
      optionDefaults: {
        key: function () {
          return this.props.value
        },
      },
    })

    this.setProps({
      optionList: {
        component: List,
      },
    })

    this.setProps({
      control: this.props.optionList,
    })

    super._config()
  }

  getSelectedOptions() {
    return this.optionList.getSelectedItems()
  }

  _getValue() {
    const selected = this.getSelectedOptions()
    if (selected !== null && Array.isArray(selected)) {
      const vals = selected.map(function (item) {
        return item.props.value
      })

      return vals
    }

    return null
  }

  _getValueText() {
    const selected = this.getSelectedOptions()
    if (selected !== null && Array.isArray(selected)) {
      const vals = selected.map(function (item) {
        return item.props.text
      })

      return vals
    }

    return null
  }

  _setValue(value, options) {
    if (options === false) {
      options = { triggerChange: false }
    } else {
      options = extend({ triggerChange: true }, options)
    }

    if (value === null) {
      this.optionList.unselectAllItems({ triggerSelectionChange: options.triggerChange })
    }
    this.optionList.selectItem(
      function () {
        return this.props.value === value
      },
      { triggerSelectionChange: options.triggerChange },
    )
  }

  _disable() {
    if (this.firstRender === false) {
      this.optionList.disable()
    }
  }

  _enable() {
    if (this.firstRender === false) {
      this.optionList.enable()
    }
  }
}

Component.register(CheckboxList)

export default CheckboxList
