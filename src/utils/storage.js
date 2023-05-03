// 操作localStorage缓存的工具函数
const storage = {
  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value))
  },

  get(key) {
    return JSON.parse(localStorage.getItem(key))
  },

  delete(key) {
    localStorage.removeItem(key)
  },

  clear() {
    localStorage.clear()
  },
}

export default storage
