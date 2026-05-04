import { Request } from 'express';
import { JwtPayload } from '../auth/jwt.strategy';

export type GraphQLContext = {
  req: Request & {
    user: JwtPayload;
  };
};
