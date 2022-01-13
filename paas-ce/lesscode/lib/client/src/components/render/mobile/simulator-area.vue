<template>
    <div class="area-wrapper">
        <div class="title">
            <span class="title-text">效果预览</span>
        </div>
        <div class="simulator-wrapper" :style="{ width: width, height: height }">
            <div class="device-phone-frame">
                <div class="device-phone"></div>
            </div>
            <div class="simulator-preview" :style="{ width: width, height: height }">
                123123123123
            </div>
        </div>
    </div>
</template>

<script>
    import { bus } from '@/common/bus'

    export default {
        data () {
            return {
                width: '375px',
                height: '812px'
            }
        },
        created () {
            bus.$on('canvasSizeChange', this.updateSize)
        },
        methods: {
            updateSize (size) {
                this.width = `${size.width}px`
                this.height = `${size.height}px`
            }
        }
    }
</script>

<style lang="postcss" scoped>
    @import './area.css';

    .simulator-wrapper {
        position: relative;
        .device-phone-frame {
            z-index: 1;
            position: absolute;
            height: 100%;
            width: 100%;
            padding: 5% 6.5% 5.6%;
            box-sizing: content-box;

        }
        .device-phone {
            pointer-events: none;
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            background-image: url(../../../images/phone.png);
            background-size: 100% 100%;
        }
        .simulator-preview {
            height: 100%;
            width: 100%;
            box-sizing: content-box;
            padding: 5% 6.5% 5.6%;
        }
    }
</style>
