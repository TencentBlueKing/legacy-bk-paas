<template>
    <monaco
        :value.sync="copyForm.funcBody"
        :height="height"
        @change="change">
        <template v-slot:tools>
            <i class="bk-drag-icon bk-drag-fix icon-style" @click="fixMethod" v-bk-tooltips="fixMethodTips"></i>
            <slot name="tools"></slot>
        </template>
    </monaco>
</template>

<script>
    import monaco from '../../monaco.vue'
    import mixins from './form-item-mixins'
    import { mapActions } from 'vuex'
    import { bus } from '@/common/bus'
    import { getFunctionTips } from 'shared'

    const defaultMultVal = getFunctionTips(location.origin)

    export default {
        components: {
            monaco
        },

        mixins: [mixins],

        props: {
            height: {
                type: [Number, String],
                default: 458
            }
        },

        data () {
            return {
                fixMethodTips: {
                    content: '自动修复 Eslint',
                    theme: 'light',
                    placements: ['top'],
                    appendTo: 'parent',
                    boundary: 'window'
                },
                multVal: {
                    ...defaultMultVal
                }
            }
        },

        watch: {
            'copyForm.funcType': {
                handler (type) {
                    this.change(this.multVal[type])
                }
            }
        },

        created () {
            bus.$on('switch-fun-form', this.initMultVal)
            this.$once('hook:beforeDestroy', () => {
                bus.$off('switch-fun-form', this.initMultVal)
            })
            this.initMultVal()
        },

        methods: {
            ...mapActions('functions', ['fixFunByEslint']),

            initMultVal (func = this.copyForm) {
                this.multVal = {
                    ...defaultMultVal,
                    [func.funcType]: func.funcBody
                }
            },

            fixMethod () {
                this.fixFunByEslint(this.copyForm).then((res = {}) => {
                    const { code, message } = res.data || {}
                    if (code) {
                        this.change(code)
                    }
                    if (message) {
                        this.messageHtmlError(message)
                    } else {
                        this.messageSuccess('函数修复成功')
                    }
                }).catch((err) => {
                    this.messageError(err.message || err)
                })
            },

            change (val) {
                this.multVal[this.copyForm.funcType] = val
                this.updateValue('funcBody', val)
            }
        }
    }
</script>
