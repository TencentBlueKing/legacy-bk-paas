<template>
    <div
        v-if="isShow && Object.keys(config).length"
        class="modifier-slot">
        <renderSlot
            v-for="(slotConfig, slotName) in config"
            :key="slotName"
            :name="slotName"
            :last-value="lastSlots[slotName]"
            :describe="slotConfig"
            @on-change="handleChange" />
    </div>
</template>

<script>
    import _ from 'lodash'
    import LC from '@/element-materials/core'
    import renderSlot from './render-slot.vue'

    export default {
        components: {
            renderSlot
        },

        data () {
            return {
                isShow: true,
                lastSlots: {}
            }
        },

        created () {
            this.isInnerChange = false
            this.componentNode = LC.getActiveNode()
            // 布局类型的组件不支持 slot 配置
            if (this.componentNode.layoutType) {
                this.isShow = false
                return
            }
            const {
                material,
                renderSlots,
                layoutSlotType
            } = this.componentNode
            const slotConfig = material.slots || {}
            
            this.config = Object.keys(slotConfig).reduce((result, slotName) => {
                // slot 支持拖拽就不支持配置
                if (_.has(layoutSlotType, slotName)) {
                    return result
                }
                const config = slotConfig[slotName]
                if (config.name.includes('layout') || config.display !== 'hidden') {
                    result[slotName] = config
                }
                return result
            }, {})
            this.lastSlots = Object.freeze(_.cloneDeep(renderSlots))

            const updateCallback = _.debounce(() => {
                if (this.isInnerChange) {
                    this.isInnerChange = false
                    return
                }

                this.lastSlots = Object.freeze(_.cloneDeep(this.componentNode.renderSlots))
            }, 100)

            LC.addEventListener('setRenderSlots', updateCallback)
            this.$once('hook:beforeDestroy', () => {
                LC.removeEventListener('setRenderSlots', updateCallback)
            })
        },

        methods: {
            handleChange: _.throttle(function (slotName, slotData) {
                this.lastSlots = Object.freeze({
                    ...this.lastSlots,
                    [slotName]: slotData
                })
                this.isInnerChange = true
                this.componentNode.setRenderSlots(slotData, slotName)
            }, 60)
        }
    }
</script>

<style lang="postcss" scoped>
    .modifier-slot {
        margin: 0 10px;
        padding-bottom: 20px;
        border-bottom: 1px solid #ccc;
    }
</style>
