<template>
    <div class="extra-links">
        <bk-popover placement="bottom-end" theme="light extra-links" :arrow="false">
            <div class="help-box">
                <i class="dropdown-trigger-btn bk-icon icon-question-circle-shape" />
            </div>
            <div class="extra-links-popover-panel" slot="content">
                <slot name="before" />
                <div @click="goStart">帮助文档</div>
            </div>
        </bk-popover>
        <div class="github-link" @click="goGithub" v-bk-tooltips="{ content: 'Github', placements: ['bottom'] }">
            <i class="bk-drag-icon bk-drag-github-logo"></i>
        </div>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                routeName: 'start'
            }
        },
        watch: {
            '$route': {
                handler (to, from) {
                    if (to.name === 'functionManage') {
                        this.routeName = 'method'
                    } else if (to.name === 'componentManage') {
                        this.routeName = 'custom'
                    } else if (to.name === 'layout') {
                        this.routeName = 'layout-guide'
                    } else {
                        this.routeName = 'start'
                    }
                },
                immediate: true
            }
        },
        methods: {
            goGithub () {
                window.open('https://github.com/Tencent/bk-PaaS/blob/lesscode-master/paas-ce/lesscode/README.md')
            },

            goStart () {
                const routerUrl = this.$router.resolve({
                    name: this.routeName
                })
                window.open(routerUrl.href, '_blank')
            }
        }
    }
</script>

<style lang="postcss">
    .extra-links {
        display: flex;
        width: 301px;
        align-items: center;
        justify-content: flex-end;
        .github-link {
            height: 52px;
            width: 30px;
            margin-left: 6px;
            font-size: 16px;
            line-height: 52px;
            text-align: center;
            cursor: pointer;
            margin-right: 10px;
            position: relative;
            top: -1px;
        }
        .help-box{
            display: flex;
            align-items: center;
            justify-content: center;
            width: 24px;
            height: 24px;
            font-size: 14px;
            color: #63656E;
            border-radius: 50%;
            cursor: pointer;
            &:hover{
                color: #3A84FF;
                background: #F0F1F5;
            }
        }
    }
    .extra-links-theme{
        padding: 7px 0 !important;
        border: 1px solid #dcdee5;
        .extra-links-popover-panel{
            & > *{
                display: block;
                height: 32px;
                line-height: 33px;
                padding: 0 16px;
                color: #63656e;
                font-size: 12px;
                text-decoration: none;
                white-space: nowrap;
                cursor: pointer;
                &:hover{
                    background-color: #eaf3ff;
                    color: #3a84ff;
                }
            }
        }
    }
</style>
