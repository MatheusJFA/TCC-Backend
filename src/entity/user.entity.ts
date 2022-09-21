import { Occupation, OccupationValues } from "@/types/occupation.type";
import { RoleValues } from "@/types/role.type";
import { SexValues } from "@/types/sex.type";

import bcrypt from "bcrypt";

import { Column, Entity, ManyToMany, OneToMany } from "typeorm";
import Base from "./base.entity";

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

export default class User extends Base implements IUser {
    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column()
    birthdate: Date;

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
        image: string = "../assets/image/default-avatar.png",
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

}