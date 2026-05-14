import {Router} from "express";
import {createRoom,getAllRooms  } from "../controllers/room.controller";
import {protect,adminOnly} from "../middlewares/auth.middleware";

const roomRouter = Router();

roomRouter.post("/",protect,adminOnly,createRoom);
roomRouter.get("/",protect,getAllRooms);

export default roomRouter;  