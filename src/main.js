import 'element-plus/dist/index.css'
import 'remixicon/fonts/remixicon.css'
import '@/styles/themes.scss'

import App from './App.vue'
import ElementPlus from 'element-plus'
import { createApp } from 'vue'
import i18n from './i18n'
import router from './router'
import store from './store'

const app = createApp(App)

app.use(store).use(router).use(ElementPlus).use(i18n).mount('#app')
