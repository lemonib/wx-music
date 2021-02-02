const getToken = require('../utils/getToken')
const rp = require('request-promise')

const callCloudDb = (async (ctx, fnName, query = {}) => {
    const token = await getToken()
    const url = `https://api.weixin.qq.com/tcb/${fnName}?access_token=${token}`
    var options = {
        method: 'POST',
        uri: url,
        body: {
            query,
            env: ctx.state.env
        },
        json: true // Automatically stringifies the body to JSON
    };
    const data = await rp(options)
        .then(function (res) {
            return res

        })
        .catch(function (err) {
            console.log('call', err)
        });

    return {
        data,
        code: 20000
    }

})

module.exports = callCloudDb