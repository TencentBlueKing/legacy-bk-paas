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
    <section class="select-func-home">
        <bk-select ref="selectFuncComp" :value="renderFunc.methodCode" @clear="clear">
            <bk-option-group
                v-for="(group, index) in funcGroups"
                :name="group.groupName"
                :key="index">
                <bk-option class="function-option"
                    v-for="option in group.functionList"
                    @click.native="choose(option)"
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
        <div class="panel-item" v-for="(panel, index) in renderFunc.params" :key="index">
            <bk-input :value="panel.value" @change="val => handleSpanChange(index, val, 'value')" />
            <i class="bk-icon icon-minus-circle" @click="handleDelete(index)"></i>
        </div>
        <div class="panel-add" @click="handleAdd"><i class="bk-icon icon-plus-circle"></i>添加函数执行参数</div>
        <methods :show.sync="showMethod" :select-func-code="renderFunc.methodCode"></methods>
    </section>
</template>

<script>
    import { mapGetters } from 'vuex'
    import methods from '@/components/methods'

    export default {
        components: {
            methods
        },

        model: {
            prop: 'value',
            event: 'change'
        },

        props: {
            value: [String, Object]
        },

        data () {
            return {
                showMethod: false,
                renderFunc: {}
            }
        },

        computed: {
            ...mapGetters('functions', ['funcGroups'])
        },

        created () {
            this.initData()
        },

        methods: {
            initData () {
                let renderFunc = {
                    methodCode: this.value || '',
                    params: []
                }
                if (typeof this.value === 'object') {
                    renderFunc = {
                        methodCode: this.value.methodCode || '',
                        params: this.value.params || []
                    }
                }
                this.renderFunc = renderFunc
            },

            clear () {
                this.renderFunc.methodCode = ''
                this.updateValue()
            },

            choose (option) {
                this.renderFunc.methodCode = option.funcCode
                this.updateValue()
            },

            showMethodDialog () {
                const selectFuncComp = this.$refs.selectFuncComp
                if (selectFuncComp) {
                    selectFuncComp.close()
                }
                this.showMethod = true
            },

            handleSpanChange (index, val, type) {
                this.renderFunc.params[index][type] = val
                this.updateValue()
            },

            handleAdd () {
                this.renderFunc.params.push({ value: '' })
                this.updateValue()
            },

            handleDelete (index) {
                this.renderFunc.params.splice(index, 1)
                this.updateValue()
            },

            updateValue () {
                this.$emit('change', this.renderFunc)
            }
        }
    }
</script>

<style lang="postcss" scoped>
    .select-func-home {
        width: 100%;
        background: #f0f1f5;
        border-radius: 2px;
        padding: 14px 6px 10px;
        /deep/ .bk-select {
            background: #fff;
        }
        &:hover{
            box-shadow: 0px 2px 4px 0px rgba(0,0,0,0.2);
        }
    }
    .bk-drag-function-fill {
        margin-right: 8px;
    }
    .panel-title {
        height: 32px;
        font-size: 14px;
        font-weight: 500;
        color: #606266;
    }
    .panel-list {
        display: flex;
        flex-direction: column;
    }
    .panel-item {
        display: flex;
        align-items: center;
        margin-top: 10px;
    }
    .panel-del {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 16px;
        height: 16px;
        margin-left: 6px;
        background: #ddd;
        border-radius: 50%;
        cursor: pointer;
    }
    .icon-minus-circle {
        margin: 0 3px;
        cursor: pointer;
    }
    .panel-add {
        font-size: 12px;
        margin: 10px 0 0;
        line-height: 16px;
        cursor: pointer;
        &:hover {
            color: #3a84ff;
        }
        i {
            padding-right: 2px;
            font-size: 16px;
        }
    }
</style>
