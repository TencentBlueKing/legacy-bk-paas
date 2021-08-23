<template>
    <section class="func-form-home">
        <form-market :form.sync="form" ref="market"></form-market>
        <form-name :form.sync="form" ref="name"></form-name>
        <form-code :form.sync="form" ref="code" :disabled="!!form.id"></form-code>
        <form-category :form.sync="form" ref="category"></form-category>
        <form-detail :form.sync="form" ref="detail"></form-detail>
        <form-api-data :form.sync="form" ref="apiData"></form-api-data>
        <form-summary :form.sync="form" ref="summary"></form-summary>
        <form-monaco :form.sync="form" class="mt20" ref="monaco"></form-monaco>
    </section>
</template>

<script>
    import mixins from './form-mixins'

    export default {
        mixins: [mixins]
    }
</script>

<style lang="postcss" scoped>
    .func-form-home {
        padding: 20px 30px;
        /deep/ .func-form-item {
            margin-top: 20px;
        }
        /deep/ .func-title {
            margin: 19px 0 17px;
            padding-left: 4px;
        }
    }
</style>
