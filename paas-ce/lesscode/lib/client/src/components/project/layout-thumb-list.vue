<template>
    <ul class="layout-thumb-list">
        <li v-for="layout in list" :key="layout.id"
            :class="['list-item', { 'is-empty': layout.type === 'empty', checked: layout.checked, disabled: layout.disabled }]"
            @click="handleClickItem(layout)">
            <span v-if="layout.isDefault" class="default-tag checked">默认</span>
            <span v-else-if="toolkit.includes('setdefault')" class="default-tag setting" @click.stop="handleSetDefault(layout)">设为默认</span>
            <div class="checkbox">
                <i class="bk-icon icon-check-1 checked-icon"></i>
            </div>
            <div class="layout-img" v-if="layout.type !== 'empty'">
                <img :src="getPreviewImg(layout)" />
            </div>
            <div class="layout-name" :title="layout.defaultName">
                {{ layout.defaultName }}
            </div>
        </li>
    </ul>
</template>

<script>
    export default {
        props: {
            list: {
                type: Array,
                default: () => ([])
            },
            toolkit: {
                type: Array,
                default: () => ([
                    'select',
                    'setdefault'
                ])
            }
        },
        methods: {
            handleClickItem (layout) {
                if (layout.disabled || !this.toolkit.includes('select')) {
                    return
                }
                this.$emit('change-checked', layout)
            },
            handleSetDefault (layout) {
                if (!this.toolkit.includes('setdefault')) {
                    return
                }
                this.$emit('set-default', layout)
            },
            getPreviewImg (layout) {
                const previewImg = `layout/preview-${layout.type}-s.png`
                return require(`@/images/${previewImg}`)
            }
        }
    }
</script>

<style lang="postcss" scoped>
    @import "@/css/mixins/ellipsis";

    .layout-thumb-list {
        display: flex;
        flex-wrap: wrap;

        .list-item {
            position: relative;
            flex: none;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            width: 148px;
            height: 120px;
            background: #ffffff;
            border-radius: 2px;
            cursor: pointer;
            border: 1px solid #dcdee5;
            margin-right: 8px;
            margin-bottom: 8px;

            &:nth-of-type(4n) {
                margin-right: 0;
            }

            &:hover {
                border-color: #3a84ff;
            }

            &.checked {
                border-color: #3a84ff;
                background: #e1ecff;
                .checkbox {
                    display: block;
                }

                &:hover {
                    .default-tag {
                        &.setting {
                            display: block;
                        }
                    }
                }
            }

            &.disabled {
                border-color: #C4C6CC;
                background: #fff;
                cursor: not-allowed;
                .layout-name {
                    color: #979BA5;
                }
                .checkbox {
                    border-color: transparent transparent #C4C6CC transparent;
                }
            }

            .default-tag {
                position: absolute;
                right: 0;
                top: 0;
                height: 18px;
                line-height: 18px;
                border-radius: 2px;
                font-size: 12px;
                color: #fff;
                padding: 0 5px;

                &.checked {
                    background: #FFB848;
                }
                &.setting {
                    display: none;
                    background: #699DF4;
                    cursor: pointer;
                }
            }
            .checkbox {
                display: none;
                position: absolute;
                right: -1px;
                bottom: -1px;
                border-style: solid;
                border-width: 0 0 30px 34px;
                border-color: transparent transparent #3A84FF transparent;
                .checked-icon {
                    position: absolute;
                    left: -20px;
                    top: 10px;
                    color: #fff;
                    font-size: 20px;
                }
            }

            .layout-img {
                margin: 6px 6px 0;
                width: 136px;
                height: 82px;
                img {
                    width: 100%;
                    height: 100%;
                }
            }
            .layout-name {
                text-align: center;
                font-size: 14px;
                color: #63656e;
                padding: 0 6px;
                @mixin ellipsis 100%, block;
            }
        }
    }
</style>
