export interface Roles {
  id: string;
  name: string;
  status: boolean;
  createAt: string;
}

export interface RolesDto {
  name: string;
}

export interface FilterOptionsRoles {
  name?: string;
  status?: string;
}