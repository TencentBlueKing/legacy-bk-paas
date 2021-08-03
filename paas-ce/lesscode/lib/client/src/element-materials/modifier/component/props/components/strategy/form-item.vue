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
        <div class="form-slot-title" v-bk-tooltips="{ content: functionTips, width: 290 }">
            <span class=" under-line">初始化表单数据（初始化数据将会覆盖已有数据）</span>
        </div>

        <remote
            name="initFormData"
            title=""
            :auto-get-data="false"
            :default-value="{}"
            :remote-validate="validateObject"
            :change="getInitData"
        >
        </remote>

        <div class="form-slot-title" style="margin-top: 20px;">表单内容配置</div>

        <div class="form-item-list">
            <vue-draggable
                ghost-class="block-item-ghost"
                :list="formItemList"
                @change="orderChange"
                handle=".option-col-drag"
            >
                <transition-group type="transition" :name="'flip-list'">
                    <div
                        v-for="(item, index) in formItemList"
                        :key="index"
                        class="form-item"
                    >
                        <section class="item-name">
                            <span>{{ item.renderProps.label.val }}</span>
                            <span class="property">({{ item.renderProps.property.val }})</span>
                        </section>
                        <section class="operate-btns">
                            <span class="form-item-edit" @click.stop="handleShowOperation(index)"><i class="bk-drag-icon bk-drag-edit"></i></span>
                            <span class="form-item-drag option-col-drag"><i class="bk-drag-icon bk-drag-drag-small1"></i></span>
                            <span class="form-item-delete" @click.stop="handleDelete(index)"><i class="bk-icon icon-close"></i></span>
                        </section>
                    </div>
                </transition-group>
            </vue-draggable>
        </div>
        <div class="table-column-add" @click="handleShowOperation(-1)">
            继续添加表单项
        </div>

        <form-item-edit :is-show="isShowOperation" :default-value="formItemData" :default-rule="getFormRule(formItemData.property)" :submit="handleSave" :close="handleCancel"></form-item-edit>
    </div>
</template>
<script>
    import { mapGetters } from 'vuex'
    import cloneDeep from 'lodash.clonedeep'
    import { uuid } from '@/common/util'
    import componentList from '@/element-materials/materials'
    import remote from './remote'
    import formItemEdit from './form-item-edit'
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
            inFormItem: true,
            renderProps,
            renderStyles,
            renderEvents: {},
            renderDirectives
        }
    }

    const targetDataAppendChild = (parentNode, targetNode) => {
        parentNode.renderProps.slots.val.push(targetNode)
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
                },
                'error-display-type': {
                    type: 'string',
                    val: 'normal'
                },
                slots: {
                    type: 'form-item-content',
                    name: 'form-item-content',
                    val: []
                }
            } : {
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
        required: false,
        validate: []
    })

    export default {
        name: '',
        components: {
            remote,
            formItemEdit
        },
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
                functionTips: `请返回一个对象，对象每一项的key值将作为表单项的字段名称，value值将作为表单项类型的判断依据，eg：
                {
                    string: '',
                    boolean: false,
                    array: [1, 2, 3]
                }`,
                formItemList: [],
                formActionList: [],
                formModelList: [],
                formRuleList: [],
                isShowOperation: false,
                editIndex: -1,
                formItemData: generateFormData()
            }
        },
        computed: {
            ...mapGetters('drag', ['curSelectedComponentData'])
        },
        created () {
            this.formItemList = []
            this.formActionList = []
            // this.formModelList = this.getModelFromTargetData()
            this.initModelAndRule()
            const slotList = cloneDeep(this.defaultValue)
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
                        theme: 'primary',
                        slots: '提交'
                    },
                    style: {
                        margin: '5px'
                    }
                })
                const cancelNode = createTargetDataNode('button', {
                    prop: {
                        slots: '取消'
                    },
                    style: {
                        margin: '5px'
                    }
                })
                targetDataAppendChild(actionFormItem, submitNode)
                targetDataAppendChild(actionFormItem, cancelNode)
                this.formActionList.push(actionFormItem)
            }
        },
        methods: {
            /**
             * 更新属性值
            */
            triggerChange () {
                this.change('slots', [...this.formItemList, ...this.formActionList], this.type)
                this.change('model', this.getFormModelMap(), 'hidden')
                this.change('rules', this.getFormRuleMap(), 'hidden')
            },
            orderChange () {
                const modelList = []
                const ruleList = []
                
                this.formItemList.forEach((item) => {
                    const property = item.renderProps.property.val
                    if (property) {
                        const modelItem = this.formModelList.find(model => model.key === property)
                        const ruleItem = this.formRuleList.find(rule => rule.key === property)
                        modelList.push(modelItem)
                        ruleList.push(ruleItem)
                    }
                })
                this.formModelList = modelList
                this.formRuleList = ruleList

                this.triggerChange()
            },
            /**
             * @desc 删除表达项
             * @param {Number} index 表单项索引
            */
            handleDelete (index) {
                this.formItemList.splice(index, 1)
                this.formModelList.splice(index, 1)
                this.formRuleList.splice(index, 1)
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
            handleSave (itemData) {
                const hasRequired = ((itemData.validate || []).filter(item => item.required === true).length > 0)
                // 将校验规则里的required同步到form-item层级
                this.formItemData = Object.assign({}, itemData, { required: hasRequired })
                this.createTargetDataFromItem(this.formItemData)
                this.handleCancel()
                this.triggerChange()
            },
            
            createTargetDataFromItem (formItemData) {
                const formItemNode = createTargetDataFormItemNode(formItemData)
                const defaultVal = this.getDefaultValFromType(formItemData.type)
                const modelItem = { key: formItemData.property, value: defaultVal }
                const ruleItem = { key: formItemData.property, value: formItemData.validate || [] }
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
                    this.formRuleList.splice(this.editIndex, 1, ruleItem)
                } else {
                    this.formItemList.push(formItemNode)
                    this.formModelList.push(modelItem)
                    this.formRuleList.splice(this.editIndex, 1, ruleItem)
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
                    this.formRuleList = []
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
            getFormRuleMap () {
                const ruleMap = {}
                this.formRuleList.forEach(function (obj) {
                    if (obj.value && obj.value.length) {
                        Object.assign(ruleMap, { [obj.key]: obj.value })
                    }
                })
                return ruleMap
            },
            getFormRule (property) {
                const rule = this.formRuleList.find(item => item.key === property)
                return (rule && rule.value) || []
            },
            initModelAndRule () {
                try {
                    const modelMap = this.curSelectedComponentData.renderProps.model.val || {}
                    const ruleMap = this.curSelectedComponentData.renderProps.rules.val || {}
                    const modelList = []
                    const ruleList = []
                    for (const i in modelMap) {
                        modelList.push({ key: i, value: modelMap[i] })
                        ruleList.push({ key: i, value: ruleMap[i] || [] })
                    }
                    this.formModelList = modelList
                    this.formRuleList = ruleList
                } catch (err) {
                    this.formModelList = []
                    this.formRuleList = []
                }
            }
        }
    }
</script>
<style lang='postcss'>
    .form-slot-title {
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
            height: 36px;
            opacity: 1;
            background: #f0f1f5;
            border-radius: 2px;
            box-shadow: 0px 2px 4px 0px rgba(0,0,0,0.2);
            padding: 0 10px;
            margin-bottom: 6px;
            cursor: default;
            .item-name {
                font-size: 12px;
                .property{
                    font-style: italic;
                    color: #ccc;
                }
            }
            .operate-btns {
                cursor: pointer;
                font-size: 16px;
                .option-col-drag {
                    cursor: move;
                }
            }
        }
    }
    
</style>
