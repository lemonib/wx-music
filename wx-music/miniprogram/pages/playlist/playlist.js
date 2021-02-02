// pages/playlist/playlist.js
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperImgUrls: [],
    playlist: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._getSwiper()
    this._getPlaylist()
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
    this.setData({
      playlist : []
    })
    this._getPlaylist()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this._getPlaylist()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  _getPlaylist() {
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud.callFunction({
      name: 'music',
      data: {
        $url: 'getPlayList',
        start: this.data.playlist.length,
        count: 15
      }
    }).then((res) => {
      // console.log(res)
      this.setData({
        playlist:  this.data.playlist.concat(res.result.data)
      })
      // 阻止刷新完后出现加载的三个点
      wx.stopPullDownRefresh({
        success: (res) => {},
      })
      wx.hideLoading()
    })
  },
  _getSwiper(){
    db.collection('swiper').get().then((res)=>{
      this.setData({
        swiperImgUrls: res.data
      })
    })
  }
})