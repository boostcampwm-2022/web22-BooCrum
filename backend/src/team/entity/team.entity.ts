import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Workspace } from 'src/workspace/entity/workspace.entity';
import { TeamMember } from './team-member.entity';

@Entity()
export class Team {
  @PrimaryGeneratedColumn('increment', { name: 'team_id', type: 'int' })
  teamId: number;

  @Column({ type: 'varchar', length: 50, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 1024, nullable: true })
  description: string;

  @Column({ name: 'is_team', type: 'tinyint', default: 0, nullable: false })
  isTeam: boolean;

  @Column({
    name: 'register_date',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP()',
    nullable: false,
  })
  registerDate: number;

  @OneToMany(() => Workspace, (workspace) => workspace.team)
  workspace: Workspace[];

  @OneToMany(() => TeamMember, (teamMember) => teamMember.team)
  teamMember: TeamMember[];
}
