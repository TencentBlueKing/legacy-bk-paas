import { getRepository, In } from 'typeorm'
import ReleaseVersion from '../model/entities/release-version'

const getVersionReleaseEnv = async (versions = []) => {
    const list = await getRepository(ReleaseVersion)
        .createQueryBuilder()
        .select(['version', 'env'])
        .where({ version: In(versions), status: 'successful' })
        .groupBy('version')
        .addGroupBy('env')
        .getRawMany()
    return list
}

export default {
    getVersionReleaseEnv
}
