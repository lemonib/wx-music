// 云函数入口文件
const cloud = require('wx-server-sdk')
const TcbRouter = require('tcb-router')
cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const app = new TcbRouter({
    event
  })

  // 全局中间件
  app.use(async (ctx, next) => {
    // 返回data
    ctx.data = {}
    ctx.data.openId = event.userInfo.openId
    await next()
  })

  // 路由
  app.router('music', async (ctx, next) => {
      ctx.data.musicName = 'bloom'
      await next()
    },
    async (ctx, next) => {
      ctx.data.musicType = '儿歌'
      ctx.body = {
        data: ctx.data
      }
    })

  app.router('movie', async (ctx, next) => {
      ctx.data.movieName = 'bloom'
      await next()
    },
    async (ctx, next) => {
      ctx.data.musicType = '儿歌'
      ctx.body = {
        data: ctx.data
      }
    })
  return app.serve()
}