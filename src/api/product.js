import request from '@/utils/request'

export const getProductNames = () => {
  return request({
    url: '/TbSmtproducts/SmtProductNames',
  })
}
