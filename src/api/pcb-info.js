import request from '@/utils/request'

export const createPcbInfo = (data) => {
  return request({
    url: '/TbPcbinfoes',
    method: 'post',
    data,
  })
}

export const editPcbInfo = (id, data) => {
  return request({
    url: `/TbPcbinfoes/${id}`,
    method: 'put',
    data,
  })
}

export const getPcbPageList = (queryParams) => {
  return request({
    url: '/TbPcbinfoes/details',
    params: queryParams,
  })
}



export const deletePcbInfo = (id) => {
  return request({
    url: `/TbPcbinfoes/${id}`,
    method: 'delete',
  })
}

export const batchDeletePcb = (ids) => {
  return request({
    url: '/TbPcbinfoes/batchDelete',
    data: ids,
    method: 'post',
  })
}

export const getPcbInfoBasicInfos = () => {
  return request({
    url: '/TbPcbInfoes/basicInfos',
  })
}