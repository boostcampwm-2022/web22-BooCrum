import { TableColumnOptions } from 'typeorm';

export const OBJECT_DATABASE_NAME = 'boocrum-objects';
export const OBJECT_TABLE_COLUMN_LIST: TableColumnOptions[] = [
  {
    name: 'object_id',
    type: 'int',
    isPrimary: true,
    isGenerated: true,
    generationStrategy: 'increment',
  },
  {
    name: 'type',
    type: 'varchar',
    length: '120',
    isNullable: false,
  },
  {
    name: 'x_pos',
    type: 'int',
    isNullable: false,
  },
  {
    name: 'y_pos',
    type: 'int',
    isNullable: false,
  },
  {
    name: 'width',
    type: 'int',
    isNullable: false,
  },
  {
    name: 'height',
    type: 'int',
    isNullable: false,
  },
  {
    name: 'color',
    type: 'varchar',
    length: '100',
    isNullable: false,
  },
  {
    name: 'text',
    type: 'TEXT',
    isNullable: true,
  },
];
