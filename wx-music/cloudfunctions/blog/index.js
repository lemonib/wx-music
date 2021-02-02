// 云函数入口文件
const cloud = require('wx-server-sdk')
const TcbRouter = require('tcb-router')
cloud.init()
// 一定要在init之后 否则会报错
const db = cloud.database()
const Max_LIMIT = 100
const blogCommentCollection = db.collection('blog-comment')
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const app = new TcbRouter({
    event
  })
  app.router('list', async (ctx, next) => {
    const keyword = event.keyword
    // 定义规则
    let w = {}
    if (keyword.trim()) {
      w = {
        content: db.RegExp({
          regexp: keyword,
          options: 'i'
        })
      }
    }
    let blogCollection = db.collection('blog')
    let boxList = await blogCollection.where(w).skip(event.start).limit(event.count)
      .orderBy('createTime', 'desc')
      .get()
      .then((res) => {
        return res.data
      })
    ctx.body = boxList
  })

  app.router('detail', async (ctx, next) => {
    let blogId = event.blogId
    console.log('check', blogId)
    let detail = {}
    let blogCollection = db.collection('blog')
    // 内容查询
    detail = await blogCollection.where({
        _id: blogId
      })
      .get()
      .then((res) => {
        return res.data
      })
    // 评论查询
    const countResult = await blogCollection.count()
    const total = countResult.total
    let commentList = {
      data: []
    }
    if (total) {
      const batchTimes = Math.ceil(total / Max_LIMIT)
      const tasks = []
      for (let i = 0; i < batchTimes; i++) {
        let promise = blogCommentCollection.skip(i * Max_LIMIT).limit(Max_LIMIT)
          .where({
            blogId
          })
          .orderBy('createTime', 'desc')
          .get()
        tasks.push(promise)
      }
      if (tasks.length > 0) {
        commentList = (await Promise.all(tasks)).reduce((acc, cur) => {
          return {
            data: acc.data.concat(cur.data)
          }
        })
      }
    }
    ctx.body = {
      commentList,
      detail
    }
  })


  app.router('getListByOpenId', async (ctx, next) => {
    ctx.body = await blogCommentCollection.where({
      _openid: wxContext.OPENID
    })
    .skip(event.start)
    .limit(event.count)
    .orderBy('createTime','desc')
    .get()
    .then((res)=>{
      return res.data
    })
  })

  return app.serve()
}