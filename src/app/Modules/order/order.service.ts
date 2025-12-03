/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */

import AppError from "../../ErrorHelpers/AppError";
import { Course } from "../course/course.model";

import { PAYMENT_STATUS } from "../payment/payment.interface";
import PaymentModel from "../payment/payment.model";

import { ISSLCommerz } from "../sslCommerz/sslCommerz.interface";
import { SSLService } from "../sslCommerz/sslCommerz.service";
import { User } from "../user/user.model";

import { IOrders, ORDER_STATUS } from "./order.interface";
import OrderModel from "./order.model";


const getTransactionId = () => {
    return `tran_${Date.now()}_${Math.floor(Math.random()) * 1000}`
}
export const createOrderService = async (payload: Partial<IOrders>, userId: string) => {
    const transactionId = getTransactionId()

    const session = await OrderModel.startSession()

    session.startTransaction()

    try {
        const user = await User.findById(userId)

        if (!user?.name || !user.email ) {
            throw new AppError(404, "Please Update Your Profile")
        }

        const course = await Course.findById(payload.courseId).select("title price discountedPrice")

        if (!course) {
            throw new AppError(404, "Course not found");
        }


        if (payload.paymentMethod === 'SSLCOMMERCE') {
            const basePrice = course.price ?? 0;
            const offerPrice = course.discountedPrice ?? basePrice;

            let finalPrice: number;

            if (offerPrice < basePrice && offerPrice > 0) {
                finalPrice = offerPrice;
            } else {
                finalPrice = basePrice;
            }

    
            const payableAmount = Number(finalPrice)


            const order = await OrderModel.create([{
                userId,
                courseId: course._id,
                courseTitle: course.title,
                username: user.name,
                useremail: user.email,
                userphone: '01700000000',
                orderStatus: ORDER_STATUS.PENDING,
                ...payload

            }], { session: session })


            const payment = await PaymentModel.create([{
                userId,
                orderId: order[0]._id,
                status: PAYMENT_STATUS.UNPAID,
                transactionId,
                amount: payableAmount,

            }], { session: session })


            const updatedOrder = await OrderModel.findByIdAndUpdate(
                order[0]._id,
                { paymentId: payment[0]._id },
                { new: true, runValidators: true, session }
            ).populate("userId", "name email")
                .populate("courseId", "title price  discountedPrice category banner")
                .populate("paymentId")


            // --------------------------------ssl payment-------------------starts
            const userEmail = (updatedOrder?.userId as any).email
            // const userPhone = (updatedOrder?.userId as any).phone
            const userName = (updatedOrder?.userId as any).name

            const courseName = (updatedOrder?.courseId as any).title
            const courseCategory = (updatedOrder?.courseId as any).category

            const sslpayload: ISSLCommerz = {
                // users
                address: "N/A",
                email: userEmail,
                phoneNumber: "01700000000",
                name: userName,
                amount: payableAmount,
                transactionId: transactionId,
                // product 
                coursename: courseName,
                category: courseCategory
            }

            const sslPayment = await SSLService.sslPaymentInit(sslpayload)

            

            // await sendOrderEmail(user.email, order, payableAmount, transactionId, 'SSLCOMMERCE', user.name);

            await session.commitTransaction()
            session.endSession()
            return {
                order: updatedOrder,
                paymentURL: sslPayment.GatewayPageURL,
            }
        }


    } catch (error: any) {
        await session.abortTransaction()
        session.endSession()
        throw error


    }


}


