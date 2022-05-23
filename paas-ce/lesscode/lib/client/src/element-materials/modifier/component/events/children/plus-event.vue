<template>
    <bk-popover
        ref="mainPopoverRef"
        placement="bottom"
        trigger="click"
        theme="light"
        ext-cls="g-popover-empty-padding"
        :class="{ 'empty-event': Object.keys(renderEvents).length <= 0 }"
        :disabled="computedDisabled"
    >
        <bk-link
            theme="primary"
            icon="bk-icon icon-plus-circle"
            class="plus-event-icon"
            :disabled="computedDisabled"
            v-bk-tooltips="{
                content: '暂无可添加事件',
                disabled: !computedDisabled
            }"
        >添加事件</bk-link>
        <div slot="content">
            <section class="plus-event">
                <bk-input
                    class="plus-event-search"
                    left-icon="bk-icon icon-search"
                    behavior="simplicity"
                    v-model="searchEventName"
                ></bk-input>
                <ul class="event-list">
                    <li
                        class="event-item"
                        :key="event.name"
                        v-for="event in computedEventList"
                        @click="handleChooseEvent(event)"
                    >
                        <bk-popover
                            ref="tipsPopoverRef"
                            placement="left-start"
                            :content="event.tips"
                            :disabled="!event.tips"
                            :width="200"
                            boundary="window"
                        >
                            <span>{{ event.name }}</span>
                        </bk-popover>
                    </li>
                </ul>
                <bk-exception
                    class="exception-wrap-item exception-part"
                    type="empty"
                    scene="part"
                    v-if="computedEventList.length <= 0"
                ></bk-exception>
            </section>
        </div>
    </bk-popover>
</template>

<script>
    export default {
        props: {
            configEvents: Array,
            renderEvents: Object
        },

        data () {
            return {
                searchEventName: ''
            }
        },

        computed: {
            computedEventList () {
                return this.configEvents.reduce((acc, cur) => {
                    const hasExist = this.renderEvents[cur.name]
                    const isMatchSearch = cur.name.includes(this.searchEventName)
                    if (!hasExist && isMatchSearch) {
                        acc.push(cur)
                    }
                    return acc
                }, [])
            },

            computedDisabled () {
                return !this.computedEventList.length && !this.searchEventName
            }
        },

        methods: {
            handleChooseEvent (event) {
                this.$emit('plus-event', event)
                this.$refs['tipsPopoverRef'].forEach(ref => ref.hideHandler())
                this.$refs['mainPopoverRef'].hideHandler()
            }
        }
    }
</script>

<style lang='postcss' scoped>
    @import "@/css/mixins/scroller";

    ::v-deep .empty-event {
        margin-left: 107px;
    }
    .plus-event-icon {
        margin: 10px 10px;
        ::v-deep .bk-link-text {
            font-size: 12px;
        }
    }
    .plus-event {
        width: 276px;
        border: 1px solid #dcdee5;
        border-top: none;
        border-radius: 2px;
        box-shadow: 0px 2px 6px 0px rgba(0,0,0,0.10);
    }
    .plus-event-search {
        width: 260px;
        margin: 0 5px;
        ::v-deep input {
            border-color: transparent transparent #EAEBF0;
        }
    }
    .event-list {
        max-height: 350px;
        overflow-y: auto;
        margin-top: 4px;
        padding-bottom: 8px;
        @mixin scroller;
    }
    .event-item {
        height: 32px;
        line-height: 32px;
        padding: 0 10px;
        cursor: pointer;
        &:hover {
            background: #e1ecff;
            color: #3a84ff;
        }
    }
    .exception-wrap-item {
        margin-bottom: 30px;
    }
</style>
