<template>
    <div class="function-manage-home">
        <div class="g-page-tab">
            <div
                class="tab-item"
                :class="{ active: page === 'functionComponent' }"
                @click="handlePage('functionComponent')"
            >函数管理</div>
            <div
                class="tab-item"
                :class="{ active: page === 'apiComponent' }"
                @click="handlePage('apiComponent')"
            >Api 管理</div>
        </div>
        <component :is="pageCom" />
    </div>
</template>
<script>
    import FunctionComponent from './function'
    import ApiComponent from './api'

    export default {
        name: '',
        components: {
            FunctionComponent,
            ApiComponent
        },
        data () {
            return {
                page: 'functionComponent'
            }
        },
        computed: {
            pageCom () {
                const comMap = {
                    functionComponent: FunctionComponent,
                    apiComponent: ApiComponent
                }

                return comMap[this.page]
            }
        },
        methods: {
            handlePage (page) {
                this.page = page
            }
        }
    }
</script>
<style lang="postcss" scoped>
    .function-manage-home {
        height: calc(100vh - 120px);
    }
</style>
