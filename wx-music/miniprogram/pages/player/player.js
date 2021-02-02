// pages/player/player.js

let musiclist = []
let nowPlayingIndex = 0
const app = getApp()
// 全局唯一的
const AudioManager = wx.getBackgroundAudioManager()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    picUrl: '',
    isPlaying: false,
    isLyricShow: false,
    isSame: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    musiclist = wx.getStorageSync('musiclist')
    nowPlayingIndex = options.index
    this._loadMusicDeatail(options.musicId)
  },

  _loadMusicDeatail(musicId) {
    if (musicId !== app.getPlayingMusicId()) {
      this.setData({
        isSame: false
      })
    } else {
      this.setData({
        isSame: true
      })
    }
    // 设置全局变量
    app.setPlayingMusicId(musicId)
    wx.showLoading({
      title: 'wait...',
    })
    let music = musiclist[nowPlayingIndex]
    wx.setNavigationBarTitle({
      title: music.name,
    })

    this.setData({
      picUrl: music.al.picUrl
    })
    wx.cloud.callFunction({
      name: 'music',
      data: {
        musicId,
        $url: 'musicURL',

      }
    }).then((res) => {
      let result = res.result.data
      if (result[0].url == null) {
        wx.showToast({
          title: '你选中了vip歌曲，听不了的',
        })
        return
      }
      if (!this.data.isSame) {
        AudioManager.title = music.name
        AudioManager.src = result[0].url
        AudioManager.coverImgUrl = music.al.picUrl
        AudioManager.singer = music.ar[0].name
        AudioManager.epname = music.al.name
        //
        this.savePlayHistory()
      }
      this.setData({
        isPlaying: true,
      })
      wx.hideLoading({
        success: (res) => {},
      })
      // 加载歌词
      wx.cloud.callFunction({
        name: 'music',
        data: {
          musicId,
          $url: 'lyric',
        }
      }).then((res) => {
        let lyric = '暂无歌词'
        let lrc = res.result.lrc
        if (lrc) {
          lyric = lrc.lyric
        }
        this.setData({
          lyric
        })
      })
    })
  },
  handleTimeUpdate(event) {
    // 定义update需要先定义好
    this.selectComponent('.lyric').update(event.detail.currentTime)
  },
  togglePlaying() {
    if (this.data.isPlaying) {
      AudioManager.pause()
    } else {
      AudioManager.play()
    }
    this.setData({
      isPlaying: !this.data.isPlaying
    })

  },
  handleMusicEnd() {
    this.onNext()
  },
  handleMusicPlay() {
    this.setData({
      isPlaying: true
    })
  },
  handleMusicPause() {
    this.setData({
      isPlaying: false
    })
  },
  onPrev() {
    AudioManager.stop()
    nowPlayingIndex--
    if (nowPlayingIndex < 0) {
      nowPlayingIndex = musiclist.length - 1
    }
    this._loadMusicDeatail(musiclist[nowPlayingIndex].id)

  },
  onNext() {
    AudioManager.stop()
    nowPlayingIndex++

    if (nowPlayingIndex >= musiclist.length) {
      nowPlayingIndex = 0
    }
    this._loadMusicDeatail(musiclist[nowPlayingIndex].id)
  },
  onChangeLyricShow() {
    this.setData({
      isLyricShow: !this.data.isLyricShow
    })
  },
  savePlayHistory() {
    const music = musiclist[nowPlayingIndex]
    const openid = app.globalData.openid
    const history = wx.getStorageSync(openid)
    let bHave = false
    for (let i = 0; i < history.length; i++) {
      if (history[i].id === music.id) {
        bHave = true
        break
      }
    }
    if (!bHave) {
      history.unshift(music)
      console.log(history)
      wx.setStorageSync(openid, history)
     
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})