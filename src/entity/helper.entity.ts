import { Column, Entity, JoinTable, ManyToMany, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import Client from "./client.entity";

import { OccupationValues } from "@/types/occupation.type";
import User from "./user.entity";
import Certification from "./certification.entity";


export interface IHelper {
    id: string,
    user: User,
    occupation: string,
    certifications: Certification[],
    clients: Client[],
}

@Entity("helpers")
export default class Helper implements IHelper {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @OneToOne(() => User, user => user.id)
    user: User;

    @Column("enum", { enum: OccupationValues })
    occupation: string;

    @OneToMany(() => Certification, certification => certification.helper, { eager: true, cascade: true })
    certifications: Certification[];

    @ManyToMany(() => Client, client => client.helpers, { eager: true, cascade: true })
    @JoinTable()
    clients: Client[];

    constructor(
        user: User,
        occupation: string) {
        this.user = user;
        this.occupation = occupation;
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
        this.clients = this.clients.filter(client => client.user.id !== clientId);
    }

    getClients = (): { id: string }[] => {
        if (!this.clients)
            return [];
        else
            return this.clients.map(client => ({
                id: client.user.id,
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
        const { user, certifications, clients, occupation } = this;

        const helper = {
            id: user.id,
            name: user.name,
            email: user.email,
            birthdate: new Date(user.birthdate),
            occupation,
            certifications: certifications?.map(certification => certification.title) || null,
            clients: clients?.map(client => client.user.name) || null,
            role: user.role,
            sex: user.sex,
            image: user.image,
        }

        return helper;
    }

}
