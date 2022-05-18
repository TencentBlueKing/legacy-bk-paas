<template>
    <div class="generate-page-btns">
        <bk-button style="margin-right: 10px;" :text="true">生成流程页面</bk-button>
        <bk-button :text="true">生成数据管理页面</bk-button>
    </div>
</template>
<script>
    export default {
        name: 'generatePageBtns'
    }
</script>
<style lang="postcss" scoped>
.generate-page-btns {
    display: flex;
    align-items: center;
    padding: 0 20px;
}
</style>
