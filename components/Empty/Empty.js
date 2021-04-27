import Component from '../Component/index'

class Empty extends Component {
  constructor(props, ...mixins) {
    const defaults = {
      description: '暂无数据',
      image: Empty.PRESENTED_IMAGE_DEFAULT,
      imageStyle: {},
    }

    super(Component.extendProps(defaults, props), ...mixins)
  }

  _config() {
    const { image, imageStyle, description } = this.props
    let imageNode = image
    if (typeof image === 'string' && !image.startsWith('#')) {
      imageNode = {
        tag: 'img',
        attrs: {
          src: image,
          alt: description,
        },
      }
    }

    const { children } = this.props

    this.setProps({
      classes: {
        [`nom-empty-normal`]: image === Empty.PRESENTED_IMAGE_SIMPLE,
      },
      children: [
        {
          classes: {
            [`nom-empty-image`]: true,
          },
          attrs: {
            style: imageStyle,
          },
          children: imageNode,
        },
        description
          ? {
              classes: {
                [`nom-empty-description`]: true,
              },
              children: description,
            }
          : undefined,
        children
          ? {
              classes: {
                [`nom-empty-footer`]: true,
              },
              children: children,
            }
          : undefined,
      ],
    })
  }
}

Empty.PRESENTED_IMAGE_SIMPLE = `#<svg t="1619148284824" class="nom-empty-img-simple"  width="64" height="64" viewBox="0 0 1351 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2122" width="200" height="200"><path d="M467.21267 479.648s2.688 2.688 8.096 2.688h393.44c2.688 0 5.376-2.688 8.096-2.688V358.4h409.6c-2.688-8.096-2.688-13.472-8.096-21.568L1014.25267 59.264H335.18067L71.08467 336.832c-5.376 2.688-8.096 10.784-8.096 21.568h409.6v121.248h-5.376z m-409.6-61.952v476.96c0 37.728 40.416 70.048 88.928 70.048h1053.632c48.512 0 88.928-32.352 88.928-70.048V412.288H936.07667v64.672c0 32.352-29.632 59.296-61.984 59.296h-393.44c-35.04 0-61.984-26.944-61.984-59.296v-64.672H62.95667v5.376zM1200.20467 1024H146.57267C65.74067 1024 1.06867 964.704 1.06867 894.656v-476.96c-2.688-48.512-2.688-94.304 29.632-123.968L313.64467 0h724.896l282.944 293.728c32.352 29.632 29.632 83.552 29.632 142.816v455.424C1345.74067 964.736 1278.34867 1024 1200.20467 1024z" p-id="2123" fill="#d9d9d9"></path></svg>`

Empty.PRESENTED_IMAGE_DEFAULT = `#<svg t="1619147741727" class="nom-empty-img-normal"  width="184" height="152" viewBox="0 0 1084 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4197" width="200" height="200"><path d="M0 933.456842a456.737684 85.342316 0 1 0 913.475368 0 456.737684 85.342316 0 1 0-913.475368 0Z" fill="#F5F5F7" fill-opacity=".8" p-id="4198"></path><path d="M822.130526 682.738526L660.944842 484.372211c-7.733895-9.337263-19.038316-14.989474-30.942316-14.989474h-346.543158c-11.897263 0-23.201684 5.652211-30.935579 14.989474L91.351579 682.738526v103.632842h730.778947V682.738526z" fill="#AEB8C2" p-id="4199"></path><path d="M775.390316 794.165895L634.543158 624.990316c-6.743579-8.131368-16.889263-12.577684-27.270737-12.577684H305.071158c-10.374737 0-20.527158 4.446316-27.270737 12.577684L136.953263 794.165895v92.914526h638.437053V794.165895z" fill="#000000" p-id="4200"></path><path d="M227.907368 213.355789h457.653895a26.947368 26.947368 0 0 1 26.947369 26.947369v628.843789a26.947368 26.947368 0 0 1-26.947369 26.947369H227.907368a26.947368 26.947368 0 0 1-26.947368-26.947369V240.303158a26.947368 26.947368 0 0 1 26.947368-26.947369z" fill="#F5F5F7" p-id="4201"></path><path d="M287.514947 280.407579h338.438737a13.473684 13.473684 0 0 1 13.473684 13.473684V462.012632a13.473684 13.473684 0 0 1-13.473684 13.473684H287.514947a13.473684 13.473684 0 0 1-13.473684-13.473684V293.881263a13.473684 13.473684 0 0 1 13.473684-13.473684z m1.765053 268.220632h334.908632a15.238737 15.238737 0 0 1 0 30.477473H289.28a15.238737 15.238737 0 0 1 0-30.477473z m0 79.245473h334.908632a15.245474 15.245474 0 0 1 0 30.484211H289.28a15.245474 15.245474 0 0 1 0-30.484211z m531.354947 293.066105c-5.221053 20.688842-23.558737 36.109474-45.372631 36.109474H138.206316c-21.813895 0-40.151579-15.427368-45.365895-36.109474a49.300211 49.300211 0 0 1-1.495579-12.058947V682.745263h177.300211c19.584 0 35.368421 16.491789 35.368421 36.513684v0.269474c0 20.015158 15.966316 36.176842 35.550315 36.176842h234.341053c19.584 0 35.550316-16.309895 35.550316-36.331789V719.292632c0-20.021895 15.784421-36.554105 35.368421-36.554106h177.30021v226.149053a49.381053 49.381053 0 0 1-1.488842 12.05221z" fill="#DCE0E6" p-id="4202"></path><path d="M842.920421 224.282947l-46.012632 17.852632a6.736842 6.736842 0 0 1-8.872421-8.286316l13.049264-41.815579c-17.441684-19.833263-27.681684-44.018526-27.681685-70.117052C773.402947 54.581895 841.566316 0 925.655579 0 1009.724632 0 1077.894737 54.581895 1077.894737 121.916632c0 67.334737-68.163368 121.916632-152.245895 121.916631-30.504421 0-58.906947-7.181474-82.728421-19.550316z" fill="#DCE0E6" p-id="4203"></path><path d="M985.626947 106.004211c10.597053 0 19.193263 8.488421 19.193264 18.96421s-8.596211 18.964211-19.193264 18.964211c-10.597053 0-19.193263-8.488421-19.193263-18.964211s8.596211-18.964211 19.193263-18.96421z m-119.619368 2.371368l18.863158 33.185684h-38.386526l19.523368-33.185684z m76.43621 0v33.185684h-33.583157v-33.185684h33.583157z" fill="#FFFFFF" p-id="4204"></path></svg>`

Component.register(Empty)

export default Empty