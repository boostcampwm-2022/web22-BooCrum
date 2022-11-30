import { MigrationInterface, QueryRunner } from 'typeorm';

export class changeObjectColumnsScale1669751169830 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // INT -> DOUBLE
    queryRunner.query(`ALTER TABLE \`workspace_object\` CHANGE COLUMN \`width\` \`width\` DOUBLE NOT NULL`);
    queryRunner.query(`ALTER TABLE \`workspace_object\` CHANGE COLUMN \`height\` \`height\` DOUBLE NOT NULL`);
    queryRunner.query(`ALTER TABLE \`workspace_object\` CHANGE COLUMN \`left\` \`left\` DOUBLE NOT NULL`);
    queryRunner.query(`ALTER TABLE \`workspace_object\` CHANGE COLUMN \`top\` \`top\` DOUBLE NOT NULL`);
    // Add Scale Columns
    queryRunner.query(`ALTER TABLE \`boocrum\`.\`workspace_object\` ADD COLUMN \`scale_x\` DOUBLE NOT NULL`);
    queryRunner.query(`ALTER TABLE \`boocrum\`.\`workspace_object\` ADD COLUMN \`scale_y\` DOUBLE NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // DOUBLE -> INT
    queryRunner.query(`ALTER TABLE \`workspace_object\` CHANGE COLUMN \`width\` \`width\` INT NOT NULL`);
    queryRunner.query(`ALTER TABLE \`workspace_object\` CHANGE COLUMN \`height\` \`height\` INT NOT NULL`);
    queryRunner.query(`ALTER TABLE \`workspace_object\` CHANGE COLUMN \`left\` \`left\` INT NOT NULL`);
    queryRunner.query(`ALTER TABLE \`workspace_object\` CHANGE COLUMN \`top\` \`top\` INT NOT NULL`);
    // Delete Scale Columns
    queryRunner.query(`ALTER TABLE \`workspace_object\` DROP COLUMN \`scale_x\``);
    queryRunner.query(`ALTER TABLE \`workspace_object\` DROP COLUMN \`scale_y\``);
  }
}
