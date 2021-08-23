<template>
    <section class="func-form-home">
        <form-name :form.sync="form" ref="name" :function-list="functionList"></form-name>
        <form-detail :form.sync="form" :require-summary="true" ref="detail"></form-detail>
        <form-monaco :value.sync="form.funcBody" :func="form" class="mt20" :height="458"></form-monaco>
    </section>
</template>

<script>
    import mixins from './form-mixins'

    export default {
        mixins: [mixins],

        props: {
            functionList: Array
        }
    }
</script>

<style lang="postcss" scoped>
    .func-form-home {
        padding: 20px 30px;
        /deep/ .func-form-item {
            margin-top: 20px;
        }
        /deep/ .func-form-bottom {
            margin-bottom: 20px;
        }
    }
</style>
