import {Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import enviroment from './enviroment';
import { JwtPayload } from 'jsonwebtoken';
import { TokenType } from "@/types/token.type";
import ClientService from '@/service/client.service';
import HelperService from '@/service/helper.service';

const jwtOptions = {
  secretOrKey: enviroment.jwt.secret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const jwtVerify = async (payload: JwtPayload, done: Function) => {
  try {
    const tokenType: TokenType = 'ACCESS_TOKEN'
    if (payload.type !== tokenType) throw new Error('Invalid token type');
    
    const userID = payload.sub!;

    let user = await ClientService.getClientByID(userID) || await HelperService.getHelperByID(userID);

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