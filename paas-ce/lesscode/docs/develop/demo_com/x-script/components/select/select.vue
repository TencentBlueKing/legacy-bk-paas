<template>
    <div class="bk-select"
        :class="[{
            'is-focus': focus,
            'is-disabled': disabled,
            'is-readonly': readonly,
            'is-loading': loading,
            'is-unselected': isUnselected,
            'is-default-trigger': !$scopedSlots.trigger,
            'has-prefix-icon': !!prefixIcon
        }, wrapperCls, fontSizeCls, extCls]"
        :data-placeholder="localPlaceholder">
        <template v-if="!$scopedSlots.trigger">
            <template>
                <i class="bk-select-clear bk-icon icon-close-circle-shape"
                    v-if="clearable && !isUnselected && !disabled && !readonly"
                    @click.prevent.stop="reset">
                </i>
                <i class="bk-select-angle bk-icon icon-angle-down"></i>
            </template>
        </template>
        <bk-popover class="bk-select-dropdown"
            ref="selectDropdown"
            trigger="click"
            placement="bottom-start"
            theme="light bk-select-dropdown"
            animation="slide-toggle"
            :offset="-1"
            :distance="12"
            :on-show="handleDropdownShow"
            :on-hide="handleDropdownHide"
            :tippy-options="popoverOptions">
            <i :class="['bk-select-prefix-icon', prefixIcon]" v-if="prefixIcon"></i>
            <slot name="trigger" v-bind="$props">
                <div class="bk-select-name"
                    :class="fontSizeCls"
                    :title="selectedName">
                    {{selectedName}}
                </div>
            </slot>
            <div slot="content" class="bk-select-dropdown-content"
                :class="[popoverCls, extPopoverCls]"
                :style="popoverStyle">
                <input class="bk-select-search-input"
                    :class="fontSizeCls"
                    ref="searchInput"
                    type="text"
                    placeholder="输入关键字搜索"
                    v-if="searchable"
                    v-model="searchValue">
                <div class="bk-options-wrapper"
                    v-bkloading="{ isLoading: searchLoading }"
                    :style="{ maxHeight: scrollHeight + 'px' }">
                    <ul class="bk-options" ref="optionList"
                        :class="{
                            'bk-options-single': !multiple
                        }"
                        :style="{ maxHeight: scrollHeight + 'px' }">
                        <bk-option-all
                            ref="selectAllOption"
                            v-if="multiple && showSelectAll && !searchValue">
                        </bk-option-all>
                        <slot></slot>
                    </ul>
                </div>
                <div class="bk-select-empty" :class="fontSizeCls" v-if="!options.length">
                    {{ emptyText || '暂无选项' }}
                </div>
                <div class="bk-select-empty" :class="fontSizeCls" v-else-if="searchable && unmatchedCount === options.length">
                    {{ emptyText || '无匹配选项' }}
                </div>
                <div class="bk-select-extension" :class="fontSizeCls" v-if="$slots.extension">
                    <slot name="extension"></slot>
                </div>
            </div>
        </bk-popover>
    </div>
</template>

<script>
    import bkPopover from '../popover'
    import bkOptionAll from './option-all'
    import bkLoading from '../loading/directive'
    import emitter from '../mixins/emitter'
    import zIndex from '../mixins/z-index'

    export default {
        name: 'x-select',
        components: {
            bkPopover,
            bkOptionAll
        },
        directives: {
            bkloading: bkLoading
        },
        mixins: [emitter, zIndex],
        props: {
            value: {
                type: [String, Number, Array],
                default: ''
            },
            multiple: Boolean,
            showSelectAll: Boolean,
            scrollHeight: {
                type: Number,
                default: 216
            },
            popoverMinWidth: Number,
            popoverWidth: Number,
            popoverOptions: {
                type: Object,
                default () {
                    return {}
                }
            },
            placeholder: {
                type: String,
                default: ''
            },
            clearable: {
                type: Boolean,
                default: true
            },
            disabled: Boolean,
            readonly: Boolean,
            loading: Boolean,
            searchable: Boolean,
            searchIgnoreCase: {
                type: Boolean,
                default: true
            },
            size: {
                type: String,
                default: '',
                validator (val) {
                    return ['', 'large', 'small'].includes(val)
                }
            },
            remoteMethod: {
                type: Function
            },
            emptyText: {
                type: String,
                default: ''
            },
            // normal: 12px
            // medium: 14px
            // large: 16px
            fontSize: {
                type: String,
                default: 'normal'
            },
            // 外部设置的 class name
            extCls: {
                type: String,
                default: ''
            },
            // 外部设置的 popover class name
            extPopoverCls: {
                type: String,
                default: ''
            },
            prefixIcon: {
                type: String,
                default: ''
            }
        },
        provide () {
            return {
                select: this,
                optionGroup: null
            }
        },
        data () {
            let selected = this.value
            if (this.multiple && !Array.isArray(selected)) {
                selected = []
            }
            return {
                ready: false,
                focus: false,
                selected: selected,
                options: [],
                optionsMap: {},
                selectedOptions: this.multiple ? [] : null,
                defaultWidth: 0,
                selectSize: this.size,
                searchValue: '',
                searchTimer: null,
                searchLoading: false
            }
        },
        computed: {
            selectedName () {
                if (this.selectedOptions) {
                    if (this.multiple) {
                        return this.selectedOptions.map(option => option.name).join(',')
                    }
                    return this.selectedOptions.name
                }
                return null
            },
            isRemoteSearch () {
                return typeof this.remoteMethod === 'function'
            },
            shouldUpdate () {
                return !this.isRemoteSearch || !this.searchValue
            },
            isUnselected () {
                if (this.multiple) {
                    return !this.selected.length
                }
                return this.selected === ''
            },
            unmatchedCount () {
                return this.options.filter(option => option.unmatched).length
            },
            localPlaceholder () {
                return this.placeholder ? this.placeholder : '请选择'
            },
            dropdownActive () {
                return !(this.disabled || this.loading || this.readonly)
            },
            popoverStyle () {
                return {
                    width: (this.popoverWidth ? this.popoverWidth : this.defaultWidth) + 'px',
                    minWidth: (this.popoverMinWidth ? this.popoverMinWidth : this.defaultWidth) + 'px'
                }
            },
            fontSizeCls () {
                let cls = ''
                if (this.fontSize === 'medium') {
                    cls = 'medium-font'
                } else if (this.fontSize === 'large') {
                    cls = 'large-font'
                }
                return cls
            },
            wrapperCls () {
                const wrapperCls = []
                if (this.selectSize) {
                    wrapperCls.push(`bk-select-${this.selectSize}`)
                }

                return wrapperCls
            },
            popoverCls () {
                const wrapperCls = []
                if (this.selectSize) {
                    wrapperCls.push(`bk-select-popover-${this.selectSize}`)
                }

                return wrapperCls
            }
        },
        watch: {
            value (value) {
                if (!this.isSame(value, this.selected)) {
                    this.selected = value
                }
            },
            focus (focus) {
                if (!focus) {
                    this.resetSearchValue()
                    this.dispatch('bk-form-item', 'form-blur')
                }
                this.$nextTick(() => {
                    this.$emit('toggle', focus)
                    this.dispatch('bk-form-item', 'form-focus')
                })
            },
            dropdownActive () {
                this.setDropdownState()
            },
            searchValue (val) {
                this.searchTimer && clearTimeout(this.searchTimer)
                this.searchTimer = setTimeout(() => {
                    if (this.isRemoteSearch) {
                        this.remoteSearch()
                    } else {
                        this.search()
                    }
                }, 100)
            },
            selected (value, oldValue) {
                if (this.shouldUpdate) {
                    this.setSelectedOptions()
                }
                this.$emit('input', value)
                this.$emit('change', value, oldValue)
            },
            options () {
                this.updatePopoverPosition()
                this.setSelectedOptions()
            },
            size (val) {
                this.selectSize = val
            }
        },
        created () {
            this.$nextTick(() => {
                this.setSelectedOptions()
            })
        },
        mounted () {
            this.setDropdownState()
            this.setDropdownCallback()
        },
        methods: {
            setSelectedOptions () {
                if (this.multiple) {
                    const existOptions = this.selectedOptions.filter(option => this.selected.includes(option.id))
                    const newSelected = this.selected.filter(value => !existOptions.some(option => option.id === value))
                    newSelected.forEach(value => {
                        const option = this.optionsMap[value]
                        if (option) {
                            existOptions.push(option)
                        }
                    })
                    const selectedOptions = []
                    this.selected.forEach(value => {
                        const option = existOptions.find(option => option.id === value)
                        if (option) {
                            selectedOptions.push(option)
                        }
                    })
                    this.selectedOptions = selectedOptions
                } else {
                    this.selectedOptions = this.optionsMap[this.selected]
                }
            },
            getPopoverInstance () {
                return this.$refs.selectDropdown.instance
            },
            close () {
                const popover = this.getPopoverInstance()
                popover.hide()
            },
            show () {
                const popover = this.getPopoverInstance()
                popover.show()
            },
            updatePopoverPosition () {
                if (this.focus) {
                    const popover = this.getPopoverInstance()
                    popover.popperInstance.scheduleUpdate()
                }
            },
            setDropdownState () {
                const popover = this.getPopoverInstance()
                if (this.dropdownActive) {
                    popover.enable()
                } else {
                    popover.disable()
                }
            },
            setDropdownCallback () {
                const popover = this.getPopoverInstance()
                popover.set({
                    onShown: () => {
                        if (this.searchable) {
                            this.$refs.searchInput.focus()
                        }
                    }
                })
            },
            handleDropdownShow () {
                this.defaultWidth = this.$el.offsetWidth
                this.focus = true
            },
            handleDropdownHide () {
                this.focus = false
            },
            registerOption (option) {
                this.options.push(option)
                this.$set(this.optionsMap, option.id, option)
            },
            removeOption (option) {
                const index = this.options.indexOf(option)
                if (index > -1) {
                    this.options.splice(index, 1)
                }
            },
            selectOption (option) {
                if (this.multiple) {
                    if (!this.shouldUpdate) {
                        this.selectedOptions.push(option)
                    }
                    this.selected = [...this.selected, option.id]
                } else {
                    if (!this.shouldUpdate) {
                        this.selectedOptions = option
                    }
                    this.selected = option.id
                    this.close()
                }
                this.$nextTick(() => {
                    this.$emit('selected', this.selected, this.selectedOptions)
                })
            },
            unselectOption (option) {
                if (this.multiple) {
                    if (!this.shouldUpdate) {
                        this.selectedOptions = this.selectedOptions.filter(selectedOption => selectedOption.id !== option.id)
                    }
                    this.selected = this.selected.filter(value => value !== option.id)
                } else {
                    this.setSelectedOptions = null
                    this.reset()
                }
                this.$nextTick(() => {
                    this.$emit('selected', this.selected, this.selectedOptions)
                })
            },
            reset () {
                const prevSelected = this.multiple ? [...this.selected] : this.selected
                this.selected = this.multiple ? [] : ''
                this.$emit('clear', prevSelected)
            },
            selectAll () {
                this.selected = this.options.filter(option => !option.disabled).map(option => option.id)
            },
            search () {
                this.searchLoading = true
                let searchValue = this.searchValue
                if (searchValue) {
                    if (this.searchIgnoreCase) {
                        searchValue = searchValue.toLowerCase()
                    }
                    this.options.forEach(option => {
                        if (this.searchIgnoreCase) {
                            option.unmatched = option.lowerName.indexOf(searchValue) < 0
                        } else {
                            option.unmatched = option.name.indexOf(searchValue) < 0
                        }
                    })
                } else {
                    this.options.forEach(option => {
                        option.unmatched = false
                    })
                }
                this.searchLoading = false
            },
            async remoteSearch () {
                try {
                    this.searchLoading = true
                    await this.remoteMethod(this.searchValue)
                } catch (e) {
                    console.error(e)
                } finally {
                    this.searchLoading = false
                }
            },
            resetSearchValue () {
                this.searchValue = ''
            },
            isSame (source, target) {
                const isArray = Array.isArray(source) && Array.isArray(target)
                if (isArray) {
                    if (source.length !== target.length) {
                        return false
                    }
                    return !source.some((value, index) => value !== target[index])
                }
                return source === target
            }
        }
    }
</script>

<style>
    @import './select.css';
</style>
