import { Types } from "mongoose";


export enum ORDER_STATUS {
    PENDING = "PENDING",
    CANCEL = "CANCEL",
    COMPELTED = "COMPLETED",
    FAILED = "FAILED"

}


export interface IOrders {
    userId : Types.ObjectId,
    courseId: Types.ObjectId,
    courseTitle?: string,
    username?: string,
    useremail?: string,
    userphone?: string,
    paymentId?: Types.ObjectId, //default not available 
    paymentMethod: string,
    orderStatus: ORDER_STATUS,  //for sslcommerce
    // ref
    refCode ?: string,   
}
