import Component from '../Component/index'

class Th extends Component {
  constructor(props, ...mixins) {
    const defaults = {
      tag: 'th',
      column: {},
      sortDirection: null,
    }

    super(Component.extendProps(defaults, props), ...mixins)
  }

  _created() {
    this.tr = this.parent
    this.table = this.tr.table
    this.resizer = null
  }

  _config() {
    const that = this
    let sortIcon = 'sort'
    if (this.props.column.sortDirection === 'asc') {
      sortIcon = 'sort-up'
    }

    if (this.props.column.sortDirection === 'desc') {
      sortIcon = 'sort-down'
    }

    const children = [
      {
        tag: 'span',
        children: this.props.column.header || this.props.column.title,
      },
      this.props.column.sortable &&
        this.props.column.colSpan > 0 && {
          component: 'Icon',
          type: sortIcon,
          onClick: function () {
            that.onSortChange()
          },
        },
      that.table.hasGrid &&
        that.table.grid.props.allowFrozenCols && {
          component: 'Icon',
          type: 'pin',
          onClick: function () {
            // that.table.grid.handlePinClick(that.props.column)
          },
        },
      that.table.hasGrid &&
        that.table.grid.props.resizable &&
        this.props.column.colSpan === 1 &&
        this.props.column.width && {
          component: 'Icon',
          ref: (c) => {
            that.resizer = c
          },
          type: 'resize-handler',
          classes: { 'nom-table-resize-handler': true },
          onClick: function () {
            // that.table.grid.handlePinClick(that.props.column)
          },
        },
    ]

    this.setProps({
      children: children,
      classes: {
        'nom-table-fixed-left': this.props.column.fixed === 'left',
        'nom-table-fixed-left-last': this.props.column.lastLeft,
        'nom-table-fixed-right': this.props.column.fixed === 'right',
        'nom-table-fixed-right-first': this.props.column.firstRight,
        'nom-table-parent-th': this.props.column.colSpan > 1,
        'nom-table-leaf-th': this.props.column.colSpan === 1,
      },
      attrs: {
        colspan: this.props.column.colSpan,
        rowspan: this.props.column.rowSpan,
      },
    })
  }

  _rendered() {
    if (this.props.column.fixed === 'left') {
      this._setStyle({ left: `${this.element.offsetLeft}px` })
    } else if (this.props.column.fixed === 'right') {
      this._setStyle({
        right: `${
          this.parent.element.offsetWidth - this.element.offsetLeft - this.element.offsetWidth
        }px`,
      })
    }

    this.resizer && this.handleResize()
  }

  handleResize() {
    const resizer = this.resizer.element
    const that = this

    resizer.onmousedown = function (evt) {
      const startX = evt.clientX
      document.onmousemove = function (e) {
        const endX = e.clientX
        const moveLen = endX - startX
        that.table.grid.resizeCol({
          field: that.props.column.field,
          distance: moveLen,
        })
      }
    }
    document.onmouseup = function () {
      document.onmousemove = null
    }
  }

  onSortChange() {
    const that = this
    if (that.props.column.sortDirection === 'asc') {
      that.update({
        column: { ...that.props.column, ...{ sortDirection: 'desc' } },
      })
    } else if (that.props.column.sortDirection === 'desc') {
      that.update({
        column: { ...that.props.column, ...{ sortDirection: null } },
      })
    } else {
      that.update({
        column: { ...that.props.column, ...{ sortDirection: 'asc' } },
      })
    }
    that.table.grid.handleSort(that.props.column)
  }
}

Component.register(Th)

export default Th
