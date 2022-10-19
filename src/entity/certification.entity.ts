import { Column, Entity, ManyToOne } from "typeorm";
import Base from "./base.entity";
import Helper from "./helper.entity";

export interface ICertification {
    image: string,
    date: Date,
    title: string
}

@Entity("certifications")
export default class Certification extends Base implements ICertification {
    @ManyToOne(() => Helper, helper => helper.certifications)
    helper: Helper;

    @Column()
    image: string;
    
    @Column()
    date: Date;
    
    @Column()
    title: string;

    constructor(title: string, image: string, date: Date) {
        super();
        this.title = title;
        this.image = image;
        this.date = date;
    }

    updateCertification(title: string, image: string, date: Date) {
        this.title = title;
        this.image = image;
        this.date = date;
    }
}