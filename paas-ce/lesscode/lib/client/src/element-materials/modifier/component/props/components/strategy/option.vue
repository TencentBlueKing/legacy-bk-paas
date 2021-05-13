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
    <section>
        <h3 class="option-title">数据源配置</h3>
        <ul>
            <vue-draggable
                class="group-list"
                ghost-class="item-ghost"
                :list="optionList"
                @change="trigger"
                :group="{ name: 'option-item' }">
                <transition-group type="transition" :name="'flip-list'">
                    <li v-for="(option, index) in optionList" :key="`option${index}`" class="option-item select-item">
                        <bk-input style="margin-right: 12px;" :value="option.id" placeholder="请输入id" @change="val => handleChange(val, 'id', index)" />
                        <bk-input :value="option.name" placeholder="请输入name" @change="val => handleChange(val, 'name', index)" />
                        <i class="bk-icon icon-minus-circle" @click="changeNum(false, index)"></i>
                    </li>
                </transition-group>
            </vue-draggable>
        </ul>
        <div class="option-add" @click="changeNum(true, optionList.length - 1)"><i class="bk-icon icon-plus-circle"></i>添加一项</div>
    </section>
</template>

<script>
    import { uuid } from '@/common/util'

    export default {
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
                optionList: []
            }
        },
        watch: {
            defaultValue: {
                handler () {
                    this.optionList = JSON.parse(JSON.stringify(this.defaultValue))
                },
                immediate: true
            }
        },
        created () {
            this.trigger()
        },
        methods: {
            handleChange (value, key, index) {
                this.optionList[index][key] = value
                this.trigger()
            },

            changeNum (isAdd, index) {
                const newItem = {
                    id: uuid(),
                    name: ''
                }
                this.optionList.splice(index + 1, 0, newItem)
                if (!isAdd) this.optionList.splice(index, 2)
                this.trigger()
            },

            trigger () {
                this.change('slots', JSON.parse(JSON.stringify(this.optionList)), this.type, this.payload)
            }
        }
    }
</script>

<style lang="postcss" scoped>
    .option-title {
        height: 32px;
        line-height: 32px;
        font-size: 14px;
        font-weight: 500;
        color: #606266;
        margin: 0;
    }

    .option-item {
        display: flex;
        align-items: center;
        margin: 10px 0;
    }

    .select-item {
        input {
            cursor: move;
        }
    }

    .option-add {
        font-size: 12px;
        cursor: pointer;
        color: #3a84ff;
        i {
            padding-right: 2px;
            font-size: 16px;
        }
    }
</style>
