<template>
    <div :class="$style['area-wrapper']">
        <div :class="$style['title']">
            <span :class="$style['title-text']">编辑区</span>
            <div :class="$style['edit-button']">
                <bk-dropdown-menu trigger="click">
                    <div
                        :class="$style['dropdown-text']"
                        slot="dropdown-trigger">
                        <span>{{model}}</span>
                        <bk-icon type="down-shape" />
                    </div>
                    <ul
                        :class="$style['bk-dropdown-list']"
                        slot="dropdown-content">
                        <li
                            v-for="item in modelList"
                            :key="item.key"
                            :class="{
                                [$style.active]: item.key === model
                            }"
                            @click="model = item.key">
                            <span
                                :class="$style['list-item-text']"
                                v-bk-overflow-tips="{
                                    interactive: false
                                }">
                                {{item.text}}
                            </span>
                        </li>
                    </ul>
                </bk-dropdown-menu>
                <preview-switch :value.sync="preview" />
            </div>
        </div>
        <div
            id="lesscodeMobileDraw"
            :class="$style['edit-area']"
            :style="{
                width: canvasSize.width + 'px',
                height: canvasSize.height + 'px'
            }">
            <render />
        </div>
    </div>
</template>
<script>
    import render from '../pc/index'
    import getModelInfo from './common/model'
    import { watch, ref } from '@vue/composition-api'
    import emitter from 'tiny-emitter/instance'
    import previewSwitch from './preview-switch'
    export default {
        components: {
            render,
            previewSwitch
        },
        setup (props) {
            const { canvasSize, model, modelList } = getModelInfo()

            const { preview } = ref(props)

            const sizeChangeWatcher = watch(
                () => ({ ...canvasSize }),
                val => {
                    emitter.emit('update-canvas-size', val)
                }
            )

            return {
                canvasSize,
                model,
                modelList,
                preview,
                sizeChangeWatcher
            }
        }
    }
</script>¬

<style lang="postcss" module>
    @import './area.scss'
</style>
