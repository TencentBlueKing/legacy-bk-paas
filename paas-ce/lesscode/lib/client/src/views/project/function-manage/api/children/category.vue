<template>
    <section class="category-list">
        <h3 class="list-head">
            <bk-input
                class="head-input"
                placeholder="请输入"
                right-icon="bk-icon icon-search"
                clearable
                v-model="searchCategoryString"
                @change="handerSearchCategory"
            ></bk-input>
            <bk-popconfirm
                trigger="click"
                confirm-text=""
                cancel-text="">
                <div slot="content">
                    <bk-input
                        class="add-api-category"
                        placeholder="请输入 API 分类，多个分类 / 分隔，回车保存"
                        right-icon="loading"
                        ref="addCategoryInput"
                        v-bkloading="{
                            isLoading: isCreatingCategory
                        }"
                        v-model="newCategoryName"
                        @enter="handleCreateCategory"
                    ></bk-input>
                </div>
                <i class="bk-icon icon-plus" v-bk-tooltips.top="'添加分类'"></i>
            </bk-popconfirm>
        </h3>

        <vue-draggable
            class="category-list"
            :disabled="!!searchCategoryString"
            :list="renderCategoryList"
            :group="{
                name: 'category-list'
            }"
            v-bkloading="{
                isLoading: isLoadingCategoryList
            }"
            @change="handleCategorySort"
        >
            <li
                v-for="category in renderCategoryList"
                :key="category.id"
                :class="[
                    'function-item',
                    {
                        select: category.id === activeCategory.id
                    }
                ]"
                @click="chooseCategory(category)">
                <i class="bk-drag-icon bk-drag-grag-fill hover-show"></i>
                <i class="bk-drag-icon bk-drag-folder-fill"></i>
                <span
                    :class="[
                        'item-name',
                        {
                            'show-tool-name': category.showChange
                        }
                    ]"
                    :title="category.name"
                >{{ category.name }}</span>
                <bk-popconfirm
                    trigger="click"
                    confirm-text=""
                    cancel-text=""
                    class="item-tool-box edit-box"
                    :on-hide="() => category.showChange = false"
                >
                    <div slot="content">
                        <bk-input
                            placeholder="请输入函数分类"
                            :class="['add-api-category']"
                            :ref="category.id"
                            v-model="category.tempName"
                            v-bkloading="{ isLoading: isCreatingCategory }"
                            @enter="submitChangeCategory(category, $event)"
                        ></bk-input>
                    </div>
                    <span
                        :class="[
                            'item-tool',
                            'hover-show',
                            {
                                'click-show': category.showChange
                            }
                        ]"
                        @click="handleChangeCategory(category)"
                    >
                        <i class="bk-icon icon-edit2"></i>
                    </span>
                </bk-popconfirm>
                <bk-popover
                    class="item-tool-box del-box"
                    :disabled="getDeletePermission(category).hasPermission"
                    :content="getDeletePermission(category).message"
                >
                    <span
                        :class="['item-tool', 'hover-show', { 'click-show': category.showChange }]"
                        @click="handleDeleteCategory(category)">
                        <i :class="['bk-icon icon-close', { disable: !getDeletePermission(category).hasPermission }]"></i>
                    </span>
                </bk-popover>
                <span class="item-num">
                    {{ category.apiCount }}
                </span>
            </li>
            <bk-exception
                class="exception-wrap-item exception-part"
                type="empty"
                scene="part"
                v-if="renderCategoryList.length <= 0"
            >
                <div>暂无数据</div>
            </bk-exception>
        </vue-draggable>

        <bk-dialog v-model="delObj.show"
            render-directive="if"
            theme="primary"
            ext-cls="delete-dialog-wrapper"
            title="确定删除？"
            width="400"
            footer-position="center"
            :mask-close="false"
            :auto-close="false"
        >
            <p class="delete-content">{{ delObj.nameTips }}</p>
            <div class="dialog-footer" slot="footer">
                <bk-button
                    theme="danger"
                    :loading="delObj.loading"
                    @click="confirmDeleteCategory">删除</bk-button>
                <bk-button @click="delObj.show = false" :disabled="delObj.loading">取消</bk-button>
            </div>
        </bk-dialog>
    </section>
</template>

<script>
    import {
        mapGetters,
        mapActions
    } from 'vuex'

    export default {
        data () {
            return {
                searchCategoryString: '',
                newCategoryName: '',
                isCreatingCategory: false,
                isLoadingCategoryList: false,
                activeCategory: {},
                categoryList: [],
                renderCategoryList: [],
                delObj: {
                    id: '',
                    loading: false,
                    show: false
                }
            }
        },

        computed: {
            ...mapGetters(['user']),
            ...mapGetters('member', ['userPerm']),
            ...mapGetters('projectVersion', ['currentVersionId']),

            projectId () {
                return parseInt(this.$route.params.projectId)
            }
        },

        created () {
            this.initData()
        },

        methods: {
            ...mapActions('api', [
                'getCategoryList',
                'createCategory',
                'editCategory',
                'deleteCategory',
                'getApiList'
            ]),

            initData () {
                this.isLoadingCategoryList = true
                Promise.all([
                    this.getCategoryList({ projectId: this.projectId, versionId: this.currentVersionId }),
                    this.getCategoryList({ projectId: this.projectId, versionId: this.currentVersionId })
                ]).then(([categoryList, apiList]) => {
                    this.categoryList = categoryList.map((category) => {
                        const filterApiList = apiList.filter(fun => fun.funcCategoryId === category.id)
                        category.apiCount = filterApiList.length
                        return category
                    })
                    this.renderCategoryList = this.categoryList
                    this.chooseDefaultCategory()
                }).catch((err) => {
                    this.messageError(err.message || err)
                }).finally(() => {
                    this.isLoadingCategoryList = false
                })
            },

            chooseDefaultCategory () {
                // 选择当前选中项
                let defaultCategory = this.categoryList.find((category) => category.id === this.activeCategory.id)
                if (!defaultCategory) {
                    // 当前无选中项，选择第一个
                    defaultCategory = this.categoryList[0] || {}
                }
                this.chooseCategory(defaultCategory)
            },

            handerSearchCategory () {
                const searchReg = new RegExp(this.searchCategoryString?.trim(), 'i')
                this.renderCategoryList = this.categoryList.filter((category) => searchReg.test(category.CategoryName))
            },

            handleCategorySort () {
                this.categoryList.forEach((category, index) => {
                    category.order = index
                })
                this.editCategory({
                    projectId: this.projectId,
                    categorys: this.categoryList
                }).catch((err) => {
                    this.messageError(err.message || err)
                })
            },

            getDeletePermission (category) {
                if (this.userPerm.roleId === 2 && this.user.username !== category.createUser) {
                    return {
                        hasPermission: false,
                        message: '无删除权限'
                    }
                }

                if (category.apiCount > 0) {
                    return {
                        hasPermission: false,
                        message: '该分类下有Api，不能删除'
                    }
                }

                return {
                    hasPermission: true
                }
            },

            chooseCategory (category) {
                this.activeCategory = category
                this.$emit('categoryChange', category)
            },

            handleChangeCategory (category) {
                this.$set(category, 'tempName', category.CategoryName)
                this.$set(category, 'showChange', true)
                setTimeout(() => {
                    const el = this.$refs[category.id][0]
                    if (el) el.focus()
                }, 200)
            },

            submitChangeCategory (category, name) {
                this.checkCategoryName(name).then(() => {
                    this.isCreatingCategory = true
                    this.editCategory({
                        projectId: this.projectId,
                        categorys: [{
                            ...category,
                            name
                        }]
                    }).then(() => {
                        this.clickEmptyArea()
                        this.messageSuccess('修改成功')
                        this.initData()
                    }).finally(() => {
                        this.isCreatingCategory = false
                    })
                }).catch((err) => {
                    this.messageError(err.message || err)
                })
            },

            handleDeleteCategory (category) {
                if (!this.getDeletePermission(category).hasPermission) return

                this.delObj.show = true
                this.delObj.id = category.id
                this.delObj.nameTips = `删除分类（${category.name}）`
            },

            confirmDeleteCategory () {
                this.delObj.loading = true
                this.deleteCategory({
                    id: this.delObj.id
                }).then(() => {
                    this.messageSuccess('删除成功')
                    this.initData()
                    this.delObj.show = false
                }).finally(() => {
                    this.delObj.loading = false
                })
            },

            handleCreateCategory () {
                this.checkCategoryName(this.newCategoryName).then(() => {
                    this.isCreatingCategory = true
                    const postData = {
                        categoryName: this.newCategoryName,
                        projectId: this.projectId,
                        versionId: this.versionId
                    }
                    return this.createCategory(postData).then((res) => {
                        this.newCategoryName = ''
                        this.clickEmptyArea()
                        this.messageSuccess('添加成功')
                        this.initData()
                    }).finally(() => {
                        this.isCreatingCategory = false
                    })
                }).catch((err) => {
                    this.messageError(err.message || err)
                })
            },

            checkCategoryName (name = '') {
                return new Promise((resolve, reject) => {
                    const nameList = name.split('/')
                    const nameNum = {}
                    let hasRepeatName = false
                    nameList.forEach((name) => {
                        if (nameNum[name]) hasRepeatName = true
                        else nameNum[name] = 1
                    })
                    if (hasRepeatName) {
                        reject(new Error('不能创建相同名字的分类'))
                    } else if (nameList.some(x => x === '')) {
                        reject(new Error('分类名不能为空'))
                    } else if (this.categoryList.find(category => nameList.includes(category.CategoryName))) {
                        reject(new Error('分类名重复，请修改后重试'))
                    } else {
                        resolve()
                    }
                })
            },

            clickEmptyArea () {
                const btn = document.createElement('button')
                document.body.appendChild(btn)
                btn.click()
                document.body.removeChild(btn)
            }
        }
    }
</script>

<style lang="postcss" scoped>
    .category-list {
        height: 100%;
    }

    .function-item {
        height: 40px;
        display: flex;
        align-items: center;
        max-width: 100%;
        padding: 0 20px 0 14px;
        cursor: pointer;
        color: #63656e;
        position: relative;
        /deep/ &.sortable-ghost {
            border: 1px dashed #3a84ff;
            padding: 0 19px 0 13px;
            box-sizing: border-box;
        }
        .bk-drag-icon {
            color: #979ba5;
        }
        &.select {
            background: #e1ecff;
            color: #3a84ff;
            .item-num {
                background: #a2c5fd;
                color: #ffffff;
            }
            .bk-drag-folder-fill {
                color: #3a84ff;
            }
        }
        .disable {
            &.bk-icon {
                height: 32px;
                width: 32px;
                line-height: 32px;
                text-align: center;
                font-size: 20px;
                color: #cacdd6;
                cursor: not-allowed;
            }
        }
        .item-name {
            flex: 1;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            &.show-tool-name {
                padding-right: 75px;
            }
        }
        .item-tool-box {
            position: absolute;
            &.edit-box {
                right: 95px;
            }
            &.del-box {
                right: 55px;
            }
        }
        .item-tool {
            cursor: pointer;
            height: 32px;
            width: 32px;
            line-height: 32px;
            text-align: center;
            .bk-icon {
                font-size: 20px;
            }
            &:hover {
                border-radius: 100px;
                background: #fafbfd;
            }
        }
        .bk-drag-folder-fill {
            margin: 0 13px 0 4px;
        }
        .item-num {
            margin-left: 8px;
            height: 20px;
            border-radius: 2px;
            background: #f0f1f5;
            color: #979ba5;
            font-size: 12px;
            line-height: 20px;
            padding: 0 6px;
        }
        .hover-show {
            display: none;
        }
        .click-show {
            display: block;
        }
        &:hover {
            background: #e1ecff;
            color: #3a84ff;
            padding-left: 0;
            .bk-drag-folder-fill {
                color: #3a84ff;
            }
            .hover-show {
                display: block;
            }
            .item-num {
                background: #a2c5fd;
                color: #ffffff;
            }
            .item-name {
                padding-right: 75px;
            }
        }
    }

    .list-head {
        width: 100%;
        display: flex;
        align-items: center;
        font-weight: normal;
        margin: 0;
        padding: 16px 13px 15px 18px;
        .head-input {
            margin-right: 7px;
        }
        .icon-plus {
            cursor: pointer;
            font-size: 26px;
            &:hover {
                color: #3a84ff;
            }
        }
    }

    .category-list {
        height: calc(100% - 63px);
        overflow-y: auto;
        .exception-wrap-item {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
        }
    }

    .add-api-category {
        width: 340px;
        margin-top: 6px;
    }

    /deep/ .delete-dialog-wrapper {
        .delete-content {
            text-align: center;
            font-size: 14px;
            color: #63656e;
            margin: 0;
            word-break: break-all;
        }
        .bk-dialog-footer {
            text-align: center;
            padding: 0 65px 30px;
            background-color: #fff;
            border: none;
            border-radius: 0;
        }
        .dialog-footer {
            button {
                width: 86px;
                &:first-child {
                    margin-right: 10px;
                }
            }
        }
    }
</style>
