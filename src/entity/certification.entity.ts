import { Column, Entity, JoinTable, ManyToOne } from "typeorm";
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
    @JoinTable()
    helper: Helper

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
}