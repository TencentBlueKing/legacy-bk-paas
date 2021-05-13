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
        <div class="radio-title">radio-button可选项配置：</div>
        <div class="radio-item">
            <vue-draggable
                class="group-list"
                ghost-class="block-item-ghost"
                :list="radioOption"
                handle=".option-col-drag"
                @change="trigger"
                :group="{ name: 'table-col' }">
                <transition-group type="transition" :name="'flip-list'">
                    <div class="radio-option radio-button-option" v-for="(item, index) in radioOption" :key="`radioBut${index}`">
                        <div class="option-col-operate">
                            <i class="bk-drag-icon bk-drag-drag-small1 option-col-drag" />
                            <i class="bk-icon icon-close option-col-del" @click="handleDelete(index)"></i>
                        </div>
                        <section style="margin-top: 20px">
                            <div class="option-item">
                                <div class="label">label</div>
                                <bk-input :value="item.label" @change="val => handleChange(val, 'label', index)" />
                            </div>
                            <div class="option-item">
                                <div class="label">value</div>
                                <bk-input :value="item.value" @change="val => handleChange(val, 'value', index)" />
                            </div>
                            <div class="option-item">
                                <div class="label">是否禁用</div>
                                <bk-checkbox :checked="item.disabled" @change="val => handleChange(val, 'disabled', index)" />
                            </div>
                        </section>
                    </div>
                </transition-group>
            </vue-draggable>
        </div>
        <div class="radio-add" @click="handleAdd">添加一项</div>
    </div>
</template>
<script>
    const generateColumn = (index) => ({
        label: `选项${index}`,
        value: `选项${index}`,
        checked: false
    })
    export default {
        name: '',
        props: {
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
        created () {
            this.radioOption = JSON.parse(JSON.stringify(this.defaultValue))
            this.trigger()
        },
        methods: {
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
                this.radioOption.push(generateColumn(this.radioOption.length + 1))
                this.trigger()
            },
            trigger () {
                this.change('slots', JSON.parse(JSON.stringify(this.radioOption)), this.type, this.payload)
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
    .radio-item {
        display: flex;
        flex-direction: column;
    }
    .radio-option {
        display: flex;
        flex-direction: column;
        margin-bottom: 10px;
        padding: 0 6px;
        background-color: #F0F1F5;
        &:hover{
            box-shadow: 0px 2px 4px 0px rgba(0,0,0,0.2);
            .option-col-operate{
                display: block;
            }
        }
        .option-item{
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
    .radio-add {
        font-size: 12px;
        cursor: pointer;
        color: #3a84ff;
        i {
            padding-right: 2px;
            font-size: 16px;
        }
    }
</style>
