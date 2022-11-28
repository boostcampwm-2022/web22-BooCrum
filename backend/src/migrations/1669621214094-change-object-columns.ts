import { MigrationInterface, QueryRunner } from 'typeorm';

export class changeObjectColumns1669621214094 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`workspace_object\` CHANGE \`x_pos\` \`left\` int;`);
    await queryRunner.query(`ALTER TABLE \`workspace_object\` CHANGE \`y_pos\` \`top\` int;`);
    await queryRunner.query(`ALTER TABLE \`workspace_object\` ADD \`font_size\` int NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`workspace_object\` CHANGE \`left\` \`x_pos\` int;`);
    await queryRunner.query(`ALTER TABLE \`workspace_object\` CHANGE \`top\` \`y_pos\` int;`);
    await queryRunner.query(`ALTER TABLE \`workspace_object\` DROP COLUMN \`font_size\``);
  }
}
