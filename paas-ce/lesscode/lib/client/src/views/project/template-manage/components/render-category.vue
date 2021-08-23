<template>
    <div class="class-list" v-bkloading="{ isLoading }">
        <div class="header">
            <bk-input :value="searchValue" @change="handleSearch" />
            <div class="create-btn" v-bk-tooltips.top="'添加分类'" role="operation" @click.stop="handleShowCreate">
                <i class="bk-icon icon-plus-line" />
            </div>
        </div>
        <div class="container">
            <vue-draggable
                class="group-list"
                :list="renderList"
                :disabled="!!searchValue"
                @change="handleSort"
                :group="{ name: 'category' }">
                <transition-group type="transition" :name="'flip-list'">
                    <div
                        v-for="item in renderList"
                        class="item"
                        :class="{
                            active: activeId === item.id,
                            hover: editCategory.id === item.id
                        }"
                        :key="item.id"
                        @click="handleSelect(item.id)">
                        <i v-if="!searchValue" class="bk-drag-icon bk-drag-grag-fill drag-flag" />
                        <i class="bk-drag-icon bk-drag-folder-fill" />
                        <div class="name">{{ item.name }}</div>
                        <div class="action">
                            <div class="btn edit-btn" @click.stop="handleEdit(item, $event)" role="operation">
                                <i class="bk-icon icon-edit2" style="font-size: 20px;" />
                            </div>
                            <div class="btn" @click="handleDelete(item)">
                                <i class="bk-drag-icon bk-drag-close-small" />
                            </div>
                        </div>
                        <div class="count">{{ item.count }}</div>
                    </div>
                </transition-group>
            </vue-draggable>
        </div>
        <div v-if="isShowCreate" ref="operation" class="category-operation" :style="operationStyles" @click.stop="">
            <div class="wraper">
                <bk-input
                    v-model="newCategory"
                    :native-attributes="{ autofocus: 'autofocus' }"
                    placeholder="请输入模板分类，多个分类“/”分隔，回车结束"
                    @keyup="handleSubmitCategory" />
            </div>
        </div>
    </div>
</template>
<script>
    import _ from 'lodash'

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
                searchValue: '',
                isShowCreate: false,
                newCategory: '',
                list: [],
                renderList: [],
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
                this.isLoading = true
                try {
                    const categoryList = this.$store.dispatch('pageTemplate/categoryList', {
                        projectId: parseInt(this.$route.params.projectId)
                    })
                    const categoryCount = this.$store.dispatch('pageTemplate/categoryCount', {
                        projectId: parseInt(this.$route.params.projectId)
                    })
                    const [list, count] = await Promise.all([categoryList, categoryCount])

                    const countMap = count.reduce((result, item) => {
                        result[item.categoryId] = item.count
                        return result
                    }, {})

                    const realList = list.map(item => Object.freeze({
                        ...item,
                        count: countMap[item.id] ? countMap[item.id] : 0
                    }))
                    this.list = realList
                    this.renderList = [...realList]
                    if (this.list.length > 0) {
                        this.handleSelect(this.list[0].id)
                    }
                } finally {
                    this.isLoading = false
                }
            },
            // 暴露给外部刷新用的
            refresh () {
                this.fetchData()
            },
            handleSearch (search) {
                const realValue = search.replace(/\s/, '')
                this.searchValue = realValue
                if (!realValue) {
                    this.renderList = Object.freeze(this.list)
                    return
                }
                const searchReg = new RegExp(realValue)
                const result = []
                for (let i = 0; i < this.list.length; i++) {
                    if (searchReg.test(this.list[i].name)) {
                        result.push(this.list[i])
                    }
                }
                this.renderList = Object.freeze(result)
            },
            handleSort: _.throttle(function (event) {
                this.$store.dispatch('pageTemplate/categorySort', {
                    list: this.renderList.map(_ => ({
                        id: _.id
                    })),
                    belongProjectId: parseInt(this.$route.params.projectId)
                })
            }, 30),
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
                try {
                    if (this.editCategory.id) {
                        await this.$store.dispatch('pageTemplate/categoryUpdate', {
                            id: this.editCategory.id,
                            name: this.newCategory,
                            belongProjectId: parseInt(this.$route.params.projectId)
                        })
                        this.messageSuccess('编辑模板分类成功')
                    } else {
                        await this.$store.dispatch('pageTemplate/categoryCreate', {
                            name: this.newCategory,
                            belongProjectId: parseInt(this.$route.params.projectId)
                        })
                        this.searchValue = ''
                        this.messageSuccess('添加模板分类成功')
                    }

                    this.handleHideCreate()
                    this.fetchData()
                } catch {}
            },
            handleEdit (category, event) {
                this.editCategory = category
                this.newCategory = category.name
                this.handleShowCreate(event)
            },
            async handleDelete (category) {
                console.log(category, '======category')
                if (this.list.length === 1) {
                    this.messageError('模板分类不能为空')
                    return
                }
                try {
                    await this.$store.dispatch('pageTemplate/categoryDelete', {
                        name: category.name,
                        belongProjectId: parseInt(this.$route.params.projectId),
                        id: category.id
                    })
                    this.fetchData()
                    this.messageSuccess('删除模板分类成功')
                } catch {}
            }
        }
    }
</script>
<style lang='postcss' scoped>
    .class-list{
        position: relative;
        z-index: 1;
        height: calc(100vh - 160px);
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

                &:hover,
                &.active,
                &.hover{
                    color: #3A84FF;
                    background: #E1ECFF;
                    .bk-drag-folder-fill{
                        color: #3A84FF;
                    }
                    .count{
                        color: #fff;
                        background: #A2C5FD;
                    }
                }
                &:hover,
                &.hover{
                    .name{
                        width: calc(100% - 120px);
                    }
                    .drag-flag{
                        display: block;
                    }
                    .action{
                        display: flex;
                    }
                }
                &.hover{
                    .edit-btn{
                        color: #3A84FF;
                        background: #fff;
                    }
                }
                .bk-drag-folder-fill{
                    margin-right: 12px;
                    color: #c4c6cc;
                }
                .drag-flag{
                    position: absolute;
                    display: none;
                    margin-left: -15px;
                    font-size: 12px;
                }
                .name{
                    margin-right: auto;
                    width: calc(100% - 60px);
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    overflow: hidden;
                }
                .action{
                    position: absolute;
                    right: 60px;
                    display: none;
                    align-items: center;
                    justify-content: center;
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
    .flip-list-move {
        transition: transform 0.15s;
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
