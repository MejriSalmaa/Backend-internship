/* eslint-disable prettier/prettier */

import { SetMetadata } from '@nestjs/common';
import { Role } from './role.enum'; // Adjust the import path as needed

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
