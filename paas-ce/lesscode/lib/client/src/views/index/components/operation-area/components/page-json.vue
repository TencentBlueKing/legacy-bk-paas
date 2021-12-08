<template>
    <section>
        <code-viewer
            :code="code"
            :filename="`bklesscode-${pageId}.json`"
            @show-edit-data="showEditData"
            page-type="json" />
        <json-view
            ref="editDialog"
            :show-input="false"
            :default-value="[]"
            :change="setImportData"
            name="targetData"
            type="json"
            :dialog-title="dialogTitle" />
    </section>
</template>

<script>
    import CodeViewer from '@/components/code-viewer'
    import JsonView from '@/element-materials/modifier/component/props/components/strategy/json-view.vue'
    import { circleJSON } from '@/common/util.js'
    import { mapMutations } from 'vuex'
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
        created () {
            const root = LC.getRoot()
            this.code = circleJSON(root.toJSON().renderSlots.default)
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
