import { IsString, IsNumber, Max, Min } from 'class-validator';
import { WORKSPACE_ROLE } from 'src/util/constant/role.constant';

export class ChangeUserRoleDTO {
  @IsString()
  userId: string;

  @Min(WORKSPACE_ROLE.VIEWER)
  @Max(WORKSPACE_ROLE.OWNER)
  @IsNumber()
  role: number;
}
