<template>
    <div class="component-manage-useing-page" v-bkloading="{ isLoading }">
        <div class="search">
            <bk-input right-icon="bk-icon icon-search" />
        </div>
        <bk-table :data="data">
            <bk-table-column label="组件名称" prop="compName" align="left" />
            <bk-table-column label="来源" prop="compCode" align="left" />
            <bk-table-column label="所属分类" prop="categoryId" align="left" />
            <bk-table-column label="是否公开" prop="isPublic" align="left" />
            <bk-table-column label="使用版本" prop="latestVersionId" align="left" />
            <bk-table-column label="最新版本" prop="updateTime" align="left" />
            <bk-table-column label="使用页面" prop="updateUser" align="left" />
            <bk-table-column label="操作" prop="statusText" align="left">
                <template slot-scope="{ row }">
                    <bk-button text @click="handleUpdate(row)">升级</bk-button>
                </template>
            </bk-table-column>
        </bk-table>
    </div>
</template>
<script>
    export default {
        name: '',

        data () {
            return {
                isLoading: true,
                data: []
            }
        },
        created () {
            this.fetchData()
        },
        methods: {
            async fetchData () {
                this.data = await this.$store.dispatch('components/useing')
                this.isLoading = false
            },
            handleUpdate (payload) {
                console.log(payload)
            }
        }
    }
</script>
<style lang='postcss'>
    .component-manage-useing-page{
        padding: 14px 27px 22px 32px;
        .search{
            width: 400px;
            margin-bottom: 14px;
        }
    }
</style>
