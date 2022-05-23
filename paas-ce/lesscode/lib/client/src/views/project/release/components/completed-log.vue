<template>
    <section>
        <bk-sideslider
            :is-show.sync="isShow"
            :quick-close="false"
            title="部署日志"
            :width="896"
            :before-close="handleClose"
        >
            <div slot="header">
                <i v-if="status === 'successful'" class="bk-drag-icon bk-drag-check-circle-fill icon-successful"></i>
                <i v-if="status === 'failed'" class="bk-drag-icon bk-drag-close-circle-fill icon-failed"></i>
                {{ logTitle }}
            </div>
            <div class="log-content" slot="content" v-bkloading="{ isLoading: isLoading, opacity: 1 }">
                <pre class="log-detail" v-html="content"></pre>
            </div>
        </bk-sideslider>
    </section>
</template>

<script>
    export default {
        props: {
            status: {
                type: String,
                default: ''
            },
            isShow: {
                type: Boolean,
                default: false
            },
            deployId: {
                type: String,
                default: ''
            },
            defaultContent: {
                type: String,
                default: ''
            }
        },
        data () {
            return {
                isLoading: false,
                content: ''
            }
        },
        computed: {
            projectId () {
                return this.$route.params.projectId
            },
            logTitle () {
                return this.status === 'successful' ? '环境部署成功' : (this.status === 'failed' ? '环境部署失败' : '部署日志')
            }
        },
        created () {
            if (this.deployId) {
                this.getLogs()
            } else {
                this.content = this.defaultContent
            }
        },
        methods: {
            async getLogs () {
                try {
                    this.isLoading = true
                    const res = await this.$store.dispatch('release/detailFromV3', {
                        projectId: this.projectId,
                        deployId: this.deployId
                    })
                    this.content = res.logs || 'v3部署日志为空'
                } catch (err) {
                    this.content = '日志加载异常\n'
                    this.content += err.message || err
                } finally {
                    this.isLoading = false
                }
            },
            handleClose () {
                this.$emit('closeLog')
            }
        }
    }
</script>

<style lang="postcss" scoped>
    .icon-successful {
        color: #2dcb56;
    }
    .icon-failed {
        color: #ea3636;
    }
    .log-content {
        height: 100%;
        min-height: 500px;
        padding: 16px 36px;
        .log-detail {
            line-height: 16px;
            font-size: 12px;
            color: #63656e;
            word-break: break-all;
            width: 800px;
        }
    }
</style>
