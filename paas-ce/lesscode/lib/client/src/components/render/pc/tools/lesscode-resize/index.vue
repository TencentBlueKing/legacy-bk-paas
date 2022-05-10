<template>
    <div style="display: none">
        <div
            ref="resizeRef"
            @click.stop=""
            @contextmenu.stop="handleShowMenu">
            <div
                :class="$style['achor']"
                :style="dotWidthStyles"
                @mousedown="handleResizeWidth" />
            <div
                :class="$style['achor']"
                :style="dotHeightStyles"
                @mousedown="handleResizeHeight" />
            <div
                :class="$style['achor']"
                :style="dotBothStyles"
                @mousedown="handleResizeBoth" />
            <div
                ref="tipRef"
                :style="tipStyles">
                {{ size.width }} x {{ size.height }}
            </div>
        </div>
    </div>
</template>
<script>
    import {
        ref,
        reactive,
        toRefs,
        onMounted,
        onBeforeUnmount
    } from '@vue/composition-api'
    import useComponentActive from '../hooks/use-component-active'
    import useShowMenu from '../hooks/use-show-menu'
    import useScroll from '../hooks/use-scroll'
    import useResize from './hooks/use-resize'

    const baseStyles = {
        position: 'absolute',
        zIndex: 99
    }

    const hideStyles = {
        display: 'none'
    }

    const halfDotSize = 8

    export default {
        setup () {
            let $horizontalWrapper = null
            
            const state = reactive({
                dotWidthStyles: {},
                dotHeightStyles: {},
                dotBothStyles: {}
            })

            const resizeRef = ref()
            const tipRef = ref()

            /**
             * @desc 选中状态
             * @param { Node } componentData
             */
            const showActive = (componentData = {}) => {
                if (!componentData.componentId) {
                    state.dotWidthStyles = hideStyles
                    state.dotHeightStyles = hideStyles
                    state.dotBothStyles = hideStyles
                    return
                }

                // 解析styles配置，是否支持width、height配置
                const styleConfig = componentData.material.styles || []
                let resizeWidthEnabel = false
                let resizeHeightEnable = false
                styleConfig.forEach(styleItem => {
                    if (styleItem === 'size') {
                        resizeWidthEnabel = true
                        resizeHeightEnable = true
                        return
                    }
                    if (styleItem.name === 'size') {
                        if (styleItem.include) {
                            resizeWidthEnabel = styleItem.include.includes('width')
                            resizeHeightEnable = styleItem.include.includes('height')
                        }
                        if (styleItem.exclude) {
                            resizeWidthEnabel = !styleItem.exclude.includes('width')
                            resizeHeightEnable = !styleItem.exclude.includes('height')
                        }
                    }
                })
                
                const {
                    top: containerTop,
                    left: containerLeft
                } = $horizontalWrapper.getBoundingClientRect()
                const {
                    top,
                    left,
                    width,
                    height
                } = componentData.$elm.getBoundingClientRect()

                const dotBaseStyle = Object.assign({}, baseStyles)
                
                if (resizeWidthEnabel) {
                    state.dotWidthStyles = Object.assign({}, dotBaseStyle, {
                        top: `${top - containerTop + height / 2 - halfDotSize}px`,
                        left: `${left + width - halfDotSize - containerLeft}px`,
                        cursor: 'ew-resize'
                    })
                }
                if (resizeHeightEnable) {
                    state.dotHeightStyles = Object.assign({}, dotBaseStyle, {
                        top: `${top + height - halfDotSize - containerTop}px`,
                        left: `${left - containerLeft + width / 2 - halfDotSize}px`,
                        cursor: 'ns-resize'
                    })
                }

                if (resizeWidthEnabel && resizeHeightEnable) {
                    state.dotBothStyles = Object.assign({}, dotBaseStyle, {
                        top: `${top - containerTop + height - halfDotSize}px`,
                        left: `${left - containerLeft + width - halfDotSize}px`,
                        cursor: 'nwse-resize'
                    })
                }
                if (resizeRef.value.parentNode !== $horizontalWrapper) {
                    $horizontalWrapper.appendChild(resizeRef.value)
                }
            }
            const { activeComponentData } = useComponentActive(showActive)

            const {
                size,
                tipStyles,
                handleResizeWidth,
                handleResizeHeight,
                handleResizeBoth
            } = useResize()

            useScroll(() => {
                showActive(activeComponentData.value)
            })

            // 显示快捷面板
            const handleShowMenu = useShowMenu()

            onMounted(() => {
                $horizontalWrapper = document.querySelector('#lesscodeDrawHorizontalWrapper')
            })

            onBeforeUnmount(() => {
                if (resizeRef.value.parentNode === $horizontalWrapper) {
                    $horizontalWrapper.removeChild(resizeRef.value)
                }
            })
            
            return {
                ...toRefs(state),
                size,
                tipStyles,
                activeComponentData,
                resizeRef,
                tipRef,
                handleResizeWidth,
                handleResizeHeight,
                handleResizeBoth,
                handleShowMenu
            }
        }
    }
</script>
<style lang="postcss" module>
    .achor{
        position: absolute;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 15px;
        width: 15px;
        
        &:after{
            content: '';
            position: absolute;
            width: 5px;
            height: 5px;
            border-radius: 50%;
            border: 1px solid #3a84ff;
            background: #fff;
        }
    }
</style>
