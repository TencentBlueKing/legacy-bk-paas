<template>
    <bk-exception class="exception-wrap-item" type="404">
        <div>
            <span v-if="pageRoute.pageName">未找到页面，请检查页面“{{pageRoute.pageName}}”的路由配置</span>
            <span v-else-if="pageRoute.pageCode === ''">未找到项目首页，建议将地址“/”配置为项目默认首页</span>
            <span v-else-if="!pageRoute.pageCode">未找到页面</span>
        </div>
    </bk-exception>
</template>

<script>
    import { mapState } from 'vuex'
    export default {
        data () {
            return {}
        },
        computed: {
            ...mapState(['projectPageRouteList']),
            pageRoute () {
                const pageCode = this.$route.query.p // '' | undefined | code
                const pageRoute = this.projectPageRouteList.find(item => item.pageCode === pageCode)
                return pageRoute || { pageCode }
            }
        }
    }
</script>

<style scoped>
    .exception-wrap-item {
        margin: 150px auto 0 !important;
        height: 420px;
        padding-top: 22px;
    }
</style>
