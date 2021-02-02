// 
const fs = require('fs')
const path = require('path')
const rp = require('request-promise')
const appSecret = 'a2f2525d41181cda7d0fd4cc106f22e8'
const fileName = path.resolve(__dirname, './access_token.json')

const updateToken = async () => {
    const resStr = await rp(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wxb3d0a2b28571ee8d&secret=${appSecret}`)
    const res = JSON.parse(resStr)
    if (res.access_token) {
        fs.writeFileSync(fileName, JSON.stringify({
            access_token: res.access_token,
            createTime: new Date()
        }))
    }
}

const getToken = async () => {
    try {
        const resStr = fs.readFileSync(fileName, 'utf-8')
        const res = JSON.parse(resStr)
        const oldTime = new Date(res.createTime).getTime()
        const nowTime = new Date().getTime()
        if (nowTime - oldTime >= 7200 * 1000) {
            await updateToken()
            await getToken()
        }
        return res.access_token
       
    }
    catch (err) {
        await updateToken()
        await getToken()
    }
}

setInterval(async () => {
    await updateToken()
}, 6900 * 1000)

module.exports = getToken
// getToken()

