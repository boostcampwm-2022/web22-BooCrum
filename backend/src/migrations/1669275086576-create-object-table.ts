import { MigrationInterface, QueryRunner } from 'typeorm';

export class createObjectTable1669275086576 implements MigrationInterface {
  name = 'createObjectTable1669275086576';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`workspace_object\` (\`object_id\` varchar(500) NOT NULL, \`type\` varchar(120) NOT NULL, \`x_pos\` int NOT NULL, \`y_pos\` int NOT NULL, \`width\` int NOT NULL, \`height\` int NOT NULL, \`color\` varchar(100) NOT NULL, \`text\` text NOT NULL, \`creator\` varchar(50) NOT NULL, \`workspace_id\` varchar(36) NULL, INDEX \`IDX_c272c6e835aa677e9e8bb1d3c1\` (\`workspace_id\`), PRIMARY KEY (\`object_id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`workspace_object\` ADD CONSTRAINT \`FK_c272c6e835aa677e9e8bb1d3c16\` FOREIGN KEY (\`workspace_id\`) REFERENCES \`workspace\`(\`workspace_id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`workspace_object\` DROP FOREIGN KEY \`FK_c272c6e835aa677e9e8bb1d3c16\``);
    await queryRunner.query(`DROP INDEX \`IDX_c272c6e835aa677e9e8bb1d3c1\` ON \`workspace_object\``);
    await queryRunner.query(`DROP TABLE \`workspace_object\``);
  }
}
