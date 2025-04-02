import { Request } from 'express';

export interface User {
  id: number;
  username: string;
  role: string;
  full_name?: string;
  last_login?: string | null;
}

export interface AuthRequest extends Request {
  user?: User;
} 