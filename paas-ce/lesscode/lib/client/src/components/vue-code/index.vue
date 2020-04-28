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
    <section id="code-content" class="vue-code" v-bkloading="{ isLoading: isLoading, color: '#23241f' }">
        <template v-if="showOperation">
            <i title="复制代码" class="bk-drag-icon bk-drag-copy" @click="codeCopy($event)"></i>
            <i title="下载vue源码" class="bk-drag-icon bk-drag-download" @click="downloadFile"></i>
            <i title="全屏" class="bk-drag-icon bk-drag-full-screen" @click="screenfull"></i>
        </template>
        <div class="code-panel" style="white-space: pre;" v-show="!isLoading">
            <code>{{ formatCode }}</code>
        </div>
    </section>
</template>

<script>
    import screenfull from 'screenfull'
    import hljs from 'highlight.js'
    // import 'highlight.js/styles/tomorrow.css'
    import 'highlight.js/styles/monokai-sublime.css'
    import codeMixin from './code-mixin'

    hljs.highlightCode = function () {
        const blocks = document.querySelectorAll('code')
        blocks.forEach((block) => {
            hljs.highlightBlock(block)
        })
    }

    export default {
        name: 'vue-code',
        mixins: [codeMixin],
        props: {
            targetData: {
                type: Array,
                default: () => ([])
            }
        },
        data () {
            return {
                pageType: 'vueCode',
                formatCode: '',
                showOperation: true,
                isLoading: true
            }
        },
        created () {
            this.isLoading = true
            this.code = this.getCode()
            this.getFormatCode()
        },
        mounted () {
            if (screenfull.isEnabled) {
                screenfull.on('change', () => {
                    this.showOperation = !screenfull.isFullscreen
                })
            }
            hljs.initHighlightingOnLoad()
        },
        destroyed () {
            screenfull.off('change', () => {})
        },
        methods: {
            getFormatCode () {
                this.$store.dispatch('vueCode/formatCode', {
                    code: this.code
                }).then((res) => {
                    this.formatCode = res
                    this.$nextTick(() => {
                        hljs.highlightCode()
                    })
                }).finally(() => {
                    this.isLoading = false
                })
            },
            downloadFile () {
                const downlondEl = document.createElement('a')
                const blob = new Blob([this.formatCode])
                downlondEl.download = 'magicbox-vue-layout.vue'
                downlondEl.href = URL.createObjectURL(blob)
                downlondEl.style.display = 'none'
                document.body.appendChild(downlondEl)
                downlondEl.click()
                document.body.removeChild(downlondEl)
            },
            screenfull () {
                const el = document.getElementById('code-content')
                if (!screenfull.isEnabled) {
                    this.$bkMessage({
                        message: '浏览器不支持全屏',
                        theme: 'error'
                    })
                    return false
                }
                screenfull.request(el)
            },

            /**
             * 复制代码
             *
             * @param {Object} e 事件对象
             */
            codeCopy (e) {
                const code = e.target.parentNode.querySelector('code').innerText
                const el = document.createElement('textarea')
                el.value = code
                el.setAttribute('readonly', '')
                el.style.position = 'absolute'
                el.style.left = '-9999px'
                document.body.appendChild(el)
                const selected = document.getSelection().rangeCount > 0 ? document.getSelection().getRangeAt(0) : false
                el.select()
                document.execCommand('copy')
                document.body.removeChild(el)
                if (selected) {
                    document.getSelection().removeAllRanges()
                    document.getSelection().addRange(selected)
                }
                this.$bkMessage({ theme: 'primary', message: '代码复制成功', delay: 2000, dismissable: false })
            }
        }
    }
</script>
<style lang="postcss">
    @import "@/css/mixins/scroller";

    .vue-code {
        overflow: auto;
        background-color: #23241f;
        @mixin scroller;
        .bk-drag-icon {
            position: absolute;
            top: 10px;
            font-size: 22px;
            color: #fff;
            cursor: pointer;
        }
        .bk-drag-copy {
            right: 65px;
        }
        .bk-drag-download {
            right: 35px;
        }
        .bk-drag-full-screen {
            right: 5px;
        }
    }
    .code-panel {
        .hljs-attr {
            color: #a6e22e;
        }
    }
</style>
