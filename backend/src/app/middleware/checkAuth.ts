import httpStatus from 'http-status';
import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import AppError from '../errorHelpers/appError';
import { verifyToken } from '../utils/token/jwt';
import { envVariables } from '../config/envVeriables';
import { User } from '../modules/user/user.model';
import {  UserStatus } from '../modules/user/user.interface';


export const checkAuth = (...authRoles: string[]) => async (req: Request, res: Response, next: NextFunction) => {

    try {
        const accessToken = req.headers.authorization;

        if (!accessToken) {
            throw new AppError(403, "No Token Received")
        }


        const verifiedToken = verifyToken(accessToken, envVariables.JWT_ACCESS_SECRET as string) as JwtPayload
        const isUserExist = await User.findOne({ email: verifiedToken.email })

        if (!isUserExist) {
            throw new AppError(httpStatus.BAD_REQUEST, "User does not exist")
        }
        if (isUserExist.status === UserStatus.BLOCKED || isUserExist.status === UserStatus.INACTIVE) {
            throw new AppError(httpStatus.BAD_REQUEST, `User is ${isUserExist.status}`)
        }
        if (isUserExist.isDeleted) {
            throw new AppError(httpStatus.BAD_REQUEST, "User is deleted")
        }
        console.log("User is verified", verifiedToken)
        if (verifiedToken.role === "PENDING" ||!authRoles.includes(verifiedToken.role) ) {
            throw new AppError(403, "You are not permitted to view this route!!!")
        }
        if (!authRoles.includes(verifiedToken.role)) {
            throw new AppError(403, "You are not permitted to view this route!!!")
        }

        req.user = verifiedToken; // Attach the user info to the request object
        next()

    } catch (error) {
        console.log("jwt error", error);
        next(error)
    }
}