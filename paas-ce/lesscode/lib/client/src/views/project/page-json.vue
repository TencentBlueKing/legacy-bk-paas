<template>
    <section>
        <code-viewer :code="code" :filename="`bklesscode-${pageId}.json`" @show-edit-data="showEditData" page-type="json" />
        <json-view ref="editDialog" :show-input="false" :default-value="[]" :change="setImportData" name="targetData" type="json" :dialog-title="dialogTitle"></json-view>
    </section>
</template>

<script>
    import CodeViewer from '@/components/code-viewer'
    import JsonView from '@/element-materials/modifier/component/props/components/strategy/json-view.vue'
    import { circleJSON } from '@/common/util.js'
    import { mapMutations } from 'vuex'

    export default {
        components: {
            CodeViewer,
            JsonView
        },
        props: {
            targetData: {
                type: Array,
                default: () => ([])
            }
        },
        data () {
            return {
                code: '',
                dialogTitle: '导入的json将会覆盖当前已有页面内容'
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
        },
        methods: {
            ...mapMutations('drag', [
                'setTargetData'
            ]),
            showEditData () {
                this.$refs.editDialog && this.$refs.editDialog.showEdit()
            },
            setImportData (name, data) {
                if (data && Array.isArray(data)) {
                    this.setTargetData(data)
                }
            }
        }
    }
</script>
