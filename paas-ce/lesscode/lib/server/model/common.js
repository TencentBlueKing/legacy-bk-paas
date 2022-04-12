import { IsNull } from 'typeorm'

module.exports = {
    whereVersion: (versionId, alias = 't', field = 'versionId') => Number(versionId) ? `${alias}.${field} = ${versionId}` : `${alias}.${field} IS NULL`,
    whereVersionLiteral: (versionId) => Number(versionId) || IsNull()
}
