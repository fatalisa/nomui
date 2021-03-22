import Component from '../Component/index'
import Layer from '../Layer/index'

class GridSettingPopup extends Layer {
  constructor(props, ...mixins) {
    const defaults = {}

    super(Component.extendProps(defaults, props), ...mixins)
  }

  _created() {
    super._created()
    this.grid = this.props.grid
    this.tree = null
  }

  _config() {
    const that = this

    this.setProps({
      classes: {
        'nom-grid-setting-panel': true,
      },
      styles: {
        shadow: 'sm',
        rounded: 'md',
      },

      children: {
        component: 'Panel',
        uistyle: 'card',
        fit: true,
        header: {
          caption: {
            title: '列设置',
          },
        },
        body: {
          children: {
            component: 'Tree',
            showline: true,
            treeData: that.grid.originColumns,
            selectedNodes: that.grid.props.visibleColumns
              ? that.getMappedColumns(that.grid.props.visibleColumns)
              : that.grid.getMappedColumns(),
            multiple: true,
            leafOnly: false,
            sortable: true,
            ref: (c) => {
              this.tree = c
            },
            fields: {
              title: 'title',
              value: 'key',
            },
          },
        },
        footer: {
          children: {
            component: 'Cols',
            gutter: 'sm',
            items: [
              {
                component: 'Button',
                text: '确定',
                onClick: function () {
                  const list = that.tree.getSelectedTree()
                  that.update({
                    treeData: list,
                  })

                  that.grid.handleColumnsSetting(list)
                },
              },
              {
                component: 'Button',
                text: '取消',
                onClick: () => {
                  this.hide()
                },
              },
            ],
          },
        },
      },
    })

    super._config()
  }

  _rendered() {
    const wh = window.innerHeight
    const mh = this.element.offsetHeight
    if (mh + 50 > wh) {
      this.element.style.height = `${wh - 100}px`
    }
  }

  getMappedColumns(param) {
    const arr = []
    function mapColumns(data) {
      data.forEach(function (item) {
        if (item.children) {
          mapColumns(item.children)
        }
        arr.push(item.key)
      })
    }
    mapColumns(param)
    return arr
  }
}

Component.register(GridSettingPopup)

export default GridSettingPopup