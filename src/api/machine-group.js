import request from '@/utils/request'

export const getMachineGroupBasicInfos = () => {
  return request({
    url: '/TbMachineGroup/basicInfos',
  })
}

export const getMachineGroupTypes = () => {
  return request({
    url: '/TbMachineGroup/types',
  })
}

export const getMachineGroupNames = () => {
  return request({
    url: '/TbMachineGroup/name',
  })
}
