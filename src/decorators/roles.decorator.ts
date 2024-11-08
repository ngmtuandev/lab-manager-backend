import { SetMetadata } from '@nestjs/common';
import { ROLE_CODE } from 'src/enum/ERole';

export const Roles = (...roles: ROLE_CODE[]) => SetMetadata('roles', roles);
