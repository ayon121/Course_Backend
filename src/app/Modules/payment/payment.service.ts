/* eslint-disable @typescript-eslint/no-explicit-any */
import AppError from "../../ErrorHelpers/AppError"
import { ORDER_STATUS } from "../order/order.interface"
import OrderModel from "../order/order.model"

import { ISSLCommerz } from "../sslCommerz/sslCommerz.interface"
import { SSLService } from "../sslCommerz/sslCommerz.service"
import { PAYMENT_STATUS } from "./payment.interface"
import PaymentModel from "./payment.model"


const successPayment = async (query: Record<string, string>) => {
    // Update Order orderStatus to COMPLETED
    // update payment status to paid

    const session = await OrderModel.startSession()

    session.startTransaction()

    try {

        const updatedPayment = await PaymentModel.findOneAndUpdate({ transactionId: query.transactionId }, {
            status: PAYMENT_STATUS.PAID

        }, { new: true, runValidators: true, session })
        await OrderModel.findByIdAndUpdate(
            updatedPayment?.orderId,
            { orderStatus: ORDER_STATUS.COMPELTED },
            { new: true, runValidators: true, session }
        )
        await session.commitTransaction()
        session.endSession()
        return {
            success: true, message: "Payment Completed"
        }

    } catch (error: any) {
        await session.abortTransaction()
        session.endSession()
        throw error


    }


}


const failPayment = async (query: Record<string, string>) => {
   
    const session = await OrderModel.startSession()

    session.startTransaction()

    try {
        const updatedPayment = await PaymentModel.findOneAndUpdate({ transactionId: query.transactionId }, {
            status: PAYMENT_STATUS.FAILED

        }, { new: true, runValidators: true, session })


        await OrderModel.findByIdAndUpdate(
            updatedPayment?.orderId,
            { orderStatus: ORDER_STATUS.FAILED },
            { new: true, runValidators: true, session }
        )


        await session.commitTransaction()
        session.endSession()
        return {
            success: false, message: "Payment Failed"
        }

    } catch (error: any) {
        await session.abortTransaction()
        session.endSession()
        throw error


    }

}

const cancelPayment = async (query: Record<string, string>) => {
    const session = await OrderModel.startSession()

    session.startTransaction()

    try {

        const updatedPayment = await PaymentModel.findOneAndUpdate({ transactionId: query.transactionId }, {
            status: PAYMENT_STATUS.CANCEL

        }, { new: true, runValidators: true, session })


        await OrderModel.findByIdAndUpdate(
            updatedPayment?.orderId,
            { orderStatus: ORDER_STATUS.CANCEL },
            { new: true, runValidators: true, session }
        )


        await session.commitTransaction()
        session.endSession()
        return {
            success: false, message: "Payment Canceled"
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        await session.abortTransaction()
        session.endSession()
        throw error


    }
}



const InitPaymentService = async (orderId: string) => {
    const payment = await PaymentModel.findOne({ orderId })
    if (!payment) {
        throw new AppError(404, "Payment not Found.")
    }
    const order = await OrderModel.findById(payment.orderId)

    // --------------------------------ssl payment-------------------starts


    const userEmail = (order?.userId as any).email
    const userName = (order?.userId as any).name

    const productName = (order?.courseId as any).title
    const productCategory = (order?.courseId as any).category

    const sslpayload: ISSLCommerz = {
        // users
        address: "N/A",
        email: userEmail,
        phoneNumber: "01700000000",
        name: userName,
        amount: payment.amount,
        transactionId: payment.transactionId,
        // product 
        coursename: productName,
        category: productCategory


    }

    const sslPayment = await SSLService.sslPaymentInit(sslpayload)


    // --------------------------------ssl payment------------------- ends

    return {
        paymentURL: sslPayment.GatewayPageURL,
    }



}

export const PaymentService = {
    successPayment,
    failPayment,
    cancelPayment,
    InitPaymentService
}