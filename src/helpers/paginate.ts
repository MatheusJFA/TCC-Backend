import { IPageable } from "@/interfaces/IPageable";

export const paginate = (paginate?: IPageable<unknown>) => {
    return {
        page: paginate?.page || 1,
        limit: paginate?.limit || 10,
        sort: {
            field: paginate?.sort.field || "createdAt",
            order: paginate?.sort.order || "DESC"
        }
    } as IPageable<unknown>;
};
