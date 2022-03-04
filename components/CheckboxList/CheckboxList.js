import Component from '../Component/index'
import Field from '../Field/index'
import { extend, isString } from '../util/index'
import List from './DefaultOptionList'

class CheckboxList extends Field {
  constructor(props, ...mixins) {
    super(Component.extendProps(CheckboxList.defaults, props), ...mixins)
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
        cols: this.props.cols,
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

  getUnselectedOptions() {
    return this.optionList.getUnselectedItems()
  }

  hideOption(value, alsoUnselect = true) {
    this.optionList.hideItem(value)
    if (alsoUnselect === true) {
      this.optionList.unselectItem(value)
    }
  }

  showOption(value) {
    this.optionList.showItem(value)
  }

  _getValue(options) {
    const { valueOptions } = this.props
    options = extend(
      {
        asArray: true,
      },
      valueOptions,
      options,
    )

    const selected = this.getSelectedOptions()
    if (selected !== null && Array.isArray(selected) && selected.length > 0) {
      const vals = selected.map(function (item) {
        return item.props.value
      })

      return options.asArray ? vals : vals.join(',')
    }

    return null
  }

  _getValueText(options, value) {
    const selected =
      value !== undefined ? this._getOptionsByValue(value) : this.getSelectedOptions()
    if (selected !== null && Array.isArray(selected) && selected.length > 0) {
      const vals = selected.map(function (item) {
        return item.props ? item.props.text : item.text
      })

      return vals
    }

    return null
  }

  _setValue(value, options) {
    const { valueOptions } = this.props
    if (options === false) {
      options = { triggerChange: false }
    } else {
      options = extend({ triggerChange: true }, valueOptions, options)
    }

    if (value === null) {
      this.optionList.unselectAllItems({ triggerSelectionChange: options.triggerChange })
    }

    if (options.asArray === false && isString(value)) {
      value = value.split(',')
    }

    const _that = this
    const optionsArry = []
    this.props.options.forEach((ele) => {
      optionsArry.push(ele.value)
    })
    Array.isArray(value) &&
      value.forEach((ele) => {
        if (optionsArry.includes(ele)) {
          _that.optionList.selectItem(ele, { triggerSelectionChange: options.triggerChange })
        }
      })
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

  _getOptionsByValue(value) {
    let retOptions = null
    const { options } = this.props
    if (Array.isArray(value)) {
      retOptions = []
      for (let i = 0; i < options.length; i++) {
        if (value.indexOf(options[i].value) !== -1) {
          retOptions.push(options[i])
        }
      }
    }
    return retOptions
  }
}

CheckboxList.defaults = {
  options: [],
  valueOptions: {
    asArray: true,
  },
}

Component.register(CheckboxList)

export default CheckboxList
