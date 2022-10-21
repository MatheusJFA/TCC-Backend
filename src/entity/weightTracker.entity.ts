import { Column, Entity, ManyToOne } from "typeorm";
import Base from "./base.entity";
import Client from "./client.entity";

@Entity("weight_tracker")
export default class WeightTracker extends Base {
    @ManyToOne(() => Client, client => client)
    client: Client;

    @Column("decimal")
    weight: number

    constructor(client: Client, weight: number) {
        super();
        this.client = client;
        this.weight = weight;
    }
}