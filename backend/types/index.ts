export type Role = 'employee' | 'supervisor' | 'admin';

export interface AuthUser {
  id: string;
  role: Role;
  email: string;
}

// Attach the authenticated user to Express's Request
declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

// Narrow unknown catch values to a message string
export const errorMessage = (err: unknown): string =>
  err instanceof Error ? err.message : 'Unknown error';
