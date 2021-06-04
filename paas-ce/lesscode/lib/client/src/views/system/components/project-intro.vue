<template>
    <section style="font-size:12px">
        <section v-for="(item, index) in steps" :key="index">
            <p><strong>{{item.title}}</strong></p>
            <p>{{ item.desc }}<br><br></p>
        </section>
    </section>
</template>>

<script>
    export default {
        data () {
            return {
                steps: [
                    {
                        title: '安装依赖包',
                        desc: 'npm install'
                    },
                    {
                        title: '配置与登录域名同主域的host',
                        desc: `127.0.0.1 ${this.getHost()}`
                    },
                    {
                        title: '检查配置文件',
                        desc: '注意：运行之前，请检查配置文件.babelrc、eslintrc.js等以.开头的配置文件是否存在。部分操作系统会默认隐藏这类文件，导致在推送到代码仓库时漏掉，最终影响部署结果。'
                    },
                    {
                        title: '启动服务',
                        desc: 'npm run dev'
                    },
                    {
                        title: '打开链接',
                        desc: `浏览器输入：${this.getHost()}:5000`
                    },
                    {
                        title: '打包构建（生成dist目录）',
                        desc: 'npm run build'
                    },
                    {
                        title: '打包构建分析',
                        desc: 'npm run build:analyzer'
                    },
                    {
                        title: '登录',
                        desc: '整个框架自带登录实现，在刚打开时，如果没有登录会直接跳到登录页，如果打开后，登录过期（接口返回401状态）会弹出登录窗口'
                    }
                ]
            }
        },
        methods: {
            getHost () {
                const url = location.href
                const reg = new RegExp(/(\w+):\/\/([^/:]+)(:\d*)?/)
                const matchObj = url.match(reg)
                return matchObj[2].startsWith('local-') ? matchObj[2] : `local-${matchObj[2]}`
            }
        }
    }
</script>
