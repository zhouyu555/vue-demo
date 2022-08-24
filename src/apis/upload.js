import request from '@/utils/request'

// 登录方法
export function check(md5) {
    return request({
        url: '//minio/check?md5='+md5,
        method: 'get'
    })
}
