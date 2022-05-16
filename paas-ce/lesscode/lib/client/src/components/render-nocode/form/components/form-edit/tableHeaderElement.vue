<template>
    <div class="template-menu-box">
        <div class="menu-item-operate">
            <i class="bk-drag-icon bk-drag-drag-small1 item-drag" />
            <i class="bk-icon icon-close item-remove" @click="$emit('remove')"></i>
        </div>
        <bk-form :label-width="270" form-type="vertical">
            <bk-form-item label="项目名称">
                <bk-input v-model="localValue.name" @change="change"></bk-input>
            </bk-form-item>
            <bk-form-item label="列类型">
                <bk-select
                    v-model="localValue.display"
                    style="background: #fff"
                    @selected="change">
                    <bk-option v-for="option in typeList" :key="option.id" :id="option.id" :name="option.name"></bk-option>
                </bk-select>
            </bk-form-item>
            <bk-checkbox v-model="localValue.required" @change="change">必填</bk-checkbox>
        </bk-form>
    </div>
</template>

<script>
    import cloneDeep from 'lodash.clonedeep'
    import pinyin from 'pinyin'
    export default {
        name: 'tableHeaderElement',
        props: {
            value: {
                type: Object,
                default: () => ({
                    choice: [],
                    display: '',
                    name: '',
                    key: '',
                    required: false
                })
            }
        },
        data () {
            return {
                localValue: cloneDeep(this.value),
                typeList: [
                    { id: 'input', name: '输入框' },
                    { id: 'select', name: '单选框' },
                    { id: 'multiselect', name: '多选框' },
                    { id: 'datetime', name: '时间' },
                    { id: 'date', name: '日期' }
                ]
            }
        },
        methods: {
            change (val) {
                const key = pinyin(val, {
                    style: pinyin.STYLE_NORMAL,
                    heteronym: false
                }).join('')
                this.localValue.key = key
                this.$emit('change', this.localValue)
            }
        }
    }
</script>

<style scoped lang='postcss'>
.template-menu-box{
  position: relative;
  background: #f0f1f5;
  border-radius: 2px;
  padding: 1px 20px 12px 6px;
  transition: all .15s;
  box-shadow: 0px 2px 4px 0px rgba(0,0,0,0.2);
  .menu-item-operate {
    display: block;
  }
  &:nth-child(n + 2) {
    margin-top: 10px;
  }
  .menu-edit-area {
    margin-top: 20px;
  }
  .menu-item-operate {
    position: absolute;
    right: 0;
    color: #979BA5;
    font-size: 20px;
    margin-top: -3px;
    z-index: 10;
    .item-remove {
      cursor: pointer;
    }
    .item-drag {
      cursor: move;
      padding-left: 220px;
      margin-right: -8px;
    }
  }
}
</style>
