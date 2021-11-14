<template>
    <aside
        class="main-right-sidebar"
        :class="{
            'is-collapse': isCollapse
        }">
        <div
            v-if="componentData && !isCollapse"
            class="selected-component-info">
            <div class="component-id overflow" v-bk-overflow-tips>{{ componentData.componentId }}</div>
            <div class="action-wrapper">
                <i
                    v-if="!inFormItem"
                    class="bk-drag-icon bk-drag-shanchu mr5"
                    id="del-component-right-sidebar"
                    @click="handleRemoveElement"
                    v-bk-tooltips="'删除'" />
                <i class="bk-drag-icon"
                    v-show="componentData.isInteractiveComponent"
                    :class="componentData.interactiveShow ? 'bk-drag-visible-eye' : 'bk-drag-invisible-eye'"
                    @click="handleToggleInteractiveShow"
                    v-bk-tooltips="componentData.interactiveShow ? '隐藏' : '显示'" />
            </div>
        </div>
        <material-modifier />
        <i class="bk-drag-icon bk-drag-angle-left collapse-icon"
            v-bk-tooltips.right="{
                content: '查看组件配置',
                disabled: !isCollapse
            }"
            @click="handleCollapseSide('right')" />
        <div class="prop-doc"
            v-if="infoLinkDict[componentType]"
            @click="handleJumpLink">
            <i class="bk-drag-icon bk-drag-jump-link"></i>
            <span>查看详细属性文档</span>
        </div>
    </aside>
</template>
<script>
    import _ from 'lodash'
    import LC from '@/element-materials/core'
    import MaterialModifier from '@/element-materials/modifier'
    import { infoLink } from '@/element-materials/materials/index'

    export default {
        name: '',
        components: {
            MaterialModifier
        },
        data () {
            return {
                isCollapse: false,
                componentData: null,
                inFormItem: false,
                componentId: '',
                componentType: ''
            }
        },
        created () {
            this.infoLinkDict = infoLink
            this.componentData = null

            const updateCallback = _.throttle((event) => {
                if (this.componentData
                    && event.target.componentId === this.componentData.componentId) {
                    this.$forceUpdate()
                    this.$emit('component-update')
                }
            }, 100)

            const activeCallback = ({ target }) => {
                this.componentData = Object.freeze(target)
            }

            const activeClearCallback = () => {
                this.componentData = null
            }
            
            LC.addEventListener('update', updateCallback)
            LC.addEventListener('active', activeCallback)
            LC.addEventListener('activeClear', activeClearCallback)
            this.$once('hook:beforeDestroy', () => {
                LC.removeEventListener('update', updateCallback)
                LC.removeEventListener('active', activeCallback)
                LC.removeEventListener('activeClear', activeClearCallback)
            })
        },
        methods: {
            /**
             * @desc 显示删除选中的元素弹框
             */
            handleRemoveElement () {
                const parentNode = this.componentData.parentNode
                if (parentNode) {
                    parentNode.removeChild(this.componentData)
                    this.componentData = null
                }
            },
            handleToggleInteractiveShow () {
                this.componentData.toggleInteractive()
            },
            /**
             * @desc 调整链接
             */
            handleJumpLink () {
                const {
                    type,
                    name
                } = this.componentData
                const realType = (type === 'chart' || type === 'bk-charts') ? name : type
                window.open(this.infoLinkDict[realType], '_blank')
            }
        }
    }
</script>
<style lang="postcss">
    .main-right-sidebar {
        flex-shrink: 0;
        position: relative;
        width: 301px;
        box-shadow: -2px 0px 4px 0px rgba(0,0,0,0.1);
        background: #FFF;
        transition: width .1s cubic-bezier(0.4, 0, 0.2, 1);

        &.is-collapse {
            flex: 0 1 0;
            width: 0;
            .collapse-icon::before {
                transform: rotate(0);
            }
            .bk-tab-label-wrapper {
                padding: 0;
            }
            .empty {
                display: none;
            }
        }

        .selected-component-info {
            border-bottom: 1px solid #dcdee5;
            text-align: center;
            padding: 15px 0;
            display: flex;
            .component-id {
                padding: 0 10px;
                overflow: hidden;
                width: 239px;
                white-space: nowrap;
                text-overflow: ellipsis;
            }
            .action-wrapper {
                flex: 1;
                padding-right: 20px;
                &:hover {
                    color: #3a84ff;
                }
                i {
                    cursor: pointer;
                }
            }

        }

        .collapse-icon {
            right: 100%;
            border-radius: 8px 0 0 8px;
        }

        .collapse-icon::before {
            display: inline-block;
            transform: rotate(180deg);
        }
    }
</style>
