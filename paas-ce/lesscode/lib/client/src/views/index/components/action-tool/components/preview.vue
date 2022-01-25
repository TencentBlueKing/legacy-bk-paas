<template>
    <menu-item :item="item" />
</template>

<script>
    import MenuItem from './menu-item'
    import { mapGetters, mapState } from 'vuex'
    import { getRouteFullPath } from 'shared/route'
    
    export default {
        components: {
            MenuItem
        },
        data () {
            return {
                item: {
                    icon: 'bk-drag-icon bk-drag-play',
                    text: '预览',
                    func: this.handlePreview
                }
            }
        },
        computed: {
            ...mapState('route', ['layoutPageList']),
            ...mapGetters('page', [
                'pageDetail'
            ]),
            ...mapGetters('drag', [
                'curTemplateData'
            ]),
            ...mapGetters('projectVersion', { versionId: 'currentVersionId', currentVersion: 'currentVersion' }),
            projectId () {
                return this.$route.params.projectId || ''
            },
            pageId () {
                return this.$route.params.pageId
            }
        },
        methods: {
            async handlePreview () {
                // await this.handleSave()
                const pageRoute = this.layoutPageList.find(({ pageId }) => pageId === Number(this.pageId))
                if (!pageRoute.id) {
                    throw new Error('页面未配置路由，请先配置')
                }
                const versionQuery = `${this.versionId ? `&v=${this.versionId}` : ''}`
                const fullPath = getRouteFullPath(pageRoute)
                const routerUrl = `/preview/project/${this.projectId}${fullPath}?pageCode=${this.pageDetail.pageCode}${versionQuery}`
                window.open(routerUrl, '_blank')
            }
        }
    }
</script>
