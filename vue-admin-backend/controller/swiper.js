const Router = require('koa-router')
const router = new Router()
const cloudStorage = require('../utils/callCloudStorage')
const callCloudDb = require('../utils/callCloudDb')

router.get('/list', async (ctx, next) => {
    // 默认一次只能查10条
    const query = `db.collection('swiper').get()`
    const res = await callCloudDb(ctx, 'databasequery', query)
    let filelist = []
    const data = res.data.data
    for (let i = 0; i < data.length; i++) {
        filelist.push({
            fileid: JSON.parse(data[i]).fileId,
            max_age: 7200
        })
    }

    const dlRes = await cloudStorage.download(ctx, filelist)


    let returnData = []
    if (dlRes.file_list) {
        dlRes.file_list.forEach((element, index) => {
            returnData.push({
                download_url: element.download_url,
                fileId: element.fileId,
                id: data[index]._id
            })
        });
    }

    ctx.body = {
        code: 20000,
        returnData
    }
})

router.post('/upload', async (ctx, next) => {
    console.log('upload')
    const fileid = await cloudStorage.upload(ctx)

    // 
    const query = `
        db.collection('swiper').add({
            data:{
                fileId:'${fileid}'
            }
        })
    `
    const res = await callCloudDb(ctx, 'databaseadd', query)
    console.log(res)
    ctx.body = {
        code: 20000,
        id_list: res.data.id_list
    }
})

module.exports = router