<template>
    <code-viewer :code="code" :filename="`bklesscode-${pageId}.json`" />
</template>

<script>
    import CodeViewer from '@/components/code-viewer'
    import { circleJSON } from '@/common/util.js'
    export default {
        components: {
            CodeViewer
        },
        props: {
            targetData: {
                type: Array,
                default: () => ([])
            }
        },
        data () {
            return {
                code: ''
            }
        },
        computed: {
            pageId () {
                return this.$route.params.pageId || ''
            }
        },
        watch: {
            targetData: {
                handler () {
                    try {
                        this.code = circleJSON(this.targetData)
                    } catch (e) {
                        this.code = 'error'
                        console.error(e)
                    }
                },
                immediate: true
            }
        }
    }
</script>
