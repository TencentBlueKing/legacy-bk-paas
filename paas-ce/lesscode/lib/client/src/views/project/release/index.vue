<template>
    <div class="release-manage-page">
        <section v-if="!hasConfig">
            <bk-exception class="exception-wrap-item" type="500">
                <span>暂未配置paas平台相关信息</span>
            </bk-exception>
        </section>
        <section v-else>
            <div class="release-page-tab">
                <div class="tab-item" :class="{ active: page === 'publish' }" @click="handlePage('publish')">发布部署</div>
                <div class="tab-item" :class="{ active: page === 'history' }" @click="handlePage('history')">部署历史</div>
                <!-- <div class="tab-item" :class="{ active: page === 'package' }" @click="handlePage('package')">版本包管理</div> -->
            </div>
            <section class="release-page-content">
                <component :is="pageCom" />
            </section>
        </section>
    </div>
</template>
<script>
    import Publish from './publish'
    import History from './history'
    import Package from './package'
    export default {
        name: '',
        components: {
            Publish,
            History,
            Package
        },
        data () {
            return {
                hasConfig: true,
                page: 'publish'
            }
        },
        computed: {
            pageCom () {
                const comMap = {
                    publish: Publish,
                    history: History,
                    package: Package
                }

                return comMap[this.page]
            }
        },
        async created () {
            this.hasConfig = await this.$store.dispatch('release/checkConfig')
        },
        methods: {
            handlePage (page) {
                this.page = page
            }
        }
    }
</script>
<style lang='postcss'>
    .release-manage-page{
        overflow: hidden;
        .release-page-tab{
            position: relative;
            z-index: 1;
            display: flex;
            padding-left: 18px;
            font-size: 14px;
            color: #63656E;
            background: #fff;
            box-shadow: 0px 2px 2px 0px rgba(0,0,0,0.1);
            .tab-item{
                position: relative;
                display: flex;
                align-items: center;
                height: 44px;
                padding: 0 14px;
                cursor: pointer;
                &.active{
                    color: #3a84ff;
                    &:after{
                        content: '';
                        position: absolute;
                        bottom: -1px;
                        left: 0;
                        width: 100%;
                        height: 2px;
                        background: #3a84ff;
                    }
                }
            }
        }
        .release-page-content {
            height: 100%;
            overflow: auto;
        }
    }
</style>
