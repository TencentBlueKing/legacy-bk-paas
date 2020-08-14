<template>
    <main :class="['layout', { 'aside-folded': asideFolded }]">
        <aside class="aside">
            <div class="side-hd">
                <div class="brand">
                    <span class="bk-drag-icon app-logo">
                        <svg aria-hidden="true" width="22" height="22">
                            <use xlink:href="#bk-drag-template-logo"></use>
                        </svg>
                    </span>
                    <h2 class="app-name">可视化开发平台</h2>
                </div>
            </div>
            <div class="side-bd">
                <nav class="nav-list">
                    <router-link tag="div" :class="['nav-item', { 'router-link-active': $route.name === 'projects' }]" to="projects">
                        <i class="bk-drag-icon bk-drag-project-list"></i>项目列表
                    </router-link>
                    <!-- <router-link tag="div" class="nav-item" :to="{ name: 'componentManage', query: { filter: '' } }">
                        <i class="bk-drag-icon bk-drag-project-list"></i>自定义组件库
                    </router-link> -->
                    <router-link tag="div" class="nav-item" :to="'account'">
                        <i class="bk-drag-icon bk-drag-member"></i>账号管理
                    </router-link>
                </nav>
            </div>
            <div class="side-ft">
                <span class="nav-toggle" @click="asideFolded = !asideFolded">
                    <i class="bk-drag-icon bk-drag-nav-toggle"></i>
                </span>
            </div>
        </aside>
        <div class="breadcrumbs">
            <h3 class="current">{{$route.meta.title}}</h3>
            <extra-links></extra-links>
        </div>
        <div class="main-container">
            <router-view :key="$route.path"></router-view>
        </div>
        <footer class="footer">
            Copyright &copy; 2012-{{currentYear}} Tencent BlueKing. All Rights Reserved. 腾讯蓝鲸 版权所有
        </footer>
    </main>
</template>

<script>
    import ExtraLinks from '@/components/ui/extra-links'
    export default {
        components: {
            ExtraLinks
        },
        data () {
            return {
                currentYear: new Date().getUTCFullYear(),
                asideFolded: false
            }
        }
    }
</script>

<style lang="postcss">
    @import "@/css/mixins/ellipsis";

    .layout {
        --side-hd-height: 52px;
        --side-ft-height: 50px;
        --aside-width: 258px;
        --footer-height: 50px;
        --breadcrumb-height: 52px;
        --aside-folded-width: 60px;
        min-width: 1280px;
        height: calc(100vh - 64px);
        margin-top: 64px;

        &.aside-folded {
            .aside {
                width: var(--aside-folded-width);

                .side-ft {
                    .nav-toggle {
                        transform: rotate(0);
                    }
                }
            }

            .footer {
                padding-left: var(--aside-folded-width);
            }
        }

        .brand {
            display: flex;
            align-items: center;
            margin-left: 22px;
            .app-logo {
                font-size: 0;
            }
            .app-name {
                font-size: 16px;
                font-weight: normal;
                color: #313238;
                margin: 0;
                padding-left: 12px;
                white-space: nowrap;
            }
        }

        .aside {
            position: relative;
            width: var(--aside-width);
            height: 100%;
            border-right: 1px solid #DCDEE5;
            background: #FFF;
            float: left;
            z-index: 1;
            transition: width .2s cubic-bezier(0.4, 0, 0.2, 1);

            .side-hd {
                display: flex;
                justify-content: space-between;
                height: var(--side-hd-height);
                line-height: var(--side-hd-height);
            }
            .side-bd {
                height: calc(100% - var(--side-hd-height) - var(--side-ft-height));
                overflow-y: auto;
            }
            .side-ft {
                position: absolute;
                bottom: 0;
                height: var(--side-ft-height);
                line-height: var(--side-ft-height);
                width: 100%;
                background: #fff;
                padding-left: 12px;

                .nav-toggle {
                    width: 32px;
                    height: 32px;
                    line-height: 32px;
                    cursor: pointer;
                    display: inline-block;
                    text-align: center;
                    transform: rotate(180deg);
                    transition: transform .2s cubic-bezier(0.4, 0, 0.2, 1);

                    &:hover {
                        opacity: .8;
                    }
                }
            }
        }

        .breadcrumbs {
            position: relative;
            z-index: 99;
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: var(--breadcrumb-height);
            background: #fff;
            box-shadow: 0px 2px 2px 0px rgba(0,0,0,0.1);
            padding-left: 24px;
            .current {
                color: #000;
                font-size: 16px;
                font-weight: normal;
            }
        }

        .main-container {
            height: calc(100% - var(--footer-height) - var(--breadcrumb-height));
            overflow: auto;
        }

        .footer {
            position: fixed;
            bottom: 0;
            width: 100%;
            background: #fff;
            height: var(--footer-height);
            line-height: var(--footer-height);
            border-top: 1px solid #DCDEE5;
            text-align: center;
            padding-left: var(--aside-width);
            transition: padding .2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .nav-list {
            .nav-item {
                display: flex;
                align-items: center;
                font-size: 14px;
                height: 42px;
                line-height: 42px;
                padding: 0 12px 0 22px;
                margin: 0;
                white-space: nowrap;
                cursor: pointer;

                .bk-drag-icon {
                    font-size: 16px;
                    margin-right: 16px;
                }
                &:hover {
                    background: #F6F6F9;
                }
                &.router-link-active {
                    background: #E1ECFF;
                    color: #3A84FF;
                }
            }
        }
    }
</style>
