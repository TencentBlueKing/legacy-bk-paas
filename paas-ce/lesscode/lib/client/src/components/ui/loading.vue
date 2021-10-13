<template functional>
    <i class="loading" v-if="props.loading"></i>
    <span v-else><slot></slot></span>
</template>

<style lang="postcss" scoped>
    .loading {
        display: inline-block;
        width: 16px;
        height: 16px;
        background-color: transparent;
        background-image: url("../../images/svg/loading.svg");
        background-position: center center;
        background-size: 16px;
        background-repeat: no-repeat;
    }
</style>
