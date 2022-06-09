import Component from '../Component/index'
import Textbox from '../Textbox/index'
import { isFunction } from '../util/index'
import AutoCompletePopup from './AutoCompletePopup'

class AutoComplete extends Textbox {
  constructor(props, ...mixins) {
    super(Component.extendProps(AutoComplete.defaults, props), ...mixins)
    this._init.bind(this)
    this._handleSearch.bind(this)
    this._doSearch.bind(this)
  }

  _created() {
    super._created()
    this.placeholder = this.props.placeholder
    this.capsLock = false
    this.searchMode = false
    this.clearContent = true
  }

  _rendered() {
    const { searchable } = this.props
    !searchable && this.input && this._init()
    const { options } = this.props

    this.popup = new AutoCompletePopup({
      trigger: this.control,
      options,
      onShow: () => {
        if (this.optionList) {
          this.optionList.update({
            selectedItems: this.getValue(),
          })
          this.optionList.scrollToSelected()
        }
      },
    })
  }

  _remove() {
    this.timer && clearTimeout(this.timer)
  }

  _config() {
    const autoCompleteRef = this
    const { allowClear, options } = this.props
    this._normalizeSearchable()
    if (allowClear && this.currentValue) {
      this.setProps({
        clearProps: {
          component: 'Icon',
          type: 'close',
          ref: (c) => {
            this.clearIcon = c
          },
          classes: {
            'nom-auto-complete-clear': true,
            'nom-field-clear-handler': true,
          },
          onClick: ({ event }) => {
            event.stopPropagation()
            autoCompleteRef.clear()
            this.clearIcon.hide()
            autoCompleteRef.popup && autoCompleteRef.popup.hide()
          },
        },
      })
    }

    if (options && this.popup) {
      this.popup.update({ options, hidden: false })
    }

    super._config()
  }

  _init() {
    const autoComplete = this

    this.input.element.addEventListener('focus', function () {
      autoComplete.currentValue = this.value
      if (autoComplete.clearContent) {
        this.placeholder = this.value
        this.value = ''
      } else {
        autoComplete.clearContent = true
      }
      autoComplete.popup && autoComplete.popup.update({ options: autoComplete.props.options })
    })
    this.input.element.addEventListener('input', function () {
      if (!autoComplete.capsLock) {
        autoComplete._handleSearch(this.value)
      }
    })
    this.input.element.addEventListener('blur', function () {
      // 没有输入则需重置,此动作只能在blur事件而非change事件中进行
      if (!autoComplete.searchMode) {
        // 重置
        this.value = autoComplete.currentValue
      }
      this.placeholder = autoComplete.placeholder || ''
      autoComplete.searchMode = false
    })
    this.input.element.addEventListener('compositionstart', function () {
      autoComplete.capsLock = true
    })
    this.input.element.addEventListener('compositionend', function () {
      autoComplete.capsLock = false
      autoComplete._handleSearch(this.value)
    })
  }

  _getValue() {
    return super._getValue()
  }

  _setValue(value, options) {
    super._setValue(value, options)
  }

  getSelectedOption() {
    const { value, options, fieldName } = this.props
    let selected = options.find(({ value: v }) => value === v)
    if (selected) return selected

    selected = { value }
    if (Array.isArray(fieldName)) {
      fieldName.forEach((field) => {
        if (field !== 'value') selected[field] = null
      })
    }
    return selected
  }

  _valueChange(changed) {
    changed.newValue
      ? this.props.allowClear && this.clearIcon.show()
      : this.props.allowClear && this.clearIcon.hide()
  }

  blur() {
    super.blur()
  }

  focus() {
    this.clearContent = false
    super.focus()
  }

  _isFocus() {
    if (!this.input) return false
    return document.activeElement === this.input.element
  }

  _handleSearch(txt) {
    const autoComplete = this
    const { debounce, interval } = this.props
    // 防抖
    this.timer && clearTimeout(this.timer)
    if (debounce) {
      this.timer = setTimeout(function () {
        autoComplete._doSearch(txt)
      }, interval)
    } else {
      autoComplete._doSearch(txt)
    }
  }

  _doSearch(txt) {
    this.searchMode = true
    const { onSearch, filterOption, options } = this.props

    isFunction(filterOption) && this.popup.update({ options: filterOption(txt, options) })
    isFunction(onSearch) && onSearch({ text: txt, sender: this })
  }

  _normalizeSearchable() {
    const { searchable, onSearch } = this.props
    if (searchable) {
      this.setProps({
        searchable: Component.extendProps(
          {
            placeholder: null,
            onSearch,
          },
          searchable,
        ),
      })
    }
  }
}

AutoComplete.defaults = {
  options: [],
  debounce: true,
  interval: 300,
  filterOption: (value, options) => options.filter((o) => o.value.toString().includes(value)),
  allowClear: true,
  fieldName: null,
}

Component.register(AutoComplete)

export default AutoComplete
