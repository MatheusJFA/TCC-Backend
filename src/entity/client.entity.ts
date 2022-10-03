import { Column, Entity, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import Helper from "./helper.entity";
import User from "./user.entity";

export interface IClient {
    id: string,
    user: User,
    height: number,
    weight: number,
}

@Entity("clients")
export default class Client implements IClient {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @OneToOne(() => User, user => user.id)
    user: User;

    @ManyToMany(() => Helper, helper => helper.clients)
    helpers: Helper[];

    @Column("decimal")
    height: number;

    @Column("decimal")
    weight: number;

    constructor(
        user: User,
        height: number,
        weight: number,
    ) {
        this.user = user;
        this.height = height;
        this.weight = weight;
    }

    addHelper = (helper: Helper): void => {
        if (!this.helpers) this.helpers = new Array<Helper>();
        this.helpers.push(helper);
    }

    removeHelper = (helper: Helper): void => {
        if (!this.helpers) this.helpers = new Array<Helper>();
        this.helpers = this.helpers.filter(h => h.user.id !== helper.user.id);
    }


    updateClient = (client: Partial<Omit<IClient, "password">>) => {
        Object.assign(this, client);
    }

    toJSON = (): {
        id: string;
        name: string;
        email: string;
        birthdate: Date;
        height: number;
        weight: number;
        role: string;
        sex: string;
        image?: string;
    } => {
        const { user, weight, height } = this;

        const client = {
            id: user.id,
            name: user.name,
            email: user.email,
            birthdate: new Date(user.birthdate),
            height,
            weight,
            role: user.role,
            sex: user.sex,
            image: user.image,
        }

        return client;
    }
}