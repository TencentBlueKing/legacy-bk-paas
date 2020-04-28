<template>
    <li class="bk-option-group" v-show="visible">
        <div class="bk-option-group-name" :class="select.fontSizeCls">
            <slot name="group-name">{{name}} <template v-if="showCount">({{options.length}})</template></slot>
        </div>
        <ul class="bk-group-options">
            <slot></slot>
        </ul>
    </li>
</template>

<script>
    export default {
        name: 'x-option-group',
        props: {
            name: {
                type: String,
                required: true
            },
            showCount: {
                type: Boolean,
                default: true
            }
        },
        provide () {
            return {
                optionGroup: this
            }
        },
        inject: ['select'],
        data () {
            return {
                options: []
            }
        },
        computed: {
            unmatchedCount () {
                return this.options.filter(option => option.unmatched).length
            },
            visible () {
                const optionCount = this.options.length
                if (!optionCount) {
                    return true
                }
                return optionCount !== this.unmatchedCount
            }
        },
        methods: {
            registerOption (option) {
                this.options.push(option)
            },
            removeOption (option) {
                const index = this.options.indexOf(option)
                if (index > -1) {
                    this.options.splice(index, 1)
                }
            }
        }
    }
</script>
