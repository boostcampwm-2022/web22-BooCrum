import { MigrationInterface, QueryRunner } from 'typeorm';

export class addThumbnailOnWorkspace1669037051304 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `workspace` ADD `thumbnail` VARCHAR(2083)');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `workspace` DROP `thumbnail`');
  }
}
