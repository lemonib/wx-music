// components/musiclist/musiclist.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    musiclist: Array
  },

  /**
   * 组件的初始数据
   */
  data: {
    playingId: -1,
  },
  lifetimes: {
    attached: function () {
      // 在组件实例进入页面节点树时执行
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
    },
  },
  pageLifetimes:{
    show(){
      this.setData({
        playingId: parseInt(app.getPlayingMusicId())
      })
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    onSelect(event) {
      let musicId = event.currentTarget.dataset.musicid
      let index = event.currentTarget.dataset.index
      this.setData({
        playingId: musicId
      })
      wx.navigateTo({
        url: `../../pages/player/player?musicId=${musicId}&index=${index}`,
      })
    }
  }
})