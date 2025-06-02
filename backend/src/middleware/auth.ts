import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import UserModel from "../models/user";

// only for authentication

export interface AuthRequest extends Request {
    user?: any;
}


export const auth = async (req: AuthRequest, res: Response, next:NextFunction) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        res.status(401).json({ error: 'No Token' });
        return;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as Secret) as JwtPayload;

        const userId = decoded.id || decoded.userId;

        if (!userId) {
            res.status(401).json({ error: 'Invalid token structure' });
            return;
        }

        const user = await UserModel.findById(userId);

        if (!user) {
            res.status(401).json({ error: 'User not found' });
            return;
        }
        req.user = user;
        //calling this to reiterate it
        next();
        console.log(user._id)



    } catch (error: any) {
        console.error('Auth Error:', error);
        if (error.name === 'JsonWebTokenError') {
            res.status(401).json({ error: 'Invalid token' });
        }
        if (error.name === 'TokenExpiredError') {
            res.status(401).json({ error: 'Token expired' });
        }
        res.status(401).json({ error: 'Please authenticate' });
    }

}