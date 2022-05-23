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
        <div class="radio-title">{{type | valueTypeTextFormat}}可选项配置：</div>
        <div class="slot-card-wrapper">
            <vue-draggable
                class="group-list"
                ghost-class="block-item-ghost"
                :list="radioOption"
                @change="trigger"
                handle=".option-col-drag"
                :group="{ name: 'table-col' }">
                <transition-group type="transition" :name="'flip-list'">
                    <div class="card-item-content" v-for="(item, index) in radioOption" :key="`option${index}`">
                        <div class="option-col-operate">
                            <i class="bk-drag-icon bk-drag-drag-small1 option-col-drag" />
                            <i class="bk-icon icon-close option-col-del" @click="handleDelete(index)"></i>
                        </div>
                        <section style="margin-top: 20px">
                            <div class="card-item" v-for="(option, idx) in currentConfig.template" :key="idx">
                                <div class="label">{{option.name}}</div>
                                <bk-input v-if="option.type === 'input'" :value="item[option.key]" @change="val => handleChange(val, option.key, index)" />
                                <bk-radio v-else-if="option.type === 'radio'" :checked="item[option.key]" @change="val => handleCheckChange(val, option.key, index)" />
                                <bk-checkbox v-else-if="option.type === 'checkbox'" :checked="item[option.key]" @change="val => handleChange(val, option.key, index)" />
                                <icon v-else-if="option.type === 'icon'" :default-value="item[option.key]" :include-number="true" :change="val => handleChange(val, option.key, index)"></icon>
                                <src-input v-else-if="option.type === 'src-input'" :value="item[option.key]" @change="val => handleChange(val, option.key, index)" />
                            </div>
                        </section>
                    </div>
                </transition-group>
            </vue-draggable>

            <div class="content-add" @click="handleAdd">添加一项</div>
        </div>
    </div>
</template>
<script>
    import Icon from '@/components/modifier/icon-select'
    import SrcInput from '@/components/src-input/index.vue'

    const configMap = {
        'radio': {
            template: [
                {
                    name: 'label',
                    key: 'label',
                    type: 'input'
                }, {
                    name: 'value',
                    key: 'value',
                    type: 'input'
                }, {
                    name: '默认选中',
                    key: 'checked',
                    type: 'radio'
                }
            ],
            generateFunc: index => ({
                label: `单选项${index}`,
                value: `单选项${index}`,
                checked: false
            })
        },
        'el-radio': {
            template: [
                {
                    name: 'label',
                    key: 'label',
                    type: 'input'
                }
            ],
            generateFunc: index => ({
                label: `单选项${index}`
            })
        },
        'checkbox': {
            template: [
                {
                    name: 'label',
                    key: 'label',
                    type: 'input'
                }, {
                    name: 'value',
                    key: 'value',
                    type: 'input'
                }, {
                    name: '默认选中',
                    key: 'checked',
                    type: 'checkbox'
                }
            ],
            generateFunc: index => ({
                label: `选项${index}`,
                value: `选项${index}`,
                checked: false
            })
        },
        'el-checkbox': {
            template: [
                {
                    name: 'label',
                    key: 'label',
                    type: 'input'
                }
            ],
            generateFunc: index => ({
                label: `选项${index}`
            })
        },
        'bread-crumb': {
            template: [
                {
                    name: 'label',
                    key: 'label',
                    type: 'input'
                }, {
                    name: 'to',
                    key: 'to',
                    type: 'input'
                }
            ],
            generateFunc: index => ({
                label: `面包屑${index}`,
                to: null
            })
        },
        'step': {
            template: [
                {
                    name: 'title',
                    key: 'title',
                    type: 'input'
                }, {
                    name: 'icon',
                    key: 'icon',
                    type: 'icon'
                }, {
                    name: '步骤描述',
                    key: 'description',
                    type: 'input'
                }
            ],
            generateFunc: index => ({
                title: `步骤${index}`,
                icon: index,
                description: ''
            })
        },
        'el-step': {
            template: [
                {
                    name: 'title',
                    key: 'title',
                    type: 'input'
                }, {
                    name: 'icon',
                    key: 'icon',
                    type: 'input'
                }, {
                    name: '步骤描述',
                    key: 'description',
                    type: 'input'
                }
            ],
            generateFunc: index => ({
                title: `步骤${index}`,
                icon: '',
                description: ''
            })
        },
        'option': {
            template: [
                {
                    name: '选项id',
                    key: 'id',
                    type: 'input'
                }, {
                    name: '选项name',
                    key: 'name',
                    type: 'input'
                }
            ],
            generateFunc: index => ({
                id: `option${index}`,
                'name': ''
            })
        },
        'tab-panel': {
            template: [
                {
                    name: 'label',
                    key: 'label',
                    type: 'input'
                }, {
                    name: 'name',
                    key: 'name',
                    type: 'input'
                }
            ],
            generateFunc: index => ({
                label: `Tab-${index}`,
                'name': `Tab-${index}`
            })
        },
        'timeline': {
            template: [
                {
                    name: '内容',
                    key: 'label',
                    type: 'input'
                }, {
                    name: '时间戳',
                    key: 'timestamp',
                    type: 'input'
                },
                {
                    name: 'color',
                    key: 'color',
                    type: 'input'
                }
            ],
            generateFunc: index => ({
                label: `Timeline-${index}`,
                timestamp: '2021-06-29',
                color: ''
            })
        },
        'carousel': {
            template: [
                {
                    name: '文本label',
                    key: 'label',
                    type: 'input'
                }, {
                    name: '名字name',
                    key: 'name',
                    type: 'input'
                }, {
                    name: '内容content',
                    key: 'content',
                    type: 'input'
                }
            ],
            generateFunc: index => ({
                label: `carousel-${index}`,
                'name': `carousel-${index}`,
                content: `<h3>carousel-${index}</h3>`
            })
        },
        'srcset': {
            template: [
                {
                    name: 'url',
                    key: 'url',
                    type: 'src-input'
                }, {
                    name: 'link',
                    key: 'link',
                    type: 'input'
                }
            ],
            generateFunc: index => ({
                url: '',
                link: ''
            })
        }
    }
    export default {
        name: '',
        components: {
            Icon,
            SrcInput
        },
        filters: {
            valueTypeTextFormat (type) {
                const textMap = {
                    'srcset': '图片列表'
                }
                return textMap[type] || type
            }
        },
        props: {
            name: {
                type: String,
                required: true
            },
            defaultValue: {
                type: Array,
                required: true
            },
            payload: {
                type: Object,
                default: () => ({})
            },
            change: {
                type: Function,
                default: () => {}
            },
            type: String
        },
        data () {
            return {
                radioOption: []
            }
        },
        computed: {
            currentConfig () {
                return configMap[this.type]
            }
        },
        created () {
            this.radioOption = JSON.parse(JSON.stringify(this.defaultValue))
            // this.trigger()
        },
        methods: {
            trigger () {
                this.change(this.name, JSON.parse(JSON.stringify(this.radioOption)), this.type, this.payload)
            },
            handleDelete (index) {
                if (this.radioOption.length === 1) {
                    return
                }
                this.radioOption.splice(index, 1)
                this.trigger()
            },
            handleChange (value, key, index) {
                this.radioOption[index][key] = value
                this.trigger()
            },
            handleCheckChange (value, key, index) {
                if (value) {
                    this.radioOption = this.radioOption.map((item, itemIndex) => {
                        item[key] = itemIndex === index
                        return item
                    })
                } else {
                    this.radioOption[index][key] = value
                }
                this.trigger()
            },
            handleAdd () {
                this.radioOption.push(this.currentConfig.generateFunc(this.radioOption.length + 1))
                this.trigger()
            }
        }
    }
</script>
<style lang='postcss'>
    .radio-title {
        height: 28px;
        font-size: 12px;
        font-weight: bold;
        color: #63656E;
    }
    .slot-card-wrapper {
        display: flex;
        flex-direction: column;
        .card-item-content {
            display: flex;
            flex-direction: column;
            margin-bottom: 10px;
            padding: 0 6px;
            background-color: #F0F1F5;
            &:hover{
                box-shadow: 0px 2px 4px 0px rgba(0,0,0,0.2);
                .option-col-operate {
                    display: block;
                }
            }
            .card-item{
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                margin-bottom: 10px;
                font-size: 12px;
            }
            .label{
                height: 24px;
                margin-right: 0.6em;
                text-align: right;
            }
        }
        .content-add {
            font-size: 12px;
            cursor: pointer;
            color: #3a84ff;
            i {
                padding-right: 2px;
                font-size: 16px;
            }
        }
    }
</style>
