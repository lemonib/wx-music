import request from '@/utils/request'
const baseUrl = 'http://localhost:3001'

export function getList(params) {
    return request({
        url: `${baseUrl}/swiper/list`,
        method: 'get',
        params
    })
}