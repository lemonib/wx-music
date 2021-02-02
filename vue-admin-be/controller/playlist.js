const Router = require('koa-router')
const router = new Router()
const callCloudFn = require('../utils/callCloudFn')
const callCloudDb = require('../utils/callCloudDb')

router.get('/list', async (ctx, next) => {
    const query = ctx.request.query
    const res = await callCloudFn(ctx, 'music', {
        $url: 'getPlayList',
        start: parseInt(query.start),
        count: parseInt(query.count)
    })
    ctx.body = res
})

router.get('/getById', async (ctx, next) => {
    const query = `db.collection('playlist').doc('${ctx.request.query.id}').get()`
    const res = await callCloudDb(ctx, 'databasequery', query)
    ctx.body = res
})

router.post('/updatePlayList', async (ctx, next) => {
    const params = ctx.request.body
    const query = `db.collection('playlist').doc('${params._id}').updata(
        data:{
            name: '${params.name}',
            copywriter: '${params.copywriter}'
        }
    )`
    const res = await callCloudDb(ctx, 'databaseupdate', query)
    ctx.body = res
})

router.get('/del', async (ctx, next) => {
    const params = ctx.request.query
    const query = `db.collection('playlist').doc('${params.id}').remove()`
    const res = await callCloudDb(ctx, 'databasedelete', query)
    ctx.body = res
})

module.exports = router