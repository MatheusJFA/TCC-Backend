import { Column, Entity, JoinTable, ManyToMany, OneToMany } from "typeorm";
import Client from "./client.entity";

import { OccupationValues } from "@/types/occupation.type";
import User, { IUser } from "./user.entity";
import Certification from "./certification.entity";
import Token from "./token.entity";


export interface IHelper extends IUser {
    occupation: string,
    certifications: Certification[],
    clients: Client[],
}

@Entity("helpers")
export default class Helper extends User implements IHelper {
    @OneToMany(() => Token, token => token.helper, { eager: true, cascade: true })
    tokens: Token[];

    @Column("enum", { enum: OccupationValues })
    occupation: string;

    @OneToMany(() => Certification, certification => certification.helper)
    certifications: Certification[];

    @ManyToMany(() => Client, user => user.helpers)
    @JoinTable()
    clients: Client[];

    constructor(
        name: string,
        email: string,
        password: string,
        birthdate: Date,
        role: string,
        occupation: string,
        sex: string,
        image?: string) {
        super(name, email, password, birthdate, sex, role, image);
        this.occupation = occupation;
    }

    updateHelper = (helper: Partial<Omit<IHelper, "password">>) => {
        Object.assign(this, helper);
    }

    addToken = (token: Token): void => {
        if (!this.tokens)
            this.tokens = new Array<Token>();

        this.tokens.push(token);
    }

    addClient = (user: Client): void => {
        if (!this.clients)
            this.clients = new Array<Client>();

        this.clients.push(user);
    }

    getClients = (): {
        name: string, 
        email: string, 
        birthdate: Date, 
        sex: string,
        image: string | undefined
    }[] => {
        if (!this.clients)
            return [];
        else
            return this.clients.map(client => ({
                name: client.name,
                email: client.email,
                birthdate: client.birthdate,
                sex: client.sex,
                image: client.image,
            }));
    }

    addCertification = (title: string, image: string, date: Date): void => {
        if (!this.certifications)
            this.certifications = new Array<Certification>();

        this.certifications.push(new Certification(title, image, date));
    }

    toJSON = (): {
        name: string;
        email: string;
        birthdate: Date;
        role: string;
        occupation: string;
        sex: string;
        certifications: string[];
        clients: string[];
        image?: string;
    } => {
        const {
            id,
            name,
            email,
            birthdate,
            role,
            occupation,
            sex,
            certifications,
            clients,
            image } = this;

        const helper = {
            id,
            name,
            email,
            birthdate: new Date(birthdate),
            role,
            occupation,
            sex,
            certifications: certifications?.map(certification => certification.title) || null,
            clients: clients?.map(client => client.name) || null,
            image,
        }

        return helper;
    }

}
