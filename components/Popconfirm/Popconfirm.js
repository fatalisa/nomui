import Component from '../Component/index'
import Popup from '../Popup/index'
import { isString } from '../util/index'

class Popconfirm extends Popup {
  constructor(props, ...mixins) {
    super(Component.extendProps(Popconfirm.defaults, props), ...mixins)
  }

  _config() {
    const that = this

    const { content, okText, cancelText, icon } = this.props
    this.setProps({
      children: {
        attrs: {
          style: {
            'max-width': '350px',
            padding: '15px',
          },
        },
        children: {
          component: 'Rows',
          items: [
            {
              component: 'Cols',
              items: [
                {
                  component: 'Icon',
                  type: icon,
                  attrs: {
                    style: {
                      'font-size': '2.5rem',
                      color: '#fa0',
                    },
                  },
                },
                { children: isString(content) ? content : content() },
              ],
            },
            {
              component: 'Cols',
              justify: 'end',
              gutter: 'sm',
              items: [
                {
                  component: 'Button',
                  type: 'primary',

                  text: okText,
                  onClick: () => {
                    that._handleOk()
                  },
                },
                {
                  component: 'Button',
                  text: cancelText,

                  onClick: () => {
                    that._handleCancel()
                  },
                },
              ],
            },
          ],
        },
      },
    })
    super._config()
  }

  _handleOk() {
    this._callHandler(this.props.onConfirm)
    this.props.animate && this.hideAnimation()
    !this.props.animate && this.hide()
  }

  _handleCancel() {
    this.props.animate && this.hideAnimation()
    !this.props.animate && this.hide()
  }

  hideAnimation() {
    this.addClass('nom-layer-animate-hide')
    setTimeout(() => {
      this.hide()
    }, 90)
  }
}
Popconfirm.defaults = {
  triggerAction: 'click',
  closeOnClickOutside: false,
  content: null,
  onConfirm: null,
  okText: '是',
  cancelText: '否',
  icon: 'info-circle',
  align: 'top left',
}
Component.mixin({
  _rendered: function () {
    if (this.props.popconfirm) {
      if (isString(this.props.popconfirm)) {
        this.popconfirm = new Popconfirm({ trigger: this, children: this.props.popconfirm })
      } else {
        this.popconfirm = new Popconfirm(
          Component.extendProps({}, this.props.popconfirm, {
            trigger: this,
          }),
        )
      }
    }
  },
})

Component.register(Popconfirm)

export default Popconfirm
