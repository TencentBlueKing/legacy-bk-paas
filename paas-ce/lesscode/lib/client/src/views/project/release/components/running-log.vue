<template>
    <section>
        <bk-sideslider
            :is-show.sync="isShow"
            :quick-close="false"
            :width="896"
            :before-close="handleClose"
        >
            <div slot="header">
                <svg v-if="status === 'running'" aria-hidden="true" width="16" height="16" class="loading-rotate">
                    <use xlink:href="#bk-drag-loading-2"></use>
                </svg>
                {{ title }}
            </div>
            <div class="log-content" slot="content" v-bkloading="{ isLoading: isLoading, opacity: 1 }">
                <section v-show="!isLoading">
                    <div class="log-step" v-for="line in logs" :key="line.id">
                        <div class="log-title" v-if="line.event === 'title'">{{ line.content }}</div>
                        <div class="log-msg" v-if="line.event === 'msg'" v-html="line.content"></div>
                        <div id="log-end"></div>
                    </div>
                    <div v-if="status === 'running' && !content" class="log-loding-div">
                        <svg aria-hidden="true" width="40" height="40" class="loading-rotate">
                            <use xlink:href="#bk-drag-loading-2"></use>
                        </svg>
                    </div>
                    <pre>{{ content }}</pre>
                </section>
            </div>
        </bk-sideslider>
    </section>
</template>

<script>
    export default {
        props: {
            isShow: {
                type: Boolean,
                default: false
            },
            deployId: {
                type: String,
                default: ''
            },
            title: {
                type: String,
                default: '部署中日志'
            }
        },
        data () {
            return {
                logs: [],
                isLoading: false,
                status: 'running',
                content: '',
                timer: null
            }
        },
        computed: {
            projectId () {
                return this.$route.params.projectId
            }
        },
        async created () {
            this.isLoading = true
            if (this.deployId) {
                this.getLogs()
                this.loopLogs()
            } else {
                this.content = '暂无部署日志'
            }
        },
        destroyed () {
            this.timer && clearInterval(this.timer)
        },
        methods: {
            loopLogs () {
                this.timer && clearInterval(this.timer)
                this.timer = setInterval(() => {
                    this.getLogs()
                }, 3000)
            },
            async getLogs () {
                try {
                    this.content = ''
                    const res = await this.$store.dispatch('release/getRunningLog', {
                        projectId: this.projectId,
                        deployId: this.deployId
                    })
                    this.logs = res.logs || []
                    this.status = res.status

                    if (res.status === 'end') {
                        this.timer && clearInterval(this.timer)
                    }
                } catch (err) {
                    this.content = '日志加载异常,请刷新重试\n'
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
    .log-content {
        height: 100%;
        min-height: 500px;
        padding: 16px 36px;
        line-height: 16px;
        font-size: 12px;
        .log-title {
            font-weight: bold;
            margin: 5px 0;
        }
        .log-msg {
            color: #63656e;
            margin: 5px 0;
        }
        .log-loading-div {
            margin-top: 10px;
        }
    }
    .loading-rotate {
        animation: icon-loading 1.5s linear infinite;
    }
    @keyframes icon-loading {
        to {
            transform:rotate(1turn);
        }
    }
</style>
