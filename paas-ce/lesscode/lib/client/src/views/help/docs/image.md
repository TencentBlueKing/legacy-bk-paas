## image

基础文字基础文字基础文字基础文字基础文字

### 三级标题1

基础文字基础文字基础文字基础文字基础文字。`行内代码`

[链接](/help/intro)

### 三级标题2

块级代码

```js
import Vue from 'vue'
import App from './App'
import router from './router'

// 全量引入 bk-magic-vue
import bkMagic from '{{BASE_LIB_NAME}}'
// 全量引入 bk-magic-vue 样式
import '{{BASE_LIB_NAME}}/dist/bk-magic-vue.min.css'

Vue.use(bkMagic)

new Vue({
    el: '#root',
    router,
    template: '<App />',
    components: {App}
})
```

### 三级标题3

:::info
info提示info提示info提示info提示info提示

info提示
:::

:::tip
tip提示tip提示tip提示tip提示tip提示

tip提示
:::

:::warning
warning提示warning提示warning提示warning提示warning提示

warning提示
:::

:::danger
danger提示danger提示danger提示danger提示danger提示

danger提示
:::


