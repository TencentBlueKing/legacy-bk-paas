<template>
    <main style="margin: 100px 50px;" v-bkloading="{ isLoading }">
        <bk-table
            :data="data"
        >
            <bk-table-column label="服务名称" prop="type" width="200" />
            <bk-table-column label="返回结果" prop="result" width="200" />
            <bk-table-column label="返回码" prop="code" width="200" />
            <bk-table-column label="报错信息" prop="message" show-overflow-tooltip min-width="200" />
        </bk-table>
    </main>
</template>

<script>
    export default {
        data () {
            return {
                data: [],
                isLoading: true
            }
        },
        created () {
            this.getHealthData()
        },
        methods: {
            async getHealthData () {
                this.data = await this.$store.dispatch('getHealthData') || []
                this.isLoading = false
            }
        }
    }
</script>
