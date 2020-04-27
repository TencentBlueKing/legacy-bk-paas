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
                pageType: 'preview',
                comp: 'LoadingComponent',
                isLoading: false,
                targetData: []
            }
        },
        computed: {
            url () {
                return './static/' + this.fileName
            },
            fileName () {
                return (this.$route.query && this.$route.query.tmpFile) || ''
            }
        },
        async created () {
            if (this.fileName) {
                await this.loadFile()
            } else {
                this.$bkMessage({
                    theme: 'error',
                    message: '预览异常'
                })
            }
        },
        mounted () {
            // window.addEventListener('beforeunload', this.deleTmpFile)
        },
        destroyed () {
            // this.deleTmpFile()
        },
        methods: {
            async loadFile () {
                this.isLoading = true
                this.targetData = JSON.parse(localStorage.getItem('layout-target-data'))
                const code = this.getCode().replace('export default', 'module.exports =')
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
            deleTmpFile () {
                this.$store.dispatch('vueCode/deleteTmpFile', {
                    fileName: this.fileName
                })
            }
        },
        template: `<div>
            <component :is="comp" :is-loading="isLoading" :url="url"/>
        </div>`
    }
</script>
