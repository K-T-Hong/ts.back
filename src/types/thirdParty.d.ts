declare module "passport-kakao" {
  import { Strategy as PassportStrategy } from "passport";
  export class Strategy extends PassportStrategy {
    constructor(options: any, verify: (...args: any[]) => void);
  }
}
