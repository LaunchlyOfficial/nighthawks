declare module 'express-sanitizer' {
    import { RequestHandler } from 'express';
    const sanitizer: () => RequestHandler;
    export default sanitizer;
}

declare module 'xss-clean' {
    import { RequestHandler } from 'express';
    const xssClean: () => RequestHandler;
    export default xssClean;
} 