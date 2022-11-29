import { WORKSPACE_ROLE } from '../../util/constant/role.constant';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../user/entity/user.entity';
import { Workspace } from './workspace.entity';

@Entity({ name: 'workspace_member' })
export class WorkspaceMember {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => User, (user) => user.teamMember)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Workspace, (workspace) => workspace.workspaceMember)
  @JoinColumn({ name: 'workspace_id' })
  workspace: Workspace;

  @Column({ type: 'tinyint', default: WORKSPACE_ROLE.VIEWER })
  role: number;

  @Column({
    name: 'update_date',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP()',
    nullable: false,
  })
  updateDate: number;
}
