export interface AuthRequest {
  username: string;
  password: string;
  tenantId: string;
  emailAddress?: string;
}