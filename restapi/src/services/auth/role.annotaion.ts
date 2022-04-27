import { SetMetadata } from "@nestjs/common"
import { Role } from "./role.enum"

export const ROLE_KEY = 'roles'
export const Roles = (...roles: Role[]) => SetMetadata(ROLE_KEY, roles);
// export const Roles = (admin: boolean) => SetMetadata('admin', admin);