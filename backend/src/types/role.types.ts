import { Role } from '../../generated/prisma/enums.js';

export type { Role };

export const RoleEnum = Role;

export const ROLE_VALUES = Object.values(RoleEnum) as [Role, ...Role[]];
