import { RoleValues } from "@/types/role.type";
import { SexValues } from "@/types/sex.type";

import bcrypt from "bcrypt";

import { Column, Entity, OneToMany } from "typeorm";
import Base from "./base.entity";
import Token from "./token.entity";

export interface IUser {
    name: string,
    email: string,
    password: string
    birthdate: Date,
    sex: string,
    role: string,
    image?: string,
    isEmailVerified: boolean
}

@Entity("users")
export default class User extends Base implements IUser {
    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column()
    birthdate: Date;

    @OneToMany(() => Token, token => token.user, { eager: true, cascade: true })
    tokens: Token[];

    @Column("enum", { enum: SexValues })
    sex: string;

    @Column("enum", { enum: RoleValues })
    role: string;

    @Column()
    image?: string;

    @Column()
    isEmailVerified: boolean;

    constructor(
        name: string,
        email: string,
        password: string,
        birthdate: Date,
        sex: string = "OTHER",
        role: string = "USER",
        image: string = "../assets/image/default-avatar.png"
    ) {
        super();
        this.name = name;
        this.email = email;
        this.password = password;
        this.birthdate = birthdate;
        this.sex = sex;
        this.role = role;
        this.image = image;
        this.isEmailVerified = false;
    }

    addToken = (token: Token): void => {
        if (!this.tokens)
            this.tokens = new Array<Token>();

        this.tokens.push(token);
    }

    comparePassword = async (password: string): Promise<boolean> => {
        return await bcrypt.compare(password, this.password)
    }

    hashPassword = async (password: string) => {
        this.password = await bcrypt.hash(password, 8);
    }

    updateUser = (user: Partial<Omit<IUser, "password">>) => {
        Object.assign(this, user);
    }

    verifyEmail = (): void => {
        this.isEmailVerified = true;
    }

    invalidate = (): void => {
        this.deletedAt = new Date();
    }

    toJSON = (): {
        id: string;
        name: string;
        email: string;
        birthdate: Date;
        sex: string;
        role: string;
        image: string | undefined;
    } => {
        const { id, name, email, birthdate, sex, role, image } = this;

        const user = {
            id,
            name,
            email,
            birthdate: new Date(birthdate),
            sex,
            role,
            image
        };

        return user;
    }
}