import { Column, Entity, JoinTable, ManyToMany, OneToMany, OneToOne, PrimaryColumn } from "typeorm";
import Client from "./client.entity";

import { OccupationValues } from "@/types/occupation.type";
import User, { IUser } from "./user.entity";
import Certification from "./certification.entity";


export interface IHelper {
    user: User,
    occupation: string,
    certifications: Certification[],
    clients: Client[],
}

@Entity("helpers")
export default class Helper implements IHelper {
    @PrimaryColumn()
    @OneToOne(() => User, user => user.id)
    user: User;

    @Column("enum", { enum: OccupationValues })
    occupation: string;

    @OneToMany(() => Certification, certification => certification.helper)
    certifications: Certification[];

    @ManyToMany(() => Client, user => user.helpers)
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
        if (!this.clients)
            this.clients = new Array<Client>();

        this.clients.push(user);
    }


    removeClient = (clientId: string): void => {
        if (!this.clients) this.clients = new Array<Client>();

        this.clients = this.clients.filter(client => client.userId !== clientId);
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
}
