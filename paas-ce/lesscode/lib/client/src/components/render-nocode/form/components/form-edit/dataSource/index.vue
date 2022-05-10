<template>
    <div class="data-source-content">
        <!-- 自定义数据 -->
        <custom-data
            v-if="sourceType === 'CUSTOM'"
            ref="custom"
            :value="value"
            :show-require="fieldType === 'TABLE'"
            @update="$emit('change', $event)">
        </custom-data>
        <!-- 接口数据 -->
        <api-data
            v-else-if="sourceType === 'API'"
            ref="api"
            :flow-id="flowId"
            :node-id="nodeId"
            :change-source="showTypeSelect"
            :source-type-list="sourceTypeList"
            :use-variable="useVariable"
            :value="value"
            @sourceTypeChange="$emit('sourceTypeChange', $event)"
            @update="$emit('change', $event)">
        </api-data>
        <!-- 表单数据 -->
        <worksheet-data
            v-else-if="sourceType === 'WORKSHEET'"
            ref="worksheet"
            :flow-id="flowId"
            :node-id="nodeId"
            :change-source="showTypeSelect"
            :source-type-list="sourceTypeList"
            :use-variable="useVariable"
            :value="value"
            @sourceTypeChange="$emit('sourceTypeChange', $event)"
            @update="$emit('change', $event)">
        </worksheet-data>
    </div>
</template>
<script>
    import CustomData from './custumData.vue'
    import ApiData from './apiData.vue'
    import WorksheetData from './worksheetData.vue'

    export default {
        name: 'DataSource',
        components: {
            CustomData,
            ApiData,
            WorksheetData
        },
        props: {
            sourceType: String,
            fieldType: String,
            showTypeSelect: Boolean,
            sourceTypeList: {
                type: Array,
                default: () => []
            },
            flowId: Number,
            nodeId: Number,
            useVariable: {
                // 参数值是否支持引用变量
                type: Boolean,
                default: true
            },
            value: [Array, Object] // 自定义数据为Array，api数据、表单数据为Object
        },
        data () {
            return {
                conditionRelations: [],
                relationListLoading: false
            }
        },
        methods: {
            handleSourceTypeChange (val) {
                this.$emit('sourceTypeChange', val)
            },
            validate () {
                const type = this.sourceType.toLowerCase()
                if (this.$refs[type]) {
                    return this.$refs[type].validate()
                }
            }
        }
    }
</script>
