<!--
  Tencent is pleased to support the open source community by making 蓝鲸智云PaaS平台社区版 (BlueKing PaaS Community Edition) available.
  Copyright (C) 2017-2019 THL A29 Limited, a Tencent company. All rights reserved.
  Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License.
  You may obtain a copy of the License at
  http://opensource.org/licenses/MIT
  Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on
  an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
  specific language governing permissions and limitations under the License.
-->

<template>
    <section v-if="emptyPage" class="preview-page">
        <router-view :name="topView" />
    </section>
    <section v-else-if="authed">
        <div id="app" :class="systemCls">
            <app-header></app-header>
            <router-view :name="topView" v-show="!mainContentLoading" />
        </div>
        <bk-fixed-navbar v-if="!isCanvas"
            :position="position"
            :nav-items="navItems"></bk-fixed-navbar>
    </section>
</template>
<script>
    import { mapGetters } from 'vuex'

    import { bus } from './common/bus'

    export default {
        name: 'app',

        data () {
            return {
                systemCls: 'mac',
                position: 'middle',
                navItems: [
                    {
                        icon: 'bk-drag-icon bk-drag-document',
                        text: '文档',
                        action: () => {
                            const routerUrl = this.$router.resolve({
                                path: '/help'
                            })
                            window.open(routerUrl.href, '_blank')
                        }
                    },
                    {
                        icon: 'bk-drag-icon bk-drag-comment-fill',
                        text: '反馈',
                        action: () => {
                            window.open('https://github.com/Tencent/bk-PaaS/labels/lesscode')
                        }
                    }
                ]
            }
        },

        computed: {
            ...mapGetters(['mainContentLoading']),
            emptyPage () {
                return this.$route.name === 'preview' || this.$route.name === 'previewTemplate'
            },
            authed () {
                return this.$route.meta.authed
            },
            topView () {
                const topRoute = this.$route.matched[0]
                return (topRoute && topRoute.meta.view) || 'default'
            },
            isCanvas () {
                return this.$route.name === 'new'
            }
        },

        mounted () {
            this.$store.dispatch('perm/isPlatformAdmin')
            const platform = window.navigator.platform.toLowerCase()
            if (platform.indexOf('win') === 0) {
                this.systemCls = 'win'
            }
            bus.$on('redirect-login', data => {
                window.location.replace(data.loginUrl)
            })
        }
    }
</script>

<style lang="postcss">
    @import './css/reset.css';
    @import './css/common.css';
    @import './css/bk-patch.css';
    @import "@/css/mixins/scroller";

    body {
        background-color: #fafbfd;
        @mixin scroller;
    }

    #app {
        width: 100%;
        height: 100%;
        font-size: 14px;
        color: #63656e;
    }

    .mac {
        /* font-family: PingFang SC, Microsoft Yahei, Helvetica, Aria; */
        font-family: -apple-system, BlinkMacSystemFont, PingFang SC, Microsoft YaHei, Helvetica Neue, Arial;
    }

    .bk-fixed-navbar-wrapper {
        z-index: 9999;
    }

    .win {
        /* font-family: Microsoft Yahei, PingFang SC, Helvetica, Aria; */
        font-family: -apple-system, BlinkMacSystemFont, PingFang SC, Microsoft YaHei, Helvetica Neue, Arial;
    }
</style>
