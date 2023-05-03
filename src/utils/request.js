import axios from 'axios'

const request = axios.create({
  baseURL: process.env.VUE_APP_baseURL,
})

request.interceptors.response.use((response) => {
  return response.data
})

export default request
