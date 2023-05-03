import request from '@/utils/request'

export const getLineNames = () => {
  return request({
    url: '/TbLine/LineNames',
  })
}
