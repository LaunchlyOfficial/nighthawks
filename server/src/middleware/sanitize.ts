import { sanitize } from 'express-sanitizer';
import xss from 'xss-clean';

export const sanitizeInput = [
  sanitize(),
  xss(),
]; 