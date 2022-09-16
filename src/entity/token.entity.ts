import { TokenValues } from "@/types/token.type";
import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import Base from "./base.entity";
import Client from "./client.entity";
import Helper from "./helper.entity";
import User from "./user.entity";

export interface IToken {
    jwt: string,
    type: string,
    user: Client | Helper,
    expires: Date,
}

@Entity("tokens")
export default class Token extends Base implements IToken {
    @Column()
    jwt: string;

    @ManyToOne(() => Client || Helper, user => user.id )
    user: Client | Helper;

    @Column("enum", { enum: TokenValues })
    type: string;

    @Column()
    expires: Date;

    constructor(
        jwt: string,
        type: string,
        user: Client | Helper,
        expires: Date,
    ) {
        super();
        this.jwt = jwt;
        this.type = type;
        this.user = user;
        this.expires = expires;
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