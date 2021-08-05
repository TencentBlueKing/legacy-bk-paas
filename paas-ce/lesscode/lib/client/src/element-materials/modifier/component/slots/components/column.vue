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
        <div class="slot-title">
            列配置:
        </div>
        <div class="column-list">
            <div class="column-item" v-for="(item, index) in columns" :key="index">
                <span class="column-item-text">第 {{index + 1}} 列：</span>
                <bk-input v-model="item.span" @change="val => handleSpanChange(index, ~~val)" type="number" :min="1" />
                <i class="bk-icon icon-minus-circle" @click="handleDelete(index)"></i>
            </div>
        </div>
        <div class="column-add" @click="handleAdd" v-show="columns.length <= 11">
            <span>添加 1 列</span>
            <i class="bk-icon icon-plus-circle"></i>
        </div>
    </div>
</template>
<script>
    const generateColumn = () => ({
        span: 1,
        children: []
    })
    export default {
        name: 'slot-column',
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
                columns: []
            }
        },
        watch: {
            'slotVal.val': {
                handler (newVal) {
                    this.columns = JSON.parse(JSON.stringify(newVal))
                },
                immediate: true
            }
        },
        methods: {
            handleDelete (index) {
                if (this.columns.length === 1) {
                    return
                }
                this.columns.splice(index, 1)
                this.trigger()
            },
            handleSpanChange (index, val) {
                if (val === 0) {
                    this.$nextTick(() => {
                        this.columns[index].span = 1
                    })
                } else {
                    this.columns[index].span = val
                    this.trigger()
                }
            },
            handleAdd () {
                if (this.columns.length === 12) {
                    return
                }
                this.columns.push(generateColumn())
                this.trigger()
            },
            trigger () {
                const slot = {
                    ...this.slotVal,
                    val: JSON.parse(JSON.stringify(this.columns))
                }
                this.change(slot)
            }
        }
    }
</script>
<style lang='postcss' scoped>
    .column-list {
        display: flex;
        flex-direction: column;
        .column-item {
            display: flex;
            align-items: center;
            margin-bottom: 10px;
            .column-item-text {
                flex-shrink: 0;
                width: 95px;
            }
            .icon-minus-circle {
                margin: 0 0 0 8px;
                cursor: pointer;
                font-size: 16px;
                &:hover {
                    color: #3a84ff
                }
            }
        }
    }
    .column-add {
        text-align: right;
        font-size: 12px;
        cursor: pointer;
        color: #3a84ff;
        .icon-plus-circle {
            font-size: 16px;
            margin-left: 4px;
        }
    }
</style>
