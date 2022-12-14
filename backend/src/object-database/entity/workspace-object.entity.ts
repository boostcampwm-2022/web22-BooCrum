import { Workspace } from '../../workspace/entity/workspace.entity';
import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, Index, Double } from 'typeorm';

@Entity({
  name: 'workspace_object',
})
export class WorkspaceObject {
  @PrimaryColumn({
    name: 'object_id',
    type: 'varchar',
    length: 500,
  })
  objectId: string;

  @Column({
    type: 'varchar',
    length: '120',
    nullable: false,
  })
  type: ObjectType;

  @Column({
    name: 'left',
    type: 'double',
    nullable: false,
  })
  left: number;

  @Column({
    name: 'top',
    type: 'double',
    nullable: false,
  })
  top: number;

  @Column({
    type: 'double',
    nullable: false,
  })
  width: number;

  @Column({
    type: 'double',
    nullable: false,
  })
  height: number;

  @Column({
    name: 'scale_x',
    type: 'double',
    nullable: false,
  })
  scaleX: number;

  @Column({
    name: 'scale_y',
    type: 'double',
    nullable: false,
  })
  scaleY: number;

  @Column({
    type: 'varchar',
    length: '100',
    nullable: false,
  })
  color: string;

  @Column({
    type: 'text',
  })
  text: string;

  @Column({
    name: 'font_size',
    type: 'int',
    nullable: false,
  })
  fontSize: number;

  // 어차피 여기에 저장되는 데이터들은 유저와 Join할 용도는 아님.
  // 굳이 제약 조건을 달자고 Foreign Key로 두는 건 좀...?
  @Column({
    type: 'varchar',
    length: '50',
    nullable: false,
  })
  creator: string;

  @Index()
  @ManyToOne(() => Workspace, (ws) => ws.workspaceObjects, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'workspace_id' })
  workspace: Workspace;
}
