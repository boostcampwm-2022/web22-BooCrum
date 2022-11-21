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
  registerDate: number;

  @Column({
    name: 'update_date',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP()',
    nullable: false,
  })
  updateDate: number;

  @Column({
    name: 'thumbnail',
    type: 'varchar',
    length: 2083, // 참고: http://daplus.net/sql-url%EC%97%90-%EA%B0%80%EC%9E%A5-%EC%A0%81%ED%95%A9%ED%95%9C-%EB%8D%B0%EC%9D%B4%ED%84%B0%EB%B2%A0%EC%9D%B4%EC%8A%A4-%ED%95%84%EB%93%9C-%EC%9C%A0%ED%98%95/
    nullable: true,
  })
  thumbnailUrl: string;

  @OneToMany(() => WorkspaceMember, (workspaceMember) => workspaceMember.workspace)
  workspaceMember: WorkspaceMember[];
}
