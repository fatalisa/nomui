class ComponentDescriptor {
  constructor(tagOrComponent, props, children, mixins) {
    this.tagOrComponent = tagOrComponent
    this.props = props || {} // todo:处理 props 是 ComponentDescriptor 对象的情况
    this.children = children
    this.mixins = Array.isArray(mixins) ? mixins : []
  }

  getProps() {
    if (this.props instanceof ComponentDescriptor) {
      this.mixins = this.mixins.concat(this.props.mixins)
      this.props = this.props.getProps()
    }
    if (this.tagOrComponent) {
      this.props.component = this.tagOrComponent
    }
    if (this.children) {
      this.props.children = this.children
    }
    return this.props
  }
}

export default ComponentDescriptor