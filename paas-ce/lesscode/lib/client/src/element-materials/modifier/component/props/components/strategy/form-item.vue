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
    <div>
        <div class="form-item-title">表单项配置</div>
        <div class="form-item-list">
            <div
                v-for="(item, index) in formItemList"
                :key="index"
                class="form-item"
                @click="handleShowOperation(index)">
                <span>{{ item.renderProps.label.val }}</span>
                <span class="property">({{ item.renderProps.property.val }})</span>
            </div>
        </div>
        <div class="table-column-add" @click="handleShowOperation(-1)">
            <i class="bk-icon icon-plus-circle"></i>继续添加
        </div>
        <div class="form-item-title" style="margin-top: 20px;">表单操作配置</div>
        <div>
            <template v-for="actionButton in formActionList">
                <bk-button
                    :theme="actionButton.renderProps.theme.val"
                    :key="actionButton.componentId"
                    class="mr10"
                    size="small">
                    {{ actionButton.renderProps.slots.val }}
                </bk-button>
            </template>
            <div class="action-create">
                <i class="bk-icon" />
            </div>
        </div>
        <bk-dialog
            v-model="isShowOperation"
            title="表单项设置">
            <bk-form
                ref="operation"
                :model="formItemData"
                :rules="rules"
                :label-width="80">
                <bk-form-item label="表单类型" error-display-type="normal">
                    <bk-select v-model="formItemData.type">
                        <bk-option
                            v-for="itemName in formItemTypeList"
                            :id="itemName"
                            :name="itemName"
                            :key="itemName" />
                    </bk-select>
                </bk-form-item>
                <bk-form-item label="显示名称" required property="label" error-display-type="normal">
                    <bk-input v-model="formItemData.label" />
                </bk-form-item>
                <bk-form-item label="字段名称" required property="property" error-display-type="normal">
                    <bk-input v-model="formItemData.property" />
                </bk-form-item>
                <bk-form-item label="是否必填" error-display-type="normal">
                    <bk-radio-group v-model="formItemData.required">
                        <bk-radio :value="true" class="mr10">是</bk-radio>
                        <bk-radio :value="false">否</bk-radio>
                    </bk-radio-group>
                </bk-form-item>
                <bk-form-item label="验证规则" error-display-type="normal">
                    <bk-input v-model="formItemData.validate" />
                </bk-form-item>
            </bk-form>
            <template slot="footer">
                <bk-button theme="primary" class="mr10" @click="handleSave">保存</bk-button>
                <bk-button @click="handleCancel">取消</bk-button>
            </template>
        </bk-dialog>
    </div>
</template>
<script>
    import { mapGetters } from 'vuex'
    import cloneDeep from 'lodash.clonedeep'
    import { uuid } from '@/common/util'
    import componentList from '@/element-materials/materials'

    const createTargetDataNode = (componentType, payload) => {
        const component = componentList.bk.find(_ => _.name === componentType)
        const {
            name = '',
            type = '',
            props = {},
            directives = []
        } = component
        const {
            style: initStyle,
            prop: initProp,
            directive: initDirective
        } = payload
        // 初始化  prop
        const renderProps = {}
        for (const propName in props) {
            if (props[propName].hasOwnProperty('val') && props[propName].val !== '') {
                renderProps[propName] = cloneDeep(props[propName])
            }
        }
        for (const propName in initProp) {
            renderProps[propName].val = initProp[propName]
        }
        // 初始化 style
        const renderStyles = {}
        for (const styleName in initStyle) {
            renderStyles[styleName] = initStyle[styleName]
        }
        // 初始化 directive
        const renderDirectives = directives.map(_ => cloneDeep(_))
        for (const directiveType in initDirective) {
            const curDirective = renderDirectives.find(_ => _.type === directiveType)
            if (curDirective) {
                curDirective.val = initDirective[directiveType]
            }
        }

        return {
            componentId: `${name}-${uuid()}`,
            renderKey: uuid(),
            name,
            type,
            renderProps,
            renderStyles,
            renderEvents: {},
            renderDirectives
        }
    }

    const targetDataAppendChild = (parentNode, targetNode) => {
        parentNode.renderProps.slots.val.push(targetNode)
    }

    const createTargetDataFormItemNode = ({ type, label, property, required }) => {
        return {
            name: 'bk-form-item',
            type: 'bk-form-item',
            componentId: `bk-form-item-${uuid()}`,
            renderKey: uuid(),
            renderStyle: {},
            renderProps: {
                label: {
                    type: 'string',
                    val: label
                },
                property: {
                    type: 'string',
                    val: property
                },
                required: {
                    type: Boolean,
                    val: required
                },
                slots: {
                    type: 'form-item-content',
                    name: 'form-item-content',
                    val: []
                }
            }
        }
    }

    const generateFormData = () => ({
        type: 'input',
        label: '',
        property: '',
        required: false
        // validate: ''
    })

    export default {
        name: '',
        inheritAttrs: false,
        props: {
            defaultValue: {
                type: Array,
                required: true
            },
            change: {
                type: Function,
                default: () => {}
            },
            type: String
        },
        data () {
            return {
                formItemList: [],
                formActionList: [],
                isShowOperation: false,
                formItemData: generateFormData()
            }
        },
        computed: {
            ...mapGetters('drag', ['curSelectedComponentData'])
        },
        created () {
            this.formItemTypeList = [
                'input',
                'select',
                'date-picker',
                'time-picker',
                'switcher',
                'rate',
                'radio-group',
                'checkbox-group'
            ]

            this.formItemList = []
            this.formActionList = []
            const slotList = cloneDeep(this.defaultValue)
            slotList.forEach(_ => {
                const componentDataa = cloneDeep(_)
                if (_.type === 'bk-form-item') {
                    this.formItemList.push(componentDataa)
                } else if (_.type === 'bk-button') {
                    this.formActionList.push(componentDataa)
                }
            })
            if (slotList.length < 1) {
                this.formActionList = [
                    createTargetDataNode('button', {
                        prop: {
                            theme: 'primary',
                            slots: '提交'
                        }
                    }),
                    createTargetDataNode('button', {
                        prop: {
                            slots: '取消'
                        }
                    })
                ]
            }
            this.rules = {
                label: [
                    {
                        required: true,
                        message: '显示名称必填',
                        trigger: 'blur'
                    }
                ],
                property: [
                    {
                        required: true,
                        message: '字段名称名称必填',
                        trigger: 'blur'
                    },
                    {
                        validator: value => /^[a-zA-Z_][0-9a-zA-Z_-]{0,29}$/.test(value),
                        message: '字段名称：以英文字符、下划线开头；只允许英文字符、数字、下划线、和 -',
                        trigger: 'blur'
                    }
                ]
            }
        },
        methods: {
            /**
             * 更新属性值
            */
            triggerChange () {
                console.log('from item change ===================\n\n', this.formItemList)
                this.change('slots', [...this.formItemList, ...this.formActionList], this.type)
            },
            /**
             * @desc 删除表达项
             * @param {Number} index 表单项索引
            */
            handleDelete (index) {
                if (this.formItemList.length === 1) {
                    return
                }
                this.formItemList.splice(index, 1)
                this.triggerChange()
            },
            /**
             * @desc 编辑表单项属性
             * @param {Number} index 表单项索引
            */
            handleShowOperation (index = -1) {
                if (index > -1) {
                    const {
                        renderProps: formItemRenderProps
                    } = this.formItemList[index]
                    const {
                        label,
                        property,
                        required,
                        slots
                    } = formItemRenderProps
                    this.formItemData = {
                        label: label.val,
                        property: property.val,
                        required: required.val,
                        type: slots.val[0].name
                    }
                }
                this.isShowOperation = true
            },
            /**
             * @desc 提交表单项
            */
            handleSave () {
                this.$refs.operation.validate()
                    .then(() => {
                        const formItemNode = createTargetDataFormItemNode(this.formItemData)
                        let style = {}
                        if (['input', 'select', 'date-picker', 'time-picker'].includes(this.formItemData.type)) {
                            style = {
                                'width': '300px'
                            }
                        }
                        const inputNode = createTargetDataNode(this.formItemData.type, {
                            style,
                            directive: {}
                            // directive: {
                            //     'v-model': `${this.curSelectedComponentData.componentId}.${this.formItemData.property}`
                            // }
                        })
                        targetDataAppendChild(formItemNode, inputNode)
                        this.formItemList.push(formItemNode)
                        this.handleCancel()
                        this.triggerChange()
                    })
            },
            /**
             * @desc 关闭表单项标记框
            */
            handleCancel () {
                this.isShowOperation = false
                this.formItemData = generateFormData()
            }
        }
    }
</script>
<style lang='postcss'>
    .form-item-title {
        height: 28px;
        font-size: 12px;
        font-weight: bold;
        color: #63656E;
    }
    .form-item-list {
        display: flex;
        flex-direction: column;
        .form-item{
            display: flex;
            align-items: center;
            height: 32px;
            cursor: pointer;
            .property{
                font-style: italic;
                color: #ccc;
            }
        }
    }
    
</style>
