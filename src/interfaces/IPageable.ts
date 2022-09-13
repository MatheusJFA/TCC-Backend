import { ISortable } from "./ISortable";

export interface IPageable<T> {
    page: number,
    limit: number,
    sort: ISortable<any>
}

