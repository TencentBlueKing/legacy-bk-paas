<template>
    <div style="display: none">
        <div
            ref="hoverRef"
            :class="$style['tools-hover']"
            :style="hoverStyles">
            <div :class="$style['button']">
                {{ hoverComponentData.componentId }}
            </div>
        </div>
        <div
            ref="activeRef"
            :class="$style['tools-active']"
            :style="activeStyles"
            @click.stop=""
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
    import {
        reactive,
        toRefs,
        ref,
        onMounted,
        onBeforeUnmount
    } from '@vue/composition-api'
    import useScroll from '../hooks/use-scroll'
    import useActiveParent from './hooks/use-active-parent'
    import useSaveTemplate from './hooks/use-save-template'
    import useRemove from './hooks/user-remove'
    import useShowMenu from '../hooks/use-show-menu'
    import useComponentActive from '../hooks/use-component-active'
    import useComponentHover from '../hooks/use-component-hover'

    const hideStyles = {
        display: 'none'
    }

    let zIndex = 99

    const toolPositionHeight = 22

    export default {
        setup () {
            let $horizontalWrapper = null

            const state = reactive({
                hoverStyles: {},
                activeStyles: {}
            })

            const hoverRef = ref()
            const activeRef = ref()

            // 选中父级容器组件
            const handleSelectParent = useActiveParent()
            // 保存模板
            const handleSaveTemplate = useSaveTemplate()
            // 删除组件
            const handleRemove = useRemove()
            // 显示快捷面板
            const handleShowMenu = useShowMenu()

            /**
             * @desc hover状态
             * @param { Node } componentData
             */
            const showHover = (componentData) => {
                if (!componentData
                    || !componentData.componentId
                    || componentData === activeComponentData.value) {
                    state.hoverStyles = hideStyles
                    return
                }

                const {
                    top: containerTop,
                    left: containerLeft
                } = $horizontalWrapper.getBoundingClientRect()
                const {
                    top,
                    left
                } = componentData.$elm.getBoundingClientRect()
                
                zIndex++
                state.hoverStyles = {
                    position: 'absolute',
                    top: `${top - containerTop - toolPositionHeight}px`,
                    left: `${left - containerLeft}px`,
                    zIndex: zIndex
                }
                if (hoverRef.value.parentNode !== $horizontalWrapper) {
                    $horizontalWrapper.appendChild(hoverRef.value)
                }
            }
            /**
             * @desc acitve状态
             * @param { Node } componentData
             */
            const showActive = (componentData) => {
                if (!componentData || !componentData.componentId) {
                    state.activeStyles = hideStyles
                    return
                }
                const {
                    top: containerTop,
                    right: containerRight,
                    left: containerLeft
                } = $horizontalWrapper.getBoundingClientRect()

                const {
                    top,
                    left,
                    right
                } = componentData.$elm.getBoundingClientRect()

                const {
                    width: toolsWidth
                } = activeRef.value.getBoundingClientRect()

                zIndex++
                let realLeft = left - containerLeft
                if (left + toolsWidth > containerRight) {
                    realLeft = right - toolsWidth - containerLeft
                }
                state.activeStyles = {
                    position: 'absolute',
                    top: `${top - containerTop - toolPositionHeight}px`,
                    left: `${realLeft}px`,
                    zIndex
                }
                if (activeRef.value.parentNode !== $horizontalWrapper) {
                    $horizontalWrapper.appendChild(activeRef.value)
                }
            }

            const { activeComponentData } = useComponentActive(showActive)
            const { hoverComponentData } = useComponentHover(showHover)

            useScroll(() => {
                showHover(hoverComponentData.value)
                showActive(activeComponentData.value)
            })

            onMounted(() => {
                $horizontalWrapper = document.querySelector('#lesscodeDrawHorizontalWrapper')
            })
            onBeforeUnmount(() => {
                if (activeRef.value.parentNode === $horizontalWrapper) {
                    $horizontalWrapper.removeChild(activeRef.value)
                }
                if (hoverRef.value.parentNode === $horizontalWrapper) {
                    $horizontalWrapper.removeChild(hoverRef.value)
                }
            })
            
            return {
                hoverComponentData,
                activeComponentData,
                ...toRefs(state),
                hoverRef,
                activeRef,
                handleSaveTemplate,
                handleSelectParent,
                handleRemove,
                handleShowMenu
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
