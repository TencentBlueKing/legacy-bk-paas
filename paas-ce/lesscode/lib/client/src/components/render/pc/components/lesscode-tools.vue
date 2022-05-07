<template>
    <div style="display: none">
        <div
            ref="hover"
            :class="$style['tools-hover']"
            :style="hoverStyles">
            <div :class="$style['button']">
                {{ hoverComponentData.componentId }}
            </div>
        </div>
        <div
            ref="active"
            :class="$style['tools-active']"
            :style="activeStyles"
            @contextmenu.stop="handleShowMenu">
            <div
                v-if="activeComponentData.componentId"
                :class="$style['button']">
                <i class="bk-drag-icon" :class="activeComponentData.material.icon" />
                {{ activeComponentData.componentId }}
            </div>
            <div
                v-if="activeComponentData.layoutType"
                :class="$style['button']"
                @click="handleSaveTemplate">
                <i class="bk-drag-icon bk-drag-template-fill" />
                存为模板
            </div>
            <div
                v-if="activeComponentData.parentNode && !activeComponentData.parentNode.root"
                :class="$style['button']"
                @click="handleSelectParent">
                <i class="bk-drag-icon" :class="activeComponentData.parentNode.material.icon" />
                选中父级
            </div>
            <div
                :class="$style['button']"
                @click="handleRemove">
                <i class="bk-drag-icon bk-drag-shanchu" />
            </div>
        </div>
    </div>
</template>
<script>
    import _ from 'lodash'
    import LC from '@/element-materials/core'

    const hideStyles = {
        display: 'none'
    }

    let zIndex = 99

    export default {
        data () {
            return {
                hoverStyles: {},
                activeStyles: {}
            }
        },
        created () {
            this.hoverComponentData = {}
            this.activeComponentData = {}
            /**
             * @desc 组件被选中
             * @param { Object } event
             */
            const activeCallback = (event) => {
                if (event.target.componentId === this.activeComponentData.componentId) {
                    return
                }
                this.activeComponentData = event.target
                this.showActive(event.target)
            }
            const activeClearCallback = () => {
                this.showActive()
                this.activeComponentData = {}
            }
            /**
             * @desc 鼠标hover
             * @param { Objecy } event
             */
            const componentHoverCallback = _.throttle((event) => {
                if (event.target.componentId === this.hoverComponentData.componentId) {
                    return
                }
                this.hoverComponentData = event.target
                this.showHover(event.target)
            }, 20)

            const componentMouserleaveCallback = () => {
                this.showHover()
                this.hoverComponentData = {}
            }

            /**
             * @desc 目标组件被删除时需要重置所有交互效果
             * @param { Object } event
             */
            const removeChildCallbak = (event) => {
                if (event.child === this.hoverComponentData) {
                    componentMouserleaveCallback()
                }
                if (event.child === this.activeComponentData) {
                    activeClearCallback()
                }
            }

            const resetCallback = () => {
                componentMouserleaveCallback()
                activeClearCallback()
            }

            LC.addEventListener('active', activeCallback)
            LC.addEventListener('activeClear', activeClearCallback)
            LC.addEventListener('componentHover', componentHoverCallback)
            LC.addEventListener('componentMouserleave', componentMouserleaveCallback)
            LC.addEventListener('removeChild', removeChildCallbak)
            LC.addEventListener('reset', resetCallback)
            this.$once('hook:beforeDestroy', () => {
                LC.removeEventListener('active', activeCallback)
                LC.removeEventListener('activeClear', activeClearCallback)
                LC.removeEventListener('componentHover', componentHoverCallback)
                LC.removeEventListener('componentMouserleave', componentMouserleaveCallback)
                LC.removeEventListener('removeChild', removeChildCallbak)
                LC.removeEventListener('reset', resetCallback)
            })
        },
        mounted () {
            const refresh = _.throttle(() => {
                this.showHover(this.hoverComponentData)
                this.showActive(this.activeComponentData)
            }, 20)
            this.$horizontalWrapper = document.querySelector('#lesscodeDrawHorizontalWrapper')
            this.$horizontalWrapper.addEventListener('scroll', refresh)
            this.$once('hook:beforeDestroy', () => {
                this.$horizontalWrapper.removeEventListener('scroll', refresh)
            })
            this.$verticalWrapper = document.querySelector('#lesscodeDrawVerticalWrapper')
            this.$verticalWrapper.addEventListener('scroll', refresh)
            this.$once('hook:beforeDestroy', () => {
                this.$verticalWrapper.removeEventListener('scroll', refresh)
            })
            const $templateContainerEl = this.$horizontalWrapper.querySelector('.container-content')
            if ($templateContainerEl) {
                $templateContainerEl.addEventListener('scroll', refresh)
                this.$once('hook:beforeDestroy', () => {
                    $templateContainerEl.removeEventListener('scroll', refresh)
                })
            }
            const $mobileDrawEl = this.$horizontalWrapper.querySelector('#lesscodeMobileDraw')
            if ($mobileDrawEl) {
                $mobileDrawEl.addEventListener('scroll', refresh)
                this.$once('hook:beforeDestroy', () => {
                    $mobileDrawEl.removeEventListener('scroll', refresh)
                })
            }
        },
        methods: {
            /**
             * @desc hover状态
             * @param { Node } componentData
             */
            showHover (componentData = {}) {
                if (!componentData.componentId
                    || this.hoverComponentData === this.activeComponentData) {
                    this.hoverStyles = hideStyles
                    return
                }

                const {
                    top: containerTop,
                    left: containerLeft
                } = this.$horizontalWrapper.getBoundingClientRect()
                const {
                    top,
                    left
                } = componentData.$elm.getBoundingClientRect()
                
                zIndex++
                this.hoverStyles = {
                    position: 'absolute',
                    top: `${top - containerTop - 22 + 20}px`,
                    left: `${left - containerLeft}px`,
                    zIndex: zIndex
                }
                if (this.$refs.hover.parentNode !== this.$horizontalWrapper) {
                    this.$horizontalWrapper.appendChild(this.$refs.hover)
                    this.$once('hook:beforeDestroy', () => {
                        this.$horizontalWrapper.removeChild(this.$refs.hover)
                    })
                }
            },
            /**
             * @desc acitve状态
             * @param { Node } componentData
             */
            showActive (componentData = {}) {
                if (!componentData.componentId) {
                    this.activeStyles = hideStyles
                    return
                }
                const {
                    top: containerTop,
                    right: containerRight,
                    left: containerLeft
                } = this.$horizontalWrapper.getBoundingClientRect()

                const {
                    top,
                    left,
                    right
                } = componentData.$elm.getBoundingClientRect()

                const {
                    width: toolsWidth
                } = this.$refs.active.getBoundingClientRect()

                zIndex++
                let realLeft = left - containerLeft
                if (left + toolsWidth > containerRight) {
                    realLeft = right - toolsWidth - containerLeft
                }
                this.activeStyles = {
                    position: 'absolute',
                    top: `${top - containerTop - 22 + 20}px`,
                    left: `${realLeft}px`,
                    zIndex
                }
                if (this.$refs.active.parentNode !== this.$horizontalWrapper) {
                    this.$horizontalWrapper.appendChild(this.$refs.active)
                    this.$once('hook:beforeDestroy', () => {
                        this.$horizontalWrapper.removeChild(this.$refs.active)
                    })
                }
            },
            /**
             * @desc 保存模板
             * @param { Object } event
             */
            handleSaveTemplate (event) {
                event.stopPropagation()
                event.preventDefault()
                const activeNode = LC.getActiveNode()
                const newTemplateNode = activeNode.cloneNode()
                let templateJSON = {}
                if (newTemplateNode.type === 'render-column') {
                    // render-column 不能单独存在必须和 render-grid 配套存在
                    templateJSON = LC.createNode('render-grid').toJSON()
                    newTemplateNode.setStyle('width', '100%')
                    templateJSON.renderSlots.default = [newTemplateNode.toJSON()]
                } else {
                    templateJSON = newTemplateNode.toJSON()
                }
                LC.triggerEventListener('saveTemplate', {
                    type: 'saveTemplate',
                    target: activeNode,
                    value: templateJSON
                })
            },
            /**
             * @desc 选中父级容器组件
             */
            handleSelectParent () {
                this.activeComponentData.parentNode.active()
            },
            /**
             * @desc 删除组件
             */
            handleRemove () {
                LC.execCommand('remove')
            },
            handleShowMenu (event) {
                LC.showMenu(event)
            }
        }
    }
</script>
<style lang="postcss" module>
    .tools-active,
    .tools-hover{
        position: absolute;
        display: flex;
        padding-bottom: 4px;
        user-select: none;
    }
    .tools-active{
        .button{
            background: #3A84FF;
            cursor: pointer;
        }
    }
    .tools-hover{
        .button{
            background: #A3C5FD;
        }
    }
    .button{
        flex: 0 0 auto;
        height: 20px;
        padding: 0 3px;
        margin-right: 4px;
        font-size: 12px;
        line-height: 20px;
        text-align: center;
        border-radius: 2px;
        color: #fff;
        text-align: center;
        pointer-events: all;
    }
</style>
