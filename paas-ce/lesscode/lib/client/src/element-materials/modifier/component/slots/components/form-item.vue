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
            title="表单数据（更新将会覆盖已有数据）"
            tips="绑定函数后，需要手动获取初始表单数据"
            :auto-get-data="false"
            :default-value="{}"
            :remote-validate="validateObject"
            :change="getInitData"
        >
        </remote>

        <div class="form-slot-title" style="margin: 20px 0 10px;">表单内容配置</div>

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
                        :key="`item${index}`"
                        class="form-item"
                    >
                        <section class="item-name" :title="`${item.renderProps.label.val}(${item.renderProps.property.val})`">
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
    import remote from '@/element-materials/modifier/component/props/components/strategy/remote'
    import formItemEdit from './form-item-edit'
    import { camelCase, camelCaseTransformMerge } from 'change-case'

    const createTargetDataNode = (componentType, payload) => {
        const component = componentList.bk.find(_ => _.name === componentType)
        const {
            name = '',
            type = '',
            props = {},
            directives = [],
            slots = {}
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
        const defaultSlots = slots.default ? {
            default: {
                name: slots.default.name[0] || name,
                type: slots.default.type[0] || type,
                val: slots.default.val
            }
        } : {}
        const renderSlots = initSlots || defaultSlots

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
            renderStyles: {},
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
                }
            } : {},
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
            remote,
            formItemEdit
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
            this.iniModelAndRuleFromSlot()
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
                    prop: {},
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
        },
        methods: {
            /**
             * 更新属性值
            */
            triggerChange () {
                this.change('slots', [...this.formItemList, ...this.formActionList], this.type)
                
                const model = {
                    type: 'hidden',
                    val: this.getFormModelMap()
                }
                const rules = {
                    type: 'hidden',
                    val: this.getFormRuleMap()
                }
                const renderProps = {
                    ...this.renderProps,
                    model,
                    rules
                }
                this.$emit('batchUpdate', { renderProps })
                const slot = {
                    ...this.slotVal,
                    val: JSON.parse(JSON.stringify([...this.formItemList, ...this.formActionList]))
                }
                this.change(slot)
            },
            orderChange () {
                const modelList = []
                const ruleList = []
                if (this.formItemList.length !== this.formModelList.length) {
                    this.iniModelAndRuleFromSlot()
                }
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
                        renderProps: formItemRenderProps,
                        renderSlots: formItemRenderSlots
                    } = this.formItemList[index]
                    const {
                        label,
                        property,
                        required
                    } = formItemRenderProps
                    this.formItemData = {
                        label: label.val,
                        property: property.val,
                        required: required.val,
                        type: formItemRenderSlots.default.val[0].name
                    }
                }
                this.isShowOperation = true
            },
            /**
             * @desc 提交表单项
            */
            handleSave (itemData, isContinue = false) {
                // 判断表单项类型是否改变
                const slotChange = this.formItemData.type !== itemData.type
                // 将校验规则里的required同步到form-item层级
                const hasRequired = ((itemData.validate || []).filter(item => item.required === true).length > 0)
                this.formItemData = Object.assign({}, itemData, { required: hasRequired })
                // formItem编辑后，里面的表单项组件也默认值重新生成了，这里应该做个判断，如果是类型没变，表单组件内容不用变
                this.createTargetDataFromItem(this.formItemData, slotChange)
                this.triggerChange()
                if (isContinue) {
                    this.formItemData = generateFormData()
                    this.handleShowOperation(-1)
                } else {
                    this.handleCancel()
                }
            },
            
            createTargetDataFromItem (formItemData, changeSlot = true) {
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
                
                let inputNode = createTargetDataNode(formItemData.type, {
                    style,
                    directive: {
                        'v-model': `${camelCase(this.curSelectedComponentData.componentId, { transform: camelCaseTransformMerge })}model.${formItemData.property}`
                    }
                })

                if (!changeSlot && this.editIndex > -1) {
                    try {
                        inputNode = this.formItemList[this.editIndex].renderSlots.default.val[0] || inputNode
                    } catch (err) {
                        console.log(err)
                    }
                }
                
                if (this.editIndex > -1 && this.formItemList[this.editIndex]) {
                    this.formItemList.splice(this.editIndex, 1, formItemNode)
                    this.formModelList.splice(this.editIndex, 1, modelItem)
                    this.formRuleList.splice(this.editIndex, 1, ruleItem)
                } else {
                    this.formItemList.push(formItemNode)
                    this.formModelList.push(modelItem)
                    this.formRuleList.push(ruleItem)
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
            iniModelAndRuleFromSlot () {
                const modelMap = this.curSelectedComponentData.renderProps.model.val || {}
                const ruleMap = this.curSelectedComponentData.renderProps.rules.val || {}
                const modelList = []
                const ruleList = []
                this.formItemList.forEach(formItem => {
                    const key = formItem.renderProps.property.val
                    let value = ''
                    try {
                        value = this.getDefaultValFromType(formItem.renderSlots.default.val[0].name)
                    } catch (error) {
                        value = ''
                    }
                    modelList.push({ key, value })
                    ruleList.push({ key, value: ruleMap[key] || [] })
                })
                this.formModelList = modelList
                this.formRuleList = ruleList
                if (this.formItemList.length !== Object.keys(modelMap).length) {
                    this.triggerChange()
                }
            }
        }
    }
</script>
<style lang='postcss'>
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
            padding: 0 10px;
            margin-bottom: 6px;
            cursor: default;
            &:hover {
                box-shadow: 0px 2px 4px 0px rgba(0,0,0,0.2);
            }
            .item-name {
                width: 195px;
                font-size: 12px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
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
