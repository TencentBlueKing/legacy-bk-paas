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
    <iframe :src="previewUrl" frameborder="0" class="preview-home" ref="iframe" @load="initDefaultPath"></iframe>
</template>

<script>
    export default {
        data () {
            return {
                previewUrl: `${window.location.origin}/preview.html`
            }
        },

        created () {
            window.addEventListener('message', this.handleUrl)
        },

        beforeDestroy () {
            window.removeEventListener('message', this.handleUrl)
        },

        methods: {
            initDefaultPath () {
                const val = this.$route
                const data = {
                    fullPath: val.fullPath.replace(/\/preview\/project\/\d+/, ''),
                    query: val.query,
                    type: 'initRouter'
                }
                this.sendDataToIframe(data)
            },

            sendDataToIframe (data) {
                this.$refs.iframe.contentWindow.postMessage((data), '\*')
            },

            handleUrl (res) {
                const data = res.data || {}
                const iframePath = data.name === '404' ? '/404' : (data.fullPath || '/')
                const url = `/preview/project/${this.$route.params.projectId}${iframePath}`
                if (data.type !== 'preview') return
                history.replaceState({ url: url, title: document.title }, document.title, url)
            }
        }
    }
</script>

<style lang="postcss" scoped>
    .preview-home {
        width: 100vw;
        height: 100vh;
    }
</style>
