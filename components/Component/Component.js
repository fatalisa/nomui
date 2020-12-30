import { Events } from '../util/events'
import {
  extend,
  hyphenate,
  isFunction,
  isNumeric,
  isPlainObject,
  isString,
  normalizeKey,
} from '../util/index'
import ComponentDescriptor from './ComponentDescriptor'

const components = {}
const MIXINS = []

class Component {
  constructor(props, ...mixins) {
    const defaults = {
      tag: 'div',
      reference: document.body,
      placement: 'append',
      autoRender: true,

      hidden: false,
      disabled: false,
      selected: false,
      expanded: false,

      selectable: {
        byClick: false,
        byHover: false,
        canRevert: false,
        selectedProps: null,
        unselectedProps: null,
      },
      expandable: {
        byClick: false,
        byHover: false,
        target: null,
        expandedProps: false,
        collapsedProps: false,
      },
    }
    this.props = Component.extendProps(defaults, props)

    this.parent = null
    this.children = []
    this.root = null
    this.rendered = false
    this.scope = null
    this.refs = {}
    this.mixins = []
    this._scoped = false

    this._propStyleClasses = []

    mixins && this._mixin(mixins)

    if (this.props.key) {
      this.key = this.props.key
      if (isFunction(this.props.key)) {
        this.key = this.props.key.call(this)
      }
    }

    this.referenceComponent =
      this.props.reference instanceof Component
        ? this.props.reference
        : this.props.reference.component
    if (this.referenceComponent) {
      if (this.props.placement === 'append') {
        this.parent = this.referenceComponent
      } else {
        this.parent = this.referenceComponent.parent
      }
    }

    if (this.parent === null) {
      this.root = this
      this.scope = this.root
    } else {
      this.root = this.parent.root
      this.scope = this.parent._scoped ? this.parent : this.parent.scope
    }

    if (this.props.ref && this.scope) {
      this.scope.refs[this.props.ref] = this
    }

    if (this.props.methods) {
      for (const method in this.props.methods) {
        if (this.props.methods.hasOwnProperty(method)) {
          this[method] = this.props.methods[method]
        }
      }
    }

    this.componentType = this.__proto__.constructor.name
    this.referenceElement =
      this.props.reference instanceof Component
        ? this.props.reference.element
        : this.props.reference

    this.create()
    if (this.props.autoRender === true) {
      this.config()
      this.render()
    }
  }

  create() {
    this._onClickToggleExpand = this._onClickToggleExpand.bind(this)
    this._onClickToggleSelect = this._onClickToggleSelect.bind(this)
    this._onClickHandler = this._onClickHandler.bind(this)

    isFunction(this._create) && this._create()
    this._callMixin('_create')
    this.props._create && this.props._create.call(this)
  }

  config() {
    this.props._config && this.props._config.call(this)
    this._callMixin('_config')
    isFunction(this._config) && this._config()
    this._setExpandableProps()
    this._setStatusProps()
  }

  render() {
    if (this.rendered === true) {
      this.emptyChildren()
    } else {
      this._mountElement()
    }

    this._handleAttrs()
    this._handleStyles()
    this._handleEvents()

    this._renderChildren()

    this.props.disabled === true && isFunction(this._disable) && this._disable()
    this.props.selected === true && isFunction(this._select) && this._select()
    this.props.hidden === false && isFunction(this._show) && this._show()

    isFunction(this._render) && this._render()
    this._callMixin('_render')
    isFunction(this.props._render) && this.props._render.call(this)

    this.rendered = true
  }

  // todo: 需要优化，现在循环删除节点，太耗时，计划改成只移除本节点，子节点只做清理操作
  remove() {
    const el = this._removeCore()
    this.parent && this.parent.removeChild(this)
    el.parentNode.removeChild(el)
  }

  update(props) {
    this.setProps(props)
    this._off()
    this.off()
    this.config()
    this.render()
  }

  emptyChildren() {
    while (this.element.firstChild) {
      if (this.element.firstChild.component) {
        this.element.firstChild.component.remove()
      } else {
        this.element.removeChild(this.element.firstChild)
      }
    }
  }

  offsetWidth() {
    return this.element.offsetWidth
  }

  _mountElement() {
    const { placement } = this.props
    this.referenceElement =
      this.props.reference instanceof Component
        ? this.props.reference.element
        : this.props.reference
    this.element = document.createElement(this.props.tag)
    this.element.component = this
    if (placement === 'append') {
      this.referenceElement.appendChild(this.element)
    } else if (placement === 'replace') {
      if (this.referenceComponent) {
        this.referenceComponent._removeCore()
        this.parent && this.parent.replaceChild(this.referenceComponent, this)
      }
      this.referenceElement.parentNode.replaceChild(this.element, this.referenceElement)
    }
  }

  getComponent(componentOrElement) {
    return componentOrElement instanceof Component
      ? componentOrElement
      : componentOrElement.component
  }

  getElement(componentOrElement) {
    return componentOrElement instanceof Component ? componentOrElement.element : componentOrElement
  }

  _renderChildren() {
    const { children } = this.props
    if (Array.isArray(children)) {
      for (let i = 0; i < children.length; i++) {
        this.appendChild(children[i])
      }
    }
    else {
      this.appendChild(children)
    }
  }

  _removeCore() {
    this.emptyChildren()
    const el = this.element
    isFunction(this._remove) && this._remove()
    this._callMixin('_remove')
    this._off()
    this.off()

    for (const p in this) {
      if (this.hasOwnProperty(p)) {
        delete this[p]
      }
    }

    return el
  }

  _callMixin(hookType) {
    for (let i = 0; i < MIXINS.length; i++) {
      const mixin = MIXINS[i]
      mixin[hookType] && mixin[hookType].call(this)
    }
    for (let i = 0; i < this.mixins.length; i++) {
      const mixin = this.mixins[i]
      mixin[hookType] && mixin[hookType].call(this)
    }
  }

  removeChild(childInstance) {
    for (let i = 0; i < this.children.length; i++) {
      if (this.children[i] === childInstance) {
        delete this.children[i]
        this.children.splice(i, 1)
      }
    }
  }

  replaceChild(oldChild, newChild) {
    for (let i = 0; i < this.children.length; i++) {
      if (this.children[i] === oldChild) {
        delete this.children[i]
        this.children[i] = newChild
      }
    }
  }

  setProps(newProps) {
    this.props = Component.extendProps(this.props, newProps)
  }

  appendChild(child) {
    if (!child) {
      return
    }

    let childDefaults = this.props.childDefaults,
      childDefaultsProps = {},
      childDefaultsMixins = [],
      childProps = {},
      childMixins = [],
      props = {},
      mixins = []

    if (childDefaults) {
      if (isPlainObject(childDefaults)) {
        childDefaultsProps = childDefaults
      }
      else if (childDefaults instanceof ComponentDescriptor) {
        childDefaultsProps = childDefaults.getProps()
        childDefaultsMixins = childDefaults.mixins
      }
    }

    if (isPlainObject(child)) {
      childProps = child
    }
    else if (child instanceof ComponentDescriptor) {
      childProps = child.getProps()
      childMixins = child.mixins
    }
    else if (isString(child) || isNumeric(child)) {
      if (isPlainObject(childDefaults)) {
        childProps = { children: child }
      }
      else if (child[0] === '<') {
        this.element.innerHTML = child
        return
      }
      else {
        this.element.appendChild(document.createTextNode(child))
        return
      }
    }
    else if (child instanceof DocumentFragment) {
      this.element.appendChild(child)
      return
    }

    props = Component.extendProps({},
      childDefaultsProps, childProps,
      { reference: this.element, placement: 'append' })

    mixins = [...childDefaultsMixins, ...childMixins]

    this.children.push(Component.create(props, ...mixins))
  }

  disable() {
    if (!this.rendered || this.props.disabled === true) {
      return
    }

    this.props.disabled = true
    this.addClass('s-disabled')
    isFunction(this._disable) && this._disable()
  }

  enable() {
    if (!this.rendered || this.props.disabled === false) {
      return
    }

    this.props.disabled = false
    this.removeClass('s-disabled')
    isFunction(this._enable) && this._enable()
  }

  show() {
    if (!this.rendered) {
      this.setProps({ hidden: false })
      this.config()
      this.render()
      return
    }

    if (this.props.hidden === false) {
      return
    }

    this.props.hidden = false
    this.removeClass('s-hidden')
    isFunction(this._show) && this._show()
    this.trigger('show')
  }

  _triggerShow() {
    isFunction(this._show) && this._show()
    this.trigger('show')
  }

  hide() {
    if (!this.rendered || this.props.hidden === true) {
      return
    }

    this.props.hidden = true
    this.addClass('s-hidden')
    isFunction(this._hide) && this._hide()
    this.trigger('hide')
  }

  select(selectOption) {
    if (!this.rendered) {
      return
    }

    selectOption = extend(
      {
        triggerSelect: true,
        triggerSelectionChange: true,
      },
      selectOption,
    )
    if (this.props.selected === false) {
      this.props.selected = true
      this.addClass('s-selected')
      isFunction(this._select) && this._select()
      selectOption.triggerSelect === true && this.trigger('select')
      selectOption.triggerSelectionChange === true && this.trigger('selectionChange')

      return true
    }

    return false
  }

  unselect(unselectOption) {
    if (!this.rendered) {
      return
    }

    unselectOption = extend(
      {
        triggerUnselect: true,
        triggerSelectionChange: true,
      },
      unselectOption,
    )
    if (this.props.selected === true) {
      this.props.selected = false
      this.removeClass('s-selected')
      isFunction(this._unselect) && this._unselect()

      if (unselectOption.triggerUnselect === true) {
        this.trigger('unselect')
      }

      if (unselectOption.triggerSelectionChange === true) {
        this.trigger('selectionChange')
      }

      return true
    }

    return false
  }

  toggleSelect() {
    if (!this.rendered) return
    this.props.selected === true ? this.unselect() : this.select()
  }

  expand() {
    if (!this.rendered) return
    if (this.props.expanded === true) return

    this.props.expanded = true
    this.addClass('s-expanded')
    const expandTarget = this._getExpandTarget()
    if (expandTarget !== null && expandTarget !== undefined) {
      expandTarget.show()
    }
    const { expandedProps } = this.props.expandable
    if (expandedProps) {
      this.update(expandedProps)
    }
    isFunction(this._expand) && this._expand()
  }

  collapse() {
    if (!this.rendered) return
    if (this.props.expanded === false) return
    this.props.expanded = false
    this.removeClass('s-expanded')
    const expandTarget = this._getExpandTarget()
    if (expandTarget !== null && expandTarget !== undefined) {
      expandTarget.hide()
    }
    isFunction(this._collapse) && this._collapse()
    const { collapsedProps } = this.props.expandable
    if (collapsedProps) {
      this.update(collapsedProps)
    }
  }

  toggleExpand() {
    this.props.expanded === true ? this.collapse() : this.expand()
  }

  toggleHidden() {
    this.props.hidden === true ? this.show() : this.hide()
  }

  addClass(className) {
    this.element.classList.add(className)
  }

  removeClass(className) {
    this.element.classList.remove(className)
  }

  _setExpandableProps() {
    const { expandable } = this.props
    if (isPlainObject(expandable)) {
      if (this.props.expanded) {
        if (expandable.expandedProps) {
          this.setProps(expandable.expandedProps)
        }
      } else if (expandable.collapsedProps) {
        this.setProps(expandable.collapsedProps)
      }
    }
  }

  _setStatusProps() {
    const { props } = this

    this.setProps({
      classes: {
        's-disabled': props.disabled,
        's-selected': props.selected,
        's-hidden': props.hidden,
        's-expanded': props.expanded,
      },
    })
  }

  _getExpandTarget() {
    const { target } = this.props.expandable
    if (target === undefined || target === null) {
      return null
    }
    if (target instanceof Component) {
      return target
    }
    if (isString(target)) {
      return this.getScopedComponent(target)
    }
    if (isFunction(target)) {
      return target.call(this)
    }
  }

  getScopedComponent(name) {
    if (this.scope) {
      return this.scope.refs[name]
    }
  }

  getChildren() {
    const children = []
    for (let i = 0; i < this.element.childNodes.length; i++) {
      children.push(this.element.childNodes[i].component)
    }
    return children
  }

  _handleAttrs() {
    for (const name in this.props.attrs) {
      const value = this.props.attrs[name]
      if (value == null) continue
      if (name === 'style') {
        this._setStyle(value)
      } else if (name[0] === 'o' && name[1] === 'n') {
        this._on(name.slice(2), value)
      } else if (
        name !== 'list' &&
        name !== 'tagName' &&
        name !== 'form' &&
        name !== 'type' &&
        name !== 'size' &&
        name in this.element
      ) {
        this.element[name] = value == null ? '' : value
      } else {
        this.element.setAttribute(name, value)
      }
    }
  }

  _handleStyles() {
    const { props } = this

    const classes = []

    const componentTypeClasses = this._getComponentTypeClasses(this)
    for (let i = 0; i < componentTypeClasses.length; i++) {
      const componentTypeClass = componentTypeClasses[i]
      classes.push(`nom-${hyphenate(componentTypeClass)}`)
    }

    if (props.type) {
      this._propStyleClasses.push('type')
    }
    for (let i = 0; i < this._propStyleClasses.length; i++) {
      const modifier = this._propStyleClasses[i]
      const modifierVal = this.props[modifier]
      if (modifierVal !== null && modifierVal !== undefined) {
        if (modifierVal === true) {
          classes.push(`p-${hyphenate(modifier)}`)
        } else if (typeof modifierVal === 'string' || typeof modifierVal === 'number') {
          classes.push(`p-${hyphenate(modifier)}-${modifierVal}`)
        }
      }
    }

    if (isPlainObject(props.classes)) {
      for (const className in props.classes) {
        if (props.classes.hasOwnProperty(className) && props.classes[className] === true) {
          classes.push(className)
        }
      }
    }

    const { styles } = props
    if (isPlainObject(styles)) {
      addStylesClass(styles)
    }

    function addStylesClass(_styles, className) {
      className = className || ''
      if (isPlainObject(_styles)) {
        for (const style in _styles) {
          if (_styles.hasOwnProperty(style)) {
            addStylesClass(_styles[style], `${className}-${style}`)
          }
        }
      } else if (Array.isArray(_styles)) {
        for (let i = 0; i < _styles.length; i++) {
          if (isString(_styles[i])) {
            classes.push(`u${className}-${_styles[i]}`)
          }
        }
      } else if (isString(_styles)) {
        classes.push(`u${className}-${_styles}`)
      }
    }

    if (classes.length) {
      const classNames = classes.join(' ')
      this.element.setAttribute('class', classNames)
    }
  }

  _handleEvents() {
    const { props } = this
    const { events } = this.props
    for (const event in events) {
      if (events.hasOwnProperty(event)) {
        if (event === 'click') {
          this._on('click', this._onClickHandler)
        }
        this.on(event, events[event])
      }
    }

    if (props.selectable && props.selectable.byClick) {
      this._on('click', this._onClickToggleSelect)
    }

    if (props.expandable && props.expandable.byClick) {
      this._on('click', this._onClickToggleExpand)
    }
  }

  _onClickHandler(e) {
    this.trigger('click', e)
  }

  _onClickToggleSelect() {
    this.toggleSelect()
  }

  _onClickToggleExpand() {
    this.toggleExpand()
  }

  _setStyle(style) {
    const { element } = this
    if (typeof style !== 'object') {
      // New style is a string, let engine deal with patching.
      element.style.cssText = style
    } else {
      // `old` is missing or a string, `style` is an object.
      element.style.cssText = ''
      // Add new style properties
      for (const key in style) {
        const value = style[key]
        if (value != null) element.style.setProperty(normalizeKey(key), String(value))
      }
    }
  }

  _getComponentTypeClasses(instance) {
    const classArray = []
    let ctor = instance.constructor

    while (ctor && ctor.name !== 'Component') {
      classArray.unshift(ctor.name)
      ctor = ctor.__proto__.prototype.constructor
    }

    return classArray
  }

  _on(event, callback) {
    /* if (context) {
            callback = callback.bind(context)
        }
        else {
            callback = callback.bind(this)
        } */
    const cache = this.__htmlEvents || (this.__htmlEvents = {})
    const list = cache[event] || (cache[event] = [])
    list.push(callback)

    this.element.addEventListener(event, callback, false)
  }

  _off(event, callback) {
    let cache
    let i

    // No events, or removing *all* events.
    if (!(cache = this.__htmlEvents)) return this
    if (!(event || callback)) {
      for (const key in this.__htmlEvents) {
        if (this.__htmlEvents.hasOwnProperty(key)) {
          const _list = this.__htmlEvents[key]
          if (!_list) continue
          for (i = _list.length - 1; i >= 0; i -= 1) {
            this.element.removeEventListener(key, _list[i], false)
          }
        }
      }
      delete this.__htmlEvents
      return this
    }

    const list = cache[event]
    if (!list) return

    if (!callback) {
      delete cache[event]
      return
    }

    for (i = list.length - 1; i >= 0; i -= 1) {
      if (list[i] === callback) {
        list.splice(i, 1)
        this.element.removeEventListener(event, callback, false)
      }
    }
  }

  _trigger(eventName) {
    const event = new Event(eventName)
    this.element.dispatchEvent(event)
  }

  _mixin(mixins) {
    this.mixins = [...this.mixins, ...mixins]
  }

  static create(componentProps, ...mixins) {
    let componentType = componentProps.component
    if (isString(componentType)) {
      componentType = components[componentType]
    }

    if (componentType === undefined || componentType === null) {
      componentType = Component
    }

    return new componentType(componentProps, ...mixins)
  }

  static register(component) {
    components[component.name] = component
  }

  static extendProps(out) {
    out = out || {}

    for (let i = 1; i < arguments.length; i++) {
      const obj = arguments[i]

      if (!obj) continue

      for (const key in obj) {
        // Prevent Object.prototype pollution
        // Prevent never-ending loop
        if (key === '__proto__' || out === obj[key]) {
          continue
        }
        if (obj.hasOwnProperty(key) && isPlainObject(obj[key])) {
          out[key] = Component.extendProps(out[key], obj[key])
        } else if (obj[key] !== undefined) {
          out[key] = obj[key]
        }
      }
    }

    return out
  }

  static mixin(mixin) {
    MIXINS.push(mixin)
  }
}

Component.normalizeTemplateProps = function (props) {
  if (props === null || props === undefined) {
    return null
  }
  let templateProps = {}
  if (isString(props)) {
    templateProps.children = props
  } else {
    templateProps = props
  }

  return templateProps
}

Component.components = components
Component.mixins = MIXINS

Object.assign(Component.prototype, Events.prototype)

export function n(tagOrComponent, props, children, mixins) {
  return new ComponentDescriptor(tagOrComponent, props, children, mixins)
}

export default Component
