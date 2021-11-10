<template functional>
    <span class="version-tag">{{props.versionName}}</span>
</template>

<style lang="postcss" scoped>
    .version-tag {
        height: 18px;
        line-height: 18px;
        background: #f0f1f5;
        border-radius: 9px;
        color: #63656E;
        font-size: 12px;
        text-align: center;
        padding: 0 8px;
        max-width: 120px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;

        &:hover {
            background: #dcdee5;
        }
    }
</style>
