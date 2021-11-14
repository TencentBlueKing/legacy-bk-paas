<template>
    <article
        v-if="Object.keys(renderConfig).length"
        class="modifier-slot">
        <renderSlot
            v-for="(slotConfig, slotName) in renderConfig"
            :key="slotName"
            :slot-name="slotName"
            :slot-val="lastSlots[slotName]"
            :slot-config="slotConfig"
            :render-props="lastProps"
            @change="handleChange"
            @batchUpdate="batchUpdate"
        ></renderSlot>
    </article>
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
            this.lastProps = {}
            this.componentNode = LC.getActiveNode()
            const {
                material,
                renderProps,
                renderSlots
            } = this.componentNode
            this.config = Object.freeze(material.slots || {})
            this.lastProps = _.cloneDeep(renderProps)
            this.lastSlots = Object.freeze(_.cloneDeep(renderSlots))
        },

        methods: {
            handleChange: _.throttle(function (slotName, slotVal) {
                this.lastSlots = Object.freeze({
                    ...this.lastSlots,
                    [slotName]: slotVal
                })
                this.componentNode.setRenderSlots(slotVal, slotName)
            }, 60),
            batchUpdate (renderData) {
                console.log('from slot batchUpdate', renderData)
            }
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
