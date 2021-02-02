const getToken = require('../utils/getToken')
const rp = require('request-promise')
const fs = require('fs')

const cloudStorage = {
    async download(ctx, fileList) {
        const token = await getToken()
        const url = `https://api.weixin.qq.com/tcb/batchdownloadfile?access_token=${token}`
        var options = {
            method: 'POST',
            uri: url,
            body: {
                env: ctx.state.env,
                file_list: fileList
            },
            json: true // Automatically stringifies the body to JSON
        };
        const data = await rp(options)
            .then(function (res) {
                return res

            })
            .catch(function (err) {
                console.log(err)
            });

        return data


    },
    async upload(ctx) {
        const token = await getToken()
        const file = ctx.request.files.file
        const path = `swiper/${Date.now()} - ${Math.random()} - ${file.name}`
        const url = `https://api.weixin.qq.com/tcb/uploadfile?access_token=${token}`
        var options = {
            method: 'POST',
            uri: url,
            body: {
                path,
                env: ctx.state.env,
            },
            json: true // Automatically stringifies the body to JSON
        };
        const info = await rp(options)
            .then(function (res) {
                return res

            })
            .catch(function (err) {
                console.log(err)
            });

            // 2. 上传图片
            const params = {
                method: 'post',
                headers:{
                   'content-type': 'multipart/form-data'
                },
                url: info.url,
                formData:{
                    key:path,
                    signature: info.authorization,
                    'x-cos-security-token': info.token,
                    'x-cos-meta-fileid': info.cos_file_id,
                    file: fs.createReadStream(file.path)
                },
                json:true
            }

            await rp(params)
            .then(function (res) {
                return res

            })
            .catch(function (err) {
                console.log(err)
            });
        return info.file_id


    }
}

module.exports = cloudStorage