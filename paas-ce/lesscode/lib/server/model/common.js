import { IsNull } from 'typeorm'

module.exports = {
    whereVersion: (versionId, alias = 't') => Number(versionId) ? `${alias}.versionId = ${versionId}` : `${alias}.versionId IS NULL`,
    whereVersionLiteral: (versionId) => Number(versionId) || IsNull()
}
