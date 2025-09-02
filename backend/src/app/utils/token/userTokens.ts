import  httpStatus  from 'http-status';
import { envVariables } from "../../config/envVeriables"
import AppError from "../../errorHelpers/appError"
import {  IUser, UserStatus } from "../../modules/user/user.interface"
import { User } from "../../modules/user/user.model"
import { generateToken, verifyToken } from "./jwt"
import { JwtPayload } from 'jsonwebtoken';

export const createUserTokens = (user: Partial<IUser>) => {
    const jwtPayload = {
        userId: user._id,
        email: user.email,
        role: user.role
    }
    const accessToken = generateToken(jwtPayload, envVariables.JWT_ACCESS_SECRET as string, envVariables.JWT_ACCESS_EXPIRES as string)

    const refreshToken = generateToken(jwtPayload, envVariables.JWT_REFRESH_SECRET as string, envVariables.JWT_REFRESH_EXPIRES as string)
    return {
        accessToken,
        refreshToken
    }
}
export const createNewAccessTokenWithRefreshToken = async (refreshToken: string) => {

    const verifiedRefreshToken = verifyToken(refreshToken, envVariables.JWT_REFRESH_SECRET as string) as JwtPayload


    const isUserExist = await User.findOne({ email: verifiedRefreshToken.email })

    if (!isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "User does not exist")
    }
    if (isUserExist.status === UserStatus.BLOCKED || isUserExist.status === UserStatus.INACTIVE) {
        throw new AppError(httpStatus.BAD_REQUEST, `User is ${isUserExist.status}`)
    }
    if (isUserExist.isDeleted) {
        throw new AppError(httpStatus.BAD_REQUEST, "User is deleted")
    }

    const jwtPayload = {
        userId: isUserExist._id,
        email: isUserExist.email,
        role: isUserExist.role
    }
    const accessToken = generateToken(jwtPayload, envVariables.JWT_ACCESS_SECRET as string, envVariables.JWT_ACCESS_EXPIRES as string)

    return accessToken
}
