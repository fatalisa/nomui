import Component from '../Component/index'

class Dropdown extends Component {
  constructor(props, ...mixins) {
    super(Component.extendProps(Dropdown.defaults, props), ...mixins)
  }

  _created() {
    super._created()
    this.onClick = this.props.onClick
  }

  _config() {
    const that = this
    const { items, triggerAction, split, text, type, size } = this.props

    const children = [
      split && {
        component: 'Button',
        text: text,
        type: type,
        size: size,
        inline: type === 'link',
        onClick: (args) => {
          that._callHandler(that.onClick)
          args.event.stopPropagation()
        },
      },
      {
        component: 'Button',
        text: split ? null : that.props.text,
        rightIcon: that.props.rightIcon,
        type: type,
        size: size,
        inline: type === 'link',
        popup: {
          triggerAction: triggerAction,
          classes: {
            'nom-dropdown-popup': true,
          },
          ref: (c) => {
            that.popup = c
          },
          _rendered() {
            that.props.animate && that.initAnimation(this)
          },
          children: {
            component: 'Menu',
            itemDefaults: {
              size: size,
            },
            items: items,
          },
          onClick: (args) => {
            if (that.props.animate) {
              that.hideAnimation(args)
            } else {
              args.sender.hide()
            }
          },
        },
      },
    ]

    this.setProps({
      onClick: null,
      children: children,
      classes: {
        'nom-split-button': this.props.split,
      },
    })

    super._config()
  }

  initAnimation(that) {
    if (that.element.getAttribute('offset-y') !== '0') {
      this.props.animateName = 'bottom'
    } else {
      this.props.animateName = 'top'
    }
    that.addClass([`nom-dropdown-animate-${this.props.animateName}-show`])
  }

  hideAnimation(that) {
    this.popup.removeClass([`nom-dropdown-animate-${this.props.animateName}-show`])
    if (this.popup.element.getAttribute('offset-y') !== '0') {
      this.props.animateName = 'bottom'
    } else {
      this.props.animateName = 'top'
    }
    this.popup.addClass([`nom-dropdown-animate-${this.props.animateName}-hide`])
    setTimeout(() => {
      that.sender.hide()
      if (!this.popup.element) return false
      this.popup.removeClass([`nom-dropdown-animate-${this.props.animateName}-hide`])
      this.popup.addClass([`nom-dropdown-animate-${this.props.animateName}-show`])
    }, 160)
  }
}
Dropdown.defaults = {
  animateName: 'top',
  tag: 'span',
  triggerAction: 'click',
  rightIcon: 'down',
  split: false,
  onClick: null,
  items: [],
  size: null,
}
Component.register(Dropdown)

export default Dropdown
