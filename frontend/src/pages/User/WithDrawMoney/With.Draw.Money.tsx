/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/User/Wallet/WithdrawMoney.tsx
import { useState } from "react";
import { 
  ArrowLeft, 
  Download, 
  Upload, 
  Banknote, 
  CreditCard,
  AlertCircle,
  Loader2,
  Info
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useWithdrawMoneyMutation, useGetMyWalletQuery } from "@/redux/features/wallet/wallet.api";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Withdrawal method types
type WithdrawMethod = "bank" | "mobile_banking" | "cashout";

// Interface for withdrawal data
interface WithdrawRequest {
  amount: number;
  description: string;
  method: string;
  accountNumber?: string;
  bankName?: string;
}

export default function WithdrawMoney() {
  const navigate = useNavigate();
  const [withdrawMoney, { isLoading }] = useWithdrawMoneyMutation();
  const { data: walletData } = useGetMyWalletQuery(undefined);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [withdrawMethod, setWithdrawMethod] = useState<WithdrawMethod>("bank");
  const [accountNumber, setAccountNumber] = useState("");
  const [bankName, setBankName] = useState("");

  const wallet = walletData?.data;
  const availableBalance = wallet?.balance || 0;

  // Predefined amount options (percentage of available balance)
  const amountOptions = [
    { label: "25%", value: availableBalance * 0.25 },
    { label: "50%", value: availableBalance * 0.5 },
    { label: "75%", value: availableBalance * 0.75 },
    { label: "100%", value: availableBalance }
  ].filter(option => option.value > 0);

  const handleAmountSelect = (selectedAmount: number) => {
    setAmount(selectedAmount.toFixed(2));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || parseFloat(amount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    const withdrawAmount = parseFloat(amount);
    
    if (withdrawAmount > availableBalance) {
      alert("Insufficient balance");
      return;
    }

    if (withdrawAmount < 100) {
      alert("Minimum withdrawal amount is ৳100");
      return;
    }

    try {
      // Create withdrawal request data
      const withdrawRequest: WithdrawRequest = {
        amount: withdrawAmount,
        description: description || "Withdrawal from wallet",
        method: withdrawMethod,
      };

      // Add method-specific details
      if (withdrawMethod === "bank") {
        if (!accountNumber || !bankName) {
          alert("Please provide bank account details");
          return;
        }
        withdrawRequest.accountNumber = accountNumber;
        withdrawRequest.bankName = bankName;
      }

      // Use the mutation
      const result = await withdrawMoney(withdrawRequest).unwrap();

      if (result.success && result.data.paymentUrl) {
        // Redirect to SSLCommerz for withdrawal processing
        window.location.href = result.data.paymentUrl;
      }
    } catch (err: any) {
      console.log("Withdrawal failed:", err);
      
      // Handle specific backend validation errors
      if (err.data?.message) {
        alert(`Withdrawal failed: ${err.data.message}`);
      } else {
        alert("Withdrawal initialization failed. Please try again.");
      }
    }
  };

  // // Display backend error message if available
  // const errorMessage = error 
  //   ? ("data" in error ? error.data.message : "Failed to process withdrawal") 
  //   : null;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/user/wallet")}
          className="hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Withdraw Money</h1>
          <p className="text-gray-600 dark:text-gray-300">Transfer funds from your wallet</p>
        </div>
      </div>

      {/* Balance Info */}
      <Alert className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <Info className="w-4 h-4 text-blue-500" />
        <AlertTitle>Available Balance</AlertTitle>
        <AlertDescription>
          <span className="font-semibold text-blue-700 dark:text-blue-300">
            ৳{availableBalance.toFixed(2)}
          </span>
        </AlertDescription>
      </Alert>

   

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Withdrawal Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Withdraw Funds</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Amount Selection */}
                <div className="space-y-4">
                  <Label htmlFor="amount">Amount (BDT)</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="Enter amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    min="100"
                    step="0.01"
                    max={availableBalance}
                    className="text-lg font-semibold"
                    required
                  />
                  
                  {/* Quick Amount Buttons */}
                  {availableBalance > 0 && (
                    <div className="space-y-2">
                      <Label className="text-sm text-gray-500">Quick Select:</Label>
                      <div className="flex flex-wrap gap-2">
                        {amountOptions.map((option, index) => (
                          <Button
                            key={index}
                            type="button"
                            variant={amount === option.value.toFixed(2) ? "default" : "outline"}
                            onClick={() => handleAmountSelect(option.value)}
                            className="flex-1 min-w-[80px] text-xs"
                          >
                            {option.label}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Withdrawal Method */}
                <div className="space-y-4">
                  <Label>Withdrawal Method</Label>
                  <RadioGroup
                    value={withdrawMethod}
                    onValueChange={(value) => setWithdrawMethod(value as WithdrawMethod)}
                    className="grid grid-cols-1 gap-4"
                  >
                    <div className="flex items-center space-x-3 rounded-lg border p-4 hover:bg-gray-50 dark:hover:bg-gray-800">
                      <RadioGroupItem value="bank" id="bank" />
                      <Label htmlFor="bank" className="flex items-center gap-3 cursor-pointer">
                        <Banknote className="w-5 h-5 text-green-500" />
                        <div>
                          <p className="font-medium">Bank Transfer</p>
                          <p className="text-sm text-gray-500">Transfer to bank account</p>
                        </div>
                      </Label>
                    </div>

                    <div className="flex items-center space-x-3 rounded-lg border p-4 hover:bg-gray-50 dark:hover:bg-gray-800">
                      <RadioGroupItem value="mobile_banking" id="mobile_banking" />
                      <Label htmlFor="mobile_banking" className="flex items-center gap-3 cursor-pointer">
                        <CreditCard className="w-5 h-5 text-purple-500" />
                        <div>
                          <p className="font-medium">Mobile Banking</p>
                          <p className="text-sm text-gray-500">bKash, Nagad, Rocket</p>
                        </div>
                      </Label>
                    </div>

                    <div className="flex items-center space-x-3 rounded-lg border p-4 hover:bg-gray-50 dark:hover:bg-gray-800 opacity-50">
                      <RadioGroupItem value="cashout" id="cashout" disabled />
                      <Label htmlFor="cashout" className="flex items-center gap-3 cursor-not-allowed">
                        <Download className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-400">Cash Out</p>
                          <p className="text-sm text-gray-400">Coming soon</p>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Bank Details (shown only for bank transfer) */}
                {withdrawMethod === "bank" && (
                  <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <h4 className="font-semibold">Bank Account Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="bankName">Bank Name</Label>
                        <Input
                          id="bankName"
                          placeholder="Enter bank name"
                          value={bankName}
                          onChange={(e) => setBankName(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="accountNumber">Account Number</Label>
                        <Input
                          id="accountNumber"
                          placeholder="Enter account number"
                          value={accountNumber}
                          onChange={(e) => setAccountNumber(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    placeholder="Purpose of withdrawal"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={2}
                  />
                </div>

                {/* Fees and Processing Time */}
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <p className="font-medium text-yellow-800 dark:text-yellow-200">
                        Processing Information
                      </p>
                      <ul className="text-yellow-700 dark:text-yellow-300 mt-1 space-y-1">
                        <li>• Withdrawal fee: ৳15 (deducted from amount)</li>
                        <li>• Processing time: 1-3 business days</li>
                        <li>• Minimum withdrawal: ৳100</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isLoading || !amount || parseFloat(amount) > availableBalance}
                  className="w-full h-12 text-lg font-semibold"
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5 mr-2" />
                      Withdraw ৳{amount || "0"}
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Withdrawal Info */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Withdrawal Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Amount</span>
                <span className="font-semibold">৳{amount || "0"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Fee</span>
                <span className="text-red-600">-৳15.00</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t pt-3">
                <span>You'll Receive</span>
                <span className="text-green-600">
                  ৳{(parseFloat(amount || "0") - 15).toFixed(2)}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-green-800 dark:text-green-200">
                    Secure Withdrawal
                  </h4>
                  <p className="text-sm text-green-600 dark:text-green-300 mt-1">
                    Your funds are processed securely through SSLCommerz. All transactions are encrypted and protected.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}