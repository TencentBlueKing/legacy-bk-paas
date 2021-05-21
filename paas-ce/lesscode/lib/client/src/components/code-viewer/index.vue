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
    <div :class="[$style['code-viewer'], { [$style['fullscreen']]: isFullscreen }]">
        <div :class="$style['toolbar']">
            <div :class="$style['buttons']">
                <i v-bk-tooltips="{ boundary: 'window', content: '复制代码' }" :class="['bk-drag-icon', 'bk-drag-copy', $style['icon']]" @click="handleCodeCopy"></i>
                <i v-bk-tooltips="{ boundary: 'window', content: '下载源码' }" :class="['bk-drag-icon', 'bk-drag-download', $style['icon']]" @click="handleDownloadFile"></i>
                <i v-bk-tooltips="{ boundary: 'window', content: withNav ? '包含导航源码' : '不包含导航源码' }" :class="['bk-drag-icon', 'bk-drag-switcher', $style['icon'], { [$style['without-nav']]: !withNav }]" @click="switchWithNav"></i>
                <i v-bk-tooltips="{ boundary: 'window', content: '全屏' }" :class="['bk-drag-icon', 'bk-drag-full-screen', $style['icon']]" @click="handleScreenfull"></i>
            </div>
        </div>
        <div :class="$style['content']">
            <div :class="$style['code-panel']">
                <code viewer :class="$style['code']">{{ code }}</code>
            </div>
        </div>
    </div>
</template>

<script>
    import screenfull from 'screenfull'
    import hljs from 'highlight.js'
    // import 'highlight.js/styles/tomorrow.css'
    import 'highlight.js/styles/monokai-sublime.css'

    export default {
        props: {
            code: {
                type: String,
                default: ''
            },
            filename: {
                type: String,
                default: ''
            },
            withNav: {
                type: Boolean
            }
        },
        data () {
            return {
                isFullscreen: false
            }
        },
        watch: {
            code: {
                handler () {
                    this.highlightCode()
                },
                immediate: true
            }
        },
        mounted () {
            this.screenfullChange = () => {
                this.isFullscreen = screenfull.isFullscreen
            }
            if (screenfull.isEnabled) {
                screenfull.on('change', this.screenfullChange)
            }
        },
        destroyed () {
            screenfull.off('change', this.screenfullChange)
        },
        methods: {
            switchWithNav () {
                this.$emit('change-with-nav', !this.withNav)
            },
            highlightCode () {
                this.$nextTick(() => {
                    const ele = document.querySelector('code[viewer]')
                    if (this.code) {
                        ele.textContent = this.code
                        hljs.highlightBlock(ele)
                    }
                })
            },
            handleDownloadFile () {
                const downlondEl = document.createElement('a')
                const blob = new Blob([this.code])
                downlondEl.download = this.filename
                downlondEl.href = URL.createObjectURL(blob)
                downlondEl.style.display = 'none'
                document.body.appendChild(downlondEl)
                downlondEl.click()
                document.body.removeChild(downlondEl)
            },
            handleScreenfull () {
                const el = document.querySelector(`.${this.$style['code-viewer']}`)
                if (!screenfull.isEnabled) {
                    this.$bkMessage({
                        message: '浏览器不支持全屏',
                        theme: 'error'
                    })
                    return false
                }
                screenfull.request(el)
            },
            handleCodeCopy () {
                const code = this.code
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

<style lang="postcss" module>
    @import "@/css/mixins/scroller";

    .code-viewer {
        --toolbar-height: 42px;
        height: 100%;
        background: #313238;
        border-radius: 2px;

        &.fullscreen {
            --toolbar-height: 0px;
            .toolbar {
                display: none;
            }
        }

        .toolbar {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            height: var(--toolbar-height);
            padding: 0 22px;
            background: #4B4D55;

            .buttons {
                .icon {
                    font-size: 16px;
                    color: #C4C6CC;
                    cursor: pointer;
                    display: inline-block;

                    & + .icon {
                        margin-left: 12px;
                    }

                    &:hover {
                        color: #fff;
                    }
                }
            }

            .without-nav {
                transform: rotateY(180deg);
            }
        }

        .content {
            height: calc(100% - var(--toolbar-height));
            overflow: auto;
            @mixin scroller #63656E;

            .code-panel {
                white-space: pre;
                .code {
                    background: #313238 !important;
                    word-break: break-all;
                    word-wrap: break-word;
                    @mixin scroller;
                    .hljs-attr {
                        color: #a6e22e;
                    }
                }
            }
        }
    }
</style>
