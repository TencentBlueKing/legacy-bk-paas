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
        <div class="checkbox-title">checkbox可选项配置：</div>
        <div class="checkbox-item">
            <div class="checkbox-option" v-for="(item, index) in checkboxOption" :key="index">
                <i class="bk-icon icon-close checkbox-del" @click="handleDelete(index)"></i>
                <div class="option-item">
                    <div class="label">label</div>
                    <bk-input :value="item.label" @change="val => handleChange(val, 'label', index)" />
                </div>
                <div class="option-item">
                    <div class="label">value</div>
                    <bk-input :value="item.value" @change="val => handleChange(val, 'value', index)" />
                </div>
                <div class="option-item">
                    <div class="label">默认选中</div>
                    <bk-checkbox :checked="item.checked" @change="val => handleChange(val, 'checked', index)" />
                </div>
            </div>
        </div>
        <div class="checkbox-add" @click="handleAdd"><i class="bk-icon icon-plus-circle"></i>添加一项</div>
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
                checkboxOption: []
            }
        },
        created () {
            this.checkboxOption = JSON.parse(JSON.stringify(this.defaultValue))
            this.trigger()
        },
        methods: {
            handleDelete (index) {
                if (this.checkboxOption.length === 1) {
                    return
                }
                this.checkboxOption.splice(index, 1)
                this.trigger()
            },
            handleChange (value, key, index) {
                this.checkboxOption[index][key] = value
                this.trigger()
            },
            handleAdd () {
                this.checkboxOption.push(generateColumn(this.checkboxOption.length + 1))
                this.trigger()
            },
            trigger () {
                this.change('slots', JSON.parse(JSON.stringify(this.checkboxOption)), this.type, this.payload)
            }
        }
    }
</script>
<style lang='postcss'>
    .checkbox-title {
        height: 28px;
        font-size: 14px;
        font-weight: bold;
        color: #63656E;
    }
    .checkbox-item {
        display: flex;
        flex-direction: column;
    }
    .checkbox-option {
        display: flex;
        flex-direction: column;
        margin-bottom: 10px;
        padding: 0 6px 14px;
        background-color: #F0F1F5;
            box-shadow: 0px 2px 4px 0px rgba(0,0,0,0.2);
            .checkbox-del{
                display: block;
            }
        }
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
        }
    }
    .checkbox-del {
        position: absolute;
        right: 12px;
        font-size: 24px;
        color: #979BA5;
        text-align: right;
        cursor: pointer;
        display: none;
    }
    .checkbox-add {
        font-size: 12px;
        cursor: pointer;
        color: #3a84ff;
        i {
            padding-right: 2px;
            font-size: 16px;
        }
    }
</style>
