import { Column, Entity, ManyToMany, OneToMany, OneToOne, PrimaryColumn } from "typeorm";
import Helper from "./helper.entity";
import Token from "./token.entity";
import User, { IUser } from "./user.entity";

export interface IClient {
    user: User,
    height: number,
    weight: number,
}

@Entity("clients")
export default class Client implements IClient {
    @PrimaryColumn()
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
}