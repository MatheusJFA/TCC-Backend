import { TokenValues } from "@/types/token.type";
import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import Base from "./base.entity";
import User from "./user.entity";

export interface IToken {
    jwt: string,
    type: string,
    expires: Date,
    user: User,
}

@Entity("tokens")
export default class Token extends Base implements IToken {
    @Column()
    jwt: string;

    @ManyToOne(() => User, user => user.tokens)
    user: User;

    @Column("enum", { enum: TokenValues })
    type: string;

    @Column()
    expires: Date;

    constructor(
        jwt: string,
        type: string,
        expires: Date,
        user: User,
    ) {
        super();
        this.jwt = jwt;
        this.type = type;
        this.expires = expires;
        this.user = user;
    }

    static setExpirationTime = (addedTime: number): Date => {
        const date = new Date();
        date.setTime(date.getTime() + addedTime);
        return date;
    }

    isExpired = (): boolean => {
        return this.expires.getTime() < Date.now();
    };


    toJSON = (): {} => {
        const { jwt: token, type, expires } = this;
        const jwt = { token, type, expires };

        return { jwt }
    }
}