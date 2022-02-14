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
        <style-layout title="自定义样式">
            <style-item name="自定义样式">
                <div style="width: 200px; text-align: right">
                    <bk-button
                        theme="primary"
                        @click="showEditStyle(true)">
                        样式编辑
                    </bk-button>
                </div>
            </style-item>
        </style-layout>
        <article
            v-if="isShow"
            class="custom-style">
            <div class="custom-style-container">
                <div class="container-tips">
                    请在{}内编写该组件的自定义样式，样式优先级：自定义样式 > 样式面板设置 > 组件默认样式
                </div>
                <monaco
                    :value.sync="styleValue"
                    height="400px"
                    language="css"
                    :show-header="false"
                    class="monaco"
                    ref="monaco" />
                <div class="container-footer">
                    <div class="footer-wrapper">
                        <bk-button
                            theme="primary"
                            @click.native="confirm">
                            保存
                        </bk-button>
                        <bk-button @click="showEditStyle(false)">
                            取消
                        </bk-button>
                    </div>
                </div>
            </div>
        </article>
    </section>
</template>

<script>
    import StyleLayout from '../layout/index'
    import StyleItem from '../layout/item'
    import Monaco from '@/components/monaco'
    import { camelCase } from 'change-case'

    export default {
        components: {
            StyleLayout,
            StyleItem,
            Monaco
        },
        props: {
            componentId: {
                type: String
            },
            value: {
                type: Object,
                required: true
            },
            change: {
                type: Function,
                required: true
            }
        },
        data () {
            return {
                initMap: {},
                isShow: false,
                styleValue: ''
            }
        },
        computed: {
            initValue () {
                let mapStr = ''
                const className = camelCase(this.componentId.replace(/-/g, ''))
                for (const i in this.initMap) {
                    mapStr += `\t${i}: ${this.initMap[i]};\n`
                }
                if (!mapStr) {
                    mapStr = '\n'
                }
                return `.${className} {\n${mapStr}}`
            }
        },
        methods: {
            showEditStyle (isShow = true) {
                this.isShow = isShow
                if (isShow) {
                    this.initMap = this.value.customStyle || {}
                    this.styleValue = this.initValue
                }
            },
            parseInputStyle () {
                // eslint-disable-next-line
                let customMap = {}
                let inputVal = this.styleValue
                try {
                    inputVal = inputVal.trim()
                    inputVal = inputVal.replace(/[\t\n\v\r\f]/g, '')
                    if (!inputVal) return {}
                    const lSplit = inputVal.split('{')
                    const rSplit = inputVal.split('}')
                    if (lSplit.length !== 2 || rSplit.length !== 2) {
                        this.$bkMessage({
                            theme: 'error',
                            message: '请输入语法正确的css样式'
                        })
                        return {}
                    }
                    inputVal = inputVal.substring(inputVal.indexOf('{') + 1, inputVal.indexOf('}'))
                    const styleArr = inputVal.split(';')
                    styleArr.forEach(item => {
                        item = item.trim()
                        if (item) {
                            const itemArr = item.split(':')
                            if (itemArr.length === 2 && itemArr[0].trim() && itemArr[1].trim()) {
                                Object.assign(customMap, { [itemArr[0].trim()]: itemArr[1].trim() })
                            }
                        }
                    })
                    return customMap
                } catch (error) {
                    this.$bkMessage({
                        theme: 'error',
                        message: '请输入语法正确的css样式'
                    })
                    return {}
                }
            },
            confirm () {
                const styleMap = this.parseInputStyle() || {}
                this.change('customStyle', styleMap)
                this.showEditStyle(false)
            }
        }
    }
</script>

<style lang="postcss">
      .custom-style {
        position: fixed !important;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        background: rgba(0, 0, 0, 0.6);
        z-index: 2000;
        .custom-style-container {
            position: absolute;
            width: 800px;
            height: 500px;
            top: 20%;
            left: calc(50% - 400px);
            .container-tips {
                background: #1e1e1e;
                padding: 12px 32px;
                font-size: 12px;
                color: #979ba5;
            }
            .container-footer {
                text-align: right;
                padding: 12px 24px;
                background-color: #fafbfd;
                border-top: 1px solid #dcdee5;
                border-radius: 2px;
            }
        }
    }
</style>
