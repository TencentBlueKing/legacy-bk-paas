<template>
    <div class="get-request-params" v-bkloading="{ isLoading: fieldListLoading, zIndex: 4 }">
        <bk-table :data="paramsTableList" :size="'small'">
            <bk-table-column label="名称" prop="name" min-width="180"></bk-table-column>
            <bk-table-column label="必选" width="60">
                <template slot-scope="props">
                    {{ props.row.is_necessary ? '是' : '否' }}
                </template>
            </bk-table-column>
            <bk-table-column show-overflow-tooltip label="备注" min-width="90">
                <template slot-scope="props">
                    <span :title="props.row.desc">{{ props.row.desc || '--' }}</span>
                </template>
            </bk-table-column>
            <bk-table-column label="参数值" width="250" fixed="right">
                <template slot-scope="props">
                    <div class="params-value">
                        <template v-if="editable">
                            <bk-select
                                v-if="useVariable"
                                v-model="props.row.source"
                                behavior="simplicity"
                                style="width: 99px; margin-right: 4px"
                                :clearable="false"
                                @change="handleSourceChange($event, props.row)">
                                <bk-option id="CUSTOM" name="自定义"></bk-option>
                                <bk-option id="FIELD" name="引用变量"></bk-option>
                            </bk-select>
                            <bk-select
                                v-if="props.row.source === 'FIELD'"
                                v-model="localVal[props.row.name]"
                                behavior="simplicity"
                                placeholder="请选择变量"
                                style="width: 110px"
                                :searchable="true"
                                :clearable="false"
                                @change="change">
                                <bk-option v-for="field in fieldList" :key="field.key" :id="field.key" :name="field.name"></bk-option>
                            </bk-select>
                            <div v-else :style="useVariable ? 'width: 110px' : 'width: 100%'">
                                <bk-select
                                    v-if="props.row.type === 'boolean'"
                                    v-model="localVal[props.row.name]"
                                    behavior="simplicity"
                                    style="background: #fff"
                                    @change="change">
                                    <bk-option :id="true" name="true"></bk-option>
                                    <bk-option :id="false" name="false"></bk-option>
                                </bk-select>
                                <bk-input
                                    v-else
                                    v-model="localVal[props.row.name]"
                                    behavior="simplicity"
                                    placeholder="请输入参数值"
                                    :type="props.row.type === 'number' ? 'number' : 'text'"
                                    @change="change">
                                </bk-input>
                            </div>
                        </template>
                        <span v-else>{{ localVal[props.row.name] }}</span>
                    </div>
                </template>
            </bk-table-column>
        </bk-table>
    </div>
</template>
<script>
    export default {
        name: 'GetRequestParams',
        props: {
            flowId: Number,
            nodeId: Number,
            params: {
                type: Array,
                default: () => []
            },
            useVariable: {
                // 参数值是否支持引用变量
                type: Boolean,
                default: true
            },
            value: {
                type: Object,
                default: () => ({})
            },
            editable: {
                type: Boolean,
                default: true
            }
        },
        data () {
            return {
                fieldList: [],
                fieldListLoading: false,
                paramsTableList: this.transToTableList(),
                localVal: { ...this.value }
            }
        },
        watch: {
            params () {
                this.paramsTableList = this.transToTableList()
            },
            value (val) {
                this.localVal = { ...val }
            }
        },
        created () {
            if (this.useVariable) {
                this.getFields()
            }
        },
        methods: {
            async getFields () {
                try {
                    this.fieldListLoading = true
                    const params = {
                        workflow: this.flowId,
                        state: this.nodeId
                    }
                    const res = await this.$store.dispatch('nocode/formSetting/getNodeVars', params)
                    this.fieldList = res.data.map(item => {
                        const { key, name } = item
                        return { key: `\${params_${key}}`, name }
                    })
                } catch (e) {
                    console.error(e)
                } finally {
                    this.fieldListLoading = false
                }
            },
            transToTableList () {
                return this.params.map(item => {
                    return { ...item, source: /^\$\{params_.*\}$/.test(this.value[item.name]) ? 'FIELD' : 'CUSTOM' }
                })
            },
            handleSourceChange (val, param) {
                this.localVal[param.name] = ''
                this.change()
            },
            change () {
                this.$emit('change', { ...this.localVal })
            }
        }
    }
</script>
<style lang="postcss" scoped>
.params-value {
  display: flex;
  align-items: center;
}
</style>
