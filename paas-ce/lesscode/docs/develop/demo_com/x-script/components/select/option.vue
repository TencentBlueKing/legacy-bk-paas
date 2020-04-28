<template>
    <li class="bk-option"
        :class="{
            'is-selected': isSelected,
            'is-disabled': disabled,
            'is-highlight': isHighlight
        }"
        v-show="!unmatched"
        @click="handleOptionClick">
        <div class="bk-option-content">
            <slot>
                <div class="bk-option-content-default" :title="name">
                    <span class="bk-option-name" :class="select.fontSizeCls">
                        {{name}}
                    </span>
                    <i class="bk-option-icon bk-icon icon-check-1" v-if="select.multiple && isSelected"></i>
                </div>
            </slot>
        </div>
    </li>
</template>

<script>
    export default {
        name: 'x-option',
        props: {
            id: {
                type: [String, Number],
                required: true
            },
            name: {
                type: [String, Number],
                required: true
            },
            disabled: Boolean
        },
        inject: ['select', 'optionGroup'],
        data () {
            return {
                unmatched: false,
                isHighlight: false // todo: 解决性能问题，暂时关闭键盘上下键选择的功能
            }
        },
        computed: {
            isSelected () {
                if (this.select.multiple) {
                    return this.select.selected.includes(this.id)
                }
                return this.select.selected === this.id
            },
            lowerName () {
                return String(this.name).toLowerCase()
            }
        },
        created () {
            this.select.registerOption(this)
            if (this.optionGroup) {
                this.optionGroup.registerOption(this)
            }
        },
        beforeDestroy () {
            this.select.removeOption(this)
            if (this.optionGroup) {
                this.optionGroup.removeOption(this)
            }
        },
        methods: {
            handleOptionClick () {
                if (this.disabled) {
                    return false
                }
                const select = this.select
                if (this.isSelected && select.multiple) {
                    select.unselectOption(this)
                } else if (!this.isSelected) {
                    select.selectOption(this)
                }
                if (!select.multiple) {
                    select.close()
                }
            }
        }
    }
</script>
