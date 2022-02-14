<template>
    <div class="area-wrapper">
        <div class="title">
            <span class="title-text">编辑区</span>
            <bk-dropdown-menu trigger="click">
                <div class="dropdown-text" slot="dropdown-trigger">
                    <span>{{model}}</span>
                    <bk-icon type="down-shape" />
                    <span>{{`${currentResolution} px`}}</span>
                </div>
                <ul class="bk-dropdown-list" slot="dropdown-content">
                    <li
                        :class="{ active: item.key === model }"
                        v-for="item in modelList"
                        :key="item.key"
                        @click="model = item.key">
                        <span class="list-item-text" v-bk-overflow-tips="{ interactive: false }">{{item.text}}</span>
                    </li>
                </ul>
            </bk-dropdown-menu>
        </div>
        <div class="edit-area" :style="{ width: canvasSize.width + 'px', height: canvasSize.height + 'px' }">
            <render></render>
        </div>
    </div>
</template>
<script>
    import { list } from './model-list'
    import { bus } from '@/common/bus'
    import render from '../pc/index'
    export default {
        components: {
            render
        },
        data () {
            return {
                model: 'iPhone 11 Pro',
                modelList: list
            }
        },
        computed: {
            currentResolution () {
                const resolution = (this.activeModelInfo.length && this.activeModelInfo[1])
                    || ''
                return resolution
            },
            activeModelInfo () {
                const currentModel = this.modelList.find(item => item.key === this.model)
                return /\((\d+\s?x\s?\d+)\)/.exec(currentModel.text)
            },
            canvasSize () {
                const size = { // 默认为iPhone 12 的尺寸
                    width: 375,
                    height: 812
                }
                if (this.activeModelInfo && this.activeModelInfo.length) {
                    size.width = parseInt(this.activeModelInfo[1].split('x')[0])
                    size.height = parseInt(this.activeModelInfo[1].split('x')[1])
                }
                return size
            }
        },
        watch: {
            canvasSize: {
                immediate: true,
                handler (val) {
                    bus.$emit('canvasSizeChange', val)
                }
            }
        }
    }
</script>¬

<style lang="postcss" scoped>
    @import './area.css'
</style>
