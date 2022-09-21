export const Order = {
    ASCENDING: "ASC",
    DESCENDING: "DESC"
}

export type Order = keyof typeof Order;

export const ValidOrder = (order: string) => Object.values(Order).find(value => value === order) || null;

export const OrderValues = Object.values(Order);

