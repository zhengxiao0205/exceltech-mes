import request from '@/utils/request'

export const createProgram = (data) => {
  return request({
    url: '/TbProgram',
    method: 'post',
    data
  })
}

export const editProgram = (id, data) => {
  return request({
    url: `/TbProgram/${id}`,
    method: 'put',
    data,
  })
}

export const deleteProgram = (id) => {
  return request({
    url: `/TbProgram/${id}`,
    method: 'delete',
  })
}

export const batchDeleteProgram = (ids) => {
  return request({
    url: '/TbProgram/batchDelete',
    data: ids,
    method: 'post',
  })
}

export const getProgramPageList = (queryParams) => {
  return request({
    url: '/TbProgram/details',
    params: queryParams,
  })
}
