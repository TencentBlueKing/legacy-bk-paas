**安装依赖包**

npm install
<br/>
<br/>

**配置host**

127.0.0.1 dev.bkapps.com
<br/>
<br/>

**检查配置文件**

注意：运行之前，请检查配置文件.babelrc、eslintrc.js等以.开头的配置文件是否存在。部分操作系统会默认隐藏这类文件，导致在推送到代码仓库时漏掉，最终影响部署结果。
<br/>
<br/>

**启动服务**

npm run dev
<br/>
<br/>

**打开链接**

浏览器输入：dev.bkapps.com:5000
<br/>
<br/>

**打包构建（生成dist目录）**

npm run build
<br/>
<br/>

**打包构建分析**

npm run build:analyzer
<br/>
<br/>

**登录**

整个框架自带登录实现，在刚打开时，如果没有登录会直接跳到登录页，如果打开后，登录过期（接口返回401状态）会弹出登录窗口
