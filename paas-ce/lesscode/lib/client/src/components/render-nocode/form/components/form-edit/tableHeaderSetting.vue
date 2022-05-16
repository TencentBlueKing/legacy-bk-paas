<template>
    <div class="header-setting-wrapper">
        <vue-draggable
            class="group-list"
            ghost-class="menu-ghost-item"
            handle=".item-drag"
            @end="handleChangeHeader"
            :group="{ name: 'top-col' }">
            <transition-group type="transition" :name="'flip-list'">
                <table-header-element
                    v-for="(head, index) in localValue"
                    :key="`${head.choice}_${index}`"
                    :value="head"
                    @remove="handleRemove(index)"
                    @change="handleChange($event,index)">
                </table-header-element>
            </transition-group>
        </vue-draggable>
    </div>
</template>

<script>
    import cloneDeep from 'lodash.clonedeep'
    import TableHeaderElement from './tableHeaderElement.vue'
    export default {
        name: 'tableHeaderSetting',
        components: {
            TableHeaderElement
        },
        props: {
            list: {
                type: Array,
                default: () => ([{
                    choice: [],
                    display: '',
                    name: '',
                    key: '',
                    required: false
                }])
            }
        },
        data () {
            return {
                localValue: cloneDeep(this.list)
            }
        },
        watch: {
            list (val) {
                this.localValue = cloneDeep(this.list)
            }
        },
        methods: {
            handleChangeHeader (e) {
                this.$emit('move', e.newIndex, e.oldIndex)
            },
            handleRemove (index) {
                this.$emit('remove', index)
            },
            handleChange ($event, index) {
                console.log($event, index)
                this.$emit('update', $event, index)
            },
            change () {
                this.$emit('change', this.localValue)
            }
        }
    }
</script>

<style  scoped lang='postcss'>
@import "@/css/mixins/scroller";
.header-setting-wrapper{
  .menu-wraper{
    margin-bottom:  10px;
    max-height: calc(100% - 76px);
    overflow-y: auto;
    @mixin scroller;
  }
}
</style>
