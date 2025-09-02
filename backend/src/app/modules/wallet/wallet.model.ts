import { model, Schema, Types } from "mongoose";
import { IWallet, IWalletModel, WalletStatus, WalletType } from "./wallet.interface";

const walletSchema = new Schema<IWallet,IWalletModel>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    balance: {
        type: Number,
        required: true,
        default: 50
    },
    currency: {
        type: String,
        required: true,
        default: "BDT"
    },
    status: {
        type: String,
        enum: Object.values(WalletStatus),
        default: WalletStatus.ACTIVE
    },
    type: {
        type: String,
        enum: Object.values(WalletType),
        required: true
    },
    minBalance: {
        type: Number,
        default: 0
    },
    dailyLimit: {
        type: Number,
        default: 50000
    },
    monthlyLimit: {
        type: Number,
        default: 150000
    },
    dailySpent: {
        type: Number,
        default: 0
    },
    monthlySpent: {
        type: Number,
        default: 0
    },
    lastResetDate: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Static method to check and reset limits
walletSchema.statics.checkAndResetLimits = async function (walletId: Types.ObjectId): Promise<IWallet> {
  const wallet = await this.findById(walletId);
  
  if (!wallet) {
    throw new Error("Wallet not found");
  }

  const now = new Date();
  const lastReset = new Date(wallet.lastResetDate);

  // Check if it's a new day
  if (now.toDateString() !== lastReset.toDateString()) {
    wallet.dailySpent = 0;
  }

  // Check if it's a new month
  if (now.getMonth() !== lastReset.getMonth() || now.getFullYear() !== lastReset.getFullYear()) {
    wallet.monthlySpent = 0;
  }

  wallet.lastResetDate = now;
  return wallet.save();
};

export const Wallet = model<IWallet,IWalletModel>("Wallet", walletSchema);