import { JwtPayload } from "jsonwebtoken"
import { createOrderService } from "./order.service"
import { sendResponse } from "../../utils/sendResponse"
import { Request, Response } from "express"
import OrderModel from "./order.model"

export const createOrderController = async (req: Request, res: Response) => {
  const decodedToken = req.user as JwtPayload
  const order = await createOrderService(req.body, decodedToken.userId)

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Order Created Successfully",
    data: order
  })
}


// GET Single Order by ID
export const getSingleOrder = async (req: Request, res: Response) => {
  const { orderId } = req.params;


  try {
    const order = await OrderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch order", error });
  }
};


// GET Orders by User ID
export const getMyOrders = async (req: Request, res: Response) => {
  const verified = req?.user as JwtPayload


  try {
    const orders = await OrderModel.find({ userId: verified?.userId })
      .populate('productId')
      .populate('paymentId')
      .sort({ createdAt: 1 });
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch orders", error });
  }
};