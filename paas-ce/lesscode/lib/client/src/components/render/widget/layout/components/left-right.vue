<template>
    <div ref="layout" class="monitor-navigation">
        <bk-navigation
            :header-title="navActive"
            :side-title="siteTitle"
            default-open
            navigation-type="left-right"
            need-menu
            v-bind="curTemplateData.renderProps || {}"
            @toggle="handleToggle">
            <template slot="side-header">
                <div
                    class="component-wrapper"
                    style="display: flex"
                    @mouseenter.stop="componentWrapperMouseenterHandler"
                    @mouseleave.stop="componentWrapperMouseleaveHandler"
                    @click.stop="handleSiteInfo">
                    <span class="title-icon">
                        <img style="width: 28px; height: 28px" :src="curTemplateData.logo" />
                    </span>
                    <span class="title-desc">{{ curTemplateData.siteName }}</span>
                </div>
            </template>
            <template slot="header">
                <bk-popover
                    theme="light lesscode-layout-message"
                    :arrow="false"
                    placement="bottom-start"
                    offset="-20, 10"
                    :tippy-options="{ 'hideOnClick': false }">
                    <div class="message-box">
                        <span>{{ user.username }}</span>
                        <i class="bk-icon icon-down-shape"></i>
                    </div>
                    <template slot="content">
                        <div class="message-item" @click="handleLogout">退出</div>
                    </template>
                </bk-popover>
            </template>
            <template slot="menu">
                <div
                    class="side-menu-wraper"
                    :class="{
                        selected: isSideMenuSelected
                    }"
                    @click.stop="handleSideMenuSelect">
                    <bk-navigation-menu
                        ref="menu"
                        :unique-opened="false"
                        :default-active="navActive"
                        :toggle-active="true">
                        <bk-navigation-menu-item
                            v-for="(menuItem) in curTemplateData.menuList"
                            ref="item"
                            :key="`${menuItem.id}_${refreshKey}`"
                            :has-child="menuItem.children && !!menuItem.children.length"
                            :icon="menuItem.icon"
                            :id="menuItem.name">
                            <span>{{menuItem.name}}</span>
                            <div slot="child">
                                <bk-navigation-menu-item
                                    v-for="(childrenItem) in menuItem.children"
                                    :key="`${childrenItem.id}`"
                                    :id="childrenItem.pageCode"
                                    default-active>
                                    <span>{{ childrenItem.name }}</span>
                                </bk-navigation-menu-item>
                            </div>
                        </bk-navigation-menu-item>
                    </bk-navigation-menu>
                </div>
            </template>
            <slot />
        </bk-navigation>
    </div>
</template>
<script>
    import { mapGetters, mapMutations } from 'vuex'
    import { bus } from '@/common/bus'
    import LC from '@/element-materials/core'
    import { getNodeWithClass } from '@/common/util'

    const unselectComponent = () => {
        const activeNode = LC.getActiveNode()
        if (activeNode) {
            activeNode.activeClear()
        }
    }

    export default {
        name: 'lesscode-layout',
        data () {
            return {
                siteTitle: 'lesscode',
                isToggle: false,
                navActive: '首页',
                isSideMenuSelected: false
            }
        },
        computed: {
            ...mapGetters(['user']),
            ...mapGetters('drag', [
                'curSelectedComponentData',
                'curTemplateData'
            ]),
            ...mapGetters('layout', ['pageLayout'])
        },
        created () {
            const activeCallback = () => {
                const curComponentNode = getNodeWithClass(this.$refs.layout, 'component-wrapper')
                curComponentNode.classList.remove('selected')
                this.isSideMenuSelected = false
            }
            LC.addEventListener('active', activeCallback)
            bus.$on('on-template-change', this.handleTemplateChange)
            this.$once('hook:beforeDestroy', () => {
                LC.removeEventListener('active', activeCallback)
                bus.$off('on-template-change', this.handleTemplateChange)
            })
            this.refreshKey = Date.now()
        },
        mounted () {
            this.handleOpenMenu()
        },
        methods: {
            ...mapMutations('drag', ['setCurTemplateData']),
            componentWrapperMouseenterHandler (event) {
                event.target.classList.add('component-wrapper-hover')
            },
            componentWrapperMouseleaveHandler (event) {
                event.target.classList.remove('component-wrapper-hover')
            },
            handleOpenMenu () {
                if (!this.$refs.item) {
                    return
                }
                this.refreshKey = Date.now()
                setTimeout(() => {
                    this.$refs.item.forEach(item => item.handleOpen())
                })
            },
            handleSiteInfo (event) {
                unselectComponent()
                event.target.classList.add('selected')
                this.setCurTemplateData({
                    ...this.curTemplateData,
                    panelActive: 'info'
                })
            },
            handleSideMenuSelect () {
                unselectComponent()
                this.isSideMenuSelected = true
                this.setCurTemplateData({
                    ...this.curTemplateData,
                    panelActive: 'menu'
                })
            },
            handleTemplateChange (payload) {
                const {
                    logo,
                    siteName,
                    menuList,
                    renderProps
                } = payload
                this.setCurTemplateData({
                    ...this.curTemplateData,
                    logo,
                    siteName,
                    menuList,
                    renderProps
                })
                this.handleOpenMenu()
            },
            handleToggle (value) {
                this.isToggle = value
            },
            handleLogout () {
                this.messageWarn('请部署后使用本功能')
            }
        }
    }
</script>
<style lang="postcss">
    .navigation-editor-wrapper{
        position: relative;
    }
</style>
