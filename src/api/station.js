import request from '@/utils/request'

export const createStation = (data) => {
  return request({
    url: '/TbStation',
    method: 'post',
    data,
  })
}

export const editStation = (id, data) => {
  return request({
    url: `/TbStation/${id}`,
    method: 'put',
    data,
  })
}

export const getStationPageList = (queryParams) => {
  return request({
    url: '/TbStation/details',
    params: queryParams,
  })
}

export const deleteStation = (id) => {
  return request({
    url: `/TbStation/${id}`,
    method: 'delete',
  })
}

export const batchDeleteStation = (ids) => {
  return request({
    url: '/TbStation/batchDelete',
    data: ids,
    method: 'post',
  })
}
