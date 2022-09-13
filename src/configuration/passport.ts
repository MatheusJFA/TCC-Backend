import {Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import enviroment from './enviroment';
import { JwtPayload } from 'jsonwebtoken';
import userService from '@service/user.service';
import { TokenType } from "@/types/token.type";

const jwtOptions = {
  secretOrKey: enviroment.jwt.secret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const jwtVerify = async (payload: JwtPayload, done: Function) => {
  try {
    const tokenType: TokenType = 'ACCESS_TOKEN'
    if (payload.type !== tokenType) throw new Error('Invalid token type');
    
    const userID = payload.sub!;

    const user = await userService.getUserByID(userID);
    if (!user) {
      return done(null, false);
    }
    done(null, user);
  } catch (error) {
    done(error, false);
  }
};

const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);

export default jwtStrategy