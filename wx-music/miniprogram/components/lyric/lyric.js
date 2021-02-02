// components/lyric/lyric.js
let lyricHight = 0
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isLyricShow: {
      type: Boolean,
      value: false
    },
    lyric: String
  },

  /**
   * 组件的初始数据
   */
  data: {
    nowLyricIndex: 0,
    lrcList: [],
    scrollTop: 0
  },
  observers: {
    lyric(newdata) {
      if (newdata == '暂无歌词') {
        this.setData({
          lrcList: [{
            lrc,
            time: 0
          }],
          nowLyricIndex: -1
        })
      } else {
        this._parserLyric(newdata)
      }

    }
  },
  /**
   * 组件的方法列表
   */
  lifetimes: {
    ready() {
      // 750px
      wx.getSystemInfo({
        success: (result) => {
          // 求出1rpx的大小
          lyricHight = parseInt(result.screenHeight / 750 * 64)
        },
      })
    }
  },
  methods: {
    _parserLyric(lyric) {
      console.log('times')
      let line = lyric.split('\n')
      let _lrcList = []
      line.forEach(element => {
        let time = element.match(/\[(\d{2,}):(\d{2})(?:\.(\d{2,3}))?]/g)
        if (time != null) {
          let lrc = element.split(time)[1]
          let timeReg = time[0].match(/(\d{2,}):(\d{2})(?:\.(\d{2,3}))?/)
          // time -> s
          let timeSec = parseInt(timeReg[1]) * 60 + parseInt(timeReg[2]) + parseInt(timeReg[3]) / 1000
          _lrcList.push({
            timeSec,
            lrc
          })
        }
      });
      this.setData({
        lrcList: _lrcList
      })
    },
    update(currentTime) {
      let lrcList = this.data.lrcList
      if (lrcList.length === 0) {
        return
      }
      console.log(this.data.scrollTop)
      // if (currentTime > lrcList[lrcList.length - 1].time) {
      //   if (this.data.nowLyricIndex != -1) {
      //     this.setData({
      //       nowLyricIndex: -1,
      //       scrollTop: lrcList * lyricHight
      //     })
      //   }
      // }
      for (let i = 0; i < lrcList.length; i++) {
        if (currentTime <= lrcList[i].timeSec) {
          this.setData({
            nowLyricIndex: i - 1,
            scrollTop: (i - 1)  * lyricHight
          })
          break
        }
      }
    }
  },

})