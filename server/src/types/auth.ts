import { Request } from 'express';

export interface AuthRequest extends Request {
  user?: {
    id: number;
    username: string;
    role: string;
    full_name: string;
    last_login: string | null;
  };
} 