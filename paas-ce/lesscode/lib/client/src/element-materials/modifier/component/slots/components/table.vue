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
        <div class="table-column-item">
            <vue-draggable
                class="group-list"
                ghost-class="block-item-ghost"
                :list="column"
                handle=".option-col-drag"
                @change="trigger"
                :group="{ name: 'table-col' }">
                <transition-group type="transition" :name="'flip-list'">
                    <div class="table-column-option" v-for="(item, index) in column" :key="`col${index}`">
                        <div class="option-col-operate">
                            <i class="bk-drag-icon bk-drag-drag-small1 option-col-drag" />
                            <i class="bk-icon icon-close option-col-del" @click="handleDelete(index)"></i>
                        </div>
                        <section style="margin-top: 20px">
                            <div class="option-item" :class="item.type === 'selection' ? 'disabled' : ''">
                                <div class="label">label</div>
                                <bk-input :value="item.label" @change="val => handleChange(val, 'label', index)" />
                            </div>

                            <template v-if="item.type === 'customCol'">
                                <div class="option-item">
                                    <div class="label">
                                        <span class="show-tip" v-bk-tooltips="{ content: '可输入html模板或vue template，<br>`props.row`作为内置变量代表表格每一行的数据，如`props.row.id`代表每一行的id字段，<br>也可以在此处调用函数库已有的函数（若使用了函数库函数，需在模板绑定函数项勾选用到的函数），<br>如默认值demo即可实现一项编辑操作列' }">自定义列模板</span>
                                    </div>
                                    <bk-input type="textarea" :value="item.templateCol" @change="val => handleChange(val, 'templateCol', index)" />
                                </div>
                                <div class="option-item">
                                    <div class="label">
                                        <span class="show-tip" v-bk-tooltips="{ content: '请勾选列模板中使用到的函数库函数，<br>未使用函数则无须勾选' }">模板绑定函数</span>
                                    </div>
                                    <bk-select style="width: 100%" class="event-choose" ref="eventChooseComp" :value="item.methodCode" :multiple="true" @change="val => handleChange(val, 'methodCode', index)">
                                        <bk-option-group
                                            v-for="(group, funcIndex) in funcGroups"
                                            :name="group.groupName"
                                            :key="funcIndex">
                                            <bk-option class="function-option"
                                                v-for="option in group.functionList"
                                                :key="option.id"
                                                :id="option.funcCode"
                                                :name="option.funcName">
                                                <span class="funtion-name" :title="option.funcName">{{option.funcName}}</span>
                                                <i class="bk-icon icon-info" v-bk-tooltips="option.funcSummary || '该函数暂无描述'"></i>
                                            </bk-option>
                                        </bk-option-group>
                                        <div slot="extension" style="cursor: pointer;" @click="showMethodDialog">
                                            <i class="bk-drag-icon bk-drag-function-fill"></i>函数库
                                        </div>
                                    </bk-select>
                                </div>
                            </template>
                            <template v-else>
                                <div class="option-item" :class="(item.type === 'selection' || item.type === 'index') ? 'disabled' : ''">
                                    <div class="label">
                                        <span class="show-tip" v-bk-tooltips="{ content: '该列对应的字段名' }">prop</span>
                                    </div>
                                    <bk-input :value="item.prop" @change="val => handleChange(val, 'prop', index)" />
                                </div>
                                <div class="option-item">
                                    <div class="label">列类型</div>
                                    <bk-select style="width: 100%; background-color: #fff"
                                        v-model="item.type" @change="val => handleChange(val, 'type', index)">
                                        <bk-option v-for="option in typeList"
                                            :key="option.id"
                                            :id="option.id"
                                            :name="option.name">
                                        </bk-option>
                                    </bk-select>
                                </div>
                            </template>
                            <div class="option-item">
                                <div class="label">
                                    <span class="show-tip" v-bk-tooltips="{ content: '列宽度，请填写正整数，单位为px' }">width</span>
                                </div>
                                <bk-input :value="item.width" type="number" @change="val => handleChange(val, 'width', index)">
                                    <template slot="append">
                                        <div class="group-text">px</div>
                                    </template>
                                </bk-input>
                            </div>
                            <div v-if="item.type !== 'customCol'" class="option-item" :class="(item.type === 'selection' || item.type === 'index') ? 'disabled' : ''">
                                <bk-checkbox :checked="item.sortable" @change="val => handleChange(val, 'sortable', index)" style="font-size: 12px;">
                                    支持排序
                                </bk-checkbox>
                            </div>
                        </section>
                    </div>
                </transition-group>
            </vue-draggable>
        </div>
        <div>
            <span class="table-column-add" @click="handleAdd">添加默认列</span> |
            <span class="table-column-add" @click="handleAdd('customCol')"> 添加自定义内容列</span>
        </div>
        <methods :show.sync="showMethod"></methods>
    </div>
</template>
<script>
    import { mapGetters } from 'vuex'
    import methods from '@/components/methods'

    const generateColumn = (index) => ({
        label: `选项${index}`,
        prop: `prop${index}`,
        sortable: false,
        type: ''
    })
    const generateCustomColumn = (index) => ({
        type: 'customCol',
        label: `选项${index}`,
        templateCol: `<a style="color:#3A84FF;cursor:pointer" @click="editCallBack(props.row)">编辑</a>`,
        methodCode: [],
        sortable: false
    })
    export default {
        name: 'slot-table',
        components: {
            methods
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
                column: [],
                showMethod: false,
                typeList: [
                    { id: '', name: '普通数据列' },
                    { id: 'selection', name: '多选框列' },
                    // { id: 'expand', name: '展开按钮' },
                    { id: 'index', name: '索引序号列（从 1 开始）' }
                ]
            }
        },
        computed: {
            ...mapGetters('functions', ['funcGroups'])
        },
        created () {
            this.column = JSON.parse(JSON.stringify(this.slotVal.val))
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
            handleAdd (type) {
                if (type !== 'customCol') {
                    this.column.push(generateColumn(this.column.length + 1))
                } else {
                    this.column.push(generateCustomColumn(this.column.length + 1))
                }
                this.trigger()
            },
            trigger () {
                const slot = {
                    ...this.slotVal,
                    val: JSON.parse(JSON.stringify(this.column))
                }
                this.change(slot)
            },
            showMethodDialog () {
                const eventChooseComp = this.$refs.eventChooseComp[0]
                if (eventChooseComp) {
                    eventChooseComp.close()
                }
                this.showMethod = true
            }
        }
    }
</script>
<style lang='postcss' scoped>
    .table-column-title {
        height: 28px;
        font-size: 12px;
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
        padding: 0 6px;
        background-color: #F0F1F5;
        &:hover {
            box-shadow: 0px 2px 4px 0px rgba(0,0,0,0.2);
            .option-col-operate {
                display: block;
            }
        }
        .option-item {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            margin-bottom: 10px;

            &.disabled {
                cursor: not-allowed;
                * {
                    opacity: 0.7;
                    pointer-events: none;
                }
            }
            .bk-checkbox-text {
                font-size: 12px;
            }
        }
        .label {
            height: 24px;
            font-size: 12px;
            margin-right: 0.6em;
            text-align: right;
            &.bold-label {
                font-weight: bold;
            }
            .show-tip {
                border-bottom: 1px dashed #979ba5;
                cursor: pointer;
                padding-bottom: 2px;
            }
        }
    }
    .table-column-add {
        font-size: 12px;
        cursor: pointer;
        color: #3a84ff;
        i {
            padding-right: 2px;
            font-size: 16px;
        }
    }
</style>
