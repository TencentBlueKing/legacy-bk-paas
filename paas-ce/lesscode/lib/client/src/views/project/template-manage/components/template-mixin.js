import { parseFuncAndVar } from '@/common/parse-function-var'
import { mapActions } from 'vuex'
import LC from '@/element-materials/core'

export default {
    methods: {
        ...mapActions('pageTemplate', ['getProjectFuncAndVar']),

        async getVarAndFuncList (template) {
            const { variableList, funcGroups } = await this.getProjectFuncAndVar({ projectId: template.belongProjectId, versionId: template.versionId, pageCode: template.fromPageCode })
            const templateNode = LC.parseTemplate(JSON.parse(template.content || {}))
            const result = parseFuncAndVar(templateNode, variableList, funcGroups)
            return result
        }
    }
}
