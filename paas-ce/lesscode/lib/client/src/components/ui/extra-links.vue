<template>
    <div class="extra-links">
        <div class="changelog" @click="goChangelog" v-bk-tooltips="{ content: '更新日志', placements: ['bottom'] }">
            <i class="bk-drag-icon bk-drag-update-log-fill"></i>
        </div>
        <div class="github-link" @click="goGithub" v-bk-tooltips="{ content: 'Github', placements: ['bottom'] }">
            <i class="bk-drag-icon bk-drag-github-logo"></i>
        </div>
    </div>
</template>

<script>
    export default {
        methods: {
            goGithub () {
                window.open('https://github.com/Tencent/bk-PaaS/blob/lesscode-master/paas-ce/lesscode/README.md')
            },

            goChangelog () {
                const routerUrl = this.$router.resolve({
                    name: 'changelog'
                })
                window.open(routerUrl.href, '_blank')
            }
        }
    }
</script>

<style lang="postcss" scoped>
    .extra-links {
        display: flex;

        .github-link,
        .changelog {
            height: 52px;
            width: 30px;
            font-size: 16px;
            line-height: 52px;
            text-align: center;
            cursor: pointer;
            margin-right: 10px;
        }
    }
</style>
