<template>
    <section>
        <template v-for="(item, index) in list">
            <span :key="index" class="variable-txt">{{item.txt}}：</span>
            <monaco class="variable-code" :key="item.key" :value="value[item.key]" @change="change(item.key, ...arguments)">
                <template v-slot:tools>
                    <i class="bk-drag-icon bk-drag-fix icon-style" @click="fixVariable(item.key)" v-bk-tooltips="{ content: '自动修复 Eslint', theme: 'light', placements: ['top'] }"></i>
                </template>
            </monaco>
        </template>
    </section>
</template>

<script>
    import mixins from './variable.mixin'
    import monaco from '@/components/methods/monaco'
    import { mapActions } from 'vuex'

    export default {
        components: {
            monaco
        },

        mixins: [mixins],

        methods: {
            ...mapActions('functions', ['fixFunByEslint']),

            fixVariable (key) {
                const postData = {
                    funcBody: this.value[key]
                }
                this.fixFunByEslint(postData).then((res = {}) => {
                    const { code, message } = res.data || {}
                    if (code) this.change(key, code)
                    if (message) {
                        this.messageHtmlError(message)
                    } else {
                        this.messageSuccess('函数修复成功')
                    }
                }).catch((err) => {
                    this.messageError(err.message || err)
                })
            }
        }
    }
</script>

<style lang="postcss" scoped>
    .variable-txt {
        display: inline-block;
        font-size: 12px;
    }
</style>
