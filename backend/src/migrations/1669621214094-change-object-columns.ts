import { MigrationInterface, QueryRunner } from 'typeorm';

export class changeObjectColumns1669621214094 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`workspace_object\` RENAME COLUMN \`x_pos\` TO \`left\`;`);
    await queryRunner.query(`ALTER TABLE \`workspace_object\` RENAME COLUMN \`y_pos\` TO \`top\`;`);
    await queryRunner.query(`ALTER TABLE \`workspace_object\` ADD \`font_size\` int NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`workspace_object\` RENAME COLUMN \`left\` TO \`x_pos\`;`);
    await queryRunner.query(`ALTER TABLE \`workspace_object\` RENAME COLUMN \`top\` TO \`y_pos\`;`);
    await queryRunner.query(`ALTER TABLE \`workspace_object\` DROP COLUMN \`font_size\``);
  }
}
