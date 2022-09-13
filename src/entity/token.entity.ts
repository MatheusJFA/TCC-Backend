import { TokenValues } from "@/types/token.type";
import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import Base from "./base.entity";
import User from "./user.entity";

export interface IToken {
    jwt: string,
    type: string,
    user: User,
    expires: Date,
}

@Entity("tokens")
export default class Token extends Base implements IToken {
    @Column()
    jwt: string;

    @ManyToOne(() => User, user => user.id)
    user: User;

    @Column("enum", { enum: TokenValues })
    type: string;

    @Column()
    expires: Date;

    constructor(
        jwt: string,
        type: string,
        user: User,
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

    invalidate = (): void => {
        this.deletedAt = new Date();
    };

    toJSON = (): {} => {
        const { jwt: token, type, expires } = this;
        const jwt = { token, type, expires };

        return { jwt }
    }
}