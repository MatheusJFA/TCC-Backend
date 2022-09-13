import { BaseEntity, CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn, UpdateDateColumn, VersionColumn } from "typeorm";
import { v4 as uuid } from "uuid";

export interface IBase {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    version: number;
}

export default class Base extends BaseEntity implements IBase {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date | null;

    @VersionColumn()
    version: number;

    constructor() {
        super();
        this.id = uuid();
        this.createdAt = new Date();
        this.updatedAt = new Date();
        this.deletedAt = null;
        this.version = 0;
    }
}