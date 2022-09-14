import { Occupation, OccupationValues } from "@/types/occupation.type";
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
    height: number,
    weight: number,
    role: string,
    occupation: string,
    certification?: string,
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

    @Column("enum", { enum: OccupationValues })
    occupation: string;

    @Column()
    certification?: string;

    @Column("decimal")
    height: number;

    @Column("decimal")
    weight: number;

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
        height: number,
        weight: number,
        role: string = "USER",
        occupation: string = "USER",
        image: string = "../assets/image/default-avatar.png",
        certification: string | undefined = undefined
    ) {
        super();
        this.name = name;
        this.email = email;
        this.password = password;
        this.birthdate = birthdate;
        this.sex = sex;
        this.height = height;
        this.weight = weight;
        this.role = role;
        this.occupation = occupation;
        if (this.occupation === Occupation.USER) this.certification = "";
        else this.certification = certification!;
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
        height: number,
        weight: number,
        occupation: string,
        certification: string | undefined,
        role: string;
        image: string | undefined;
    } => {
        const { id, name, email, birthdate, sex, height, weight, role, occupation, certification, image } = this;

        const user = {
            id,
            name,
            email,
            birthdate: new Date(birthdate),
            sex,
            height,
            weight,
            role,
            occupation,
            certification: certification || undefined,
            image
        };

        return user;
    }
}