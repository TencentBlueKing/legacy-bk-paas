<template>
    <li class="bk-option"
        :class="{
            'is-disabled': disabled
        }"
        @click="handleOptionClick">
        <div class="bk-option-content">
            <span class="bk-option-name">
                全选
                <template v-if="isAllSelected">
                    {{`(${select.selectedOptions.length})`}}
                </template>
            </span>
        </div>
    </li>
</template>

<script>
    export default {
        name: 'x-option-all',
        inject: ['select'],
        data () {
            return {
                enabledOptions: []
            }
        },
        computed: {
            disabled () {
                return !this.enabledOptions.length
            },
            isAllSelected () {
                return !this.enabledOptions.some(option => !option.isSelected)
            }
        },
        watch: {
            'select.options' (options) {
                this.setEnabledOptions()
            }
        },
        methods: {
            setEnabledOptions () {
                this.enabledOptions = this.select.options.filter(option => !option.disabled)
            },
            handleOptionClick () {
                if (this.disabled) {
                    return false
                }
                if (this.isAllSelected) {
                    this.select.reset()
                } else {
                    this.select.selectAll()
                }
            }
        }
    }
</script>
