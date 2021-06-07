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
        <bk-input
            disabled
            style="width: 100%"
            type="textarea"
            v-if="showInput"
            :rows="5"
            :value="initJsonStr" />
        <div class="option-add" @click="showEdit">编辑数据</div>

        <bk-dialog
            v-model="isShow"
            :confirm-fn="confirm"
            :position="{ top: 100 }"
            @cancel="cancel"
            render-directive="if"
            width="900"
            ext-cls="json-setting-dialog">
            <div class="dialog-title" v-if="dialogTitle">
                <bk-upload
                    :theme="'button'"
                    :tip="`可导入json文件或输入json数据,${dialogTitle}`"
                    with-credentials
                    :multiple="false"
                    :url="uploadUrl"
                    accept=".json"
                    @on-success="handleUploadSuccess"
                ></bk-upload>
            </div>
            <main class="main-container">
                <div class="init-json">
                    <textarea class="json-input" placeholder="请输入json格式的数据" v-model="initJsonStr"></textarea>
                </div>
                <div class="transform-json">
                    <json-viewer
                        :value="initJson"
                        :expand-depth="5"
                    ></json-viewer>
                </div>
            </main>
        </bk-dialog>
    </section>
</template>

<script>
    import Vue from 'vue'
    import { circleJSON } from '@/common/util.js'
    import JsonViewer from 'vue-json-viewer'
    Vue.use(JsonViewer)
    export default {
        props: {
            showInput: {
                type: Boolean,
                default: true
            },
            defaultValue: {
                type: [Object, Array, String],
                required: true
            },
            change: {
                type: Function,
                default: () => {}
            },
            name: {
                type: String,
                required: true
            },
            type: {
                type: String,
                required: true
            },
            dialogTitle: {
                type: String
            }
        },

        data () {
            return {
                isShow: false,
                initJsonStr: '',
                localValue: {}
            }
        },
        computed: {
            initJson () {
                if (this.initJsonStr) {
                    try {
                        return JSON.parse(this.initJsonStr)
                    } catch (e) {
                        return '解析error: ' + '请输入正确的json格式数据'
                    }
                }
                return {}
            },
            uploadUrl () {
                return `${AJAX_URL_PREFIX}/page/importJson`
            }
        },
        created () {
            this.localValue = this.defaultValue
            this.initJsonStr = circleJSON(this.defaultValue, null, 4)
        },
        methods: {
            showEdit () {
                this.isShow = true
            },
            confirm () {
                try {
                    if (this.initJsonStr && typeof JSON.parse(this.initJsonStr) === 'object') {
                        this.localValue = JSON.parse(this.initJsonStr)
                        this.change(this.name, JSON.parse(this.initJsonStr), this.type)
                        this.isShow = false
                    }
                } catch (err) {
                    console.log(err)
                    this.$bkMessage({
                        theme: 'error',
                        message: '请输入正确的json格式数据'
                    })
                }
            },
            cancel () {
                this.initJsonStr = circleJSON(this.localValue, null, 4)
            },
            handleUploadSuccess (res) {
                this.initJsonStr = res.responseData.data
            }
        }
    }
</script>

<style lang="postcss">
    @import "@/css/mixins/scroller";
    .json-setting-dialog {
        /deep/ .bk-dialog {
            position: initial;
            /* &.ease-enter-active.ease-enter-to {
                animation: none!important;
            } */
            .bk-dialog-content {
                top: calc(50vh - 324px)!important;
            }
        }
        .dialog-title {
            margin-left: 10px;
            font-size: 12px;
        }
        .main-container {
            width: 98%;
            height: 450px;
            display:flex;
            overflow: hidden;
            margin: 0 auto;
            border: solid 1px #E5EBEE;
            > div {
                border-right: solid 1px #E5EBEE;
                overflow: auto;
                @mixin scroller;
            }
            .init-json {
                flex: 1;
                overflow: hidden;
                margin-top: 10px;
                .json-input {
                    border: 0px;
                    width: 100%;
                    height: 100%;
                    @mixin scroller;
                }
            }
            .transform-json {
                flex: 1;
            }
        }
    }
    .option-add {
        font-size: 12px;
        cursor: pointer;
        color: #3a84ff
    }
</style>
