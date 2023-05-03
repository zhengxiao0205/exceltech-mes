import { createI18n } from 'vue-i18n'
import en from './en'
import storage from '@/utils/storage'
import zh from './zh'

const i18n = createI18n({
  locale: storage.get('lang') || 'zh',
  messages: {
    en,
    zh,
  },
  fallbackLocale: 'zh',
  legacy: false,
})

export default i18n
