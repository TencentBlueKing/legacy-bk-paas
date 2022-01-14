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
    import render from '../pc/index'
    import getModelInfo from './common/model'
    import { watch } from '@vue/composition-api'
    import emitter from 'tiny-emitter/instance'
    export default {
        components: {
            render
        },
        setup () {
            const { canvasSize, currentResolution, model, modelList } = getModelInfo()

            const sizeChangeWatcher = watch(
                () => ({ ...canvasSize }),
                val => {
                    emitter.emit('update-canvas-size', val)
                }
            )
            return {
                canvasSize,
                currentResolution,
                model,
                modelList,
                sizeChangeWatcher
            }
        }
    }
</script>¬

<style lang="postcss" scoped>
    @import './area.css'
</style>
