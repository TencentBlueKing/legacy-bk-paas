<template>
    <section v-if="isShow" class="func-form-home">
        <section class="source-code">
            <section class="func-form-main">
                <h3 class="func-form-title">源码预览</h3>
                <form-name :form.sync="form" form-type="vertical" disabled></form-name>
                <form-detail :form.sync="form" form-type="vertical" disabled></form-detail>
                <form-api-data :form.sync="form" form-type="vertical" disabled></form-api-data>
                <form-summary :form.sync="form" form-type="vertical" disabled></form-summary>
            </section>
            <monaco class="monaco" :read-only="true" height="100%" :value="form.funcBody">
                <template v-slot:tools>
                    <i
                        class="bk-drag-icon bk-drag-export icon-style"
                        @click="handleExportFunction"
                        v-if="isShowExport"
                    ></i>
                    <i
                        class="bk-drag-icon bk-drag-close-line icon-style"
                        @click="handleClose"
                    ></i>
                </template>
            </monaco>
        </section>
    </section>
</template>

<script>
    import mixins from './form-mixins'
    import monaco from '@/components/monaco'
    import { getExportFunction } from 'shared/function'
    import { downloadFile } from '@/common/util.js'

    export default {
        components: {
            monaco
        },

        mixins: [mixins],

        props: {
            isShow: Boolean,
            isShowExport: Boolean
        },

        methods: {
            handleExportFunction () {
                downloadFile(getExportFunction(this.form), `${this.form.funcName}.json`)
            },

            handleClose () {
                this.$emit('update:isShow', false)
            }
        }
    }
</script>

<style lang="postcss" scoped>
    .func-form-main {
        float: left;
        width: 350px;
        height: 100%;
        overflow-y: auto;
        padding: 7px 20px 20px;
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
    .func-form-home {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.6);
        z-index: 500;
        .source-code {
            position: absolute;
            background: #fff;
            width: 80%;
            height: 74%;
            top: 13%;
            left: 10%;
        }
    }
    .monaco {
        margin: 0;
        height: calc(100% - 30px);
        margin-left: 350px;
    }
    .func-form-title {
        font-weight: normal;
        margin: 16px 0 16px;
        color: #313238;
    }
</style>
