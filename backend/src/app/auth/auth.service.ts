import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import AppError from "../errorHelpers/appError"
import { User } from "../modules/user/user.model"
import { createNewAccessTokenWithRefreshToken } from "../utils/token/userTokens"
import { envVariables } from '../config/envVeriables';
import { IAuthProvider, IUser, Role, UserStatus } from '../modules/user/user.interface';
import { Wallet } from '../modules/wallet/wallet.model';
import { WalletType } from '../modules/wallet/wallet.interface';
import { sendEmail } from '../utils/sendEmail';
import jwt, { JwtPayload } from 'jsonwebtoken';

// Define ResetPasswordPayload type if not imported from elsewhere
type ResetPasswordPayload = {
    id: string;
    newPassword: string;
};

const getNewAccessToken = async (refreshToken: string) => {
    const newAccessToken = await createNewAccessTokenWithRefreshToken(refreshToken)

    return {
        accessToken: newAccessToken
    }

}
const setPassword = async (userId: string, plainPassword: string) => {
    const user = await User.findById(userId);

    if (!user) {
        throw new AppError(404, "User not found");
    }

    if (
        user.password &&
        Array.isArray(user.auths) &&
        user.auths.some(providerObject => providerObject.provider === "Google")
    ) {
        throw new AppError(httpStatus.BAD_REQUEST, "You have already set you password. Now you can change the password from your profile password update")
    }

    const hashedPassword = await bcrypt.hash(
        plainPassword,
        Number(envVariables.BCRYPT_SALT_ROUNDS)
    )

    const credentialProvider: IAuthProvider = {
        provider: "Credential",
        providerId: user.email
    }

    const auths: IAuthProvider[] = [...(user.auths ?? []), credentialProvider]

    user.password = hashedPassword

    user.auths = auths

    await user.save()

}

const registerAgent = async (payload: Partial<IUser>) => {
    const { email, password, name, phone } = payload;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new AppError(httpStatus.BAD_REQUEST, "Agent already exists with this email");
    }

    // Create agent with pending status (needs admin approval)
    const agent = await User.create({
        name,
        email,
        password,
        phone,
        status: UserStatus.ACTIVE,
        role: Role.AGENT
    });

    // Create wallet for agent
    await Wallet.create({
        userId: agent._id,
        balance: 50,
        currency: "BDT",
        type: WalletType.AGENT,
        status: "active"
    });

    return agent;
};
const forgotPassword = async (email: string) => {
    const isUserExist = await User.findOne({ email });

    if (!isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "User does not exist")
    }
    // if (!isUserExist.isVerified) {
    //     throw new AppError(httpStatus.BAD_REQUEST, "User is not verified")
    // }
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

    const resetToken = jwt.sign(jwtPayload, envVariables.JWT_ACCESS_SECRET as string, {
        expiresIn: "10m"
    })

    const resetUILink = `${envVariables.FRONTEND_URL}/reset-password?id=${isUserExist._id}&token=${resetToken}`

    sendEmail({
        to: isUserExist.email,
        subject: "Password Reset",
        templateName: "forgetPassword",
        templateData: {
            name: isUserExist.name,
            resetUILink
        }
    })
}
const resetPassword = async (payload: ResetPasswordPayload, decodedToken: JwtPayload) => {
    if (payload.id != decodedToken.userId) {
        throw new AppError(401, "You can not reset your password")
    }

    const isUserExist = await User.findById(decodedToken.userId)
    if (!isUserExist) {
        throw new AppError(401, "User does not exist")
    }

    const hashedPassword = await bcrypt.hash(
        payload.newPassword,
        Number(envVariables.BCRYPT_SALT_ROUNDS)
    )

    isUserExist.password = hashedPassword;

    await isUserExist.save()
}
const changePassword = async (oldPassword: string, newPassword: string, decodedToken: JwtPayload) => {

    const user = await User.findById(decodedToken.userId)

    const isOldPasswordMatch = await bcrypt.compare(oldPassword, user!.password as string)
    if (!isOldPasswordMatch) {
        throw new AppError(httpStatus.UNAUTHORIZED, "Old Password does not match");
    }

    user!.password = await bcrypt.hash(newPassword, Number(envVariables.BCRYPT_SALT_ROUNDS))

    user!.save();


}

export const AuthServices = {
    getNewAccessToken,
    setPassword,
    registerAgent,
    forgotPassword,
    resetPassword,
    changePassword

}