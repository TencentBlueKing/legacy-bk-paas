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
            <li v-for="(option, index) in optionList" :key="index" class="option-item">
                <bk-input :value="option.name" @change="val => handleChange(val, 'name', index)" />
                <i class="bk-icon icon-minus-circle" @click="changeNum(false, index)"></i>
                <!-- <i class="bk-icon icon-plus" @click="changeNum(true, index)"></i> -->
            </li>
        </ul>
        <div class="option-add" @click="changeNum(true, optionList.length - 1)"><i class="bk-icon icon-plus-circle"></i>添加一项</div>
    </section>
</template>

<script>
    export default {
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

        methods: {
            handleChange (value, key, index) {
                this.optionList[index][key] = value
                this.trigger()
            },

            changeNum (isAdd, index) {
                const newItem = {
                    id: Math.random(),
                    name: ''
                }
                this.optionList.splice(index + 1, 0, newItem)
                if (!isAdd) this.optionList.splice(index, 2)
                this.trigger()
            },

            trigger () {
                this.change('slots', JSON.parse(JSON.stringify(this.optionList)), this.type)
            }
        }
    }
</script>

<style lang="postcss">
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
        .bk-icon {
            margin: 0 3px;
            cursor: pointer;
        }
    }

    .option-add {
        font-size: 12px;
        cursor: pointer;
        &:hover {
            color: #3a84ff
        }
        i {
            padding-right: 2px;
            font-size: 16px;
        }
    }
</style>
