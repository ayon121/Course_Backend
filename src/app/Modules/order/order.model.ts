import { Schema, model } from "mongoose";
import { IOrders, ORDER_STATUS } from "./order.interface";



const OrderSchema = new Schema<IOrders>({
  userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  courseId: { type: Schema.Types.ObjectId, required: true, ref: "Course" },
  paymentId: { type: Schema.Types.ObjectId, default: null, ref: "Payment" },
  paymentMethod: { type: String, required: true },
  courseTitle: { type: String },
  username: { type: String },
  useremail: { type: String },
  userphone: { type: String },
  refCode: { type: String , default : null },
 
  orderStatus: {
    type: String,
    required: true,
    enum: Object.values(ORDER_STATUS),
    default: ORDER_STATUS.PENDING
  },

}, {
  timestamps: true,
  versionKey: false,
});

const OrderModel = model<IOrders>("AllOrder", OrderSchema);

export default OrderModel;