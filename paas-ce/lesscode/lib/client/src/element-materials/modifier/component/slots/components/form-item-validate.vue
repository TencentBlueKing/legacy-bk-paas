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
        <div class="form-item-title">校验规则</div>
        <div class="slot-card-wrapper">
            <div class="card-item-content" v-for="(item, index) in dataList" :key="`option${index}`">
                <div class="option-operate">
                    <i class="bk-icon icon-close option-col-del" @click="handleDelete(index)"></i>
                </div>
                <section style="margin-top: 20px;padding: 10px 20px 15px;">
                    <bk-form :label-width="120">
                        <bk-form-item label="校验方式" error-display-type="normal">
                            <bk-select :value="item.type" :clearable="false" @change="val => handleChange(val, 'type', index)">
                                <bk-option
                                    v-for="type in typeList"
                                    :id="type.id"
                                    :name="type.name"
                                    :key="type.id" />
                            </bk-select>
                        </bk-form-item>
                        <bk-form-item :label="getItemConfig(item.type)" error-display-type="normal" v-if="item.type !== 'required'" :required="true" :desc="getItemConfig(item.type, 'desc')">
                            <select-func v-if="item.type === 'validator'" :value="item[item.type]" @change="val => handleChange(val, item.type, index)" :show-add-params="false"></select-func>
                            <bk-input v-else :value="item[item.type]" :type="item.type === 'min' || item.type === 'max' ? 'number' : 'text'" @change="val => handleChange(val, item.type, index)" />
                        </bk-form-item>
                        <bk-form-item label="报错提示信息">
                            <bk-input :value="item.message" @change="val => handleChange(val, 'message', index)" />
                        </bk-form-item>
                    </bk-form>
                </section>
            </div>
            <div class="rule-add" @click="handleAdd">
                <i class="bk-drag-icon bk-drag-add-line"></i>添加规则
            </div>
        </div>
    </div>
</template>
<script>
    import selectFunc from '@/components/methods/select-func'

    const itemList = [
        {
            type: 'required',
            required: true,
            message: '字段不能为空',
            trigger: 'blur'
        },
        {
            type: 'min',
            min: '',
            message: '字段最小长度不符合设置值',
            trigger: 'blur'
        },
        {
            type: 'max',
            max: '',
            message: '字段最大长度不符合设置值',
            trigger: 'blur'
        },
        {
            type: 'regex',
            regex: '',
            message: '字段值不符合正则表达式',
            trigger: 'blur'
        },
        {
            type: 'validator',
            validator: '',
            message: '字段值未通过函数校验',
            trigger: 'blur'
        }
    ]

    export default {
        name: '',
        components: {
            selectFunc
        },
        props: {
            name: {
                type: String,
                required: true
            },
            defaultValue: {
                type: Array,
                required: true,
                default: () => ([])
            },
            change: {
                type: Function,
                default: () => {}
            }
        },
        data () {
            return {
                typeList: [
                    {
                        id: 'required',
                        name: '字段必填'
                    },
                    {
                        id: 'min',
                        name: '字段最小长度',
                        label: '最小长度'
                    },
                    {
                        id: 'max',
                        name: '字段最大长度',
                        label: '最大长度'
                    },
                    {
                        id: 'regex',
                        name: '正则表达式检验',
                        label: '正则表达式',
                        desc: { content: '表达式格式如“/a-zA-Z/”' }
                    },
                    {
                        id: 'validator',
                        name: '函数校验',
                        label: '选择函数',
                        desc: { width: 350, content: '绑定的函数需要设置一个参数，参数值即为当前表单项的值，如果需要异步函数校验，请使用Promise的方式' }
                    }
                ],
                dataList: []
            }
        },
        created () {
            this.dataList = JSON.parse(JSON.stringify(this.defaultValue))
            this.trigger()
        },
        methods: {
            trigger () {
                this.change(this.name, JSON.parse(JSON.stringify(this.dataList)))
            },
            handleDelete (index) {
                this.dataList.splice(index, 1)
                this.trigger()
            },
            handleChange (value, key, index) {
                if (key === 'validator') {
                    value = (value && value.methodCode) || value || ''
                }
                this.dataList[index][key] = value
                if (key === 'type') {
                    const newItem = itemList.find(item => item.type === value)
                    this.dataList.splice(index, 1, Object.assign({}, newItem))
                }
                this.trigger()
            },
            handleAdd () {
                this.dataList.push(Object.assign({}, itemList[0]))
                this.trigger()
            },
            getItemConfig (type, prop = 'label') {
                const typeItem = this.typeList.find(item => item.id === type)
                return (typeItem && typeItem[prop]) || ''
            }
        }
    }
</script>
<style lang='postcss'>
    .slot-card-wrapper {
        display: flex;
        flex-direction: column;
        .card-item-content {
            display: flex;
            position: relative;
            flex-direction: column;
            margin-bottom: 10px;
            padding: 0 6px;
            background-color: #F0F1F5;
            .option-operate {
                position: absolute;
                right: 4px;
                display: flex;
                justify-content: flex-end;
                margin-top: 4px;
                font-size: 16px;
                font: #979BA5;
                .option-col-del {
                    cursor: pointer;
                }
            }
            .card-item{
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                margin-bottom: 12px;
                font-size: 12px;
            }
            .label{
                height: 24px;
                margin-right: 0.6em;
                text-align: right;
            }
        }
        .rule-add {
            width: 100%;
            margin-top: 8px;
            padding: 8px 0;
            border: 1px dashed #3a84ff;
            text-align: center;
            font-size: 12px;
            cursor: pointer;
            color: #3a84ff;
            &:hover {
                background: #e1ecff;
            }
            i {
                padding-right: 2px;
            }
        }
    }
</style>
