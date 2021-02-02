//app.js
App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        env: 'test-music-0gtfar1b7a37b325',
        // 在云开发控制台中显示用户记录
        traceUser: true,
      })
    }
    // 全局属性、方法
    this.globalData = {
      playingMusicId: -1,
      openid: -1
    }
    this.getOpenId()
  },
  onShow: function(options){
    console.log(options)
  },
  setPlayingMusicId(id) {
    this.globalData.playingMusicId = id
  },
  getPlayingMusicId() {
    return this.globalData.playingMusicId
  },
  getOpenId() {
    wx.cloud.callFunction({
      name: 'login'
    }).then((res) => {
      let openId = res.result.openid
      this.globalData.openid = openId
      if (wx.getStorageSync(openId) == '') {
        wx.setStorageSync(openId, [])
      }
    })
  }
})