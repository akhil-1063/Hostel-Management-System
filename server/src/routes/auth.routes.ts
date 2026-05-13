import {Router} from "express" ;
import {registerUser,loginUser} from "../controllers/auth.controller";

const authRouter =Router();

//Route for user registration



authRouter.post("/register",registerUser);
authRouter.post("/login",loginUser);

export default authRouter;
