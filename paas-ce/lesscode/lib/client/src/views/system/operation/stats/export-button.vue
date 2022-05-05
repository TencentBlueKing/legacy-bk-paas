<template>
    <bk-button :disabled="!list.length" @click="handleExport">导出</bk-button>
</template>

<script>
    import xlsx from 'node-xlsx'
    import { downloadFile } from '@/common/util'

    export default {
        props: {
            name: {
                type: String,
                default: ''
            },
            sheetName: {
                type: String,
                default: ''
            },
            dim: {
                type: String,
                default: 'table'
            },
            list: {
                type: Array,
                default: () => ([])
            },
            fields: {
                type: Array,
                default: () => ([])
            }
        },
        computed: {
            tableSheetName () {
                const nameMap = {
                    user: '按用户',
                    project: '按应用',
                    func: '按函数',
                    comp: '按自定义组件'
                }
                return this.sheetName || nameMap[this.name] || 'Sheet1'
            }
        },
        methods: {
            handleExport () {
                // 自定义的导出方法
                const exportFunc = `handle${this.fistLetterUpper(this.name)}${this.fistLetterUpper(this.dim)}}Export`
                if (this[exportFunc] && typeof this[exportFunc] === 'function') {
                    return this[exportFunc]()
                }

                // 没有自定义导出方法，则根据不同类型使用通用的方法
                if (this.dim === 'table') {
                    return this.handleCommonTableExport()
                }

                if (this.dim === 'time') {
                    return this.handleCommonTimeDimExport()
                }
            },
            handleCommonTableExport () {
                const header = this.fields.map(item => item.name)
                const keys = this.fields.map(item => item.id)

                const body = []
                this.list.forEach(row => {
                    const sub = []
                    keys.forEach(key => {
                        for (const [rowKey, value] of Object.entries(row)) {
                            if (key === rowKey) {
                                sub.push(value)
                            }
                        }
                    })
                    body.push(sub)
                })

                const data = [header, ...body]

                const buffer = xlsx.build([{ name: this.tableSheetName, data }]) // Returns a buffer
                downloadFile(buffer, `lesscode-stats-${this.name}.xlsx`)
            },
            handleCommonTimeDimExport () {
                const blocks = []
                const max = this.list.length
                this.list.forEach((block, index) => {
                    const { title, data, fields = this.fields } = block
                    const header = fields.map(item => item.name)
                    const keys = fields.map(item => item.id)

                    const body = []
                    data.forEach(row => {
                        const sub = []
                        keys.forEach(key => {
                            sub.push(row[key])
                        })
                        body.push(sub)
                    })
                    blocks.push([title], header, ...body)

                    // 加一个空行分隔多个数据块
                    if (max > 1 && index < max - 1) {
                        blocks.push([])
                    }
                })

                const buffer = xlsx.build([{ name: '按时间', data: blocks }])
                downloadFile(buffer, `lesscode-stats-${this.name}-${this.dim}.xlsx`)
            },
            fistLetterUpper (str) {
                return str.charAt(0).toUpperCase() + str.slice(1)
            }
        }
    }
</script>
