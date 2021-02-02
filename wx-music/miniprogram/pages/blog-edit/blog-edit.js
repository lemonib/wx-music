// pages/blog-edit/blog-edit.js
const MAX_IMG_COUNT = 9
const db = wx.cloud.database()
let content = ''
let userInfo = {}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wordNum: 0,
    footerBottom: 0,
    images: [],

  },
  onInput(event) {
    let wordNum = event.detail.cursor
    if (wordNum >= 50) {
      wordNum = '最大字数为50'
    }
    this.setData({
      wordNum: wordNum
    })
    content = event.detail.value
  },
  onFocus(event) {
    this.setData({
      footerBottom: event.detail.height
    })
  },
  onBlur() {
    this.setData({
      footerBottom: 0
    })
  },
  onPriewImg(event) {
    let src = event.target.dataset.src
    wx.previewImage({
      urls: this.data.images,
      current: src
    })
  },
  selectPhoto() {
    let max = MAX_IMG_COUNT - this.data.images.length
    wx.chooseImage({
      count: max,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        console.log(res.tempFilePaths)
        this.setData({
          images: this.data.images.concat(res.tempFilePaths)
        })
      }
    })
  },
  deletePhoto(event) {
    let index = event.target.dataset.index
    this.data.images.splice(index, 1)
    this.setData({
      images: this.data.images
    })
  },
  send() {
    if (content.trim() === '') {
      wx.showModal({
        title: '没有内容，不许发',
      })
      return
    }
    wx.showLoading({
      title: '上传中',
      mask: true
    })
    // 1. 图片上传 API每次只能存储一张图片
    let promiseArr = []
    let fileIds = []
    for (let i = 0; i < this.data.images.length; i++) {
      let p = new Promise((resolve, reject) => {
        let item = this.data.images[i]
        let suffix = /\.\w+$/.exec(item)[0]
        wx.cloud.uploadFile({
          cloudPath: 'blog/' + Date.now() + '-' + parseInt(Math.random() * 10000) + suffix,
          filePath: item,
          success: ((res) => {
            fileIds = fileIds.concat(res.fileID)
            resolve()
          }),
          fail: ((err) => {
            console.log('err')
            reject(err)
          })
        })
      })
      promiseArr.push(p)
    }
    // 2. 存入到数据库中
    Promise.all(promiseArr).then((res) => {
      console.log('ok?')
      db.collection('blog').add({
        data:{
          ...userInfo,
          content,
          img: fileIds,
          createTime: db.serverDate()
        }
      }).then((res) => {
        wx.hideLoading({
          success: (res) => {},
        })
        wx.showToast({
          title: '发布成功',
        })
        // 返回并刷新
        wx.navigateBack()
        const pages = getCurrentPages()
        // 取到上一个界面
        const prevPage = pages[pages.length -2 ]
        prevPage.onPullDownRefresh()
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    userInfo = options
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