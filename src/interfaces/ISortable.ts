import { FindConditions } from "typeorm";


export interface ISortable<T> {
    field: keyof T;
    order: "ASC" | "DESC";
}
