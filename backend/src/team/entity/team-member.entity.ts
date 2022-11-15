import { Team } from 'src/team/entity/team.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../user/entity/user.entity';

@Entity({ name: 'team_member' })
export class TeamMember {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => User, (user) => user.teamMember)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Team, (team) => team.teamMember)
  @JoinColumn({ name: 'team_id' })
  team: Team;

  @Column()
  role: number;
}
