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
    <main class="help-main">
        <div class="main-container">
            <aside class="main-left-sidebar">
                <div class="main-top">
                    <div class="page-title">
                        <span class="bk-drag-icon app-logo" @click="jump('projects')">
                            <svg aria-hidden="true" width="22" height="22">
                                <use xlink:href="#bk-drag-template-logo"></use>
                            </svg>
                        </span>
                        <div class="page-name">
                            可视化开发帮助文档
                        </div>
                    </div>
                </div>
                <div class="sidebar-panel">
                    <div class="sidebar-bd">
                        <div class="nav-item">
                            <div class="nav-title no-groupid"></div>
                            <div class="nav-content" :class="$route.name === 'intro' ? 'nav-active' : ''" @click="jump('intro')">介绍</div>
                            <!-- <div class="nav-content" :class="$route.name === 'start' ? 'nav-active' : ''" @click="jump('start')">快速上手</div> -->
                            <div class="nav-content" :class="$route.name === 'grid' ? 'nav-active' : ''" @click="jump('grid')">栅格布局</div>
                            <!-- <div class="nav-content" :class="$route.name === 'custom' ? 'nav-active' : ''" @click="jump('custom')">自定义组件</div> -->
                            <div class="nav-content" :class="$route.name === 'changelog' ? 'nav-active' : ''" @click="jump('changelog')">更新日志</div>
                        </div>
                    </div>
                </div>
            </aside>
            <div class="main-content">
                <router-view :key="$route.path"></router-view>
            </div>
        </div>
    </main>
</template>

<script>
    import { getActualTop } from '@/common/util'

    import customComponents from '@/custom'

    export default {
        components: {
            ...customComponents
        },
        watch: {
            '$route' (to, from) {
                this.adjustAnchor()
            }
        },
        mounted () {
            this.adjustAnchor()
        },
        methods: {
            adjustAnchor () {
                const hash = this.$route.hash
                const anchor = hash.replace('#/?anchor=', '')
                if (!anchor) {
                    document.querySelector('.main-content').scrollTo(0, 0)
                    return
                }
                setTimeout(() => {
                    this.jumpAnchor(anchor)
                }, 0)
            },

            jumpAnchor (anchor) {
                const node = document.getElementById(anchor)
                if (!node) {
                    document.querySelector('.main-content').scrollTo(0, 0)
                    return
                }
                const top = getActualTop(node)
                this.$nextTick(() => {
                    document.querySelector('.main-content').scrollTo(0, top - 80)
                })
            },

            /**
             * 切换帮助文档内的 router
             *
             * @param {string} routeName routeName
             */
            jump (routeName) {
                this.$router.push({
                    name: routeName
                })
            }
        }
    }
</script>

<style lang="postcss">
    @import './index.css';
</style>
