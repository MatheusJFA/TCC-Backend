import { ChildEntity, Column, Entity, JoinTable, ManyToMany, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import Client from "./client.entity";

import { OccupationValues } from "@/types/occupation.type";
import User from "./user.entity";
import Certification from "./certification.entity";
import Token from "./token.entity";

export interface IHelper {
    id: string,
    occupation: string,
    certifications: Certification[],
    clients: Client[],
}


@Entity("helpers")
export default class Helper extends User implements IHelper {
    @Column("enum", { enum: OccupationValues })
    occupation: string;

    @OneToMany(() => Certification, certification => certification.helper, { eager: true, cascade: true })
    certifications: Certification[];

    @ManyToMany(() => Client, client => client.helpers, { eager: true, cascade: true })
    @JoinTable()
    clients: Client[];

    @OneToMany(() => Token, token => token.helper, { eager: true, cascade: true })
    tokens: Token[];

    constructor(
        name: string,
        email: string,
        password: string,
        birthdate: Date,
        sex: string,
        role: string,
        occupation: string,
        image?: string,
    ) {
        super(name, email, password, birthdate, sex, role, image);
        this.occupation = occupation;
    }

    addToken = (token: Token): void => {
        if (!this.tokens)
            this.tokens = new Array<Token>();

        this.tokens.push(token);
    }
    
    updateHelper = (helper: Partial<Omit<IHelper, "password">>) => {
        Object.assign(this, helper);
    }

    addClient = (user: Client): void => {
        if (!this.clients) this.clients = new Array<Client>();
        this.clients.push(user);
    }


    removeClient = (clientId: string): void => {
        if (!this.clients) this.clients = new Array<Client>();
        this.clients = this.clients.filter(client => client.id !== clientId);
    }

    getClients = (): { id: string }[] => {
        if (!this.clients)
            return [];
        else
            return this.clients.map(client => ({
                id: client.id,
            }));
    }

    addCertification = (certification: Certification): void => {
        if (!this.certifications) this.certifications = new Array<Certification>();
        this.certifications.push(new Certification(certification.title, certification.image, certification.date));
    }

    removeCertification = (certificationId: string): void => {
        if (!this.certifications) this.certifications = new Array<Certification>();
        this.certifications = this.certifications.filter(certification => certification.id !== certificationId);
    }

    toJSON = (): {
        id: string;
        name: string;
        email: string;
        birthdate: Date;
        occupation: string,
        certifications: string[];
        clients: string[];
        role: string;
        sex: string;
        image?: string;
    } => {
        const { id, name, email, birthdate, role, sex, image, certifications, clients, occupation } = this;

        const helper = {
            id: id,
            name: name,
            email: email,
            birthdate: new Date(birthdate),
            occupation,
            certifications: certifications?.map(certification => certification.title) || null,
            clients: clients?.map(client => client.name) || null,
            role: role,
            sex: sex,
            image: image,
        }

        return helper;
    }

}
