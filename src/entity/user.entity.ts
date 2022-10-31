import { RoleValues } from "@/types/role.type";
import { SexValues } from "@/types/sex.type";

import bcrypt from "bcrypt";

import { Column, Entity, OneToMany, TableInheritance } from "typeorm";
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

export default abstract class User extends Base implements IUser {
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

    @Column()
    level: number;

    @Column()
    exp: number;

    constructor(
        name: string,
        email: string,
        password: string,
        birthdate: Date,
        sex: string = "MALE",
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
        this.level = 1;
        this.exp = 25;
    }

    DEFAULT = {
        max_level: 100,
        next: 64
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

    currentLevel = () => {
        return Math.floor((1 + Math.sqrt(1 + 8 * this.exp / this.DEFAULT.next)) / 2);
    }
    
    getExperienceToLevelUp = (level: number): number => {
        return Math.floor(((Math.pow(level, 2) - level) * this.DEFAULT.next) / 2);
    }

    parseByXP = () => {
        let level = this.level === this.DEFAULT.max_level ? this.DEFAULT.max_level : Math.floor(this.level);
        let forNextLevel = level === this.DEFAULT.max_level ? Infinity : this.getExperienceToLevelUp(level + 1)
        let toNextlevel = forNextLevel - this.exp;
        let currentLevelRequiredExperience = this.getExperienceToLevelUp(level);
        return {
            level: level,
            xp: this.exp,
            forNextLevel,
            toNextlevel,
            currentLevelRequiredExperience
        };
    };

    addExperience = (value: number) => {
        this.exp += value;
        this.level = this.currentLevel();
    }

    toJSON = (): {
        id: string;
        name: string;
        email: string;
        birthdate: Date;
        role: string;
        sex: string;
        image?: string;
    } => {

        const { id, name, email, birthdate, role, sex, image, exp, level } = this;

        const user = {
            id,
            name,
            email,
            birthdate: new Date(birthdate),
            role,
            sex,
            image,
            experience: {
                exp,
                level
            }
        }

        return user;
    }
}