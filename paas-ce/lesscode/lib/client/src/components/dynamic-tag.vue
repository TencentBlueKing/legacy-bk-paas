<template>
    <section class="tag-view">
        <template v-for="(tag, index) in defaultTags">
            <bk-tag
                :closable="!disabled"
                :key="index"
                @close="closeTag(tag)">
                {{tag}}
            </bk-tag>
        </template>
        <bk-button
            v-if="!isAddTag"
            ext-cls="new-tag-btn"
            icon="plus"
            size="small"
            theme="default"
            :disabled="disabled"
            @click="addTag">
        </bk-button>
        <bk-input
            v-else
            ref="tagInput"
            class="new-tag-input"
            size="small"
            v-model="userInput"
            @enter="handleAddTag">
        </bk-input>
    </section>
</template>

<script>
    export default {
        props: {
            value: {
                type: Array,
                default: () => ([])
            },

            disabled: {
                type: Boolean,
                default: false
            }
        },

        data () {
            return {
                isAddTag: false,
                userInput: '',
                defaultTags: []
            }
        },

        watch: {
            value: {
                handler () {
                    this.defaultTags = [...this.value]
                },
                immediate: true
            }
        },

        methods: {
            addTag () {
                this.isAddTag = !this.isAddTag
            },
            handleAddTag (value) {
                if (value) {
                    this.defaultTags.push(value)
                    this.triggleChange()
                }
                this.isAddTag = false
                this.userInput = ''
            },
            closeTag (key) {
                const index = this.defaultTags.findIndex(item => item === key)
                this.defaultTags.splice(index, 1)
                this.triggleChange()
            },
            triggleChange () {
                this.$emit('update:value', this.defaultTags)
                this.$emit('change', this.defaultTags)
            }
        }
    }
</script>

<style lang="postcss" scoped>
    .tag-view {
        /deep/ .bk-tag {
            margin: 2px 6px 2px 0;
        }
        .new-tag-btn {
            color: #979ba5;
            padding: 0;
            min-width: 28px;
            margin-top: -2px;
            position: static !important;
            transform: none !important;
            &.is-disabled {
                color: #c4c6cc;
            }
        }
    }
    .new-tag-input {
        width: 100px;
    }
</style>
