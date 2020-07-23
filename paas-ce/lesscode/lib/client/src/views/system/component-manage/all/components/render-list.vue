<template>
    <div class="render-list" v-bkloading="{ isLoading }">
        <div class="header">
            <bk-button theme="primary" @click="handleShowOperation">新建</bk-button>
        </div>
        <bk-table :data="data">
            <bk-table-column label="组件名称" prop="compName" align="left" />
            <bk-table-column label="组件ID" prop="compCode" align="left" />
            <bk-table-column label="所属分类" prop="categoryId" align="left" />
            <bk-table-column label="是否公开" prop="isPublic" align="left" />
            <bk-table-column label="最新版本" prop="latestVersionId" align="left" />
            <bk-table-column label="更新时间" prop="updateTime" align="left" />
            <bk-table-column label="更新人" prop="updateUser" align="left" />
            <bk-table-column label="操作" prop="statusText" align="left">
                <template slot-scope="{ row }">
                    <bk-button text @click="handleUpdate(row)">更新</bk-button>
                    <bk-button text @click="handleOff(row)">下架</bk-button>
                </template>
            </bk-table-column>
        </bk-table>
        <operation :is-show.sync="isShowOperation" :id="componentId" @on-update="fetchData" />
    </div>
</template>
<script>
    import Operation from './operation'

    export default {
        name: '',
        components: {
            Operation
        },
        props: {
            category: {
                type: Number
            }
        },
        data () {
            return {
                isLoading: true,
                isShowOperation: false,
                data: [],
                componentId: 0
            }
        },
        watch: {
            category () {
                this.fetchData()
            }
        },
        created () {
            this.fetchData()
        },
        methods: {
            async fetchData () {
                this.isLoading = true
                this.data = await this.$store.dispatch('components/list', {
                    category: this.category
                })
                this.isLoading = false
            },
            
            handleShowOperation () {
                this.componentId = ''
                this.isShowOperation = true
            },
            handleUpdate (component) {
                this.componentId = component.id
                this.isShowOperation = true
            },
            handleOff () {

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
