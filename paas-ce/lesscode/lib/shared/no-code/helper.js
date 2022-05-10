import { normalizeJson } from '../data-source/helper'
/**
 * 把 nocode 数据源 json 转换为 lesscode 数据源 json
 * @param {[]Object} jsonData no code json
 * @returns lesscode json
 */
export const transformNCJson2LCJson = (ncJson) => {
    const typeMap = {
        STRING: 'varchar',
        TEXT: 'text',
        INT: 'int',
        DATE: 'date',
        DATETIME: 'datetime',
        LINK: 'varchar',
        SELECT: 'varchar',
        INPUTSELECT: 'varchar',
        MULTISELECT: 'varchar',
        CHECKBOX: 'varchar',
        RADIO: 'varchar',
        MEMBER: 'varchar',
        MEMBERS: 'varchar',
        RICHTEXT: 'text',
        FILE: 'json',
        TABLE: 'json',
        DESC: 'varchar'
    }

    return ncJson.reduce((acc, cur) => {
        if (cur.type !== 'DIVIDER') {
            const json = {
                name: cur.key,
                type: typeMap[cur.type],
                nullable: cur.validate_type !== 'REQUIRE',
                default: cur.default,
                comment: cur.desc,
                length: 255
            }
            acc.push(normalizeJson(json))
        }
        return acc
    }, [])
}
