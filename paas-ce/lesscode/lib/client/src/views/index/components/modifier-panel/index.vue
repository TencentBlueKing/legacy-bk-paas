<template>
    <div
        id="modifierPanel"
        class="draw-page-modifier-panel">
        <div>
            <div class="component-info">
                <div
                    class="component-id"
                    v-bk-overflow-tips>
                    {{ componentId || '--' }}
                </div>
                <div
                    v-if="componentId"
                    class="action-wrapper">
                    <i
                        v-if="!isAttachToForm"
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
            <a
                v-if="componentDocument"
                class="link-prop-doc"
                :href="componentDocument"
                target="_blank">
                <i class="bk-drag-icon bk-drag-jump-link"></i>
                <span>查看详细属性文档</span>
            </a>
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
                componentId: '',
                componentDocument: '',
                isAttachToForm: false
            }
        },
        created () {
            this.componentData = {}

            const toggleInteractiveCallback = _.throttle((event) => {
                if (this.componentId
                    && event.target.componentId === this.componentId) {
                    this.$forceUpdate()
                }
            }, 100)

            const activeCallback = ({ target }) => {
                this.componentData = target
                this.componentId = target.componentId
                this.componentDocument = target.material.document || ''
                this.checkAttachToFrom()
            }

            const resetCallback = (event) => {
                this.componentData = {}
                this.componentId = ''
                this.componentDocument = ''
                this.isAttachToForm = false
            }
            
            LC.addEventListener('active', activeCallback)
            LC.addEventListener('activeClear', resetCallback)
            LC.addEventListener('removeChild', resetCallback)
            LC.addEventListener('toggleInteractive', toggleInteractiveCallback)
            this.$once('hook:beforeDestroy', () => {
                LC.removeEventListener('active', activeCallback)
                LC.removeEventListener('activeClear', resetCallback)
                LC.removeEventListener('removeChild', resetCallback)
                LC.removeEventListener('toggleInteractive', toggleInteractiveCallback)
            })
        },
        methods: {
            /**
             * @desc 检测选中的组件是否是 from 的子组件
             */
            checkAttachToFrom () {
                this.isAttachToForm = false
                let parentNode = this.componentData.parentNode
                while (parentNode) {
                    if (parentNode.type === 'widget-form') {
                        this.isAttachToForm = true
                    }
                    parentNode = parentNode.parentNode
                }
            },
            /**
             * @desc 显示删除选中的元素弹框
             */
            handleRemoveElement () {
                removeCallBack()
            },
            /**
             * @desc 切换交互组件显示状态
             */
            handleToggleInteractiveShow () {
                this.componentData.toggleInteractive()
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
        .active-empty{
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }
</style>
