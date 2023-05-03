// 这个工具文件专门用来处理看板中的工具方法

/**
 * 根据重叠面积, 计算出重合度最大的元素, 这个元素就是拖拽后想要交换位置的那个目标
 * @param {*} draggingItem 正在拖拽的元素
 * @param {*} layout 当前的看板布局
 * @returns 返回重合度最大的元素
 */
export const getMaxCoincideItem = (draggingItem, layout) => {
  let maxCoincideItem = null
  layout
    .filter((item) => item.i !== draggingItem.i)
    .forEach((item) => {
      const left = Math.max(draggingItem.translateX, item.translateX)
      const right = Math.min(draggingItem.translateX + 120 * draggingItem.w, item.translateX + 120 * item.w)
      const top = Math.max(draggingItem.translateY, item.translateY)
      const bottom = Math.min(draggingItem.translateY + 80 * draggingItem.h, item.translateY + 80 * item.h)
      if (left < right && top < bottom) {
        // 计算交叉区域的面积
        const area = (right - left) * (bottom - top)
        // 计算两个元素各自的面积
        const area1 = draggingItem.w * draggingItem.h * 120 * 80
        const area2 = item.w * item.h * 120 * 80
        // 计算重合比例
        const ratio = area / (area1 + area2 - area)

        if (!maxCoincideItem || ratio > maxCoincideItem.ratio) {
          maxCoincideItem = { item, ratio }
        }
      }
    })
  return maxCoincideItem
}

/**
 * 判断拖拽元素和目标元素是否可以交换位置，并返回新的xy位置
 * 如果x轴相邻，则高度相同就可以换位置；y轴相邻就需要宽度相同；如果不相邻，那么就需要高度宽度完全相同
 * @param {*} draggingItem 拖拽元素
 * @param {*} targetItem 目标元素
 * @returns 是否可以变换位置，如果可以，返回两个元素的新xy位置，如果不可以，则返回false
 */
export const handleExchangePosition = (draggingItem, targetItem) => {
  let result = false
  if (draggingItem.x === targetItem.x) {
    if (draggingItem.w === targetItem.w) {
      // x轴一样并且宽度相同，只需要上下相邻就可以交换了
      if (draggingItem.y + draggingItem.h === targetItem.y) {
        // 拖拽元素在上面，目标元素在下面
        result = {
          draggingItem: { x: draggingItem.x, y: draggingItem.y + targetItem.h },
          targetItem: { x: draggingItem.x, y: draggingItem.y },
        }
      }
      if (targetItem.y + targetItem.h === draggingItem.y) {
        // 拖拽元素在下面，目标元素在上面
        result = {
          draggingItem: { x: draggingItem.x, y: targetItem.y },
          targetItem: { x: draggingItem.x, y: targetItem.y + draggingItem.h },
        }
      }
    }
  }
  if (draggingItem.y === targetItem.y) {
    // y轴一样并且高度相同，只需要左右相邻就可以交换了
    if (draggingItem.h === targetItem.h) {
      if (draggingItem.x + draggingItem.w === targetItem.x) {
        // 拖拽元素在左面，目标元素在右面
        result = {
          draggingItem: { x: draggingItem.x + targetItem.w, y: draggingItem.y },
          targetItem: { x: draggingItem.x, y: draggingItem.y },
        }
      }

      if (targetItem.x + targetItem.w === draggingItem.x) {
        // 拖拽元素在右面，目标元素在左面
        result = {
          draggingItem: { x: targetItem.x, y: draggingItem.y },
          targetItem: { x: targetItem.x + draggingItem.w, y: draggingItem.y },
        }
      }
    }
  }

  // 最后说明不相邻，必须高度和宽度完全相同才可以换位置
  if (draggingItem.w === targetItem.w && draggingItem.h === targetItem.h) {
    result = {
      draggingItem: { x: targetItem.x, y: targetItem.y },
      targetItem: { x: draggingItem.x, y: draggingItem.y },
    }
  }
  return result
}

export const handleDragToEmpty = (draggingItem, layout) => {
  let result = false
  // 1. 首先获取draggingItem拖拽区域所在的网格位置
  const newX = Math.max(Math.round(draggingItem.translateX / 120), 0)
  const newY = Math.max(Math.round(draggingItem.translateY / 80), 0)

  // 2. 计算如果把draggingItem放置在新位置，是否会和其他元素产生碰撞
  const maxCoincideItem = getMaxCoincideItem(
    {
      ...draggingItem,
      translateX: newX * 120,
      translateY: newY * 80,
    },
    layout.filter((item) => item.i !== draggingItem.i)
  )

  // 3. 没有和其他元素发生碰撞，说明允许放置在此空位处
  if (!maxCoincideItem) {
    result = {
      draggingItem: { x: newX, y: newY },
    }
  }

  return result
}

/**
 * 计算当前的item能否放置在网格中，并且给出坐标
 * @param {*} newItem 目标放置元素
 * @param {*} layout 当前看板布局
 * @returns 是否有空位放置，如果有的话，返回新坐标
 */
export const handleAddItemToDashboard = (newItem, layout) => {
  const { w, h } = newItem

  // 循环遍历网格，计算如果把元素放在所有网格中，是否会与其他元素产生碰撞
  let result = false // 是否找到了结果的标志位
  for (let x = 0; x <= 16 - w; x++) {
    for (let y = 0; y <= 12 - h; y++) {
      const translateX = x * 120
      const translateY = y * 80
      const coincideItem = layout.find((item) => {
        const left = Math.max(translateX, item.translateX)
        const right = Math.min(translateX + 120 * w, item.translateX + 120 * item.w)
        const top = Math.max(translateY, item.translateY)
        const bottom = Math.min(translateY + 80 * h, item.translateY + 80 * item.h)
        if (left < right && top < bottom) {
          return true
        }
      })
      if (!coincideItem) {
        result = { x, y }
        break
      }
    }
    if (result) {
      break
    }
  }
  return result
}
