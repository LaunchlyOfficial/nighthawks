import type { Request } from 'express';

export interface User {
    id: number;
    username: string;
    role: string;
}

export interface AuthRequest extends Request {
    user?: User;
} 