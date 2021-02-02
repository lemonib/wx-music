// 云函数入口文件
const cloud = require('wx-server-sdk')
const TcbRouter = require('tcb-router')
cloud.init()
const rp = require('request-promise')
const BASE_URL = 'http://120.26.187.68:4000'
// 云函数入口函数
exports.main = async (event, context) => {
  // const wxContext = cloud.getWXContext()
  const app = new TcbRouter({
    event
  })

  app.router('getPlayList', async (ctx, next) => {
    ctx.body = await cloud.database().collection('playlist')
      .skip(event.start)
      .limit(event.count)
      .orderBy('createTime', 'desc')
      .get()
      .then((res) => {
        return res
      })
  })

  app.router('musiclist', async (ctx, next) => {
    ctx.body = await rp(BASE_URL + '/playlist/detail?id=' + parseInt(event.playlistId))
      .then((res) => {
        return JSON.parse(res)
      })
  })

  app.router('musicURL', async (ctx, next) => {
    ctx.body = await rp(BASE_URL + '/song/url?id=' + event.musicId)
      .then((res) => {
        return JSON.parse(res)
      })
  })

  app.router('lyric', async (ctx, next) => {
    ctx.body = await rp(BASE_URL + '/lyric?id=' + event.musicId)
      .then((res) => {
        return JSON.parse(res)
      })
  })

  return app.serve()
}