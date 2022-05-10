<template>
    <bk-dialog
        title="数据源配置"
        header-position="left"
        ext-cls="data-source-dialog"
        :mask-close="false"
        :auto-close="false"
        :width="sourceType === 'API' ? 960 : 780"
        :show-type-select="false"
        :value="show"
        @confirm="onConfirm"
        @cancel="onCancel">
        <data-source
            v-if="show"
            ref="dataSource"
            :app-id="appId"
            :source-type="sourceType"
            :field-type="fieldType"
            :use-variable="false"
            :value="localVal"
            @change="localVal = $event">
        </data-source>
    </bk-dialog>
</template>
<script>
    import cloneDeep from 'lodash.clonedeep'
    import DataSource from './dataSource/index.vue'

    export default {
        name: 'DataSourceDialog',
        components: {
            DataSource
        },
        props: {
            show: {
                type: Boolean,
                default: false
            },
            appId: String,
            sourceType: String,
            fieldType: String,
            value: [Array, Object] // 自定义数据为Array，api数据、表单数据为Object
        },
        data () {
            return {
                localVal: cloneDeep(this.value)
            }
        },
        watch: {
            value (val) {
                this.localVal = cloneDeep(val)
            }
        },
        methods: {
            async onConfirm () {
                if (this.$refs.dataSource.validate()) {
                    this.$emit('confirm', this.localVal)
                }
            },
            onCancel () {
                this.$emit('update:show', false)
                this.localVal = cloneDeep(this.value)
            }
        }
    }
</script>
<style lang="postcss" scoped>
.data-source-content {
  padding: 3px 24px 26px;
  max-height: 384px;
  overflow: auto;
}
</style>
<style lang="postcss">
.data-source-dialog .bk-dialog-body {
  padding: 0;
}
</style>
