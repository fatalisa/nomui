import Component from '../Component/index'
import Field from '../Field/index'
import { extend } from '../util/index'
import Textarea from './Textarea'

class MultilineTextbox extends Field {
  constructor(props, ...mixins) {
    const defaults = {
      autofocus: false,
      autoSize: false, // boolean|{minRows:number,maxRows:number}
      placeholder: null,
      value: null,
      maxlength: null,
      rows: null,
      readonly: false,
    }

    super(Component.extendProps(defaults, props), ...mixins)
  }

  _config() {
    const that = this
    const { autoSize, value, placeholder, autofocus, readonly, rows } = this.props
    const maxlength = this.props.maxlength || this.props.maxLength

    this.setProps({
      control: {
        children: {
          component: Textarea,
          autoSize: readonly || autoSize,
          readonly,
          attrs: {
            value,
            placeholder,
            autofocus,
            rows,
            maxlength,
          },
          _created: function () {
            this.multilineTextbox = that
            this.multilineTextbox.textarea = this
          },
        },
      },
    })
    super._config()
  }

  getText() {
    return this.textarea.getText()
  }

  _getValue() {
    const inputText = this.getText()
    if (inputText === '') {
      return null
    }
    return inputText
  }

  _setValue(value, options) {
    if (options === false) {
      options = { triggerChange: false }
    } else {
      options = extend({ triggerChange: true }, options)
    }

    this.textarea.setText(value)
    const newValue = this.getValue()
    if (options.triggerChange) {
      if (newValue !== this.oldValue) {
        super._onValueChange()
      }
    }
    this.oldValue = this.currentValue
    this.currentValue = newValue
  }

  onblur() {
    this._callHandler(this.props.onBlur, { value: this.getValue() })
  }

  focus() {
    this.textarea.focus()
  }

  blur() {
    this.textarea.blur()
  }

  _disable() {
    this.textarea.disable()
  }

  _enable() {
    this.textarea.enable()
  }
}

Component.register(MultilineTextbox)

export default MultilineTextbox
