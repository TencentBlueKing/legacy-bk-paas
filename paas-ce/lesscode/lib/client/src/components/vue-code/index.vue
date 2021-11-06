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
    <section class="vue-code" v-bkloading="{ isLoading: isLoading, color: '#313238' }">
        <code-viewer ref="codeView" v-show="!isLoading" :code="formatCode" :filename="filename" @change-with-nav="getFormatCode" :with-nav="withNav" />
    </section>
</template>

<script>
    import { mapGetters } from 'vuex'
    import { circleJSON } from '@/common/util.js'
    import CodeViewer from '@/components/code-viewer'
    export default {
        name: 'vue-code',
        components: {
            CodeViewer
        },
        props: {
            targetData: {
                type: Array,
                default: () => ([])
            },
            lifeCycle: {
                type: Object,
                default: () => ({})
            },
            withNav: {
                type: Boolean
            }
        },
        data () {
            return {
                pageType: 'vueCode',
                formatCode: '',
                isLoading: true
            }
        },
        computed: {
            ...mapGetters('projectVersion', { versionId: 'currentVersionId' }),
            projectId () {
                return this.$route.params.projectId || ''
            },
            pageId () {
                return this.$route.params.pageId || ''
            },
            filename () {
                return `bklesscode-${this.pageId}.vue`
            }
        },
        mounted () {
            this.getFormatCode(this.withNav)
        },
        methods: {
            getFormatCode (withNav) {
                this.isLoading = true
                console.log('查看源码 getFormatCode')
                const { pageType, projectId, versionId, lifeCycle, pageId } = this
                const state = this.$store.state || {}
                const drag = state.drag || {}
                const layoutContent = drag.curTemplateData
                const targetData = JSON.parse(circleJSON(this.targetData))
                this.$emit('update:withNav', withNav)
                this.$store.dispatch('vueCode/getPageCode', {
                    targetData,
                    pageType,
                    projectId,
                    versionId,
                    lifeCycle,
                    pageId,
                    layoutContent,
                    withNav
                }).then(res => {
                    this.formatCode = res
                }).finally(() => {
                    this.isLoading = false
                })
            }
        }
    }
</script>

<style lang="postcss">
    .vue-code {
        .hljs-attr {
            color: #a6e22e;
        }
    }
</style>
