export type JwtUser = { id: number };

declare global {
  namespace Express {
    interface User extends JwtUser {}
    interface Request {
      user?: JwtUser;
    }
  }
}
export {};
