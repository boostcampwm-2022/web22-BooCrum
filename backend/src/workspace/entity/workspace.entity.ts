import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Team } from '../../team/entity/team.entity';
import { WorkspaceMember } from './workspace-member.entity';

@Entity()
export class Workspace {
  @PrimaryGeneratedColumn('uuid', { name: 'workspace_id' })
  workspaceId: string;

  @ManyToOne(() => Team, (team) => team.workspace, { nullable: false })
  @JoinColumn({ name: 'team_id' })
  team: Team;

  @Column({ type: 'varchar', length: 1024, nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  name: string;

  @Column({
    name: 'register_date',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP()',
    nullable: false,
  })
  registeDate: number;

  @Column({
    name: 'update_date',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP()',
    nullable: false,
  })
  updateDate: number;

  @OneToMany(() => WorkspaceMember, (workspaceMember) => workspaceMember.workspace)
  workspaceMember: WorkspaceMember[];
}
