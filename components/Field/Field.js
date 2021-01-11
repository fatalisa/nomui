import Component from '../Component/index'
import FieldControl from './FieldControl'
import FieldLabel from './FieldLabel'

class Field extends Component {
  constructor(props, ...mixins) {
    const defaults = {
      label: null,
      labelAlign: 'right',
      invalidTipAlign: 'top right',
      control: {},
      value: null,
    }

    super(Component.extendProps(defaults, props), ...mixins)
  }

  _create() {
    this.form = this.parent
  }

  _config() {
    this._propStyleClasses = ['required', 'requiredMark', 'labelAlign']
    const { label } = this.props
    const hasLabel = label !== null && label !== undefined

    if (!hasLabel) {
      this.props.labelAlign = null
    }

    this.on('valueChange', function (changed) {
      this.form.trigger('valueChange', changed)
    })

    this.setProps({
      required: this.props.control.required,
      requiredMark: this.form.props.requiredMark,
      children: [
        hasLabel && { component: FieldLabel },
        { component: FieldControl, value: this.props.value },
      ],
    })
  }

  getValue() {
    if (this.control.getValue) {
      return this.control.getValue()
    }

    return null
  }

  setValue(value) {
    if (this.control.setValue) {
      this.control.setValue(value)
    }
  }

  validate() {
    if (this.control.validate) {
      return this.control.validate()
    }

    return true
  }

  focus() {
    this.control.focus && this.control.focus()
  }

  blur() {
    this.control.blur && this.control.blur()
  }
}

Component.register(Field)

export default Field
