import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { TeamMember } from '../../team/entity/team-member.entity';
import { WorkspaceMember } from '../../workspace/entity/workspace-member.entity';

@Entity()
export class User {
  @PrimaryColumn({ name: 'user_id', type: 'varchar', length: 50 })
  userId: string;

  @Column({ name: 'nickname', type: 'varchar', length: 50, nullable: false })
  nickname: string;

  @Column({
    name: 'register_date',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP()',
    nullable: false,
  })
  registerDate: Date;

  @OneToMany(() => TeamMember, (tm) => tm.user)
  teamMember: TeamMember[];

  @OneToMany(() => WorkspaceMember, (wm) => wm.user)
  workspaceMember: WorkspaceMember[];
}
