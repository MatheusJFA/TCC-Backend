import { Column, Entity, ManyToMany, OneToMany } from "typeorm";
import Helper from "./helper.entity";
import Token from "./token.entity";
import User, { IUser } from "./user.entity";

export interface IClient extends IUser{
    height: number,
    weight: number,
}

@Entity("clients")
export default class Client extends User implements IClient {
    @ManyToMany(() => Helper, helper => helper.clients)
    helpers: Helper[];
    
    @OneToMany(() => Token, token => token.user, { eager: true, cascade: true })
    tokens: Token[];

    @Column("decimal")
    height: number;

    @Column("decimal")
    weight: number;

    constructor(
        name: string,
        email: string,
        password: string,
        birthdate: Date,
        sex: string = "OTHER",
        height: number,
        weight: number,
        role: string = "USER",
        image: string = "../assets/image/default-avatar.png",
    ) {
        super(name, email, password, birthdate, sex, role, image);
        this.height = height;
        this.weight = weight;
    }
    
    addToken = (token: Token): void => {
        if (!this.tokens)
            this.tokens = new Array<Token>();

        this.tokens.push(token);
    }

    addHelper = (helper: Helper): void => {
        if(!this.helpers) {
            this.helpers = new Array<Helper>();
        }

        this.helpers.push(helper);
    }

    updateClient = (client: Partial<Omit<IClient, "password">>) => {
        Object.assign(this, client);
    }

    toJSON = (): {
        id: string;
        name: string;
        email: string;
        birthdate: Date;
        sex: string;
        height: number,
        weight: number,
        role: string;
        image: string | undefined;
    } => {
        const { id, name, email, birthdate, sex, height, weight, role, image } = this;

        const user = {
            id,
            name,
            email,
            birthdate: new Date(birthdate),
            sex,
            height,
            weight,
            role,
            image
        };

        return user;
    }
}