<template>
    <section>
        <bk-form :label-width="130" ref="funcForm" :form-type="formType" class="func-market-home">
            <bk-form-item label="从函数市场导入">
                <bk-select
                    @toggle="getMarketFuncs"
                    @selected="changeMarketFunc"
                    :loading="isLoading"
                    :popover-options="{ boundary: 'window', appendTo: 'parent' }"
                    :disabled="disabled">
                    <bk-option v-for="option in marketFuncs"
                        :key="option.id"
                        :id="option.id"
                        :name="option.funcName">
                        <div v-bk-tooltips="getTips(option.funcSummary)">{{ option.funcName }}</div>
                    </bk-option>
                </bk-select>
                <i class="bk-icon icon-info">可使用函数市场模板快速创建，注意：选择后会覆盖当前函数的数据</i>
            </bk-form-item>
        </bk-form>
        <h5 class="func-title">函数信息</h5>
    </section>
</template>

<script>
    import { transformTipsWidth } from '@/common/util'
    import mixins from './form-item-mixins'
    import { mapActions } from 'vuex'
    import { bus } from '@/common/bus'

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

            getTips (funcSummary) {
                const tips = transformTipsWidth(funcSummary, 350)
                let tipObj = {
                    content: tips,
                    placement: 'right',
                    boundary: 'window'
                }
                if (typeof tips === 'object') {
                    tipObj = {
                        ...tipObj,
                        ...tips
                    }
                }
                return tipObj
            },

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
                this.$parent.formChanged = true
                this.$emit('update:form', copyVaule)
                bus.$emit('switch-fun-form', copyVaule)
            }
        }
    }
</script>

<style lang="postcss" scoped>
    .func-market-home {
        background: #f0f1f5;
        border-radius: 2px;
        padding: 16px;
        /deep/ .bk-select {
            background: #fff;
        }
        /deep/ .bk-option-content {
            padding: 0;
            div {
                padding: 0 16px;
            }
        }
    }
    .func-title {
        font-weight: 700;
        font-size: 14px;
    }
    .icon-info {
        display: block;
        text-align: left;
        line-height: 16px;
        margin-top: 8px;
        font-size: 12px;
        &:before {
            margin-right: 4px;
        }
    }
</style>
