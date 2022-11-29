import { MigrationInterface, QueryRunner } from 'typeorm';

export class changeObjectScaleColumns1669747010535 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`workspace_object\` CHANGE COLUMN \`width\` \`scale_x\` DOUBLE NOT NULL`);
    await queryRunner.query(`ALTER TABLE \`workspace_object\` CHANGE COLUMN \`height\` \`scale_y\` DOUBLE NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`workspace_object\` CHANGE COLUMN \`width\` \`scale_x\` DOUBLE NOT NULL`);
    await queryRunner.query(`ALTER TABLE \`workspace_object\` CHANGE COLUMN \`height\` \`scale_y\` DOUBLE NOT NULL`);
  }
}
