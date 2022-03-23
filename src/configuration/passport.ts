import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { t } from "i18next";
import { TokenType } from "../enums/token";
import User  from "../entity/user";
import { getRepository } from "typeorm";
import { JwtPayload } from "jsonwebtoken";

const jwtOptions = {
  secretOrKey: process.env.JWT_SECRET,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const jwtVerify = async (payload: JwtPayload, done: any) => {
  try {
    if (payload.type !== TokenType.ACCESS_TOKEN) 
      throw new Error(t("MSG_E005"));
    
    const repository = getRepository(User);

    const user = await repository.findOne({ 
      where: {id: payload.sub}
    });
    
    if (!user) {
      return done(null, false);
    }
    done(null, user);
  } catch (error) {
    done(error, false);
  }
};

const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);

export default jwtStrategy;
