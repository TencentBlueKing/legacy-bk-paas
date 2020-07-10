<template>
    <div class="render-list">
        <div class="header">
            <bk-button theme="primary" @click="handleShowOperation">新建</bk-button>
        </div>
        <bk-table>
            <bk-table-column label="组件名称" prop="statusText" align="left" />
            <bk-table-column label="组件ID" prop="statusText" align="left" />
            <bk-table-column label="所属分类" prop="statusText" align="left" />
            <bk-table-column label="是否公开" prop="statusText" align="left" />
            <bk-table-column label="最新版本" prop="statusText" align="left" />
            <bk-table-column label="更新时间" prop="statusText" align="left" />
            <bk-table-column label="更新人" prop="statusText" align="left" />
            <bk-table-column label="操作" prop="statusText" align="left" />
        </bk-table>
        <bk-sideslider :is-show.sync="isShowOperation" quick-close :width="796" title="新建自定义组件">
            <operation slot="content" />
        </bk-sideslider>
    </div>
</template>
<script>
    import Operation from './operation'

    export default {
        name: '',
        components: {
            Operation
        },
        data () {
            return {
                isShowOperation: false
            }
        },

        methods: {
            handleShowOperation () {
                this.isShowOperation = true
            }
        }
    }
</script>
<style lang='postcss' scoped>
    .render-list{
        padding: 14px 25px 14px 14px;
        .header{
            margin-bottom: 12px;
        }
    }
</style>
