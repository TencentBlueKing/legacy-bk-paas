<template>
    <article>
        <render-header>
            <span class="table-header">
                <i class="bk-drag-icon bk-drag-arrow-back" @click="goBack"></i>
                新建表
            </span>
        </render-header>

        <main class="table-main">
            <section class="table-section">
                <h5 class="section-title">基础信息</h5>
                <bk-form :model="tableStatus.basicInfo" :label-width="82">
                    <bk-form-item label="表名" :required="true" property="tableName">
                        <bk-input v-model="tableStatus.basicInfo.tableName" class="section-item"></bk-input>
                    </bk-form-item>
                    <bk-form-item label="存储引擎">
                        <bk-input v-model="tableStatus.basicInfo.engine" disabled class="section-item"></bk-input>
                    </bk-form-item>
                    <bk-form-item label="字符集">
                        <bk-input v-model="tableStatus.basicInfo.character" disabled class="section-item"></bk-input>
                    </bk-form-item>
                    <bk-form-item label="备注" property="summary">
                        <bk-input v-model="tableStatus.basicInfo.summary" class="section-item"></bk-input>
                    </bk-form-item>
                </bk-form>
            </section>

            <section class="table-section">
                <h5 class="section-title">字段配置</h5>
                <field-table :data="tableStatus.data"></field-table>
            </section>

            <bk-button theme="primary" class="mr5">提交</bk-button>
            <bk-button @click="goBack">取消</bk-button>
        </main>
    </article>
</template>

<script lang="ts">
    import {
        defineComponent,
        reactive
    } from '@vue/composition-api'
    import {
        IBasicInfo,
        ITableField,
        tableBasicInfo,
        transformFieldObject2FieldArray
    } from './composables/table-info'
    import { baseColumns } from 'shared/data-source/constant'
    import renderHeader from '../common/header'
    import fieldTable from '../common/field-table'
    import router from '@/router'

    interface ITableStatus {
        basicInfo: IBasicInfo,
        data: ITableField[]
    }

    export default defineComponent({
        components: {
            renderHeader,
            fieldTable
        },

        setup () {
            const tableStatus = reactive<ITableStatus>({
                basicInfo: tableBasicInfo,
                data: transformFieldObject2FieldArray(baseColumns).map((item, ind) => {
                    if (ind % 2 === 0) {
                        return Object.assign(item, { isEdit: true })
                    } else {
                        return item
                    }
                })
            })

            const goBack = () => {
                router.push({ name: 'tableList' })
            }

            return {
                tableStatus,
                goBack
            }
        }
    })
</script>

<style lang="postcss" scoped>
    .table-header {
        display: flex;
        align-items: center;
        .bk-drag-arrow-back {
            color: #3a84ff;
            padding: 10px;
            cursor: pointer;
            font-size: 14px;
        }
    }
    .table-main {
        padding: 20px 24px;
    }
    .table-section {
        background: #ffffff;
        box-shadow: 0px 2px 4px 0px rgba(25,25,41,0.05);
        padding: 16px 24px 25px;
        margin-bottom: 23px;
        .section-title {
            font-weight: 700;
            text-align: left;
            color: #313238;
            line-height: 19px;
            font-size: 14px;
            margin: 0 0 12px;
        }
        .section-item {
            width: 483px;
        }
    }
</style>
