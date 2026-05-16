import {Router} from "express";
import {createTicket,getAllTickets,updateTicketStatus} from "../controllers/maintenance.controller";
import {protect,adminOnly} from "../middlewares/auth.middleware";

const maintenanceRouter = Router();

maintenanceRouter.post("/",protect,createTicket);
maintenanceRouter.get("/",protect,adminOnly,getAllTickets);
maintenanceRouter.put("/:id",protect,adminOnly,updateTicketStatus);

export default maintenanceRouter;