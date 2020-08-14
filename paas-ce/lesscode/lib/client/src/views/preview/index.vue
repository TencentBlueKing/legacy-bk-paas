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
    import codeMixin from '@/components/vue-code/code-mixin'
    import { customComponentList } from '@/custom'
    import { mapActions } from 'vuex'

    customComponentList.forEach(name => {
        const ref = require('@/custom/' + name)
        const com = ref.default
        const componentName = ref.config.type
        Vue.component(componentName, com)
    })

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
        mixins: [codeMixin],
        data () {
            return {
                pageDetail: {},
                pageType: 'preview',
                comp: 'LoadingComponent',
                isLoading: false,
                targetData: [],
                minHeight: 0
            }
        },
        computed: {
            fromPageList () {
                return this.$route.query.type && this.$route.query.type === 'fromList'
            }
        },
        async created () {
            const projectId = this.$route.params.projectId || 1
            await this.getAllGroupFuncs(projectId)

            if (this.fromPageList) {
                this.pageDetail = await this.$store.dispatch('page/detail', { pageId: this.$route.params.pageId })
            }

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
            ...mapActions('functions', [
                'getAllGroupFuncs'
            ]),

            async loadFile () {
                this.isLoading = true
                try {
                    if (this.fromPageList) {
                        this.targetData = JSON.parse(this.pageDetail.content)
                    } else {
                        this.targetData = JSON.parse(localStorage.getItem('layout-target-data'))
                    }
                } catch (err) {
                    this.$bkMesseage({
                        theme: 'error',
                        message: 'targetData格式错误'
                    })
                }

                let code = this.getCode().replace('export default', 'module.exports =')
                code = code.replace('components: { chart: ECharts },', '')
                const res = httpVueLoader(code)
                setTimeout(() => {
                    Vue.component('preview-page', res)
                    this.comp = 'preview-page'
                    this.isLoading = false
                }, 300)
                // this.isLoading = true
                // try {
                //     const res = await httpVueLoader(this.url)
                //     setTimeout(() => {
                //         Vue.component('preview-page', res)
                //         this.comp = 'preview-page'
                //         this.isLoading = false
                //     }, 300)
                // } catch (e) {
                //     console.error(e)
                //     this.comp = 'ErrComponent'
                //     this.$bkMessage({
                //         theme: 'error',
                //         message: e.message || e.data.msg || e.statusText
                //     })
                //     this.isLoading = false
                // }
            },
            resizeHandler () {
                this.minHeight = window.innerHeight
            }
        },
        template: ''
            + '<div :style="{ \'min-height\': minHeight + \'px\' }">'
            + '<component :is="comp" :is-loading="isLoading"/>'
            + '</div>'
    }
</script>
