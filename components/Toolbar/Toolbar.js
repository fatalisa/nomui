import Component from '../Component/index'

class Toolbar extends Component {
  constructor(props, ...mixins) {
    const defaults = {
      type: 'default',
      visibleItems: 2,
      gutter: 'sm',
      size: null,
      items: [],
    }

    super(Component.extendProps(defaults, props), ...mixins)
  }

  _config() {
    const { items, type, gutter, size, visibleItems } = this.props

    const before = items.slice(0, visibleItems).map((item) => {
      return {
        component: 'Button',
        type: type,
        size: size,
        ...item,
      }
    })
    const dropdowns = {
      component: 'Dropdown',
      rightIcon: 'ellipsis',
      items: items.slice(visibleItems),
      type: type,
      size: size,
    }

    this.setProps({
      children: {
        component: 'Cols',
        gutter: gutter,
        items: [...before, items.length > visibleItems && dropdowns],
      },
    })
  }
}

Component.register(Toolbar)

export default Toolbar
