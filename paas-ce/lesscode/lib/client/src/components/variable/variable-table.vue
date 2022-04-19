<template>
    <section>
        <bk-table :data="filterVariableList"
            :outer-border="false"
            :header-border="false"
            :header-cell-style="{ background: '#f0f1f5' }"
            class="variable-table"
            size="medium"
        >
            <bk-table-column label="变量名称" prop="variableName" show-overflow-tooltip></bk-table-column>
            <bk-table-column label="变量标识" prop="variableCode" show-overflow-tooltip></bk-table-column>
            <bk-table-column label="初始类型" prop="valueType" :formatter="valueTypeFormatter" show-overflow-tooltip></bk-table-column>
            <bk-table-column label="默认值" width="300">
                <template slot-scope="props">
                    <span v-for="(val, key) in getDisplayDefaultValue(props.row)" :key="key" class="default-value" v-bk-overflow-tips>{{ `【${nameMap[key]}】${val}` }}</span>
                </template>
            </bk-table-column>
            <bk-table-column label="引用" width="100" show-overflow-tooltip>
                <template slot-scope="props">
                    <span v-bk-tooltips.light="{ content: getUseInfoTips(props.row.useInfo).join('<br>'), disabled: !getUseInfoTips(props.row.useInfo).length }" class="use-info">
                        {{ getUseInfoTips(props.row.useInfo).length }}
                    </span>
                </template>
            </bk-table-column>
            <bk-table-column label="生效范围" prop="effectiveRange" :formatter="effectiveRangeFormatter" show-overflow-tooltip></bk-table-column>
            <template v-if="!simpleDisplay">
                <bk-table-column label="变量说明" prop="description" show-overflow-tooltip>
                    <template slot-scope="props">
                        <span>{{ props.row.description || '--' }}</span>
                    </template>
                </bk-table-column>
                <bk-table-column label="更新人" prop="updateUser" show-overflow-tooltip width="150"></bk-table-column>
                <bk-table-column label="更新时间" prop="updateTime" :formatter="timeFormatter" show-overflow-tooltip></bk-table-column>
            </template>
            <bk-table-column label="操作" width="120">
                <template slot-scope="props">
                    <span @click="showVariableForm(props.row)"
                        v-bk-tooltips="{ content: getEditStatus(props.row), disabled: !getEditStatus(props.row) }"
                        :class="{ 'table-btn': true, disable: getEditStatus(props.row) }"
                    >编辑</span>
                    <span @click="showDeleteVariable(props.row)"
                        v-bk-tooltips="{ content: getDeleteStatus(props.row), disabled: !getDeleteStatus(props.row) }"
                        :class="{ 'table-btn': true, disable: getDeleteStatus(props.row) }"
                    >删除</span>
                </template>
            </bk-table-column>
        </bk-table>
        <slot>
            <span class="variable-tip">
                提示：
                <br>1. 可以在组件属性和指令的配置面板中使用该变量
                <br>2. 在函数插槽中可以使用【lesscode.变量标识】唤醒编辑器自动补全功能选择对应变量，来获取或者修改该变量的值
                <br>3. 在远程函数中，参数 Api Url 和 Api Data 的值可用 <span v-pre>{{变量标识}}</span> 来获取变量值
            </span>
        </slot>

        <bk-dialog v-model="deleteObj.visible"
            render-directive="if"
            theme="primary"
            ext-cls="delete-dialog-wrapper"
            title="删除变量"
            width="400"
            footer-position="center"
            :mask-close="false"
            :auto-close="false"
        >
            确定删除变量【{{ deleteObj.code }}】？
            <div class="dialog-footer" slot="footer">
                <bk-button
                    theme="danger"
                    :loading="deleteObj.loading"
                    @click="requestDeleteVariable(deleteObj.id)"
                >删除</bk-button>
                <bk-button @click="handleDeleteCancel" :disabled="deleteObj.loading">取消</bk-button>
            </div>
        </bk-dialog>
    </section>
</template>

<script>
    import dayjs from 'dayjs'
    import { mapGetters, mapActions, mapState } from 'vuex'

    export default {
        props: {
            simpleDisplay: {
                type: Boolean,
                default: false
            },
            variableName: {
                type: String,
                default: ''
            }
        },

        data () {
            return {
                nameMap: {
                    all: '所有环境',
                    stag: '预发布环境',
                    prod: '生产环境'
                },
                deleteObj: {
                    visible: false,
                    code: '',
                    loading: false
                },
                projectVariableList: []
            }
        },

        computed: {
            ...mapGetters('variable', ['variableList']),
            ...mapState(['user']),
            ...mapGetters('member', ['userPerm']),
            ...mapGetters('page', ['pageDetail']),
            ...mapGetters('projectVersion', { versionId: 'currentVersionId' }),

            filterVariableList () {
                return (this.variableList || []).filter((variable) => {
                    return (variable.variableName || '').includes(this.variableName)
                })
            },

            projectId () {
                return this.$route.params.projectId
            }
        },

        created () {
            this.getProjectVariableList()
        },

        methods: {
            ...mapActions('variable', ['deleteVariable', 'setVariableFormData', 'getAllVariable', 'getAllProjectVariable']),

            // 变量存在页面变量使用全局变量的情况，所以需要获取项目所有变量来展示
            getProjectVariableList () {
                this.getAllProjectVariable({ projectId: this.projectId, versionId: this.versionId }).then((res) => {
                    this.projectVariableList = res || []
                })
            },

            getEditStatus (row) {
                let tip = ''
                if (this.simpleDisplay && row.effectiveRange === 0) tip = '项目级变量，请到变量管理进行修改'
                return tip
            },

            getDeleteStatus (row) {
                const user = this.user || {}
                const username = user.bk_username || user.username
                let tip = ''
                if (this.userPerm.roleId !== 1 && username !== row.createUser) tip = '只有管理员或自己创建的才有删除权限'
                if (this.getUseInfoTips(row.useInfo).length > 0) tip = '该变量被引用，无法删除'
                if (this.simpleDisplay && row.effectiveRange === 0) tip = '项目级变量，请到变量管理进行删除'
                return tip
            },

            showVariableForm (form = {}) {
                const isDisable = this.getEditStatus(form)
                if (isDisable) return
                const data = { show: true, form }
                this.setVariableFormData(data)
            },

            showDeleteVariable (row) {
                const isDisable = this.getDeleteStatus(row)
                if (isDisable) return
                this.deleteObj.id = row.id
                this.deleteObj.code = row.variableCode
                this.deleteObj.visible = true
            },

            requestDeleteVariable (id) {
                this.deleteObj.loading = true
                this.deleteVariable(id).then(() => {
                    return this.refreshVariable()
                }).catch((err) => {
                    this.$bkMessage({ theme: 'error', message: err.message || err })
                }).finally(() => {
                    this.deleteObj.loading = false
                    this.deleteObj.visible = false
                })
            },

            refreshVariable () {
                const routerParams = this.$route.params || {}
                const params = { projectId: routerParams.projectId, effectiveRange: 0 }
                if (routerParams.pageId) {
                    params.pageCode = this.pageDetail.pageCode
                }
                return this.getAllVariable(params)
            },

            handleDeleteCancel () {
                this.deleteObj.visible = false
            },

            timeFormatter (obj, con, val) {
                return val ? dayjs(val).format('YYYY-MM-DD HH:mm:ss') : '--'
            },

            getDisplayDefaultValue (row) {
                const valList = {}
                const defaultVal = row.defaultValue || {}
                const showKeyList = row.defaultValueType === 0 ? ['all'] : ['prod', 'stag']
                showKeyList.forEach((key) => {
                    let val = defaultVal[key]
                    if (![3, 4].includes(row.valueType)) val = JSON.stringify(val)
                    valList[key] = val
                })
                return valList
            },

            effectiveRangeFormatter (obj, con, val) {
                const rangeMap = {
                    0: '本项目',
                    1: `页面【${obj.pageCode}】`
                }
                return rangeMap[val]
            },

            valueTypeFormatter (obj, con, val) {
                const valueTypeMap = {
                    0: 'String',
                    1: 'Number',
                    2: 'Boolean',
                    3: 'Array',
                    4: 'Object',
                    5: '图片地址',
                    6: '计算变量'
                }
                return valueTypeMap[obj.valueType]
            },

            getUseInfoTips (useInfo) {
                const tips = [];
                (useInfo || []).forEach((item) => {
                    const { pageCode, funcCode, type, useInfo, parentVariableId } = item
                    switch (type) {
                        case 'func':
                            tips.push(`函数【${funcCode}】`)
                            break
                        case 'var':
                            const variable = this.projectVariableList.find((variable) => (variable.id === parentVariableId)) || {}
                            tips.push(`变量【${variable.variableCode}】`)
                            break
                        default:
                            (useInfo || []).forEach((detail) => {
                                if (detail.type === 'v-bind') {
                                    const modifiers = (detail.modifiers || []).join('.')
                                    const modifierStr = modifiers ? `，修饰符为${modifiers}` : ''
                                    tips.push(`页面【${pageCode}】内组件【${detail.componentId}】的【${detail.prop}】属性${modifierStr}`)
                                } else if (detail.source === 'prop') {
                                    tips.push(`页面【${pageCode}】内组件【${detail.componentId}】的【${detail.key}】属性`)
                                } else if (detail.source === 'slot') {
                                    tips.push(`页面【${pageCode}】内组件【${detail.componentId}】的【${detail.key}】插槽`)
                                } else if (detail.type === 'slots') {
                                    tips.push(`页面【${pageCode}】内组件【${detail.componentId}】的【${detail.slot}】插槽`)
                                } else {
                                    tips.push(`页面【${pageCode}】内组件【${detail.componentId}】的【${detail.type}】指令`)
                                }
                            })
                            break
                    }
                })
                return tips
            }
        }
    }
</script>

<style lang="postcss" scoped>
    @import "@/css/mixins/scroller";

    .variable-table {
        margin-bottom: 12px;
        &:before {
            height: 0;
        }
        /deep/ .bk-table-body-wrapper {
            @mixin scroller;
            max-height: calc(100vh - 350px);
            overflow-y: auto;
            .bk-table-1-column-4 div {
                -webkit-line-clamp: 2;
            }
        }
        .table-btn {
            margin-right: 15px;
            cursor: pointer;
            color: #3a84ff;
            &.disable {
                cursor: not-allowed;
                color: #dcdee5;
            }
        }
        .use-info {
            color: #3a84ff;
            cursor: pointer;
        }
        .default-value {
            display: block;
            width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: normal;
            word-break: break-all;
            display: -webkit-box;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
        }
    }
    .variable-tip {
        font-size: 12px;
        color: #979ba5;
        line-height: 16px;
    }
    /deep/ .delete-dialog-wrapper {
        .bk-dialog-footer {
            text-align: center;
            padding: 0 65px 40px;
            background-color: #fff;
            border: none;
            border-radius: 0;
        }
        .dialog-footer {
            button {
                width: 86px;
            }
        }
    }
</style>
