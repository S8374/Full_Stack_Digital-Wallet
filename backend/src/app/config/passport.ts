import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { User } from "../modules/user/user.model";
import { Role, UserStatus } from "../modules/user/user.interface";
import bcrypt from 'bcrypt';
import { Strategy as GoogleStrategy, Profile, VerifyCallback } from "passport-google-oauth20";
import { envVariables } from "./envVeriables";
import { Wallet } from "../modules/wallet/wallet.model"; // Import Wallet model
import { WalletStatus, WalletType } from "../modules/wallet/wallet.interface"; // Import wallet types

passport.use(
    new LocalStrategy({
        usernameField: "email",
        passwordField: "password"
    }, async (email: string, password: string, done) => {
        try {
            const isUserExist = await User.findOne({ email });

            if (!isUserExist) {
                return done(null, false, { message: "User does not exist" });
            }

            if (!isUserExist.isVerified) {
                return done(null, false, { message: "User is not verified" });
            }

            if (isUserExist.status !== UserStatus.ACTIVE) {
                return done(null, false, { message: `User is ${isUserExist.status}` });
            }

            if (isUserExist.isDeleted) {
                return done(null, false, { message: "User is deleted" });
            }

            const isGoogleAuthenticated = Array.isArray(isUserExist.auths) && 
                isUserExist.auths.some(providerObject => providerObject.provider === "Google");

            if (isGoogleAuthenticated && !isUserExist.password) {
                return done(null, false, { 
                    message: "You have authenticated through Google. Please login with Google first and set a password." 
                });
            }

            if (!isUserExist.password) {
                return done(null, false, { message: "Password not set for this account" });
            }

            const isPasswordMatched = await bcrypt.compare(password, isUserExist.password);

            if (!isPasswordMatched) {
                return done(null, false, { message: "Password does not match" });
            }

            return done(null, isUserExist);

        } catch (error) {
            console.log(error);
            return done(error);
        }
    })
);

if (!envVariables?.GOOGLE) {
    throw new Error("Google environment variables are not defined");
}

passport.use(
    new GoogleStrategy(
        {
            clientID: envVariables.GOOGLE.GOOGLE_CLIENT_ID as string,
            clientSecret: envVariables.GOOGLE.GOOGLE_CLIENT_SECRET as string,
            callbackURL: envVariables.GOOGLE.GOOGLE_CALLBACK_URL as string
        }, 
        async (accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) => {
            try {
                const email = profile.emails?.[0].value;

                if (!email) {
                    return done(null, false, { message: "No email found" });
                }

                let isUserExist = await User.findOne({ email });
                
                if (isUserExist) {
                    if (isUserExist.status !== UserStatus.ACTIVE) {
                        return done(null, false, { message: `User is ${isUserExist.status}` });
                    }

                    if (isUserExist.isDeleted) {
                        return done(null, false, { message: "User is deleted" });
                    }

                    // Update user's Google auth if not already set
                    const hasGoogleAuth = isUserExist.auths?.some(auth => auth.provider === "Google");
                    if (!hasGoogleAuth) {
                        isUserExist.auths = [
                            ...(isUserExist.auths || []),
                            {
                                provider: "Google",
                                providerId: profile.id,
                            }
                        ];
                        await isUserExist.save();
                    }

                    // Check if user has a wallet, create if not
                    const existingWallet = await Wallet.findOne({ userId: isUserExist._id });
                    if (!existingWallet) {
                        await Wallet.create({
                            userId: isUserExist._id,
                            balance: 50,
                            currency: "BDT",
                            type: WalletType.USER,
                            status: WalletStatus.ACTIVE,
                            minBalance: 0,
                            dailyLimit: 50000,
                            monthlyLimit: 150000,
                            dailySpent: 0,
                            monthlySpent: 0,
                            lastResetDate: new Date()
                        });
                    }
                } else {
                    // Create new user for Google authentication
                    isUserExist = await User.create({
                        email,
                        name: profile.displayName,
                        picture: profile.photos?.[0].value,
                        status: UserStatus.ACTIVE,
                        isVerified: true,
                        role: Role.USER,
                        auths: [{
                            provider: "Google",
                            providerId: profile.id,
                        }]
                    });

                    // Create wallet for the new Google user
                    await Wallet.create({
                        userId: isUserExist._id,
                        balance: 50,
                        currency: "BDT",
                        type: WalletType.USER,
                        status: WalletStatus.ACTIVE,
                        minBalance: 0,
                        dailyLimit: 50000,
                        monthlyLimit: 150000,
                        dailySpent: 0,
                        monthlySpent: 0,
                        lastResetDate: new Date()
                    });
                }

                return done(null, isUserExist);

            } catch (error) {
                console.log("Google Strategy Error", error);
                return done(error);
            }
        }
    )
);

passport.serializeUser((user: any, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (id: any, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, false);
    }
});

export default passport;