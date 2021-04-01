import Component from '../Component/index'
import Textbox from '../Textbox/index'
import TimePickerPopup from './TimePickerPopup'

class TimePicker extends Textbox {
  constructor(props, ...mixins) {
    const defaults = {
      allowClear: true,
      value: null,
      format: 'HH:mm:ss',
      hourStep: 0,
      minuteStep: 0,
      secondStep: 0,
      readOnly: true,
      placeholder: null,
      showNow: true,
      minTime: null,
      maxTime: null,
    }

    super(Component.extendProps(defaults, props), ...mixins)
  }

  _created() {
    super._created()
    this.defaultValue = this.props.value
    this.timeList = []

    this.confirm = false
    this.empty = !this.props.value

    this.minTime = {
      hour: '00',
      minute: '00',
      second: '00',
    }
    this.maxTime = {
      hour: '23',
      minute: '59',
      second: '59',
    }

    if (this.props.minTime) {
      const time = new Date(`2000 ${this.props.minTime}`)
      this.minTime = {
        hour: this.getDoubleDigit(time.getHours()),
        minute: this.getDoubleDigit(time.getMinutes()),
        second: this.getDoubleDigit(time.getSeconds()),
      }
    }
    if (this.props.maxTime) {
      const time = new Date(`2000 ${this.props.maxTime}`)
      this.maxTime = {
        hour: this.getDoubleDigit(time.getHours()),
        minute: this.getDoubleDigit(time.getMinutes()),
        second: this.getDoubleDigit(time.getSeconds()),
      }
    }

    this.time = {
      hour: '00',
      minute: '00',
      second: '00',
    }

    if (this.props.value) {
      const t = this.props.value.split(':')
      this.time.hour = t[0] || '00'
      this.time.minute = t[1] || '00'
      this.time.second = t[2] || '00'
    }

    this.defaultTime = this.time
    this.steps = {
      hour: true,
      minute: false,
      second: false,
    }
  }

  _config() {
    this.setProps({
      leftIcon: 'clock',
      rightIcon: {
        type: 'times',
        hidden: !this.props.allowClear,
        onClick: (args) => {
          this.clearTime()
          args.event && args.event.stopPropagation()
        },
      },
    })

    super._config()
  }

  _rendered() {
    const that = this
    this.popup = new TimePickerPopup({
      trigger: this.control,
      onHide: () => {
        if (this.confirm === false) {
          this.setValue(this.defaultValue)
          this.resetList()
        }
      },
      onShown: () => {
        this.confirm = false
        Object.keys(this.timeList).forEach(function (key) {
          that.timeList[key].scrollToKey()
        })
      },
    })
  }

  getHour() {
    const hour = []
    if (this.props.hourStep) {
      hour.push({
        children: '00',
      })
      for (let i = 0; i < 24; i++) {
        if ((i + 1) % this.props.hourStep === 0 && i !== 23) {
          if (i < 9) {
            hour.push({
              key: `0${i + 1}`,
              children: `0${i + 1}`,
            })
          } else {
            hour.push({
              key: `${i + 1}`,
              children: `${i + 1}`,
            })
          }
        }
      }
      return hour
    }
    for (let i = 0; i < 24; i++) {
      if (i < 10) {
        hour.push({
          key: `0${i}`,
          children: `0${i}`,
        })
      } else {
        hour.push({
          key: `${i}`,
          children: `${i}`,
        })
      }
    }
    return hour
  }

  getMinute() {
    const minute = []
    if (this.props.minuteStep) {
      minute.push({
        children: '00',
      })
      for (let i = 0; i < 60; i++) {
        if ((i + 1) % this.props.minuteStep === 0 && i !== 59) {
          if (i < 9) {
            minute.push({
              key: `0${i + 1}`,
              children: `0${i + 1}`,
            })
          } else {
            minute.push({
              key: `${i + 1}`,
              children: `${i + 1}`,
            })
          }
        }
      }
      return minute
    }
    for (let i = 0; i < 60; i++) {
      if (i < 10) {
        minute.push({
          key: `0${i}`,
          children: `0${i}`,
        })
      } else {
        minute.push({
          key: `${i}`,
          children: `${i}`,
        })
      }
    }
    return minute
  }

  getSecond() {
    const second = []
    if (this.props.secondStep) {
      second.push({
        children: '00',
      })
      for (let i = 0; i < 60; i++) {
        if ((i + 1) % this.props.secondStep === 0 && i !== 59) {
          if (i < 9) {
            second.push({
              key: `0${i + 1}`,
              children: `0${i + 1}`,
            })
          } else {
            second.push({
              key: `${i + 1}`,
              children: `${i + 1}`,
            })
          }
        }
      }
      return second
    }
    for (let i = 0; i < 60; i++) {
      if (i < 10) {
        second.push({
          key: `0${i}`,
          children: `0${i}`,
        })
      } else {
        second.push({
          key: `${i}`,
          children: `${i}`,
        })
      }
    }
    return second
  }

  adjustTime(data) {
    if (data.type === 'hour' && data.value === this.minTime.hour) {
      this.time.minute = this.minTime.minute
    }
  }

  setTime(data) {
    this.time[data.type] = data.value
    // if (data.type === 'hour') {
    //   this.steps.minute = true
    //   this.steps.second = false
    // }
    // if (data.type === 'minute') {
    //   this.steps.second = true
    // }
    this.checkTimeRange(data)

    const result = new Date(
      '2000',
      '01',
      '01',
      this.time.hour,
      this.time.minute,
      this.time.second,
    ).format(this.props.format)
    this.setValue(result)
  }

  resetList() {
    const that = this
    Object.keys(this.timeList).forEach(function (key) {
      that.timeList[key].resetTime()
    })
  }

  clearTime() {
    this.setValue(null)
    this.empty = true
    this.defaultValue = null
    this.time = {
      hour: '00',
      minute: '00',
      second: '00',
    }
    this.resetList()
    this.popup.hide()
  }

  setNow() {
    const c = new Date().format('HH:mm:ss')
    this.setValue(c.format(this.props.format))
    this.defaultValue = c
    const t = c.split(':')
    this.time.hour = t[0]
    this.time.minute = t[1]
    this.time.second = t[2]

    this.empty = false
    this.resetList()
  }

  handleChange() {
    this.props.onChange && this._callHandler(this.props.onChange)
  }

  showPopup() {
    this.popup.show()
  }

  getDoubleDigit(num) {
    if (num < 10) {
      return `0${num}`
    }
    return `${num}`
  }

  checkTimeRange(data) {
    const that = this
    if (data.type === 'hour') {
      this.timeList.minute.props.min = this.time.minute =
        data.value === this.minTime.hour ? this.minTime.minute : '00'
    }
    if (data.type === 'minute') {
      this.timeList.second.props.min = this.time.second =
        data.value === this.minTime.minute ? this.minTime.second : '00'
    }

    this.empty = false
    Object.keys(this.timeList).forEach(function (key) {
      that.timeList[key].refresh()
    })
  }
}

Component.register(TimePicker)
export default TimePicker
