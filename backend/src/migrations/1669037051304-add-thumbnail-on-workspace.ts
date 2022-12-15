import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class addThumbnailOnWorkspace1669037051304 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'workspace',
      new TableColumn({
        name: 'thumbnail',
        type: 'varchar',
        length: '2083',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('workspace', 'thumbnail');
  }
}
