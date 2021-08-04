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
        <div class="slot-card-wrapper">
            <vue-draggable
                class="group-list"
                ghost-class="block-item-ghost"
                :list="optionList"
                @change="trigger"
                handle=".option-col-drag"
                :group="{ name: 'table-col' }">
                <transition-group type="transition" :name="'flip-list'">
                    <div class="card-item-content" v-for="(item, index) in optionList" :key="`option${index}`">
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
    import configMap from './config.js'

    export default {
        name: 'slot-list',
        components: {
            Icon
        },
        props: {
            slotVal: {
                type: Object,
                required: true
            },
            slotConfig: {
                type: Object,
                default: () => ({})
            },
            change: {
                type: Function,
                default: () => {}
            }
        },
        data () {
            return {
                optionList: []
            }
        },
        computed: {
            currentConfig () {
                return configMap[this.slotVal.name]
            }
        },
        created () {
            this.optionList = JSON.parse(JSON.stringify(this.slotVal.val))
            this.trigger()
        },
        methods: {
            trigger () {
                const slot = {
                    ...this.slotVal,
                    val: JSON.parse(JSON.stringify(this.optionList))
                }
                this.change(slot)
            },
            handleDelete (index) {
                if (this.optionList.length === 1) {
                    return
                }
                this.optionList.splice(index, 1)
                this.trigger()
            },
            handleChange (value, key, index) {
                this.optionList[index][key] = value
                this.trigger()
            },
            handleCheckChange (value, key, index) {
                if (value) {
                    this.optionList = this.optionList.map((item, itemIndex) => {
                        item[key] = itemIndex === index
                        return item
                    })
                } else {
                    this.optionList[index][key] = value
                }
                this.trigger()
            },
            handleAdd () {
                this.optionList.push(this.currentConfig.generateFunc(this.optionList.length + 1))
                this.trigger()
            }
        }
    }
</script>
<style lang='postcss' scoped>
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
