const path = require('path')
const { execSql } = require('../../util')

export class ${migrationName} {
    async up (queryRunner) {
        await execSql(queryRunner, path.resolve(__dirname, './sql/${fileName}.sql'))
    }

    async down () {}
}
