const getToken = require('../utils/getToken')
const rp = require('request-promise')

const callCloudFn = (async (ctx, fnName, params) => {
    const token = await getToken()
    const url = `https://api.weixin.qq.com/tcb/invokecloudfunction?access_token=${token}&env=${ctx.state.env}&name=${fnName}`
    var options = {
        method: 'POST',
        uri: url,
        body: {
            ...params
        },
        json: true // Automatically stringifies the body to JSON
    };
    const data = await rp(options)
        .then(function (res) {
            return JSON.parse(res.resp_data).data

        })
        .catch(function (err) {
            console.log(err)
        });

    return {
        data,
        code: 20000
    }

})

module.exports = callCloudFn