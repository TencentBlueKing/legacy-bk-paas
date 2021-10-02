import './public-path'
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/theme-chalk/index.css'
import routes from './router'
import App from './App.vue'

const app = createApp(App)
app.use(ElementPlus)
app.use(routes)
app.mount('#vue3-app')

window.globalStr = 'vue3'

console.log('微应用vue3渲染了')

// 监听卸载
window.addEventListener('unmount', function () {
  console.log('微应用vue3卸载了')
  // 卸载应用
  app.unmount()
})
