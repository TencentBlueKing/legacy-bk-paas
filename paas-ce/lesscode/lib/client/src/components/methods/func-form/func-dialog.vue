<template>
    <section class="func-form-home">
        <section class="func-form-main">
            <form-market
                v-if="!form.id"
                :form.sync="form"
                ref="market"
                form-type="vertical">
            </form-market>
            <form-name
                :form.sync="form"
                ref="name"
                form-type="vertical">
            </form-name>
            <form-code
                :form.sync="form"
                :disabled="!!form.id"
                ref="code"
                form-type="vertical">
            </form-code>
            <form-category
                :form.sync="form"
                ref="category"
                form-type="vertical"
            ></form-category>
            <form-detail
                :form.sync="form"
                ref="detail"
                form-type="vertical">
            </form-detail>
            <form-api-data
                :form.sync="form"
                ref="apiData"
                form-type="vertical">
            </form-api-data>
            <form-summary
                :form.sync="form"
                ref="summary"
                form-type="vertical">
            </form-summary>
        </section>
        <form-monaco :form.sync="form" height="100%" class="monaco" ref="monaco">
            <template v-slot:tools>
                <slot name="tools"></slot>
            </template>
        </form-monaco>
    </section>
</template>

<script>
    import mixins from './form-mixins'

    export default {
        mixins: [mixins]
    }
</script>

<style lang="postcss" scoped>
    .func-form-main {
        float: left;
        width: 350px;
        height: 100%;
        overflow-y: auto;
        margin: 7px 0;
        padding: 0 20px 20px;
        /deep/ .func-form-item {
            margin-top: 8px;
        }
        /deep/ .func-market-home {
            padding: 8px 12px 16px;
        }
        /deep/ .func-title {
            margin: 16px 0 8px;
        }
        &::-webkit-scrollbar {
            width: 6px;
            height: 5px;
        }
        &::-webkit-scrollbar-thumb {
            border-radius: 20px;
            background-color: #dcdee5;
            -webkit-box-shadow: inset 0 0 6px hsla(0, 0%, 80%, .3);
        }
    }
    .monaco {
        margin: 0;
        height: 100%;
        margin-left: 350px;
    }
</style>
