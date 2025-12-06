import express from "express";
import { getBanner, upsertBanner } from "./banner.controller";
import { Role } from "../user/user.interface";
import { checkAuth } from "../../Middlewares/CheckAuth";


const bannerrouter = express.Router();

bannerrouter.get("/get", getBanner);
bannerrouter.patch("/add", checkAuth( Role.ADMIN, Role.SUPER_ADMIN) , upsertBanner);

export default bannerrouter;
