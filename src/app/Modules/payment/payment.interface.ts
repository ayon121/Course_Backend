/* eslint-disable @typescript-eslint/no-explicit-any */
import { Types } from "mongoose";

export enum PAYMENT_STATUS {
    UNPAID = "UNPAID",
    CANCEL = "CANCEL",
    PAID = "PAID",
    FAILED = "FAILED",
    REFUNDED = "REFUNDED"

}

export interface IPayment {
    userId: Types.ObjectId,
    orderId : Types.ObjectId,
    transactionId : string,
    amount : number,
    paymentGateData ?: any,
    invoiceUrl ?: string
    status : PAYMENT_STATUS,
}

