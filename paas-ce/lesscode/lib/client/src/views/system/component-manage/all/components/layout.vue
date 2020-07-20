<template>
    <div ref="layout" class="all-component-page-layout" :class="{ toggle: isToggleLeft }" :style="styles">
        <div class="layout-left" ref="layoutLeft" :style="leftStyles">
            <div class="wraper">
                <slot name="left" />
            </div>
            <div class="toggle-btn" @click="handleToggle">
                <i class="toggle-btn-arrow bk-drag-icon bk-drag-angle-left" />
            </div>
        </div>
        <div class="divide" :style="lineStyles" @mousedown="handleMouseDown" />
        <div class="layout-right">
            <slot />
        </div>
    </div>
</template>
<script>
    import _ from 'lodash'
    import { getOffset } from '@/common/util'

    export default {
        name: '',

        data () {
            return {
                offsetTop: 0,
                isToggleLeft: false,
                isResize: false,
                width: 337
            }
        },
        computed: {
            styles () {
                return {
                    height: `calc(100vh - ${this.offsetTop}px - 50px)`
                }
            },
            leftStyles () {
                return {
                    width: `${this.width}px`
                }
            },
            lineStyles () {
                return {
                    left: `${this.width}px`
                }
            }
        },
        created () {
            this.startResize = false
            this.memoWidth = 0
        },
        mounted () {
            setTimeout(() => {
                this.init()
            })
            document.body.addEventListener('mousemove', this.handleMouseMove)
            document.body.addEventListener('mouseup', this.handleMouseUp)
            this.$once('hook:beforeDestroy', () => {
                document.body.removeEventListener('mousemove', this.handleMouseMove)
                document.body.removeEventListener('mouseup', this.handleMouseUp)
            })
        },
        methods: {
            init () {
                const { top } = getOffset(this.$refs.layout)
                this.offsetTop = top
            },
            handleToggle () {
                this.isToggleLeft = !this.isToggleLeft
            },
            handleMouseDown (event) {
                this.left = this.$refs.layoutLeft.getBoundingClientRect().left
                this.isStartResize = true
                document.body.style.userSelect = 'none'
            },
            handleMouseUp () {
                this.isStartResize = false
                document.body.style.userSelect = 'initial'
            },
            handleMouseMove: _.throttle(function (event) {
                if (!this.isStartResize) {
                    return
                }
                const width = event.clientX - this.left
                if (width < 200) {
                    return
                }
                this.width = width
            }, 20)
        }
    }
</script>
<style lang='postcss'>
    @import '@/css/mixins/scroller';

    .all-component-page-layout{
        position: relative;
        display: flex;
        &.toggle{
            .layout-left{
                width: 0 !important;
            }
            .divide{
                display: none;
            }
            .toggle-btn-arrow{
                transform: rotateZ(180deg);
            }
        }
        .layout-left{
            position: relative;
            flex: 0 0 auto;
            height: 100%;
            background: #FAFBFD;
            .wraper{
                height: 100%;
                overflow-y: scroll;
            }
            .toggle-btn{
                position: absolute;
                z-index: 10;
                top: 50%;
                right: -16px;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 16px;
                height: 50px;
                color: #fff;
                border-radius: 0 8px 8px 0;
                background: #3A84FF;
                cursor: pointer;
            }
        }
        .divide{
            position: absolute;
            top: 0;
            bottom: 0;
            z-index: 9;
            width: 1px;
            background: #DCDEE5;
            cursor: col-resize;
            &:hover{
                background: #3A84FF;
            }
            &:after{
                content: '';
                position: absolute;
                top: 0;
                left: -5px;
                bottom: 0;
                width: 10px;
            }
        }
        .layout-right{
            flex: 1;
            height: 100%;
            background: #fff;
            overflow-y: scroll;
        }
    }
</style>
