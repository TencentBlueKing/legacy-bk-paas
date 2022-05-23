<template>
    <div class="post-request-params">
        <bk-table size="small" :data="paramsTableData">
            <bk-table-column label="名称" min-width="120">
                <template slot-scope="props">
                    <div class="key" :style="{ marginLeft: `${props.row.level * 20}px` }">
                        <i
                            v-if="'extend' in props.row"
                            :class="['bk-icon', 'icon-right-shape', 'fold-icon', { extend: props.row.extend }]"
                            @click="handleParamExtend(props.row)">
                        </i>
                        {{ props.row.key }}
                    </div>
                </template>
            </bk-table-column>
            <bk-table-column label="类型" property="type" width="80"></bk-table-column>
            <bk-table-column label="必须" width="60">
                <template slot-scope="props">
                    {{ props.row.is_necessary ? '是' : '否' }}
                </template>
            </bk-table-column>
            <bk-table-column show-overflow-tooltip label="备注" width="100">
                <template slot-scope="props">
                    <span :title="props.row.description">{{ props.row.description || '--' }}</span>
                </template>
            </bk-table-column>
            <bk-table-column label="参数值" width="250">
                <template slot-scope="props">
                    <div class="params-value">
                        <template v-if="props.row.canSetValue">
                            <bk-select
                                v-if="useVariable"
                                v-model="props.row.source"
                                behavior="simplicity"
                                style="width: 99px; margin-right: 4px"
                                :clearable="false"
                                @change="handleValueChange('', props.row)">
                                <bk-option id="CUSTOM" name="自定义"></bk-option>
                                <bk-option id="FIELD" name="引用变量"></bk-option>
                            </bk-select>
                            <bk-select
                                v-if="props.row.source === 'FIELD'"
                                v-model="props.row.value"
                                behavior="simplicity"
                                placeholder="请选择变量"
                                style="width: 110px"
                                :searchable="true"
                                @change="handleValueChange($event, props.row)">
                                <bk-option v-for="field in fieldList" :key="field.key" :id="field.key" :name="field.name"></bk-option>
                            </bk-select>
                            <template v-else>
                                <bk-input
                                    v-if="['string', 'number'].includes(props.row.type)"
                                    v-model="props.row.value"
                                    behavior="simplicity"
                                    placeholder="请输入参数值"
                                    style="width: 110px"
                                    :type="props.row.type === 'number' ? 'number' : 'text'"
                                    @change="handleValueChange($event, props.row)">
                                </bk-input>
                                <bk-select
                                    v-if="props.row.type === 'boolean'"
                                    v-model="props.row.value"
                                    @change="handleValueChange($event, props.row)">
                                    <bk-option :id="true" name="true"></bk-option>
                                    <bk-option :id="false" name="false"></bk-option>
                                </bk-select>
                            </template>
                        </template>
                        <span v-else>{{ props.row.value }}</span>
                    </div>
                </template>
            </bk-table-column>
        </bk-table>
    </div>
</template>
<script>
    import cloneDeep from 'lodash.clonedeep'
    import { transSchemeToList } from '../../../../common/apiScheme'

    export default {
        name: 'PostRequestParams',
        props: {
            flowId: Number,
            nodeId: Number,
            params: {
                type: Object,
                default: () => ({})
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
            const list = []
            transSchemeToList(this.params, list)
            const paramsList = this.getParamsList(list)
            return {
                paramsList,
                paramsTableData: paramsList.slice(0),
                localVal: cloneDeep(this.value),
                fieldList: [],
                fieldListLoading: false
            }
        },
        watch: {
            params (val) {
                const list = []
                transSchemeToList(val, list)
                const paramsList = this.getParamsList(list)
                this.paramsList = paramsList
                this.paramsTableData = paramsList.slice(0)
            },
            value (val) {
                this.localVal = cloneDeep(val)
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
            // 拍平层级后的数据增加source、value
            getParamsList (list) {
                return list.map(item => {
                    let value = ''
                    let source = ''
                    const canSetValue = this.editable && !['object', 'array'].includes(item.type)
                    if (canSetValue) {
                        const paramPath = this.getParamPath(item, list)
                        value = paramPath.reduce((acc, crt) => acc[crt], this.value)
                        source = /^\$\{params_.*\}$/.test(item.value) ? 'FIELD' : 'CUSTOM'
                    }
                    return { ...item, value, source, canSetValue }
                })
            },
            // 获取字段路径
            getParamPath (param, list) {
                let path = [param.key]
                if (param.parentId) {
                    const parentParam = list.find(item => item.id === param.parentId)
                    const parentPath = this.getParamPath(parentParam, list)
                    if (parentParam.type === 'array') {
                        parentPath.push(0)
                    }
                    path = [...parentPath, ...path]
                }
                return path
            },
            // 请求参数展开、收起
            handleParamExtend (prop) {
                prop.extend = !prop.extend
                if (prop.extend) {
                    // 展开
                    const index = this.paramsList.findIndex(item => item.id === prop.id)
                    const list = []
                    this.paramsList.slice(index + 1).some(item => {
                        if (item.level > prop.level) {
                            const parentParam = this.paramsList.find(p => p.id === item.parentId)
                            if (parentParam.extend) {
                                list.push(item)
                            }
                            return false
                        }
                        return true
                    })
                    this.paramsTableData.splice(index + 1, 0, ...list)
                } else {
                    // 收起
                    let num = 0
                    const index = this.paramsTableData.findIndex(item => item.id === prop.id)
                    this.paramsTableData.slice(index + 1).some(item => {
                        if (item.level > prop.level) {
                            num += 1
                            return false
                        }
                        return true
                    })
                    this.paramsTableData.splice(index + 1, num)
                }
            },
            handleValueChange (val, param) {
                const paramPath = this.getParamPath(param, this.paramsList)
                const pathLen = paramPath.length
                paramPath.reduce((acc, crt, index) => {
                    if (index === pathLen - 1) {
                        acc[crt] = val
                    }
                    return acc[crt]
                }, this.localVal)
                this.$emit('change', cloneDeep(this.localVal))
            }
        }
    }
</script>
<style lang="postcss" scoped>
.key {
  position: relative;

  .fold-icon {
    position: absolute;
    top: 2px;
    left: -15px;
    display: inline-block;
    color: #c0c4cc;
    font-size: 14px;
    cursor: pointer;
    transition: transform 0.2s ease-in-out;

    &:hover {
      color: #3a84ff;
    }

    &.extend {
      transform: rotate(90deg);
    }
  }
}

.params-value {
  display: flex;
  align-items: center;
}
</style>
