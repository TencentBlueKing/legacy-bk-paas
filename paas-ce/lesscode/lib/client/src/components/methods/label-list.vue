<template>
    <section class="label-list-home">
        <span v-for="item in list.slice(0, 1)" :key="item" :class="['label-item', 'label-first', { only: list.length === 1 }]" :title="item">{{ item }}</span>
        <bk-popconfirm trigger="click" confirm-text="" cancel-text="" ext-cls="label-pop" v-if="list.slice(1).length">
            <div slot="content">
                <ul class="label-list">
                    <li v-for="item in list.slice(1)" :key="item" class="label-item list-item">{{ item }}</li>
                </ul>
            </div>
            <span class="label-item label-more">...</span>
        </bk-popconfirm>
        <span v-if="list.length <= 0">--</span>
    </section>
</template>

<script>
    export default {
        props: {
            list: Array
        }
    }
</script>

<style lang="postcss" scoped>
    .label-list-home {
        width: 100%;
        display: flex;
        align-items: center;
        .label-first {
            max-width: calc(100% - 24px);
            display: inline-block;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            &.only {
                max-width: 100%;
            }
        }
        .label-more {
            width: 24px;
            margin: 0;
        }
    }
    .label-item {
        color: #63656e;
        background: #f0f1f5;
        line-height: 24px;
        padding: 0 8px;
        font-size: 12px;
        display: inline-block;
        margin-right: 6px;
    }
    .label-list {
        max-width: 460px;
        padding: 8px 0 0 8px;
        &:after {
            content: '';
            display: table;
            clear: both;
        }
        .list-item {
            float: left;
            margin: 0 8px 8px 0;
        }
    }
    .label-more {
        cursor: pointer;
        &:hover {
            background: #c4c6cc;
        }
    }
</style>
<style lang="postcss">
    .label-pop {
        .tippy-tooltip, .bk-popconfirm-content {
            padding: 0;
        }
        .popconfirm-content {
            margin: 0;
        }
    }
</style>
