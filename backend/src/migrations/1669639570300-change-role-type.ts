import { MigrationInterface, QueryRunner } from 'typeorm';

export class changeRoleType1669639570300 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`boocrum\`.\`team_member\` CHANGE COLUMN \`role\` \`role\` TINYINT(1) NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`boocrum\`.\`workspace_member\` CHANGE COLUMN \`role\` \`role\` TINYINT(1) NOT NULL DEFAULT '0'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`boocrum\`.\`team_member\` CHANGE COLUMN \`role\` \`role\` INT NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE \`boocrum\`.\`workspace_member\` CHANGE COLUMN \`role\` \`role\` INT NOT NULL`,
    );
  }
}
