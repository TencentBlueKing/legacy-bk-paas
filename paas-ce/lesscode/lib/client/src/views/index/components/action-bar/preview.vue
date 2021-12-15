<template>
    <menu-item :item="item"></menu-item>
</template>

<script>
    import MenuItem from './menu-item'
    import LC from '@/element-materials/core'
    import { circleJSON } from '@/common/util.js'
    import { mapGetters } from 'vuex'
    
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
            ...mapGetters('page', ['pageDetail']),
            projectId () {
                return this.$route.params.projectId || ''
            }
        },
        methods: {
            handlePreview () {
                localStorage.removeItem('layout-target-data')
                localStorage.setItem('layout-target-data', circleJSON(LC.getRoot().toJSON().renderSlots.default))
                const routerUrl = `/preview/project/${this.projectId}/?pageCode=${this.pageDetail.pageCode}`
                window.open(routerUrl, '_blank')
            }
        }
    }
</script>
