import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import ElementPlus from 'element-plus'
import 'element-plus/theme-chalk/index.css'

import App from './App.vue'
import router from './router'

const app = createApp(App)
const pinia = createPinia()
// 注册持久化插件
pinia.use(piniaPluginPersistedstate)


app.use(pinia)
app.use(router)
app.use(ElementPlus)
app.mount('#app')
