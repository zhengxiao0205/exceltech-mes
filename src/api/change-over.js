import request from '@/utils/request'

export const getChangeOverList = (queryParams) => {
  return request({
    url: '/TbChangeOver/details',
    params: queryParams,
  })
}

export const startChangeOver = (data) => {
  return request({
    url: '/TbChangeOver/start',
    method: 'post',
    data,
  })
}

export const uploadBarcodeCsvFile = (formData) => {
  return request({
    url: '/BarCode/readFromFile',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}
