<template>
    <div class="btn-group-container">
        <bk-button :theme="'primary'" :title="'主要按钮'" class="mr10" @click="handleClick('add')">
            新增
        </bk-button>
        <bk-button :theme="'default'" type="submit" :title="'基础按钮'" @click="handleClick('import')" class="mr10">
            导入
        </bk-button>
        <bk-button :theme="'default'" type="submit" :title="'基础按钮'" @click="handleClick('export')" class="mr10">
            导出
        </bk-button>
        <!--        <bk-button :theme="'default'" type="submit" :title="'基础按钮'" @click="handleClick('download')" class="mr10">-->
        <!--            下载文件-->
        <!--        </bk-button>-->
        <bk-button :theme="'default'" type="submit" :title="'基础按钮'" @click="handleClick('bacthDel')" class="mr10">
            批量删除
        </bk-button>

    </div>
</template>

<script>
    export default {
        name: 'buttonGroup',
        props: {
            permissions: {
                type: Array,
                default: () => ([])
            }
        },
        methods: {
            handleClick (action) {
                this.$emit('click', action)
            }
        }
    }
</script>

<style scoped lang="postcss">
.btn-group-container{
  margin: 16px;
  height: 40px;
  display: flex;
  align-items: center;

}
</style>
