<template>
    <section style="height: 100%;">
        <code-viewer :code="code" :filename="`bklesscode-${pageId}.json`" @show-edit-data="showEditData" page-type="json" />
        <json-view ref="editDialog" :show-input="false" :default-value="[]" :change="setImportData" name="targetData" type="json" :dialog-title="dialogTitle"></json-view>
    </section>
</template>

<script>
    import CodeViewer from '@/components/code-viewer'
    import JsonView from '@/element-materials/modifier/component/props/components/strategy/json-view.vue'
    import { circleJSON } from '@/common/util.js'
    import LC from '@/element-materials/core'

    export default {
        components: {
            CodeViewer,
            JsonView
        },
        data () {
            return {
                code: '',
                dialogTitle: 'json数据将会覆盖当前已有页面内容'
            }
        },
        computed: {
            pageId () {
                return this.$route.params.pageId || ''
            }
        },
        mounted () {
            this.code = circleJSON(LC.getRoot().toJSON() || [])
        },
        methods: {
            showEditData () {
                this.$refs.editDialog && this.$refs.editDialog.showEdit()
            },
            setImportData (name, data) {
                if (data && Array.isArray(data)) {
                    LC.parseData(data)
                }
            }
        }
    }
</script>
