import bcryptjs from "bcrypt";
import { IAuthProvider, IUser, Role, UserStatus } from "../modules/user/user.interface";
import { envVariables } from "../config/envVeriables";
import { User } from "../modules/user/user.model";
import { Wallet } from "../modules/wallet/wallet.model";
import { WalletStatus, WalletType } from "../modules/wallet/wallet.interface";

export const createAdmin = async () => {
  try {
    const isAdminExist = await User.findOne({ email: envVariables.ADMIN?.ADMIN_EMAIL });

    if (isAdminExist) {
      console.log("Admin Already Exists!");
      return;
    }

    console.log("Trying to create Admin...");

    const hashedPassword = await bcryptjs.hash(
      envVariables.ADMIN?.ADMIN_PASSWORD as string,
      Number(envVariables.BCRYPT_SALT_ROUNDS)
    );

    const authProvider: IAuthProvider = {
      provider: "Credential",
      providerId: envVariables.ADMIN?.ADMIN_EMAIL as string,
    };

    // Create admin user
    const admin = await User.create({
      name: "System Admin",
      email: envVariables.ADMIN?.ADMIN_EMAIL as string,
      password: hashedPassword,
      role: Role.ADMIN,
      status: UserStatus.ACTIVE,
      isVerified: true,
      auths: [authProvider]
    });

    // Create wallet for admin
    await Wallet.create({
      userId: admin._id,
      balance: 0, // Admin typically doesn't need a balance
      currency: "BDT",
      type: WalletType.SYSTEM,
      status: WalletStatus.ACTIVE,
      minBalance: 0,
      dailyLimit: 0,
      monthlyLimit: 0,
      dailySpent: 0,
      monthlySpent: 0,
      lastResetDate: new Date()
    });

    console.log("Admin Created Successfully!");
    console.log(admin);
  } catch (error) {
    console.log("Error creating admin:", error);
  }
};