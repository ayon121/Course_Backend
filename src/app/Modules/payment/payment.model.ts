import { Schema, model, } from "mongoose";
import { IPayment, PAYMENT_STATUS } from "./payment.interface";




const PaymentSchema = new Schema<IPayment>({
    userId: { type: Schema.Types.ObjectId, required: false, ref: "User" },
    orderId: { type: Schema.Types.ObjectId, required: true, ref: "AllOrder" },
    transactionId: { type: String, required: true, unique: true },

    amount: { type: Number, required: true },
    status: {
        type: String,
        enum: Object.values(PAYMENT_STATUS),
        default: PAYMENT_STATUS.UNPAID

    },
    paymentGateData: {
        type: Schema.Types.Mixed
    },
    invoiceUrl: { type: String, default: "" }



}, {
    timestamps: true,
    versionKey: false,
});

const PaymentModel = model<IPayment>("Payment", PaymentSchema);

export default PaymentModel;