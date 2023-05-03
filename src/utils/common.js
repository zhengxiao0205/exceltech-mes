import dayjs from 'dayjs'

// 把字符串日期(或者后端传来的utc格式)格式化为前端日期
export const formatDate = (date, format) => {
  return dayjs(date).format(format)
}

// 把element-ui中表格的排序字段修改成后端需要的排序字段
export const formatSortOrder = (sortOrder) => {
  return sortOrder === 'descending' ? 'desc' : sortOrder === 'ascending' ? 'asc' : 'none'
}

// 把后端传过来的{id: name}的对象数据格式转换成为[{id, name}]的数组形式
export const formatNameIdMapToArray = (nameIdMap)=>{
  const result = []
  Object.keys(nameIdMap).forEach((id) => {
    const name = nameIdMap[id]
    result.push({ id, name })
  })
  return result
}
