// components/playlist/playlist.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    playlist: {
      type: Object
    }
  },
  observers: {
    // 监听对象变化的值
    ['playlist.trackCount'](val) {

      this.setData({
        _count: this._tranNum(val, 2)
      })
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    _count: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
     _tranNum(val, point) {
      let numStr = val.toString().split('.')[0]
      if (numStr.length < 6) {
        return numStr
      } else if (numStr.length >= 6 && numStr.length < 8) {
        let decemal = numStr.substring(numStr.length - 4, numStr.length)
        return parseInt(numStr / 1000) + '万'
      } else if (numStr.length > 8) {
        let decemal = numStr.substring(numStr.length - 8, numStr.length - 8 + point)
        return parseInt(numStr / 1000000) + '亿'
      }
    },
    gotoMusicList(){
      wx.navigateTo({
        url: `../../pages/musiclist/musiclist?playlistId=${this.properties.playlist.id}`,
      })
    }
  }
})