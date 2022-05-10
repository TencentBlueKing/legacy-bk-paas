<template>
    <div class="filter-area">
        <i
            v-if="filters.length > 0"
            :class="['bk-icon icon-funnel filter-expand-icon', { actived: expanding }]"
            @click="expanding = !expanding">
        </i>
        <div class="filter-form-area">
            <div v-if="expanding" class="filter-form-content">
                <bk-form
                    class="form-container"
                    form-type="vertical">
                    <bk-form-item
                        v-for="(item, index) in filters"
                        style="width: 230px; margin-right: 16px;"
                        :key="index"
                        :label="`条件${index + 1}`">
                        <bk-input></bk-input>
                    </bk-form-item>
                </bk-form>
                <div class="form-buttons">
                    <bk-button size="small" theme="primary">查询</bk-button>
                    <bk-button size="small">取消</bk-button>
                </div>
            </div>
            <div v-if="!expanding && conditions.lenght > 0" class="selected-conditions"></div>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'filterArea',
        props: {
            fields: {
                type: Array,
                default: () => []
            },
            filters: {
                type: Array,
                default: () => []
            }
        },
        data () {
            return {
                expanding: false,
                conditions: []
            }
        }
    }
</script>
<style lang="postcss" scoped>
    .filter-area {
        position: relative;
        margin-bottom: 16px;
    }
    .filter-expand-icon {
        position: absolute;
        top: -40px;
        right: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 32px;
        width: 32px;
        color: #979ba5;
        background: #fff;
        border: 1px solid #c4c6cc;
        border-radius: 2px;
        cursor: pointer;
        &.actived {
            color: #699df4;
            border-color: #699df4;
        }
    }
    .filter-form-content {
        padding: 24px;
        background: #f5f7fa;
        border-radius: 2px;
    }
    .form-container {
        display: flex;
        flex-wrap: wrap;
        align-items: flex-end;
        >>> .bk-form-item {
            margin-top: 0;
        }
    }
    .form-buttons {
        margin-top: 16px;
        .bk-button {
            margin-right: 4px;
        }
    }
</style>
