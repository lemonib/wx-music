// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const {
    OPENID
  } = cloud.getWXContext()
  wx.requestSubscribeMessage({
    tmplIds: [''],
    success (res) { }
  })
  cloud.openapi.templateMessage.send({
    tourer: OPENID,
    page: `/page/blog-comment/blog-comment?blogId=${event.blogId}`,
    data: {
      thing3: {
        value: event.content
      },
      thing1: {
        value: 'xxx'
      }
    },
    templateId: 'D0lX9OJcRvURILCyTJ5In8Pp-1BuA42uFE-QGwE0DaE',
    fromId: event.fromId
  })
}