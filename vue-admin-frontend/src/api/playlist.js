import request from '@/utils/request'
const baseUrl = 'http://localhost:3001'
export function getList(params) {
    return request({
        url: `${baseUrl}/playlist/list`,
        method: 'get',
        params
    })
}

export function getListById(params) {
    return request({
        url: `${baseUrl}/playlist/getById`,
        method: 'get',
        params
    })
}

export function update(params) {
    return request({
        url: `${baseUrl}/playlist/updatePlayList`,
        method: 'post',
        data: { ...params }
    })
}

export function del(params) {
    return request({
        url: `${baseUrl}/playlist/del`,
        method: 'get',
        params
    })
}