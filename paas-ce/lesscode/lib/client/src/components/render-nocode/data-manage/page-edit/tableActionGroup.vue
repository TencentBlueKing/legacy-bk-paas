<template>
    <div class="table-actions-wrapper">
        <bk-button
            class="table-action-btn"
            size="small"
            :text="true"
            @click="handleClick('edit')">
            编辑
        </bk-button>
        <bk-button
            class="table-action-btn"
            size="small"
            :text="true"
            @click="handleClick('del')">
            删除
        </bk-button>
        <bk-button
            class="table-action-btn"
            size="small"
            :text="true"
            @click="handleClick('detail')">
            详情
        </bk-button>
    </div>
</template>

<script>
    export default {
        name: 'tableActionGroup',
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
.table-actions-wrapper {
  display: flex;
  align-items: center;
  .table-action-btn {}
  .add-action-btn {
    font-size: 20px;
    cursor: pointer;
    &:hover {
      color: #3a84ff;
    }
  }
}

/deep/ .bk-button-small{
  padding: 0;
  margin-right: 8px;
}
</style>
