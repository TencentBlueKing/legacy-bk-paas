<template>
    <section>
        <div class="package-container" v-bkloading="{ isLoading: isLoading, opacity: 1 }">
            <div class="package-content">
                <bk-table :data="list" type="small" ext-cls="package-table" empty-text="暂无部署版本包">
                    <bk-table-column label="版本号" prop="version"></bk-table-column>
                    <bk-table-column label="创建时间" prop="createTime" :formatter="timeFormatter">
                    </bk-table-column>
                    <bk-table-column label="创建人" prop="createUser"></bk-table-column>
                    <bk-table-column label="操作">
                        <template slot-scope="{ row }">
                            <a class="download-link" :href="row.codeUrl">下载</a>
                        </template>
                    </bk-table-column>
                </bk-table>
            </div>
        </div>
    </section>
</template>

<script>
    import dayjs from 'dayjs'
    export default {
        data () {
            return {
                isLoading: true,
                list: []
            }
        },
        computed: {
            projectId () {
                return this.$route.params.projectId
            }
        },
        created () {
            this.getList()
        },
        methods: {
            async getList () {
                try {
                    this.isLoading = true
                    this.list = await this.$store.dispatch('release/getSucVersionList', { projectId: this.projectId })
                } catch (err) {
                    this.$bkMessage({
                        theme: 'error',
                        message: err.message || err
                    })
                } finally {
                    this.isLoading = false
                }
            },
            timeFormatter (obj, con, val) {
                return val ? dayjs(val).format('YYYY-MM-DD HH:mm:ss') : '--'
            }
        }
    }
</script>

<style lang="postcss">
    .package-container {
        margin: 20px 25px;

        .package-content {
            min-width: 1000px;

            .package-table {
                box-shadow: 0px 2px 2px 0px rgba(0,0,0,0.1);
                border: none;
                th {
                    background-color: #F0F1F5;
                }
                .download-link {
                    cursor: pointer;
                    color: #3a84ff;
                }
            }
        }
    }
</style>
