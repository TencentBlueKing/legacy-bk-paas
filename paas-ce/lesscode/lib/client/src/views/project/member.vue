<template>
    <section>
        <div class="member-container">
            <div class="member-head">
                <bk-button theme="primary">添加</bk-button>
            </div>
            <div class="member-content">
                <bk-table :data="list" type="small" ext-cls="member-table">
                    <bk-table-column label="姓名" prop="userName"></bk-table-column>
                    <bk-table-column label="角色" prop="roleId" :formatter="showViewType"></bk-table-column>
                    <bk-table-column label="添加人" prop="createUser"></bk-table-column>
                    <bk-table-column label="添加时间" prop="createTime"></bk-table-column>
                    <bk-table-column label="操作" width="150">
                        <template slot-scope="props">
                            <bk-button theme="primary" text :disabled="false" @click="editView(props.row)">编辑</bk-button>
                            <bk-button theme="primary" text :disabled="false" @click="deleteView(props.row)">删除</bk-button>
                        </template>
                    </bk-table-column>
                </bk-table>
            </div>
        </div>
    </section>
</template>

<script>
    export default {
        data () {
            return {
                list: [
                    {
                        'id': '',
                        'userName': 'admin',
                        'roleId': '1',
                        'createUser': 'admin',
                        'createTime': '2020-07-14 13:14:00'
                    }
                ]
            }
        }
    }
</script>

<style lang="postcss">
    .member-container {
        margin: 16px 24px;
        
        .member-content {
            margin-top: 14px;
            min-width: 1000px;

            .member-table {
                th {
                    background-color: #F0F1F5;
                }
            }
        }
    }
</style>
