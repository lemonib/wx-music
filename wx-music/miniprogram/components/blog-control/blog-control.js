// components/blog-control/blog-control.js
let userInfo = {}
const db = wx.cloud.database()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    blogId: String,
    blog: Object
  },

  /**
   * 组件的初始数据
   */
  data: {
    loginShow: false,
    bottomModel: false,
    content: ''
  },
  options: {
    // 解除组件样式隔离
    styleIsolation: 'apply-shared',
    multipleSlots: true
  },
  /**
   * 组件的方法列表
   */
  methods: {
    onComment() {
      // 判断是否授权
      wx.getSetting({
        success: (res) => {
          if (res.authSetting['scope.userInfo']) {
            wx.getUserInfo({
              success: (res) => {
                userInfo = res.userInfo
                this.setData({
                  bottomModel: true
                })
              }
            })
          } else {
            this.setData({
              loginShow: true
            })
          }
        }
      })
    },
    handleLoginSuccess(event) {
      userInfo = event.detail
      // 关闭授权框
      // 开启评论框
      this.setData({
        loginShow: false
      }, () => {
        this.setData({
          bottomModel: true
        })
      })
    },
    handleLoginFail() {
      wx.showModal({
        content: '',
        title: '授权才能发布',
      })
    },
    onInput(event) {
      this.setData({
        content: event.detail.value
      })
    },
    oncomment(event) {
      // 插入数据库
      let fromId = event.detail.fromId
      let content = this.data.content
      if (content.trim()) {
        wx.showLoading({
          mask: true,
          title: '发送中..'
        })
        db.collection('blog-comment').add({
          data: {
            fromId,
            content,
            blogId: this.properties.blogId,
            nickName: userInfo.nickName,
            avatarUrl: userInfo.avatarUrl,
            createTime: db.serverDate(),
          }
        }).then((res) => {
          // 推送模板消息
          // wx.cloud.callFunction({
          //   name: 'sendMsg',
          //   data: {
          //     fromId,
          //     content,
          //     blogId: this.properties.blogId,
          //   }
          // }).then((res) => {

          // })
          wx.hideLoading({
            success: (res) => {},
          })
        })

      } else {
        wx.showToast({
          title: '不能发空',
        })
        return
      }
    }
  }
})