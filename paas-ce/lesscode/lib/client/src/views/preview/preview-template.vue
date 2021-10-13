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

<script>
    import Vue from 'vue'
    import httpVueLoader from '@/common/http-vue-loader'

    window.previewCustomCompontensPlugin = []
    window.registerPreview = function (callback) {
        window.previewCustomCompontensPlugin.push(callback)
    }
    const LoadingComponent = Vue.component('loading-component', {
        props: {
            isLoading: {
                type: Boolean,
                default: false
            }
        },
        data () {
            return {
                height: window.innerHeight
            }
        },
        template: `
            <div class="loading" :style="{ height: height + 'px' }" v-bkloading="{ isLoading: true }"></div>
        `
    })
    /* eslint-disable */
    const ErrComponent = Vue.component('err-component', {
        template: '<span>err</span>'
    })
    /* eslint-enable */

    export default {
        name: 'preview',
        components: {
            LoadingComponent
        },
        data () {
            return {
                isCustomComponentLoading: true,
                detail: {},
                pageType: 'preview',
                comp: 'LoadingComponent',
                isLoading: false,
                targetData: [],
                minHeight: 0
            }
        },
        computed: {
            fromTemplateList () {
                return this.$route.query.type && this.$route.query.type === 'viewTemplate'
            },
            projectId () {
                return this.$route.params.projectId || ''
            },
            templateId () {
                return this.$route.params.templateId || ''
            }
        },
        async created () {
            const script = document.createElement('script')
            script.src = `/${parseInt(this.projectId)}/component/preview-register.js`
            script.onload = () => {
                window.previewCustomCompontensPlugin.forEach(callback => {
                    const [config, source] = callback(Vue)
                    Vue.component(config.type, source)
                })
                this.isCustomComponentLoading = false
            }
            document.body.appendChild(script)

            this.detail = await this.$store.dispatch('pageTemplate/detail', { id: this.templateId })

            await this.loadFile()
        },
        mounted () {
            this.minHeight = window.innerHeight
            window.addEventListener('resize', this.resizeHandler)
        },
        destroyed () {
            window.removeEventListener('resize', this.resizeHandler)
        },
        methods: {
            async loadFile () {
                this.isLoading = true
                try {
                    this.targetData.push(JSON.parse(this.detail.content || {}))
                } catch (err) {
                    this.$bkMesseage({
                        theme: 'error',
                        message: 'targetData格式错误'
                    })
                }

                try {
                    console.log('预览 loadFile')
                    const { targetData, projectId } = this
                    
                    let code = await this.$store.dispatch('vueCode/getPageCode', {
                        targetData,
                        projectId: projectId,
                        pageType: 'previewSingle',
                        fromPageCode: this.detail.fromPageCode
                    })
                    
                    code = code.replace('export default', 'module.exports =').replace('components: { chart: ECharts },', '')
                    console.log(code)
                    const res = httpVueLoader(code)
                    setTimeout(() => {
                        Vue.component('preview-page', res)
                        this.comp = 'preview-page'
                        this.isLoading = false
                    }, 300)
                } catch (err) {
                    this.$bkMesseage({
                        theme: 'error',
                        message: err.message || err
                    })
                }
            },
            resizeHandler () {
                this.minHeight = window.innerHeight
            }
        },
        template: ''
            + '<div v-if="!isCustomComponentLoading" :style="{ \'min-height\': minHeight + \'px\' }">'
            + '<component :is="comp" :is-loading="isLoading"/>'
            + '</div>'
    }
</script>
