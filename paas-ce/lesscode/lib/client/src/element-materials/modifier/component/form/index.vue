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
    <div
        v-if="isShow"
        class="modifier-form">
        <remote
            name="initFormData"
            title="表单数据（更新将会覆盖已有数据）"
            tips="绑定函数后，需要手动获取初始表单数据"
            :auto-get-data="false"
            :default-value="{}"
            :remote-validate="validateObjectMethod"
            :change="transformRemoteDataToNode" />
        <div
            class="form-slot-title"
            style="margin: 20px 0 10px;">
            表单内容配置
        </div>
        <div class="form-item-list">
            <vue-draggable
                ghost-class="block-item-ghost"
                :list="componentNode.children"
                handle=".option-col-drag">
                <transition-group
                    type="transition"
                    :name="'flip-list'">
                    <template v-for="(formItemNode, index) in componentNode.children">
                        <div
                            v-if="formItemNode.prop.property"
                            :key="`item${index}`"
                            class="form-item">
                            <section
                                class="item-name"
                                :title="`${formItemNode.prop.label}(${formItemNode.prop.property})`">
                                <span>{{ formItemNode.prop.label }}</span>
                                <span class="property">({{ formItemNode.prop.property }})</span>
                            </section>
                            <section class="operate-btns">
                                <span
                                    class="form-item-edit"
                                    @click.stop="handleShowOperation(formItemNode)">
                                    <i class="bk-drag-icon bk-drag-edit" />
                                </span>
                                <span class="form-item-drag option-col-drag">
                                    <i class="bk-drag-icon bk-drag-drag-small1" />
                                </span>
                                <span
                                    class="form-item-delete"
                                    @click.stop="handleDelete(formItemNode)">
                                    <i class="bk-icon icon-close" />
                                </span>
                            </section>
                        </div>
                    </template>
                </transition-group>
            </vue-draggable>
        </div>
        <div
            class="table-column-add"
            @click="handleShowOperation(null)">
            继续添加表单项
        </div>

        <form-item-edit
            :is-show="isShowOperation"
            :default-value="editFormItemData"
            :submit="handleSubmitFormItem"
            :close="handleCancel" />
    </div>
</template>
<script>
    import _ from 'lodash'
    import LC from '@/element-materials/core'
    import remote from '@/element-materials/modifier/component/props/components/strategy/remote'
    import formItemEdit from './components/form-item-edit'
    import { camelCase, camelCaseTransformMerge } from 'change-case'

    const getFormTypeFromValue = (val) => {
        if (typeof val === 'boolean') {
            return 'switcher'
        } else if (Array.isArray(val)) {
            return 'checkbox-group'
        }
        return 'input'
    }

    const getDefaultValFromType = (type) => {
        const typeValMap = {
            'switcher': false,
            'checkbox-group': []
        }
        return typeValMap[type] !== undefined ? typeValMap[type] : ''
    }

    const genDefaultFormItemData = () => ({
        label: '',
        property: '',
        type: 'input',
        validate: []
    })

    const typeEnum = {
        'input': 'bk-input',
        'select': 'bk-select',
        'date-picker': 'bk-date-picker',
        'time-picker': 'bk-time-picker',
        'switcher': 'bk-switcher',
        'radio-group': 'bk-radio-group',
        'checkbox-group': 'bk-checkbox-group',

        'bk-input': 'input',
        'bk-select': 'select',
        'bk-date-picker': 'date-picker',
        'bk-time-picker': 'time-picker',
        'bk-switcher': 'switcher',
        'bk-radio-group': 'radio-group',
        'bk-checkbox-group': 'checkbox-group'
    }

    export default {
        name: '',
        components: {
            remote,
            formItemEdit
        },
        inheritAttrs: false,
        data () {
            return {
                isShow: false,
                isShowOperation: false,
                editFormItemData: {}
            }
        },
        
        created () {
            // 编辑的表单项
            this.editFormItemNode = null
            
            this.componentNode = LC.getActiveNode()
            this.isShow = this.componentNode.type === 'widget-form'
            if (!this.isShow) {
                return
            }

            const updateCallback = _.throttle((event) => {
                if (this.componentNode.componentId === event.target.componentId) {
                    this.$forceUpdate()
                }
            }, 20)

            LC.addEventListener('update', updateCallback)
            this.$once('hook:beforeDestroy', () => {
                LC.removeEventListener('update', updateCallback)
            })
        },
        methods: {
            /**
             * @desc 编辑表单项属性
             * @param { Object | null } formItemNode 操作的表单节点
            */
            handleShowOperation (formItemNode) {
                const editFormItemData = genDefaultFormItemData()
                
                if (formItemNode) {
                    editFormItemData.label = formItemNode.prop.label
                    editFormItemData.property = formItemNode.prop.property
                    editFormItemData.type = typeEnum[formItemNode.children[0].type]
                    editFormItemData.validate = formItemNode.parentNode.prop.rules[formItemNode.prop.property] || []
                }

                this.editFormItemData = Object.freeze(editFormItemData)
                this.editFormItemNode = formItemNode
                this.isShowOperation = true
            },
            /**
             * @desc 提交表单项
            */
            handleSubmitFormItem (itemData) {
                const genInputNode = name => {
                    const node = LC.createNode(typeEnum[name])
                    
                    if ([
                        'input',
                        'select',
                        'date-picker',
                        'time-picker'
                    ].includes(name)) {
                        node.setStyle('width', '300px')
                    }
                    return node
                }

                const setProp = node => {
                    console.log('from setPropsetPropsetPropsetProp = ', node)
                    const formItemPropList = ['label', 'property', 'required']
                    formItemPropList.forEach(propName => {
                        node.setProp(propName, itemData[propName])
                    })
                    // 验证规则里面配有 required 规则
                    const hasRequired = ((itemData.validate || []).filter(item => item.required === true).length > 0)
                    if (hasRequired) {
                        node.setProp('required', true)
                    }
                }

                const setDirective = node => {
                    node.setRenderDirectives([
                        {
                            type: 'v-model',
                            prop: 'value',
                            val: `${camelCase(this.componentNode.componentId, { transform: camelCaseTransformMerge })}model.${itemData.property}`,
                            valType: 'variable'
                        }
                    ])
                }

                if (this.editFormItemNode) {
                    // 编辑
                    let inputNode = this.editFormItemNode.children[0]
                    // 表单组件类型改变，删除原有组件
                    if (inputNode.type !== typeEnum[itemData.type]) {
                        this.editFormItemNode.removeChild(inputNode)
                        // 新建一个新组件
                        inputNode = genInputNode(itemData.type)
                        this.editFormItemNode.appendChild(inputNode)
                    }
                    setDirective(inputNode)
                    setProp(this.editFormItemNode)
                } else {
                    // 新建

                    // 新建 form-item
                    const formItemNode = LC.createNode('widget-form-item')
                    const inputNode = genInputNode(itemData.type)
                    setDirective(inputNode)
                    formItemNode.appendChild(inputNode)
                    setProp(formItemNode)

                    // 新建表单的操作按钮
                    // prop.property 为空表示为 form 的操作项
                    let actionFormItemNode = _.find(this.componentNode.children, node => !!node.prop.property)
                    if (!actionFormItemNode) {
                        // 提交按钮
                        const submitBtnNode = LC.createNode('bk-button')
                        submitBtnNode.setRenderSlots({
                            name: 'html',
                            type: 'text',
                            val: '提交'
                        })
                        submitBtnNode.setProp('theme', 'primary')
                        // 取消按钮
                        const cancelBtnNode = LC.createNode('bk-button')
                        cancelBtnNode.setRenderSlots({
                            name: 'html',
                            type: 'text',
                            val: '取消'
                        })
                        cancelBtnNode.setStyle('marginLeft', '5px')
                        actionFormItemNode = LC.createNode('widget-form-item')
                        actionFormItemNode.appendChild(submitBtnNode)
                        actionFormItemNode.appendChild(cancelBtnNode)
                        this.componentNode.appendChild(actionFormItemNode)
                    }

                    // 新建的表单项放在操作按钮的前面
                    actionFormItemNode.insertBefore(formItemNode)
                }

                // 更新 form 的 rules prop
                this.componentNode.setProp('rules', Object.assign({}, this.componentNode.prop.rules, {
                    [itemData.property]: itemData.validate
                }))
                // 更新 form 的 model prop
                this.componentNode.setProp('model', Object.assign({}, this.componentNode.prop.model, {
                    [itemData.property]: getDefaultValFromType(itemData.type)
                }))
                this.isShowOperation = false
            },
            /**
             * @desc 关闭表单项标记框
            */
            handleCancel () {
                this.editFormItemNode = null
                this.isShowOperation = false
            },
            /**
             * @desc 删除表达项
             * @param {Number} index 表单项索引
            */
            handleDelete (formItemNode) {
                this.componentNode.removeChild(formItemNode)
            },
            /**
             * @desc 验证远程数据
             * @param { Object } res
             * @returns { String }
             */
            validateObjectMethod (res) {
                let msg = ''
                if (Object.prototype.toString.call(res) !== '[object Object]') {
                    msg = '请确保函数返回值为object类型'
                }
                return msg
            },
            /**
             * @desc 通过远程数据生成 form-item 节点
             * @param { String } name
             * @param { Array } data
             */
            transformRemoteDataToNode (name, data) {
                Object.keys(data).forEach((key) => {
                    this.handleSubmitFormItem({
                        type: getFormTypeFromValue(data[key]),
                        label: key,
                        property: key,
                        required: false,
                        validate: []
                    })
                })
            }
        }
    }
</script>
<style lang='postcss'>
    .modifier-form {
        padding: 0 10px;
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
    }
</style>
