// pages/blog/blog.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    modelShow: false,
    blogList: []
  },

  onPublish() {
    // 先判断是否授权
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: (res) => {
              this.handleLoginSuccess({
                detail: res.userInfo
              })
            }
          })
        } else {
          this.setData({
            modelShow: true
          })
        }
      }
    })

  },
  handleLoginSuccess(userInfo) {
    const detail = userInfo.detail
    wx.navigateTo({
      url: `../blog-edit/blog-edit?nickName=${detail.nickName}&avatarUrl=${detail.avatarUrl}`,
    })
  },
  handleLoginFail() {
    wx.showModal({
      content: '',
      title: '授权才能发布',
    })
  },
  goDetail(event) {
    let blogid = event.target.dataset.blogid
    wx.navigateTo({
      url: `../../pages/blog-comment/blog-comment?blogId=${blogid}`,
    })
  },
  handleSearch(event) {
    let keyword = event.detail.keyword
    this.setData({
      blogList: []
    })
    this._loadBlogList(0, keyword)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._loadBlogList(0)
  },
  _loadBlogList(start, keyword = '') {
    wx.cloud.callFunction({
      name: 'blog',
      data: {
        keyword,
        $url: 'list',
        start: start,
        count: 5,
      }
    }).then((res) => {
      this.setData({
        blogList: this.data.blogList.concat(res.result)
      })
      wx.hideLoading({
        success: (res) => {},
      })
    })
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
    wx.showLoading({
      title: '刷新..',
    })
    this.setData({
      blogList: []
    })
    this._loadBlogList(0)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    wx.showLoading({
      title: '加载中',
    })
    this._loadBlogList(this.data.blogList.length)

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (event) {
    console.log(event)
    return {
      path:`/pages/blog-comment/blog-comment?blogId=${event.target.dataset.blogid}`
    }
  },

})