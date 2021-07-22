import Component from '../Component/index'
import List from '../List/index'

class Pager extends Component {
  constructor(props, ...mixins) {
    super(Component.extendProps(Pager.defaults, props), ...mixins)
  }

  _config() {
    const pager = this

    this.setProps({
      children: {
        component: 'Cols',
        justify: 'between',
        items: [
          {
            component: List,
            gutter: 'md',
            items: pager.getPageItems(),
            itemDefaults: {
              tag: 'a',
              key() {
                return this.props.pageNumber
              },
              _config: function () {
                this.setProps({
                  children: `${this.props.text}`,
                })
              },
            },
            itemSelectable: {
              byClick: true,
            },
            selectedItems: pager.props.pageIndex,
            onItemSelectionChange: function (e) {
              const n = e.sender.selectedItem.props.pageNumber

              if (n < 1) {
                pager.props.pageIndex = 1
              } else if (n > pager._getPageCount()) {
                pager.props.pageIndex = pager._getPageCount()
              } else {
                pager.props.pageIndex = n
              }

              pager._onPageChange()
            },
          },
          {
            component: 'Cols',
            gutter: 'xs',
            items: [
              {
                children: `共有数据${this.props.totalCount}条`,
              },
              !pager.props.simple && {
                component: 'Select',
                showSearch: false,
                value: pager.props.pageSize || 10,
                onValueChange: (data) => {
                  pager.props.pageSize = data.newValue
                  pager.props.pageIndex = 1
                  pager._onPageChange(true)
                },
                allowClear: false,
                options: [
                  {
                    text: '10条/页',
                    value: 10,
                  },
                  {
                    text: '20条/页',
                    value: 20,
                  },
                  {
                    text: '30条/页',
                    value: 30,
                  },
                  {
                    text: '40条/页',
                    value: 40,
                  },
                  {
                    text: '50条/页',
                    value: 50,
                  },
                ],
              },
            ],
          },
        ],
      },
    })
  }

  _onPageChange(pageSizeChanged) {
    const params = this.getPageParams()
    if (pageSizeChanged) {
      params.pageIndex = 1
    }
    this._callHandler(this.props.onPageChange, params)
  }

  /**
   * 极端分页的起始和结束点，取决于pageIndex 和 displayItemCount.
   * @返回 {数组(Array)}
   */
  _getInterval() {
    const { props } = this
    const { pageIndex } = props
    const displayItemHalf = Math.floor(props.displayItemCount / 2)
    const pageCount = this._getPageCount()
    const upperLimit = pageCount - props.displayItemCount
    const start =
      pageIndex > displayItemHalf
        ? Math.max(Math.min(pageIndex - displayItemHalf, upperLimit), 1)
        : 1
    const end =
      pageIndex > displayItemHalf
        ? Math.min(pageIndex + displayItemHalf, pageCount)
        : Math.min(props.displayItemCount, pageCount)
    return [start, end]
  }

  _getPageCount() {
    return Math.ceil(this.props.totalCount / this.props.pageSize)
  }

  getPageParams() {
    return this.props.getPageParams.call(this)
  }

  getPageItems() {
    const items = []
    const { props } = this
    if (props.totalCount === 0) {
      return items
    }
    const { pageIndex } = props
    const pageCount = this._getPageCount()

    // 产生"Previous"-链接
    if (props.texts.prev && (pageIndex > 1 || props.prevShowAlways)) {
      items.push({
        pageNumber: pageIndex - 1,
        text: props.texts.prev,
        disabled: pageIndex <= 1,
        classes: { prev: true },
      })
    }

    this._getMiddleItems(items, pageCount)

    // 产生 "Next"-链接
    if (props.texts.next && (pageIndex < pageCount || props.nextShowAlways)) {
      items.push({
        pageNumber: pageIndex + 1,
        text: props.texts.next,
        disabled: pageIndex >= pageCount,
        classes: { next: true },
      })
    }

    return items
  }

  // 获取中间的页面展示
  _getMiddleItems(items, pageCount) {
    const { props } = this
    const interval = this._getInterval()
    // 简洁模式则不需要中间的页码
    if (!props.simple) {
      // 产生起始点
      if (interval[0] > 1 && props.edgeItemCount > 0) {
        const end = Math.min(props.edgeItemCount, interval[0] - 1)
        for (let i = 1; i <= end; i++) {
          items.push({
            pageNumber: i,
            text: i,
            classes: '',
          })
        }
        if (props.edgeItemCount < interval[0] - 1 && props.texts.ellipse) {
          items.push({
            pageNumber: interval[0] - 1,
            text: props.texts.ellipse,
            classes: { space: true },
            space: true,
          })
        }
      }

      // 产生内部的那些链接
      for (let i = interval[0]; i <= interval[1]; i++) {
        items.push({
          pageNumber: i,
          text: i,
          classes: '',
        })
      }
      // 产生结束点
      if (interval[1] < pageCount && props.edgeItemCount > 0) {
        if (pageCount - props.edgeItemCount > interval[1] && props.texts.ellipse) {
          items.push({
            pageNumber: interval[1] + 1,
            text: props.texts.ellipse,
            classes: { space: true },
            space: true,
          })
        }
        const begin = Math.max(pageCount - props.edgeItemCount + 1, interval[1])
        for (let i = begin; i <= pageCount; i++) {
          items.push({
            pageNumber: i,
            text: i,
            classes: '',
          })
        }
      }
    } else {
      items.push({
        pageNumber: props.pageIndex,
        text: `${props.pageIndex}/${pageCount}`,
        classes: '',
      })
    }
  }
}

Pager.defaults = {
  pageIndex: 1,
  pageSize: 10,
  totalCount: 0,
  displayItemCount: 5,
  edgeItemCount: 1,

  simple: false, // 简洁模式，只展示总数和上一页，下一页按钮
  prevShowAlways: true,
  nextShowAlways: true,

  texts: {
    prev: '上一页',
    next: '下一页',
    ellipse: '...',
  },

  getPageParams: function () {
    const { pageIndex, pageSize } = this.props
    let params = {}
    if (this.props.paramsType === 'skiptake') {
      params = {
        skipCount: (pageIndex - 1) * pageSize,
        maxResultCount: pageSize,
      }
    } else {
      params = {
        pageIndex: pageIndex,
        pageSize: pageSize,
      }
    }

    return params
  },
}

Component.register(Pager)

export default Pager
