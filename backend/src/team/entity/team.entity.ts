import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Workspace } from 'src/workspace/entity/workspace.entity';
import { TeamMember } from './team-member.entity';
import { IsTeam } from '../enum/is-team.enum';

@Entity()
export class Team {
  constructor(name: string, isTeam: IsTeam, description?: string) {
    this.name = name;
    this.isTeam = isTeam;
    this.description = description;
  }

  @PrimaryGeneratedColumn('increment', { name: 'team_id', type: 'int' })
  teamId: number;

  @Column({ type: 'varchar', length: 50, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 1024, nullable: true })
  description: string;

  @Column({
    name: 'is_team',
    type: 'tinyint',
    default: IsTeam.TEAM,
    nullable: false,
  })
  isTeam: number;

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
