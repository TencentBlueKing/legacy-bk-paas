<template>
    <div class="project-complex-side-menu-modifier">
        <div class="top-menu-info">
            <div>{{ localTopMenu.name || '--' }}</div>
            <div class="top-menu-action">
                <bk-button size="small" @click="handleRemoveTopMenu">删除</bk-button>
            </div>
        </div>
        <div class="wraper" :key="menuActive">
            <div class="action-title side-menu-title">
                <div>侧边导航配置</div>
                <bk-switcher
                    v-bk-tooltips="hasSideMenu ? '清空侧边导航' : '添加侧边导航'"
                    size="small"
                    :value="hasSideMenu"
                    @change="handleCreateSideMenu" />
            </div>
            <div class="side-menu-wraper">
                <vue-draggable
                    class="group-list"
                    ghost-class="menu-ghost-item"
                    :list="localSideMenu"
                    handle=".item-drag"
                    @change="triggerChange"
                    :group="{ name: 'complex-top-col' }">
                    <transition-group type="transition" :name="'flip-list'">
                        <menu-item
                            v-for="(menu, index) in localSideMenu"
                            :key="`${menu.id}`"
                            show-icon
                            :data="menu"
                            :last-one="localTopMenu.length === 1"
                            @on-delete="handleSideMenuRemove(index)"
                            @on-change="value => handleSideMenuChange(value, index)" />
                    </transition-group>
                </vue-draggable>
            </div>
            <div v-if="hasSideMenu" class="footer">
                <bk-button size="small" text @click="handleAddSideMenu">继续添加</bk-button>
            </div>
        </div>
    </div>
</template>
<script>
    import _ from 'lodash'
    import { generatorMenu } from '../utils'
    import MenuItem from '../editor/menu'

    export default {
        name: '',
        components: {
            MenuItem
        },
        inheritAttrs: false,
        props: {
            topMenuList: {
                type: Array,
                default: () => []
            },
            menuActive: {
                type: [Number, String],
                required: true
            }
        },
        data () {
            return {
                localTopMenu: {},
                localSideMenu: [],
                hasSideMenu: false

            }
        },
        watch: {
            topMenuList: {
                handler  () {
                    this.init()
                },
                immediate: true
            },
            menuActive: {
                handler  () {
                    this.init()
                },
                immediate: true
            }
        },
        methods: {
            init () {
                const currentTopMenu = _.find(this.topMenuList, _ => _.id === this.menuActive)
                this.localTopMenu = currentTopMenu
                this.localSideMenu = [...currentTopMenu.children || []]
                this.hasSideMenu = this.localSideMenu.length > 0
            },
            triggerChange () {
                const currentTopMenuIndex = _.findIndex(this.topMenuList, _ => _.id === this.menuActive)
                const topMenuList = [...this.topMenuList]
                topMenuList.splice(currentTopMenuIndex, 1, {
                    ...this.localTopMenu,
                    children: this.localSideMenu
                })
                this.$emit('on-change', 'topMenuList', topMenuList)
            },
            handleRemoveTopMenu () {
                const currentTopMenuIndex = _.findIndex(this.topMenuList, _ => _.id === this.menuActive)
                const topMenuList = [...this.topMenuList]
                topMenuList.splice(currentTopMenuIndex, 1)
                this.$emit('on-change', 'topMenuList', topMenuList)
            },
            handleTopMenuChange (value) {
                this.localTopMenu = value
                this.triggerChange()
            },
            handleCreateSideMenu () {
                if (!this.hasSideMenu) {
                    this.hasSideMenu = true
                    const localSideMenu = [...this.localSideMenu]
                    localSideMenu.push(generatorMenu())
                    this.localSideMenu = localSideMenu
                } else {
                    this.hasSideMenu = false
                    this.localSideMenu = []
                }
                this.triggerChange()
            },
            handleAddSideMenu () {
                const localSideMenu = [...this.localSideMenu]
                localSideMenu.push(generatorMenu())
                this.localSideMenu = localSideMenu
                this.triggerChange()
            },
            handleSideMenuChange (value, index) {
                const localSideMenu = [...this.localSideMenu]
                localSideMenu.splice(index, 1, value)
                this.localSideMenu = localSideMenu
                this.triggerChange()
            },

            handleSideMenuRemove (index) {
                const localSideMenu = [...this.localSideMenu]
                localSideMenu.splice(index, 1)
                this.localSideMenu = localSideMenu
                this.triggerChange()
            }
        }
    }
</script>
<style lang='postcss'>
    @import "@/css/mixins/scroller";

    .project-complex-side-menu-modifier{
        .top-menu-info{
            padding: 15px 0;
            font-size: 14px;
            line-height: 17px;
            text-align: center;
            border-bottom: 1px solid #dcdee5;
        }
        .top-menu-action{
            margin-top: 10px;
        }
        .side-menu-title{
            display: flex;
            justify-content: space-between;
            margin-top: 20px;
        }
        .side-menu-wraper{
            margin-bottom:  10px;
        }
        .footer {
            padding-bottom: 20px;
        }
    }
</style>
