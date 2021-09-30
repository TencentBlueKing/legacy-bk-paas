<template>
    <section class="table-list-home">
        <bk-alert
            class="table-list-tip"
            type="info"
            title="数据表设计完成后，需部署后才能在预发布环境和生产环境生效， 上次部署时间：2021-02-20 12:12:14"
            closable
        ></bk-alert>

        <section>
            <bk-button>新建表</bk-button>
            <bk-button>批量删除</bk-button>
            <import-table title="导入表"></import-table>
            <export-table title="导出表"></export-table>
            <bk-divider direction="vertical"></bk-divider>
            <bk-button>进入数据管理</bk-button>
            <bk-button>数据源部署记录</bk-button>
        </section>

        <bk-table style="margin-top: 15px;"
            :data="data"
            :size="size"
            :pagination="pagination"
            @row-mouse-enter="handleRowMouseEnter"
            @row-mouse-leave="handleRowMouseLeave"
            @page-change="handlePageChange"
            @page-limit-change="handlePageLimitChange">
            <bk-table-column type="selection" width="60"></bk-table-column>
            <bk-table-column type="index" label="序列" width="60"></bk-table-column>
            <bk-table-column label="名称/内网IP" prop="ip"></bk-table-column>
            <bk-table-column label="来源" prop="source"></bk-table-column>
            <bk-table-column label="状态" prop="status"></bk-table-column>
            <bk-table-column label="创建时间" prop="create_time"></bk-table-column>
            <bk-table-column label="操作" width="150">
                <template slot-scope="props">
                    <bk-button class="mr10" theme="primary" text :disabled="props.row.status === '创建中'" @click="reset(props.row)">重置</bk-button>
                    <bk-button class="mr10" theme="primary" text @click="remove(props.row)">移除</bk-button>
                    <bk-popover class="dot-menu" placement="bottom-start" theme="dot-menu light" trigger="click" :arrow="false" offset="15" :distance="0">
                        <span class="dot-menu-trigger"></span>
                        <ul class="dot-menu-list" slot="content">
                            <li class="dot-menu-item">导入</li>
                            <li class="dot-menu-item">导出</li>
                        </ul>
                    </bk-popover>
                </template>
            </bk-table-column>
        </bk-table>
    </section>
</template>

<script lang="ts">
    import { defineComponent } from '@vue/composition-api'
    import importTable from '../../../common/import.vue'
    import exportTable from '../../../common/export.vue'

    export default defineComponent({
        components: {
            importTable,
            exportTable
        },

        setup () {
            
        },

        created () {
            
        },

        methods: {
            
        }
    })
</script>

<style lang="postcss" scoped>
    .table-list-home {
        padding: 16px 24px;
    }
    .table-list-tip {
        margin-bottom: 16px;
    }
</style>
