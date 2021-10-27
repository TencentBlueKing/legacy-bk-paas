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
            @change="change"
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
                config: {}
            }
        },

        computed: {
            renderConfig () {
                return Object.keys(this.config).reduce((result, slotName) => {
                    const config = this.config[slotName]
                    if (config.display !== 'hidden') {
                        result[slotName] = config
                    }
                    return result
                }, {})
            }
        },

        created () {
            this.lastProps = {}
            this.lastSlots = {}
            this.currentComponentNode = LC.getActiveNode()
            if (this.currentComponentNode) {
                const {
                    material,
                    renderProps,
                    renderSlots
                } = this.currentComponentNode
                this.config = Object.freeze(material.slots)
                this.lastProps = Object.assign({}, renderProps)
                this.lastSlots = Object.assign({}, renderSlots)
            }
        },

        methods: {
            change: _.throttle(function (slotName, slotVal) {
                this.currentComponentNode.setRenderSlots(slotVal, slotName)
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
