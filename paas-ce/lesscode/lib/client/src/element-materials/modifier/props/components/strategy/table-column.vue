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
        <div class="table-column-title">表头配置</div>
        <div class="table-column-item">
            <div class="table-column-option" v-for="(item, index) in column" :key="index">
                <i class="bk-icon icon-close table-column-del" @click="handleDelete(index)"></i>
                <div class="option-item">
                    <div class="label bold-label">label</div>
                    <bk-input :value="item.label" @change="val => handleChange(val, 'label', index)" />
                </div>
                <div class="option-item">
                    <div class="label">prop
                        <i class="bk-icon icon-info-circle" v-bk-tooltips="{ content: '该属性的用法提示' }"></i>
                    </div>
                    <bk-input :value="item.prop" @change="val => handleChange(val, 'prop', index)" />
                </div>
                <div class="option-item">
                    <div class="label">支持排序</div>
                    <bk-checkbox :checked="item.sort" @change="val => handleChange(val, 'sortable', index)" />
                </div>
                <!-- <div class="table-column-del" @click="handleDelete(index)">删除该列</div> -->
            </div>
        </div>
        <div class="table-column-add" @click="handleAdd"><i class="bk-icon icon-plus-circle"></i>继续添加</div>
    </div>
</template>
<script>
    const generateColumn = (index) => ({
        label: `选项${index}`,
        prop: `prop_${index}`,
        sort: false
    })
    export default {
        name: '',
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
                column: []
            }
        },
        created () {
            this.column = JSON.parse(JSON.stringify(this.defaultValue))
        },
        methods: {
            handleDelete (index) {
                if (this.column.length === 1) {
                    return
                }
                this.column.splice(index, 1)
                this.trigger()
            },
            handleChange (value, key, index) {
                this.column[index][key] = value
                this.trigger()
            },
            handleAdd () {
                this.column.push(generateColumn(this.column.length + 1))
                this.trigger()
            },
            trigger () {
                this.change('slots', JSON.parse(JSON.stringify(this.column)), this.type)
            }
        }
    }
</script>
<style lang='postcss'>
    .table-column-title {
        height: 28px;
        font-size: 14px;
        font-weight: bold;
        color: #63656E;
    }
    .table-column-item-item {
        display: flex;
        flex-direction: column;
    }
    .table-column-option {
        display: flex;
        flex-direction: column;
        margin-bottom: 10px;
        padding: 0 6px 14px;
        border: 1px solid #DCDEE5;
        background-color: #FAFBFD;
        .option-item{
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            margin: 12px 0 0;
            font-size: 14px;
        }
        .label{
            height: 24px;
            margin-right: 0.6em;
            text-align: right;
            &.bold-label {
                font-weight: bold;
            }
        }
    }
    .table-column-del {
        position: absolute;
        right: 12px;
        font-size: 24px;
        color: #979BA5;
        text-align: right;
        cursor: pointer;
    }
    .table-column-add {
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
