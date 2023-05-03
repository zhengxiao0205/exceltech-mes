import request from '@/utils/request'

export const createMachine = (data) => {
  return request({
    url: '/TbMachine',
    method: 'post',
    data
  })
}

export const editMachine = (id, data) => {
  return request({
    url: `/TbMachine/${id}`,
    method: 'put',
    data,
  })
}

export const deleteMachine = (id) => {
  return request({
    url: `/TbMachine/${id}`,
    method: 'delete',
  })
}

export const batchDeleteMachine = (ids) => {
  return request({
    url: '/TbMachine/batchDelete',
    data: ids,
    method: 'post',
  })
}

export const getMachinePageList = (queryParams) => {
  return request({
    url: '/TbMachine/details',
    params: queryParams,
  })
}

export const getMachineIdsWithGroup = () => {
  return request({
    url: '/TbMachine/idsWithGroup',
  })
}
