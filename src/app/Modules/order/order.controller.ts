import { JwtPayload } from "jsonwebtoken"
import { createOrderService } from "./order.service"
import { sendResponse } from "../../utils/sendResponse"
import { Request, Response } from "express"

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
