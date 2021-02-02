const koa = require('koa')
const app = new koa()
const Router = require('koa-router')
const router = new Router()
const cors = require('koa2-cors')
//
const playlist = require('./controller/playlist')
const swiper = require('./controller/swiper')
const ENV = 'test-music-0gtfar1b7a37b325'
const bodyParser = require('koa-body')

app.use(async (ctx, next) => {
    ctx.state.env = ENV
    await next()
})


app.use(bodyParser({
    multipart: true
}))


router.use('/playlist', playlist.routes())
router.use('/swiper', swiper.routes())

app.use(cors({
    origin: ['*'],
    credentials: true
}))

app.use(router.routes())
app.use(router.allowedMethods())



app.listen(3001, () => {
    console.log('ok')
})