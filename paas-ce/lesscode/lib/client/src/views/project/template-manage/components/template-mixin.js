import { parseFuncAndVar } from '@/common/parse-function-var'
import { mapActions } from 'vuex'
import LC from '@/element-materials/core'

export default {
    methods: {
        ...mapActions('pageTemplate', ['getProjectFuncAndVar']),

        async getVarAndFuncList (template) {
            try {
                const { variableList, funcGroups } = await this.getProjectFuncAndVar({ projectId: template.belongProjectId, versionId: template.versionId, pageCode: template.fromPageCode })
                const templateNode = LC.parseTemplate(JSON.parse(template.content || {}))
                const result = parseFuncAndVar(templateNode, variableList, funcGroups)
                return result
            } catch (err) {
                this.$bkMessage({
                    theme: 'error',
                    message: '模板中引用的函数或变量已被删除'
                })
            }
        }
    }
}
