<template>
    <section class="func-form-home">
        <form-name :form.sync="form" ref="name" :function-list="functionList"></form-name>
        <form-detail :form.sync="form" ref="detail"></form-detail>
        <form-api-data :form.sync="form" ref="apiData"></form-api-data>
        <form-summary :form.sync="form" :require-summary="true" ref="summary"></form-summary>
        <form-monaco :form.sync="form" class="mt20" ref="monaco"></form-monaco>
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
