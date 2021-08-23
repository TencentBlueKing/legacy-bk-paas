<template>
    <section class="func-form-home">
        <form-project :form.sync="form" ref="project"></form-project>
        <form-name :form.sync="form" ref="name"></form-name>
        <form-code :form.sync="form" ref="code"></form-code>
        <form-category :form.sync="form" ref="category"></form-category>
        <form-detail :form.sync="form" ref="detail"></form-detail>
        <form-api-data :form.sync="form" ref="apiData"></form-api-data>
        <form-summary :form.sync="form" ref="summary"></form-summary>
        <form-monaco :form.sync="form" class="mt20" ref="monaco"></form-monaco>
    </section>
</template>

<script>
    import mixins from './form-mixins'
    import { mapActions } from 'vuex'

    export default {
        mixins: [mixins],

        beforeDestroy () {
            this.getAllGroupFuncs()
        },

        methods: {
            ...mapActions('functions', ['getAllGroupFuncs'])
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
