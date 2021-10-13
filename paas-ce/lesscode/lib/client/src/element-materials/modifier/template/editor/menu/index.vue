<template>
    <div class="template-menu-box" :style="styles">
        <div class="menu-item-operate">
            <i class="bk-drag-icon bk-drag-drag-small1 item-drag" />
            <i class="bk-icon icon-close item-remove" :class="{ last: lastOne }" @click="handleRemove"></i>
        </div>
        <menu-edit
            class="menu-edit-area"
            :data="baseInfo"
            v-bind="$attrs"
            @on-change="handleChange" />
        <div v-if="hasChild && isShowChild" class="children-wraper">
            <div
                class="menu-children-box"
                v-for="(childItem, index) in childList"
                :key="index">
                <menu-edit :data="childItem" @on-change="value => handleChildrenChange(value, index)" />
                <div class="menu-children-remove" @click="handleRemoveChildren(index)">
                    <i class="bk-icon icon-minus-circle" />
                </div>
            </div>
        </div>
        <div v-if="hasChild" class="menu-children-create" @click="handleAddChildren">
            <i class="bk-icon icon-plus-circle" />
        </div>
    </div>
</template>
<script>
    import { generatorMenu } from '../../utils'
    import MenuEdit from './edit'

    export default {
        components: {
            MenuEdit
        },
        inheritAttrs: false,
        props: {
            data: {
                type: Object,
                required: true
            },
            lastOne: {
                type: Boolean,
                default: false
            },
            hasChild: {
                type: Boolean,
                default: true
            }
        },
        data () {
            return {
                baseInfo: generatorMenu(),
                childList: []
            }
        },
        computed: {
            isShowChild () {
                return this.childList.length > 0
            },
            styles () {
                if (!this.hasChild) {
                    return {
                        padding: '1px 20px 12px 6px'
                    }
                }
                return {
                    padding: '1px 37px 12px 6px'
                }
            }
        },
        created () {
            this.baseInfo = Object.freeze({ ...this.data })
            this.childList = Object.freeze(this.data.children || [])
        },
        methods: {
            triggerChange () {
                this.$emit('on-change', {
                    ...this.baseInfo,
                    children: this.childList
                })
            },
            handleChange (value) {
                this.baseInfo = value
                this.triggerChange()
            },
            handleChildrenChange (value, index) {
                const childList = [...this.childList]
                childList.splice(index, 1, value)
                this.childList = childList
                this.triggerChange()
            },
            handleAddChildren () {
                const childList = [...this.childList]
                childList.push(generatorMenu())
                this.childList = childList
                this.triggerChange()
            },
            handleRemoveChildren (index) {
                const childList = [...this.childList]
                childList.splice(index, 1)
                this.childList = childList
                this.triggerChange()
            },
            handleRemove () {
                if (this.lastOne) {
                    this.messageError('模板导航不能为空')
                    return
                }
                this.$emit('on-delete')
            }
        }
    }
</script>
<style lang='postcss'>
    .template-menu-box{
        position: relative;
        background: #f0f1f5;
        border-radius: 2px;
        transition: all .15s;
        &:hover{
            box-shadow: 0px 2px 4px 0px rgba(0,0,0,0.2);
            .menu-item-operate {
                display: block;
            }
        }
        &:nth-child(n + 2) {
            margin-top: 10px;
        }
        .menu-edit-area {
            margin-top: 20px;
        }
        .menu-item-operate {
            position: absolute;
            right: 0px;
            color: #979BA5;
            display: none;
            font-size: 20px;
            margin-top: -3px;
            .item-remove {
                cursor: pointer;
                &.last{
                    color: #EA3636;
                }
            }
            .item-drag {
                cursor: move;
                padding-left: 220px;
                margin-right: -8px;
            }
        }
        .menu-children-box{
            position: relative;
            padding-top: 6px;
            padding-left: 20px;
            &:before{
                content: '';
                position: absolute;
                top: -39px;
                left: 3px;
                bottom: 0;
                width: 1px;
                background: #C4C6CC;
            }
            &:last-child{
                &:before{
                    content: '';
                    position: absolute;
                    bottom: unset;
                    height: 62px;
                }
            }
            .menu-name{
                position: relative;
                &:before{
                    content: '';
                    position: absolute;
                    top: 50%;
                    left: 0;
                    width: 16px;
                    height: 1px;
                    background: #C4C6CC;
                    transform: translate(-100%, -50%);
                }
            }
        }
        .menu-children-create{
            position: absolute;
            top: 25px;
            right: 12px;
            display: flex;
            font-size: 16px;
            color: #979BA5;
            cursor: pointer;
        }
        .menu-children-remove{
            position: absolute;
            top: 14px;
            right: -28px;
            display: flex;
            font-size: 16px;
            color: #979BA5;
            cursor: pointer;
        }
    }
</style>
