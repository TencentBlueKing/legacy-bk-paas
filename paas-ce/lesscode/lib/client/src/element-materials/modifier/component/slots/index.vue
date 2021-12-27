<template>
    <div
        v-if="isShow && Object.keys(renderConfig).length"
        class="modifier-slot">
        <renderSlot
            v-for="(slotConfig, slotName) in renderConfig"
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
    import renderSlot from './slot.vue'

    export default {
        components: {
            renderSlot
        },

        data () {
            return {
                isShow: true,
                config: {},
                lastSlots: {}
            }
        },

        computed: {
            renderConfig () {
                return Object.keys(this.config).reduce((result, slotName) => {
                    const config = this.config[slotName]
                    if (config.name.includes('layout') || config.display !== 'hidden') {
                        result[slotName] = config
                    }
                    return result
                }, {})
            }
        },

        created () {
            this.componentNode = LC.getActiveNode()
            // 布局类型的组件不支持 slot 配置
            if (this.componentNode.layoutType) {
                this.isShow = false
                return
            }
            const {
                material,
                renderSlots
            } = this.componentNode
            this.config = Object.freeze(material.slots || {})
            this.lastSlots = Object.freeze(_.cloneDeep(renderSlots))
        },

        methods: {
            handleChange: _.throttle(function (slotName, slotData) {
                this.lastSlots = Object.freeze({
                    ...this.lastSlots,
                    [slotName]: slotData
                })
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
