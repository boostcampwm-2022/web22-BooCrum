import { Team } from 'src/team/entity/team.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../user/entity/user.entity';
import { Role } from '../enum/role.enum';

@Entity({ name: 'team_member' })
export class TeamMember {
  constructor(user: User, team: Team, role: Role) {
    this.user = user;
    this.team = team;
    this.role = role;
  }

  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => User, (user) => user.teamMember, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Team, (team) => team.teamMember, { nullable: false })
  @JoinColumn({ name: 'team_id' })
  team: Team;

  @Column({ type: 'int', default: Role.MEMBER })
  role: number;
}
