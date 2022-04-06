<template>
    <div>
        <div role="hover">
            <div :style="hoverTopStyles" />
            <div :style="hoverRightStyles" />
            <div :style="hoverBottomStyles" />
            <div :style="hoverLeftStyles" />
        </div>
        <div role="active">
            <div :style="activeTopStyles" />
            <div :style="activeRightStyles" />
            <div :style="activeBottomStyles" />
            <div :style="activeLeftStyles" />
        </div>
    </div>
</template>
<script>
    import _ from 'lodash'
    import LC from '@/element-materials/core'

    const baseStyles = {
        position: 'absolute',
        zIndex: 99,
        borderWidth: '0px',
        borderColor: '#3a84ff',
        pointer: 'none'
    }

    const hideStyles = {
        display: 'none'
    }

    export default {
        data () {
            return {
                hoverTopStyles: {},
                hoverRightStyles: {},
                hoverBottomStyles: {},
                hoverLeftStyles: {},
                activeTopStyles: {},
                activeRightStyles: {},
                activeBottomStyles: {},
                activeLeftStyles: {}
            }
        },
        created () {
            this.activeComponentData = {}
            this.hoverComponentData = {}

            // 选中组件聚焦
            const activeResizeObserver = new ResizeObserver(() => {
                this.showActive(this.activeComponentData)
            })
            const activeCallback = (event) => {
                if (event.target.componentId === this.activeComponentData.componentId) {
                    return
                }
                console.log(`\n${new Date()}`)
                console.log('record event : ', event)
                this.showActive(event.target)
                this.activeComponentData = event.target
                activeResizeObserver.observe(event.target.$elm)
            }
            const activeClearCallback = () => {
                if (this.activeComponentData.componentId) {
                    activeResizeObserver.unobserve(this.activeComponentData.$elm)
                    this.showActive()
                    this.activeComponentData = {}
                }
            }

            // 鼠标hover聚焦
            const hoverResizeObserver = new ResizeObserver(() => {
                this.showActive(this.activeComponentData)
            })
            const hoverCallback = _.throttle((event) => {
                if (event.target.componentId === this.hoverComponentData.componentId) {
                    return
                }
                this.showHover(event.target)
                this.hoverComponentData = event.target
                hoverResizeObserver.observe(event.target.$elm)
            }, 20)

            const componentMouserleaveCallback = () => {
                if (this.hoverComponentData.componentId) {
                    hoverResizeObserver.unobserve(this.hoverComponentData.$elm)
                    this.showHover()
                    this.hoverComponentData = {}
                }
            }

            // 目标组件被删除时需要重置所有交互效果
            const removeChildCallbak = (event) => {
                if (event.child === this.hoverComponentData) {
                    componentMouserleaveCallback()
                }
                if (event.child === this.activeComponentData) {
                    activeClearCallback()
                }
            }

            LC.addEventListener('active', activeCallback)
            LC.addEventListener('activeClear', activeClearCallback)
            LC.addEventListener('componentHover', hoverCallback)
            LC.addEventListener('componentMouserleave', componentMouserleaveCallback)
            LC.addEventListener('removeChild', removeChildCallbak)
            this.$once('hook:beforeDestroy', () => {
                LC.removeEventListener('active', activeCallback)
                LC.removeEventListener('activeClear', activeClearCallback)
                LC.removeEventListener('componentHover', hoverCallback)
                LC.removeEventListener('componentMouserleave', componentMouserleaveCallback)
                LC.removeEventListener('removeChild', removeChildCallbak)
            })
        },
        methods: {
            /**
             * @desc 鼠标hover状态
             * @param { Node } componentData
             */
            showHover (componentData = {}) {
                if (!componentData.componentId
                    || componentData === this.activeComponentData.componentId) {
                    this.hoverTopStyles = hideStyles
                    this.hoverRightStyles = hideStyles
                    this.hoverBottomStyles = hideStyles
                    this.hoverLeftStyles = hideStyles
                    return
                }
                const {
                    top: containerTop,
                    left: containerLeft
                } = document.body.querySelector('#drawTarget').getBoundingClientRect()

                const {
                    top,
                    left,
                    width,
                    height
                } = componentData.$elm.getBoundingClientRect()

                const hoverBaseStyle = Object.assign({}, baseStyles, {
                    borderStyle: 'dashed'
                })
                
                this.hoverTopStyles = Object.assign({}, hoverBaseStyle, {
                    top: `${top - containerTop}px`,
                    left: `${left - containerLeft}px`,
                    width: `${width}px`,
                    borderBottomWidth: '1px'
                })
                this.hoverRightStyles = Object.assign({}, hoverBaseStyle, {
                    top: `${top - containerTop}px`,
                    left: `${left + width - 1 - containerLeft}px`,
                    height: `${height}px`,
                    borderLeftWidth: '1px',
                    borderColor: '#3a84ff'
                })
                this.hoverBottomStyles = Object.assign({}, hoverBaseStyle, {
                    top: `${top + height - 1 - containerTop}px`,
                    left: `${left - containerLeft}px`,
                    width: `${width}px`,
                    borderTopWidth: '1px',
                    borderColor: '#3a84ff'
                })
                this.hoverLeftStyles = Object.assign({}, hoverBaseStyle, {
                    top: `${top - containerTop}px`,
                    left: `${left - containerLeft}px`,
                    height: `${height}px`,
                    borderRightWidth: '1px',
                    borderColor: '#3a84ff'
                })
            },
            /**
             * @desc 选中状态
             * @param { Node } componentData
             */
            showActive (componentData = {}) {
                if (!componentData.componentId) {
                    this.activeTopStyles = hideStyles
                    this.activeRightStyles = hideStyles
                    this.activeBottomStyles = hideStyles
                    this.activeLeftStyles = hideStyles
                    return
                }
                const {
                    top: containerTop,
                    left: containerLeft
                } = document.body.querySelector('#drawTarget').getBoundingClientRect()
                const {
                    top,
                    left,
                    width,
                    height
                } = componentData.$elm.getBoundingClientRect()

                const activeBaseStyle = Object.assign({}, baseStyles, {
                    borderStyle: 'solid'
                })
                
                this.activeTopStyles = Object.assign({}, activeBaseStyle, {
                    top: `${top - containerTop}px`,
                    left: `${left - containerLeft}px`,
                    width: `${width}px`,
                    borderBottomWidth: '1px'
                })
                this.activeRightStyles = Object.assign({}, activeBaseStyle, {
                    top: `${top - containerTop}px`,
                    left: `${left + width - 1 - containerLeft}px`,
                    height: `${height}px`,
                    borderLeftWidth: '1px',
                    borderColor: '#3a84ff'
                })
                this.activeBottomStyles = Object.assign({}, activeBaseStyle, {
                    top: `${top + height - 1 - containerTop}px`,
                    left: `${left - containerLeft}px`,
                    width: `${width}px`,
                    borderTopWidth: '1px',
                    borderColor: '#3a84ff'
                })
                this.activeLeftStyles = Object.assign({}, activeBaseStyle, {
                    top: `${top - containerTop}px`,
                    left: `${left - containerLeft}px`,
                    height: `${height}px`,
                    borderRightWidth: '1px',
                    borderColor: '#3a84ff'
                })
            }
        }
    }
</script>
