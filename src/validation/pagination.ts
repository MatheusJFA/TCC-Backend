import { Order, OrderValues } from '@/types/order.type';
import * as Yup from 'yup';


export const paginationSchema = Yup.object().shape({
    query: Yup.object().shape({
        page: Yup.number().positive().default(1).required(),
        limit: Yup.number().positive().default(10).required(),
        sort: Yup.object().shape({
            field: Yup.string().default("createdAt").required(),
            order: Yup.string().default(Order.DESCENDING).oneOf(OrderValues).required()
        })
    })
});