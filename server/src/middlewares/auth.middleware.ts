import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import envConfig from "../config/envConfig";




//Logic for Authorization 

export interface AuthRequest extends Request {
    user?: any
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    let token: string | undefined;


    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {



        try {
            token = req.headers.authorization.split(" ")[1];

            const decoded = jwt.verify(token as string, envConfig.jwt);
            req.user = decoded;
            next();




        } catch (err) {
            res.status(401).json({ message: "Unauthorized, token failed" });

        }


        if (!token) {
            res.status(401).json({ message: "Unauthorized, no token" });
        }
    }
};



// Logic for Authentication 

export const adminOnly = (req: AuthRequest, res: Response, next: NextFunction): void => {

    if (req.user && req.user.role == "admin") {
        next();
    }
    else {
        res.status(403).json({ message: "Unauthorized, admin role required" });
    }
};




