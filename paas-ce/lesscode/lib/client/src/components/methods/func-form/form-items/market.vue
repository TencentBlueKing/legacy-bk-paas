<template>
    <bk-form :label-width="84" ref="funcForm" :form-type="formType" class="func-form-bottom">
        <bk-form-item label="函数市场" desc="使用函数市场快速编辑函数。注意：选择后会覆盖当前函数的值">
            <bk-select @toggle="getMarketFuncs" @selected="changeMarketFunc" :loading="isLoading">
                <bk-option v-for="option in marketFuncs"
                    :key="option.id"
                    :id="option.id"
                    :name="option.funcName">
                </bk-option>
            </bk-select>
        </bk-form-item>
    </bk-form>
</template>

<script>
    import mixins from './form-item-mixins'
    import { mapActions } from 'vuex'

    export default {
        mixins: [mixins],

        data () {
            return {
                isLoading: false,
                marketFuncs: []
            }
        },

        methods: {
            ...mapActions('functionMarket', ['getAllFuncFromMarket']),

            getMarketFuncs (isExpand) {
                if (isExpand) {
                    this.isLoading = true
                    this.getAllFuncFromMarket().then(res => {
                        this.marketFuncs = res || []
                    }).catch((err) => {
                        this.messageError(err.message || err)
                    }).finally(() => {
                        this.isLoading = false
                    })
                }
            },

            changeMarketFunc (funcId) {
                const { id, ...rest } = this.marketFuncs.find((func) => (func.id === funcId)) || {}
                const copyVaule = JSON.parse(JSON.stringify(this.form))
                Object.assign(copyVaule, rest)
                this.$emit('update:formChanged', true)
                this.$emit('update:form', copyVaule)
            }
        }
    }
</script>

<style lang="postcss" scoped>
    
</style>
