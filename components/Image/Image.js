import Component from '../Component/index'
import { isNumeric } from '../util/index'

class Image extends Component {
  constructor(props, ...mixins) {
    super(Component.extendProps(Image.defaults, props), ...mixins)
  }

  _created() {}

  _config() {
    const { alt, width, height, iconWidth, iconHeight } = this.props
    const size = this.sizeComputing(iconWidth, iconHeight)
    this.setProps({
      children: [
        {
          component: 'Icon',
          ref: (c) => {
            this.pendingRef = c
          },
          classes: {
            'nom-image-pending': true,
          },
          type: 'image-pending',
          attrs: {
            style: {
              width: isNumeric(iconWidth) ? `${iconWidth}px` : '200px',
              height: isNumeric(iconHeight) ? `${iconHeight}px` : '100px',
              'font-size': `${size}rem`,
            },
          },
        },
        {
          tag: 'img',
          ref: (c) => {
            this.imgRef = c
          },
          hidden: true,
          attrs: {
            alt,
            style: {
              width: isNumeric(width) ? `${width}px` : width,
              height: isNumeric(height) ? `${height}px` : height,
            },
          },
        },
      ],
    })
  }

  sizeComputing(val1, val2) {
    val1 = val1 || 200
    val2 = val2 || 100
    if (val1 > val2) {
      return parseInt(val2 / 22, 10)
    }
    return parseInt(val1 / 22, 10)
  }

  loadImageAsync(url) {
    return new Promise((resolve, reject) => {
      const image = this.imgRef.element
      image.onload = () => resolve(url)
      image.onerror = () => reject()
      this.imgRef.element.src = url
    })
  }

  dealImageList(urlList) {
    let success = false
    return new Promise((resolve, reject) => {
      const queueNext = (url) => {
        return this.loadImageAsync(url).then(() => {
          success = true
          resolve(url)
        })
      }

      const firstPromise = queueNext(urlList.shift() || '')

      // 生成一条promise链[队列]，每一个promise都跟着catch方法处理当前promise的失败
      // 从而继续下一个promise的处理
      urlList
        .reduce((p, url) => {
          return p.catch(() => {
            if (!success) return queueNext(url)
          })
        }, firstPromise)
        // 全都挂了 reject
        .catch(reject)
    })
  }

  _rendered() {
    let urlList = []
    if (!Array.isArray(this.props.src)) {
      urlList = [this.props.src]
    } else {
      urlList = this.props.src
    }
    this.dealImageList(urlList)
      .then(() => {
        this.pendingRef.remove()
        this.imgRef.show()
      })
      .catch(() => {
        this.pendingRef.update({
          classes: {
            'nom-image-fail': true,
          },
          type: 'image-fail',
        })
        this.imgRef.remove()
      })
  }
}
Image.defaults = {
  src: null,
  alt: null,
  width: null,
  height: null,
  iconWidth: null,
  iconHeight: null,
}

Component.register(Image)

export default Image
