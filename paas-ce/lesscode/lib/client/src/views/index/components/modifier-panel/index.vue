<template>
    <div
        id="modifierPanel"
        class="draw-page-modifier-panel">
        <div class="component-info">
            <div
                class="component-id"
                v-bk-overflow-tips>
                {{ componentData.componentId }}
            </div>
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
        <div
            class="link-prop-doc"
            @click="handleJumpLink">
            <i class="bk-drag-icon bk-drag-jump-link"></i>
            <span>查看详细属性文档</span>
        </div>
    </div>
</template>
<script>
    import _ from 'lodash'
    import LC from '@/element-materials/core'
    import MaterialModifier from '@/element-materials/modifier'
    import { removeCallBack } from '@/element-materials/core/helper/commands'

    export default {
        name: '',
        components: {
            MaterialModifier
        },
        data () {
            return {
                isCollapse: false,
                inFormItem: false,
                componentId: '',
                componentType: ''
            }
        },
        created () {
            this.componentData = {}

            const updateCallback = _.throttle((event) => {
                if (this.componentId
                    && event.target.componentId === this.componentId) {
                    this.$forceUpdate()
                }
            }, 100)

            const activeCallback = ({ target }) => {
                this.componentId = target.componentId
                this.componentType = target.type
                this.componentData = target
            }

            const activeClearCallback = () => {
                this.componentId = ''
                this.componentData = {}
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
                this.componentData.activeClear()
                removeCallBack()
            },
            /**
             * @desc 切换交互组件显示状态
             */
            handleToggleInteractiveShow () {
                this.componentData.toggleInteractive()
            },
            /**
             * @desc 跳转组件文档
             */
            handleJumpLink () {
                const {
                    material
                } = this.componentData
                const document = material.document
                if (document) {
                    window.open(document, '_blank')
                }
            }
        }
    }
</script>
<style lang="postcss" scoped>
    .draw-page-modifier-panel {
        position: relative;
        height: 100%;

        .component-info {
            display: flex;
            padding: 15px 0;
            text-align: center;
            border-bottom: 1px solid #dcdee5;
            
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

        .link-prop-doc{
            margin: 10px 0 0 10px;
            color: #3a84ff;
            cursor: pointer;
            display: inline-block;
        }
    }
</style>
