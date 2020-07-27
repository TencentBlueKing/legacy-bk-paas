<template>
    <div class="class-list" v-bkloading="{ isLoading }">
        <div class="header">
            <bk-input />
            <div class="create-btn" v-bk-tooltips.top="'添加分类'" role="operation" @click.stop="handleShowCreate">
                <i class="bk-icon icon-plus-line" />
            </div>
        </div>
        <div class="container">
            <div
                v-for="item in list"
                class="item"
                :class="{ active: activeId === item.id }"
                :key="item.id"
                @click="handleSelect(item.id)">
                <div class="name">{{ item.category }}</div>
                <div class="action">
                    <div class="btn" @click.stop="handleEdit(item, $event)" role="operation">
                        <i class="bk-drag-icon bk-drag-template-fill" />
                    </div>
                    <div class="btn" @click="handleDelete(item)">
                        <i class="bk-drag-icon bk-drag-close-small" />
                    </div>
                </div>
                <div class="count">12</div>
            </div>
        </div>
        <div v-if="isShowCreate" ref="operation" class="category-operation" :style="operationStyles" @click.stop="">
            <div class="wraper">
                <bk-input
                    v-model="newCategory"
                    :native-attributes="{ autofocus: 'autofocus' }"
                    placeholder="请输入函数分类，多个分类“/”分隔，回车结束"
                    @keyup="handleSubmitCategory" />
            </div>
        </div>
    </div>
</template>
<script>
    const getParentByRole = (path, role) => {
        for (let i = 0; i < path.length; i++) {
            const current = path[i]
            if (current.getAttribute('role') === role) {
                return current
            }
        }
        return null
    }

    export default {
        name: '',

        data () {
            return {
                isLoading: true,
                isShowCreate: false,
                newCategory: '',
                list: [],
                activeId: '',
                operationPosition: {
                    top: 0,
                    left: 0
                }
            }
        },
        computed: {
            operationStyles () {
                return {
                    top: `${this.operationPosition.top + 36}px`,
                    left: `${this.operationPosition.left - 26}px`
                }
            }
        },
        created () {
            this.fetchData()
            this.editCategory = {}
        },
        mounted () {
            document.body.addEventListener('click', this.handleHideCreate)
            this.$once('hook:beforeDestroy', () => {
                document.body.removeEventListener('click', this.handleHideCreate)
            })
        },
        methods: {
            async fetchData () {
                const data = await this.$store.dispatch('components/categoryList')
                this.list = Object.freeze(data)
                if (this.list.length > 0) {
                    this.handleSelect(this.list[0].id)
                }
                this.isLoading = false
            },
            handleSelect (categoryId) {
                this.activeId = categoryId
                this.$emit('on-change', categoryId)
            },
            handleShowCreate (event) {
                const $target = getParentByRole(event.path, 'operation')
                const { top, left } = $target.getBoundingClientRect()
                this.operationPosition = {
                    top,
                    left
                }
                this.isShowCreate = true
                setTimeout(() => {
                    document.body.appendChild(this.$refs.operation)
                    const $autoFocusItem = this.$refs.operation.querySelector('[autofocus="autofocus"]')
                    if ($autoFocusItem) {
                        $autoFocusItem.focus()
                    }
                })
            },
            handleHideCreate () {
                try {
                    this.isShowCreate = false
                    this.editCategory = {}
                    this.newCategory = ''
                    document.body.removeChild(this.$refs.operation)
                } catch {

                }
            },
            async handleSubmitCategory (value, event) {
                if (event.keyCode !== 13) {
                    return
                }
                const isDupName = this.list.some(_ => _.category === value)
                if (isDupName) {
                    this.messageError('分类重名')
                }
                
                if (this.editCategory.id) {
                    await this.$store.dispatch('components/categoryUpdate', {
                        id: this.editCategory.id,
                        category: this.newCategory
                    })
                    this.messageSuccess('编辑组件分类成功')
                } else {
                    await this.$store.dispatch('components/categoryCreate', {
                        category: this.newCategory
                    })
                    this.messageSuccess('添加组件分类成功')
                }
                
                this.handleHideCreate()
                this.fetchData()
            },
            handleEdit (category, event) {
                this.editCategory = category
                this.newCategory = category.category
                this.handleShowCreate(event)
            },
            async handleDelete (category) {
                if (this.list.length === 1) {
                    this.messageError('组件分类不能为空')
                    return
                }
                await this.$store.dispatch('components/categoryDelete', {
                    id: category.id
                })
                this.fetchData()
                this.messageSuccess('删除组件分类成功')
            }
        }
    }
</script>
<style lang='postcss' scoped>
    .class-list{
        position: relative;
        z-index: 1;
        .header{
            display: flex;
            padding: 16px 18px;
            .create-btn{
                display: flex;
                align-items: center;
                justify-content: center;
                width: 32px;
                height: 32px;
                margin-left: 7px;
                font-size: 16px;
                cursor: pointer;
                &:hover{
                    color: #3A84FF;
                }
            }
        }
        .container{
            .item{
                display: flex;
                align-items: center;
                height: 40px;
                padding: 0 19px 0 21px;
                cursor: pointer;
                &.active,
                &:hover{
                    color: #3A84FF;
                    background: #E1ECFF;
                    .count{
                        color: #fff;
                        background: #A2C5FD;
                    }
                }
                .name{
                    margin-right: auto;
                }
                .action{
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-right: 20px;
                    font-size: 14px;
                    .btn{
                        width: 32px;
                        height: 32px;
                        line-height: 32px;
                        text-align: center;
                        border-radius: 50%;
                        cursor: pointer;
                        &:hover{
                            color: #3A84FF;
                            background: #fff;
                        }
                    }
                    .bk-drag-close-small{
                        font-size: 20px;;
                    }
                }
                .count{
                    height: 20px;
                    padding: 0 6px;
                    font-size: 12px;
                    color: #979BA5;
                    line-height: 20px;
                    border-radius: 2px;
                    background: #F0F1F5;
                }
            }
        }
        
    }
    .category-operation{
        position: absolute;
        z-index: 999;
        top: 54px;
        left: 260px;
        border: 1px solid #dcdee5;
        border-radius: 2px;
        box-shadow: 0px 3px 6px 0px rgba(0,0,0,0.1);
        &:before{
            content: '';
            position: absolute;
            top: -6px;
            left: 35px;
            height: 11px;
            width: 11px;
            border: 1px solid #dcdee5;
            border-bottom: none;
            border-left: none;
            box-shadow: 0px 3px 6px 0px rgba(0,0,0,0.1);
            background: #ffffff;
            transform: rotateZ(-45deg);
        }
        .wraper{
            position: relative;
            width: 340px;
            padding: 15px 14px;
            background: #ffffff;
        }
    }
</style>
