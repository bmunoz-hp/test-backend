import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../entities/role.entity';

export class UserResposeDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id!: string;

  @ApiProperty({ example: 'Juan Perez' })
  fullName!: string;

  @ApiProperty({ example: 'user@example.com' })
  email!: string;

  @ApiProperty({ example: 'true' })
  isActive!: boolean;

  @ApiProperty({ example: 'USER' })
  role?: Role;
}
