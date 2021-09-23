import { getRepository } from 'typeorm'
const fs = require('fs')
const path = require('path')

// get all entity
const entityMap = {}
const files = fs.readdirSync(path.resolve(__dirname, '../model/entities')).filter(name => name !== 'base.js')
files.forEach((name) => {
    const entityName = name.replace(/\..+/, '')
    import(`../model/entities/${entityName}`).then(({ default: module }) => {
        entityMap[entityName] = module
    })
})

export default {
    get (tableName) {
        const entity = entityMap[tableName]
        const repository = getRepository(entity)
        return repository.find({ deleteFlag: 0 }) || []
    },

    add (tableName, data) {
        const entity = entityMap[tableName]
        const repository = getRepository(entity)
        const newData = repository.create(data)
        return repository.save(newData)
    },

    async update (tableName, data) {
        const entity = entityMap[tableName]
        const repository = getRepository(entity)
        const editData = await repository.findOne({ where: { id: data.id } })
        Object.assign(editData, data)
        return repository.save(editData)
    },

    async delete (tableName, id) {
        const entity = entityMap[tableName]
        const repository = getRepository(entity)
        const deleteData = await repository.findOne({ where: { id } })
        deleteData.deleteFlag = 1
        return repository.save(deleteData)
    }
}
