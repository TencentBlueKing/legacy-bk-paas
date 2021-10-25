<template>
    <article
        v-if="Object.keys(computedSlots).length"
        class="modifier-slot">
        <renderSlot
            v-for="(slotConfig, slotName) in computedSlots"
            :key="slotName"
            :slot-name="slotName"
            :slot-val="renderSlots[slotName]"
            :slot-config="slotConfig"
            :render-props="renderProps"
            @change="change"
            @batchUpdate="batchUpdate"
        ></renderSlot>
    </article>
</template>

<script>
    import renderSlot from './slot.vue'

    export default {
        components: {
            renderSlot
        },

        props: {
            materialConfig: Object,
            lastSlots: Object,
            lastProps: Object
        },

        data () {
            return {
                renderSlots: {},
                renderProps: {}
            }
        },

        computed: {
            computedSlots () {
                // const keys = Object.keys(this.materialConfig)
                // const res = keys.reduce((acc, cur) => {
                //     const config = this.materialConfig[cur]
                //     if (config.display !== 'hidden') {
                //         acc[cur] = config
                //     }
                //     return acc
                // }, {})
                // console.log('from computedSlots --------------: ', res)
                // return res
                return {}
            }
        },

        created () {
            this.renderSlots = this.lastSlots
            this.renderProps = this.lastProps
        },

        methods: {
            change (name, slotVal) {
                this.renderSlots[name] = slotVal
                const renderData = {
                    renderSlots: this.renderSlots
                }
                this.batchUpdate(renderData)
            },

            batchUpdate (renderData) {
                this.$emit('change', renderData)
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
