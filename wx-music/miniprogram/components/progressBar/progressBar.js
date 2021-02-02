// components/progressBar/progressBar.js

let movableAreaWidth = 0
let movableViweWidth = 0
const AudioManager = wx.getBackgroundAudioManager()
let currentSec = -1
let dragFlag = false
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isSame:Boolean
  },

  /**
   * 组件的初始数据
   */
  data: {
    showTime: {
      currentTime: '00:00',
      totalTime: '00:00'
    },
    movableDis: 0,
    progress: 0
  },
  lifetimes: {
    ready() {
      if(this.properties.isSame && this.data.showTime.totalTime==="00:00"){
        this.setData({
          ['showTime.totalTime']: this._dateFormat(AudioManager.duration)
        })
      }
      this._getMovabelDis()
      this._bindBGMEvent()
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    onChange(event) {
      if (event.detail.source == 'touch') {
        dragFlag = true
        // 只改变数据 不修改ui
        this.data.progress = event.detail.x / (movableAreaWidth - movableViweWidth) * 100
        this.data.movableDis = event.detail.x
        this.setData({
          ['showTime.currentTime']: this._dateFormat(Math.floor(event.detail.x / (movableAreaWidth - movableViweWidth)  * AudioManager.duration))
        })
       
      }
    },
    onTouchend() {
      this.setData({
        progress: this.data.progress,
        movableDis: this.data.movableDis,
      })
      AudioManager.seek(this.data.progress * AudioManager.duration / 100)
      dragFlag = false
    },
    _getMovabelDis() {
      const query = this.createSelectorQuery()
      query.select(".movable-area").boundingClientRect()
      query.select(".movable-view").boundingClientRect()
      query.exec((rect) => {
        movableAreaWidth = rect[0].width
        movableViweWidth = rect[1].width
      })
    },
    _bindBGMEvent() {
      AudioManager.onPlay(() => {
        dragFlag = false
        this.triggerEvent('musicPlay')
      })
      AudioManager.onStop(() => {

      })
      AudioManager.onPause(() => {
        this.triggerEvent('musicPause')
      })
      AudioManager.onWaiting(() => {

      })
      AudioManager.onCanplay(() => {
        if (AudioManager.duration !== undefined) {
          this.setData({
            ['showTime.totalTime']: this._dateFormat(AudioManager.duration)
          })
        } else {
          setTimeout(() => {
            this.setData({
              ['showTime.totalTime']: this._dateFormat(AudioManager.duration)
            })
          }, 1000)
        }


      })
      AudioManager.onTimeUpdate(() => {
        const currentTime = AudioManager.currentTime
        const duration = AudioManager.duration
        const currentFormat = this._dateFormat(currentTime)
        const sec = currentTime.toString().split('.')[0]
        if (sec != currentSec && !dragFlag) {
          this.setData({
            ['showTime.currentTime']: currentFormat,
            movableDis: movableAreaWidth * currentTime / duration,
            progress: currentTime / duration * 100
          })
          currentSec = sec
        }
         // 联动歌词
        this.triggerEvent('timeUpdate',{currentTime})
      })
      AudioManager.onEnded(() => {
        // 组件通信
        this.triggerEvent('musicEnd')
      })
      AudioManager.onError((err) => {
        wx.showToast({
          title: '错误' + err.errMsg + err.errCode,
        })
      })
    },
    _dateFormat(time) {
      const min = Math.floor(time / 60)
      const sec = Math.floor(time % 60)
      return this._padStart(min) + ':' + this._padStart(sec)
    },
    _padStart(num) {
      return num < 10 ? '0' + num : num
    },

  }
})