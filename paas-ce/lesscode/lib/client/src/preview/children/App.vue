<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>
<script>
    export default {
        name: 'app',
        mounted () {
            const { fullPath, query } = this.$route
            // 当前预览的页面
            let pageCode = query.pageCode
    
            const { projectPageRouteList } = this.$store.state
            let pageRoute
            if (pageCode) {
                pageRoute = projectPageRouteList.find(item => item.pageCode === pageCode)
            } else if (/^\/(\?v=\d+)*$/.test(fullPath)) {
                // 判定为项目预览，找到父路由是/的页面
                pageRoute = this.getProjectDefaultHome()
                pageCode = ''
            } else {
                // 其它情况不需要跳转
                return
            }
    
            if (pageRoute && pageRoute.id) {
                const { resolved } = this.$router.resolve({ path: pageRoute.fullPath })
                if (resolved.name === '404') {
                    // 绑定的跳转路由可能未绑定页面或路由
                    this.$router.replace({ path: '/404', query: { pageCode: pageCode } })
                } else {
                    this.$router.replace({ path: pageRoute.fullPath, query: { pageCode: pageRoute.pageCode } })
                }
            } else {
                this.$router.replace({ path: '/404', query: { pageCode: pageCode } })
            }
        },
        methods: {
            getProjectDefaultHome () {
                const { projectRouteList, projectPageRouteList } = this.$store.state
                const defaultHome = projectRouteList.find(item => item.fullPath === '/')
                if (defaultHome) {
                    return defaultHome
                }
                // 否则返回第1个父路由为/的有效路由
                const rootPathRoute = projectPageRouteList.find(item => item.layoutPath === '/')
                if (rootPathRoute && rootPathRoute.id) {
                    return rootPathRoute
                }
    
                // 返回项目的第1个路由
                return projectRouteList[0]
            }
        }
    }
</script>
<style>
    * {
        box-sizing: border-box;
    }
    html,body {
        margin: 0;
        padding: 0;
    }
    ul,li {
        margin: 0;
        padding: 0;
        list-style: none;
    }
    dl,dt,dd,p {
        margin: 0;
        padding: 0;
    }
    a {
        text-decoration: none;
    }
    button {
        outline: none;
    }
    table {
        border-collapse: collapse;
        border-spacing: 0;
    }
    td,th {
        padding: 0;
    }
    .navigation-bar {
        width: 100%;
        height: 100%;
    }
    .navigation-bar-container {
        width: 100%;
        max-width: 100%;
    }
    .bk-navigation {
        min-width: 1360px;
    }
    .bk-navigation-wrapper .navigation-container {
        max-width: 100% !important;
    }
    .navigation-header .tippy-popper .tippy-tooltip.navigation-message-theme {
        padding: 0;
        border-radius: 0;
        -webkit-box-shadow: none;
        box-shadow: none;
    }
</style>
