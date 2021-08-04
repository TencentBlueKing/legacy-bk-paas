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
        <remote
            name="initFormData"
            title="初始表单数据（初始化数据将会覆盖已有数据）"
            :tips="functionTips"
            :default-value="{}"
            :remote-validate="validateObject"
            :change="getInitData"
        >
        </remote>

        <div class="form-item-list">
            <div
                v-for="(item, index) in formItemList"
                :key="index"
                class="form-item"
                @click="handleShowOperation(index)">
                <section>
                    <span>{{ item.renderProps.label.val }}</span>
                    <span class="property">({{ item.renderProps.property.val }})</span>
                </section>
                <span class="form-item-delete" @click.stop="handleDelete(index)"><i class="bk-icon icon-close"></i></span>
            </div>
        </div>
        <div class="table-column-add" @click="handleShowOperation(-1)">
            <i class="bk-icon icon-plus-circle"></i>继续添加表单项
        </div>
        <!-- <div class="form-item-title" style="margin-top: 20px;">表单操作配置</div>
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
        </div> -->
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
                <!-- <bk-form-item label="验证规则" error-display-type="normal">
                    <bk-input v-model="formItemData.validate" />
                </bk-form-item> -->
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
    import remote from '@/element-materials/modifier/component/props/components/strategy/remote'
    import { camelCase, camelCaseTransformMerge } from 'change-case'

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
            directive: initDirective,
            slot: initSlots
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
        // 初始化 slot
        const renderSlots = initSlots || {}

        return {
            componentId: `${name}-${uuid()}`,
            renderKey: uuid(),
            name,
            type,
            inFormItem: true,
            renderProps,
            renderStyles,
            renderEvents: {},
            renderDirectives,
            renderSlots
        }
    }

    const targetDataAppendChild = (parentNode, targetNode) => {
        parentNode.renderSlots.default.val.push(targetNode)
    }

    const createTargetDataFormItemNode = ({ type, label, property, required }, isActionFormItem = false) => {
        return {
            name: 'bk-form-item',
            type: 'bk-form-item',
            componentId: `bk-form-item-${uuid()}`,
            actionItem: isActionFormItem,
            renderKey: uuid(),
            renderStyle: {},
            renderProps: !isActionFormItem ? {
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
                }
            } : {
            },
            renderSlots: {
                default: {
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
        required: false,
        validate: []
    })

    export default {
        name: '',
        components: {
            remote
        },
        inheritAttrs: false,
        props: {
            slotVal: {
                type: Object,
                required: true
            },
            slotConfig: {
                type: Object,
                default: () => ({})
            },
            renderProps: {
                type: Object
            },
            change: {
                type: Function,
                default: () => {}
            }
        },
        data () {
            return {
                functionTips: `请返回一个对象，对象每一项的key值将作为表单项的字段名称，value值将作为表单项类型的判断依据，eg：
                {
                    string: '',
                    boolean: false,
                    array: [1, 2, 3]
                }`,
                formItemList: [],
                formActionList: [],
                formModelList: [],
                formModelMap: {},
                isShowOperation: false,
                editIndex: -1,
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
                'radio-group',
                'checkbox-group'
            ]

            this.formItemList = []
            this.formActionList = []
            this.formModelList = this.getModelFromTargetData()
            const slotVal = this.slotVal.val
            const slotList = cloneDeep(slotVal)
            slotList.forEach(_ => {
                const componentDataa = cloneDeep(_)
                if (_.type === 'bk-form-item' && _.actionItem !== true) {
                    this.formItemList.push(componentDataa)
                } else if (_.type === 'bk-form-item' && _.actionItem === true) {
                    this.formActionList.push(componentDataa)
                }
            })
            if (slotList.length < 1) {
                const actionFormItem = createTargetDataFormItemNode({}, true)
                const submitNode = createTargetDataNode('button', {
                    prop: {
                        theme: 'primary'
                    },
                    style: {
                        margin: '5px'
                    },
                    slot: {
                        default: {
                            name: 'html',
                            type: 'text',
                            val: '提交'
                        }
                    }
                })
                const cancelNode = createTargetDataNode('button', {
                    prop: {
                    },
                    style: {
                        margin: '5px'
                    },
                    slot: {
                        default: {
                            name: 'html',
                            type: 'text',
                            val: '取消'
                        }
                    }
                })
                targetDataAppendChild(actionFormItem, submitNode)
                targetDataAppendChild(actionFormItem, cancelNode)
                this.formActionList.push(actionFormItem)
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
                const model = {
                    type: 'hidden',
                    val: this.getFormModelMap()
                }
                const renderProps = {
                    ...this.renderProps,
                    model
                }
                this.$emit('batchUpdate', { renderProps })

                const slot = {
                    ...this.slotVal,
                    val: JSON.parse(JSON.stringify([...this.formItemList, ...this.formActionList]))
                }
                this.change(slot)
            },
            /**
             * @desc 删除表达项
             * @param {Number} index 表单项索引
            */
            handleDelete (index) {
                this.formItemList.splice(index, 1)
                this.formModelList.splice(index, 1)
                this.triggerChange()
            },
            /**
             * @desc 编辑表单项属性
             * @param {Number} index 表单项索引
            */
            handleShowOperation (index = -1) {
                this.editIndex = index
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
                        this.createTargetDataFromItem(this.formItemData)
                        this.handleCancel()
                        this.triggerChange()
                    })
            },
            createTargetDataFromItem (formItemData) {
                const formItemNode = createTargetDataFormItemNode(formItemData)
                const defaultVal = this.getDefaultValFromType(formItemData.type)
                const modelItem = { key: formItemData.property, value: defaultVal }
                let style = {}
                if (['input', 'select', 'date-picker', 'time-picker'].includes(formItemData.type)) {
                    style = {
                        'width': '300px'
                    }
                }
                const inputNode = createTargetDataNode(formItemData.type, {
                    style,
                    directive: {
                        'v-model': `${camelCase(this.curSelectedComponentData.componentId, { transform: camelCaseTransformMerge })}model.${formItemData.property}`
                    }
                })
                if (this.editIndex > -1 && this.formItemList[this.editIndex]) {
                    this.formItemList.splice(this.editIndex, 1, formItemNode)
                    this.formModelList.splice(this.editIndex, 1, modelItem)
                } else {
                    this.formItemList.push(formItemNode)
                    this.formModelList.push(modelItem)
                }
                targetDataAppendChild(formItemNode, inputNode)
            },
            /**
             * @desc 关闭表单项标记框
            */
            handleCancel () {
                this.editIndex = -1
                this.isShowOperation = false
                this.formItemData = generateFormData()
            },
            validateObject (res) {
                let msg = ''
                if (Object.prototype.toString.call(res) !== '[object Object]') {
                    msg = '请确保函数返回值为object类型'
                }
                return msg
            },
            getFormTypeFromValue (val) {
                let type = 'input'
                if (typeof val === 'boolean') {
                    type = 'switcher'
                } else if (Array.isArray(val)) {
                    type = 'checkbox-group'
                }
                return type
            },
            getDefaultValFromType (type) {
                const typeValMap = {
                    'switcher': false,
                    'checkbox-group': []
                }
                return typeValMap[type] !== undefined ? typeValMap[type] : ''
            },
            getInitData (name, data) {
                if (Object.keys(data).length > 0) {
                    this.formItemList = []
                    this.formModelList = []
                    Object.keys(data).forEach((key) => {
                        const type = this.getFormTypeFromValue(data[key])
                        const formItemData = {
                            type: type,
                            label: key,
                            property: key,
                            required: false,
                            validate: []
                        }
                        this.createTargetDataFromItem(formItemData)
                    })
                    this.triggerChange()
                }
            },
            getFormModelMap () {
                const modelMap = {}
                this.formModelList.forEach(function (obj) {
                    Object.assign(modelMap, { [obj.key]: obj.value })
                })
                return modelMap
            },
            getModelFromTargetData () {
                try {
                    const modelMap = this.curSelectedComponentData.renderProps.model.val || {}
                    const modelList = []
                    for (const i in modelMap) {
                        modelList.push({ key: i, value: modelMap[i] })
                    }
                    return modelList
                } catch (err) {
                    return []
                }
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
            justify-content: space-between;
            height: 32px;
            cursor: pointer;
            .property{
                font-style: italic;
                color: #ccc;
            }
        }
    }
    
</style>
