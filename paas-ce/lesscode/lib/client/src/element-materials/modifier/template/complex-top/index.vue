<template>
    <div class="project-complex-top-menu-modifier">
        <div class="action-title">顶部导航配置</div>
        <div class="menu-wraper">
            <vue-draggable
                class="group-list"
                ghost-class="menu-ghost-item"
                :list="localMenuList"
                handle=".item-drag"
                @change="triggerChange"
                :group="{ name: 'cpmplex-top-col' }">
                <transition-group type="transition" :name="'flip-list'">
                    <menu-item
                        v-for="(menu, index) in localMenuList"
                        :key="`${menu.id}`"
                        :data="menu"
                        :last-one="localMenuList.length === 1"
                        :has-child="false"
                        @on-delete="handleRemove(index)"
                        @on-change="value => handleChange(value, index)" />
                </transition-group>
            </vue-draggable>
        </div>
        <div class="footer">
            <bk-button size="small" text @click="handleAdd">继续添加</bk-button>
        </div>
    </div>
</template>
<script>
    import { generatorMenu } from '../../../../../../shared/util'
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
            }
        },
        data () {
            return {
                localMenuList: []
            }
        },
        watch: {
            topMenuList: {
                handler  (menuList) {
                    this.localMenuList = menuList
                },
                immediate: true
            }
        },
        methods: {
            triggerChange () {
                this.$emit('on-change', 'topMenuList', this.localMenuList)
            },
            handleAdd () {
                this.localMenuList.push(generatorMenu())
                this.triggerChange()
            },
            handleChange (value, index) {
                this.localMenuList.splice(index, 1, value)
                this.triggerChange()
            },
            handleRemove (index) {
                const localMenuList = [...this.localMenuList]
                localMenuList.splice(index, 1)
                this.localMenuList = localMenuList
                this.triggerChange()
            }
        }
    }
</script>
<style lang='postcss'>
    @import "@/css/mixins/scroller";

    .project-complex-top-menu-modifier{
        .menu-wraper{
            margin-bottom:  10px;
        }
        .footer {
            padding-bottom: 20px;
        }
    }
</style>
