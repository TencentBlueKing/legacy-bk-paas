<!--
  Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
  Copyright (C) 2017-2019 THL A29 Limited, a Tencent company. All rights reserved.
  Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License.
  You may obtain a copy of the License at
  http://opensource.org/licenses/MIT
  Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on
  an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
  specific language governing permissions and limitations under the License.
-->

<template>
    <div :class="['page-setting', { function: type === 'pageFunction' }]">
        <div class="title">{{ setting.title }}</div>
        <div class="setting-list">
            <div class="setting-item" v-for="(field, index) in setting.settingFields" :key="index">
                <div class="field-label">
                    <span v-bk-tooltips="{ content: field.desc, disabled: !field.desc }" class="field-display-name">{{field.name}}</span>：
                </div>
                <div :class="['field-value', { 'is-loading': loadingState.includes(field) }]">
                    <template v-if="field !== editField.field">
                        <div class="field-content">
                            <span class="field-display-value">{{getFieldDisplayValue(field) || '--'}}</span>
                            <i class="bk-icon icon-edit2 field-edit" @click="handleEdit(field)"></i>
                        </div>
                    </template>
                    <template v-else-if="!loadingState.includes(field)">
                        <div class="field-form">
                            <bkSelectFunc
                                :class="`form-component ${field.type}`"
                                v-model.trim="editField.value"
                                v-bind="field.props"
                                :ref="`component-${field.id}`">
                            </bkSelectFunc>
                            <div class="buttons">
                                <bk-button text size="small" theme="primary"
                                    :disabled="disabled"
                                    @click="handleConfirmSave">确定</bk-button>
                                <span class="divider">|</span>
                                <bk-button text size="small" theme="primary" @click="handleCancel">取消</bk-button>
                            </div>
                        </div>
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex'
    import bkSelectFunc from '@/components/methods/select-func'
    import LC from '@/element-materials/core'

    const lifeCycleDescMap = {
        created: '在页面创建完成后被立即调用，这个时候页面还未渲染，可以做获取远程数据的操作',
        beforeMount: '在页面挂载开始之前被调用',
        mounted: '页面被挂载后调用，这个时候页面已经渲染完成，可以做 DOM 操作',
        beforeUpdate: '在数据更新后，页面实时更新前调用，这里适合在更新之前访问现有的 DOM',
        updated: '在数据更新后，页面实时更新后调用',
        activated: '被 keep-alive 缓存的组件激活时调用',
        deactivated: '被 keep-alive 缓存的组件停用时调用',
        beforeDestroy: '页面关闭之前调用，页面中的数据仍然完全可用，可以做离开页面前的操作',
        destroyed: '页面关闭后调用，该钩子被调用后，页面中的数据不可用'
    }

    export default {
        components: {
            bkSelectFunc
        },
        props: {
            project: {
                type: Object,
                default: () => ({})
            },
            type: {
                type: String,
                default: 'pageFunction'
            }
        },
        data () {
            return {
                editField: {
                    field: null,
                    value: null
                },
                loadingState: []
            }
        },
        computed: {
            ...mapGetters('projectVersion', { versionId: 'currentVersionId' }),
            ...mapGetters('page', {
                page: 'pageDetail'
            }),
            ...mapGetters('functions', ['functionList']),
            disabled () {
                const { editField, getFieldValue } = this
                return editField.value === getFieldValue(editField.field)
            },
            projectId () {
                return this.$route.params.projectId
            },
            setting () {
                const lifeCycleKeys = Object.keys(this.page.lifeCycle) || []
                const lifeCycleSettingFields = lifeCycleKeys.map((lifeCycleKey) => {
                    return {
                        id: lifeCycleKey,
                        name: lifeCycleKey,
                        type: 'selectFunc',
                        editable: true,
                        desc: lifeCycleDescMap[lifeCycleKey]
                    }
                })

                const lifeCycleSettings = {
                    title: '生命周期配置',
                    settingFields: lifeCycleSettingFields
                }

                return lifeCycleSettings
            }
        },
        methods: {
            handleEdit (field) {
                this.editField.field = field
                this.editField.value = this.getFieldValue(field)
            },
            handleCancel () {
                this.unsetEditField()
            },
            async handleConfirmSave () {
                const { field, value } = this.editField
                this.loadingState.push(field)
                try {
                    const pageData = await this.saveField(field, value)

                    this.$store.commit('page/updatePageDetail', pageData)
                    this.$store.commit('page/updatePageList', pageData)

                    this.unsetEditField()
                } catch (e) {
                    this.messageError(e.message || e)
                } finally {
                    this.loadingState = this.loadingState.filter(exist => exist !== field)
                }
            },
            async saveField (field, value) {
                let fieldData = { [field.id]: value }
                if (field.id in this.page.lifeCycle) {
                    fieldData = {
                        lifeCycle: {
                            ...this.page.lifeCycle,
                            [field.id]: value
                        }
                    }
                }
                // 遍历 node tree 收集组件中的引用信息
                const relateFuncCodeMap = {}
                const recTree = node => {
                    if (!node) {
                        return
                    }

                    Object.keys(node.method).forEach(methodPathKey => {
                        const methodCode = node.method[methodPathKey].code
                        relateFuncCodeMap[methodCode] = node.componentId
                    })
                    node.children.forEach(childNode => recTree(childNode))
                }
                recTree(LC.getRoot())
                
                // 收集生命周期的函数
                Object.keys(fieldData.lifeCycle).forEach((key) => {
                    const value = fieldData.lifeCycle[key]
                    const methodCode = typeof value === 'object' ? value.methodCode : value
                    if (methodCode) {
                        relateFuncCodeMap[methodCode] = key
                    }
                })
                // 转换成接口需要的数据
                const functionData = []
                const relateFuncCodeKey = Object.keys(relateFuncCodeMap)
                const errorStack = []
                for (let index = 0, l = relateFuncCodeKey.length; index < l; index++) {
                    const methodCode = relateFuncCodeKey[index]
                    const func = this.functionList.find(func => func.funcCode === methodCode)
                    if (!func) {
                        errorStack.push(`页面中【${relateFuncCodeMap[methodCode]}】使用了不存在的函数【${methodCode}】,请修改后再试`)
                    } else {
                        functionData.push(func.id)
                    }
                }
                // 抛出错误
                if (errorStack.length) {
                    throw Error(errorStack.join(';'))
                }
                // 调用方法
                const pageData = {
                    id: this.page.id,
                    ...fieldData
                }
                pageData.lifeCycle = JSON.stringify(pageData.lifeCycle)
                const res = await this.$store.dispatch('page/update', {
                    data: {
                        pageData,
                        projectId: this.projectId,
                        versionId: this.versionId,
                        functionData,
                        from: 'setting'
                    }
                })
                this.page.lifeCycle[field.id] = value
                return res
            },
            getFieldDisplayValue (field) {
                let methodCode = this.page.lifeCycle[field.id] || ''
                let params = []
                if (typeof methodCode === 'object') {
                    params = (methodCode.params || []).map(param => param.value)
                    methodCode = methodCode.methodCode
                }
                const curFunc = this.functionList.find(func => func.funcCode === methodCode) || {}
                return curFunc.funcName ? `${curFunc.funcName}(${params.join(', ')})` : ''
            },
            getFieldValue (field) {
                if (field.id in this.page.lifeCycle) {
                    return this.page.lifeCycle[field.id]
                }
                return this.page[field.id]
            },
            unsetEditField () {
                this.editField.field = this.$options.data.editField
            }
        }
    }
</script>

<style lang="postcss" scoped>
    .page-setting {
        padding: 5px 40px 30px;
        overflow: auto;
        .title {
            font-size: 14px;
            font-weight: 700;
            color: #63656E;
            padding: 20px 0 12px;
        }

        .setting-list {
            padding-left: 24px;

            .setting-item {
                display: flex;
                align-items: flex-start;
                margin-bottom: 10px;
                line-height: 32px;

                .field-label {
                    flex: none;
                    width: 110px;
                    margin-right: 4px;
                    font-size: 12px;
                    color: #63656E;
                }
                .field-value {
                    position: relative;
                    flex: none;
                    width: 410px;

                    .field-content {
                        display: flex;
                        font-size: 12px;

                        .route {
                            .unset {
                                color: #FF9C01;
                            }
                        }
                    }
                    .field-display-value {
                        word-break: break-all;
                    }

                    &.is-loading {
                        font-size: 0;
                        .field-content {
                            display: none;
                        }
                        &:before {
                            content: "";
                            display: inline-block;
                            position: absolute;
                            width: 16px;
                            height: 16px;
                            top: 8px;
                            background-image: url("../../../../../images/svg/loading.svg");
                        }
                    }

                    .form-error {
                        position: absolute;
                        top: 100%;
                        left: 0;
                        font-size: 12px;
                        color: #ff5656;
                        line-height: 18px;
                        margin: 2px 0px 0px;
                    }
                }

                .field-edit {
                    position: relative;
                    font-size: 22px;
                    top: 5px;
                    cursor: pointer;
                    &:hover {
                        color: #3A84FF;
                    }
                }
            }
        }

        .field-form {
            display: flex;
            align-items: center;
            .form-component {
                width: 100%;
            }
            .buttons {
                display: flex;
                align-items: center;
                margin-left: 4px;

                .bk-button-text {
                    width: 36px;
                    padding: 0 6px;
                }
                .divider {
                    color: #979BA5;
                    line-height: 26px;
                    margin-top: -2px;
                }
            }
        }

        &.function {
            .field-form {
                align-items: flex-start;
            }
            .field-display-name {
                cursor: pointer;
                border-bottom: 1px dashed #999;
            }
        }
    }
    .bk-option-name {
        .bound {
            color: #c4c6cc;
        }
    }
</style>
