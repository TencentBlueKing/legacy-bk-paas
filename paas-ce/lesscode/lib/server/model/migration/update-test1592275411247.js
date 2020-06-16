export class updateTest1592275411247 {

    async up(queryRunner) {
        await queryRunner.renameColumn('test', 'projectEnglish', 'projectEnglish2')
    }

    async down(queryRunner) {
        await queryRunner.query(`alter table test change projectEnglish2 projectEnglish varchar(255) DEFAULT 'test'`)
    }

}