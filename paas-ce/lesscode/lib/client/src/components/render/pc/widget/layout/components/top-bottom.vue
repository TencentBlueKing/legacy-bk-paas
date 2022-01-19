<template>
    <div ref="layout">
        <bk-navigation
            navigation-type="top-bottom"
            :need-menu="false"
            @toggle="handleToggle"
            v-bind="curTemplateData.renderProps || {}">
            <div
                slot="side-header"
                class="component-wrapper"
                style="display: flex"
                @mouseenter.stop="componentWrapperMouseenterHandler"
                @mouseleave.stop="componentWrapperMouseleaveHandler"
                @click.stop="handleNavigationWraperClick('info', $event)">
                <span class="title-icon">
                    <img style="width: 28px; height: 28px" :src="curTemplateData.logo" />
                </span>
                <span class="title-desc">{{ curTemplateData.siteName }}</span>
            </div>
            <template slot="header">
                <div
                    class="navigation-header top-menu-wraper"
                    :class="{
                        selected: isTopMenuSelected
                    }"
                    @click.stop="handleTopMenuClick">
                    <template v-for="topMemu in curTemplateData.topMenuList">
                        <component
                            :is="topMemu.children && topMemu.children.length > 0 ? 'bk-popover' : 'div'"
                            :key="topMemu.id"
                            theme="light navigation-dropdown"
                            :arrow="false"
                            offset="0, -5"
                            placement="bottom"
                            :tippy-options="{ 'hideOnClick': false, flipBehavior: ['bottom'] }">
                            <div class="navigation-header-item">
                                {{topMemu.name}}
                            </div>
                            <template slot="content">
                                <div class="navigation-dropdown-menu">
                                    <div
                                        class="menu-item"
                                        v-for="item in topMemu.children"
                                        :key="item.id">
                                        {{item.name}}
                                    </div>
                                </div>
                            </template>
                        </component>
                    </template>
                </div>
                <bk-popover
                    class="message-box"
                    theme="light lesscode-layout-message"
                    :arrow="false"
                    placement="bottom-start"
                    offset="-20, 10"
                    :tippy-options="{ 'hideOnClick': false }">
                    <div>
                        <span>{{ user.username }}</span>
                        <i class="bk-icon icon-down-shape"></i>
                    </div>
                    <template slot="content">
                        <div class="message-item" @click="handleLogout">退出</div>
                    </template>
                </bk-popover>
            </template>
            <slot />
        </bk-navigation>
    </div>
</template>
<script>
    import { mapGetters, mapMutations } from 'vuex'
    import LC from '@/element-materials/core'
    import { bus } from '@/common/bus'

    const unselectComponent = () => {
        const activeNode = LC.getActiveNode()
        if (activeNode) {
            activeNode.activeClear()
        }
        document.body.querySelectorAll('.component-wrapper').forEach($el => {
            $el.classList.remove('selectd')
        })
    }

    export default {
        name: 'lesscode-layout',
        data () {
            return {
                isTopMenuSelected: false
            }
        },
        computed: {
            ...mapGetters(['user']),
            ...mapGetters('drag', [
                'curTemplateData'
            ]),
            ...mapGetters('layout', ['pageLayout'])
        },
        created () {
            const activeCallback = () => {
                this.isTopMenuSelected = false
                document.body.querySelectorAll('.component-wrapper').forEach($el => {
                    $el.classList.remove('selectd')
                })
            }
            LC.addEventListener('active', activeCallback)
            bus.$on('on-template-change', this.handleTemplateChange)
            this.$once('hook:beforeDestroy', () => {
                LC.removeEventListener('active', activeCallback)
                bus.$off('on-template-change', this.handleTemplateChange)
            })
        },
        methods: {
            ...mapMutations('drag', ['setCurTemplateData']),
            componentWrapperMouseenterHandler (event) {
                event.target.classList.add('component-wrapper-hover')
            },
            componentWrapperMouseleaveHandler (event) {
                event.target.classList.remove('component-wrapper-hover')
            },
            handleNavigationWraperClick (panel, event) {
                unselectComponent()
                event.target.classList.add('selected')
                this.setCurTemplateData({
                    ...this.curTemplateData,
                    panelActive: panel
                })
            },
            handleTopMenuClick () {
                unselectComponent()
                this.isTopMenuSelected = true
                this.setCurTemplateData({
                    ...this.curTemplateData,
                    panelActive: 'topMenu'
                })
            },
            handleTemplateChange (payload) {
                const {
                    logo,
                    siteName,
                    topMenuList,
                    renderProps
                } = payload
                this.setCurTemplateData({
                    ...this.curTemplateData,
                    logo,
                    siteName,
                    topMenuList,
                    renderProps
                })
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
    .navigation-dropdown-menu {
        display: flex;
        flex-direction: column;
        width: 150px;
        padding: 6px 0;
        color: #63656E;
        background: #FFFFFF;
        box-shadow: 0px 3px 4px 0px rgba(64,112,203,0.06);
        .menu-item{
            flex: 0 0 32px;
            display: flex;
            align-items: center;
            padding: 0 20px;
            &:hover{
                color: #3A84FF;
                cursor: pointer;
                background-color: #F0F1F5;
            }
        }
    }
    .tippy-popper .tippy-tooltip.navigation-dropdown-theme {
        padding:0;
        border-radius:0;
        box-shadow:none;
    }
</style>
<style lang="postcss" scoped>
    .top-menu-wraper{
        border: 1px  solid transparent;
        &:hover{
            border: 1px dashed #3a84ff;
        }
        &.selected {
            border: 1px solid #3a84ff;
        }
        .navigation-header-item{
            white-space: nowrap;
        }
        .message-box{
            flex: 0 0 70px;
        }
    }
</style>
