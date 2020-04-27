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
    import { mapMutations } from 'vuex'
    import httpVueLoader from 'http-vue-loader'
    import codeMixin from '../vue-code/code-mixin'
    import fullscreen from 'screenfull'

    /* eslint-disable */
    // const LoadingComponent = {
    //     template: '<span style="width: 100%; height: 100%; display: inline-block;" v-bkloading="{ isLoading: true }">loading</span>'
    // }
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

    const ErrComponent = {
        template: '<span>err</span>'
    }
    /* eslint-disable */

    export default {
        name: 'preview',
        components: {
            LoadingComponent
        },
        mixins: [codeMixin],
        props: {
            targetData: {
                type: Array,
                default: () => ([])
            }
        },
        data () {
            return {
                comp: 'LoadingComponent',
                fileName: '',
                isLoading: false
            }
        },
        computed: {
            url () {
                return './static/' + this.fileName
            }
        },
        async created () {
            this.code = this.getCode()
            await this.saveAsFile()

        },
        mounted () {
            if (fullscreen.isEnabled) {
                const el = document.getElementById('preview-area')
                fullscreen.request(el)
            }
        },
        destroyed () {
            this.$store.dispatch('vueCode/deleteTmpFile', {
                fileName: this.fileName
            })
        },
        methods: {
            ...mapMutations('vueCode', [
                'setCurrentFilePath'
            ]),
            async saveAsFile () {
                this.isLoading = true
                try {
                    const res = await this.$store.dispatch('vueCode/saveVueFile', {
                        code: this.code
                    })
                    this.setCurrentFilePath(res)
                    this.fileName = res
                    if (this.fileName) {
                        const res = await httpVueLoader(this.url)()
                        // console.log(res, 444)
                        setTimeout(() => {
                            Vue.component('preview-page', res)
                            this.comp = 'preview-page'
                            this.isLoading = false
                        }, 300)
                    }
                } catch (e) {
                    console.error(e)
                    this.$bkMessage({
                        theme: 'error',
                        message: e.message || e.data.msg || e.statusText
                    })
                    this.isLoading = false
                }
            }
        },
        template: `<div id="preview-area">
            <component :is="comp" :is-loading="isLoading" :url="url"/>
        </div>`
    }
</script>

<style scoped>
    *:fullscreen, *:-webkit-full-screen, *:-moz-full-screen *:-ms-fullscreen{
        background-color: #fff;
    }
</style>
