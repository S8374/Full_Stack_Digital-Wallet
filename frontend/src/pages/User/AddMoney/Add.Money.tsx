/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/User/Wallet/AddMoney.tsx
import { useState } from "react";
import {
  Plus,
  CreditCard,
  Banknote,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  XCircle,
  ExternalLink
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAddMoneyMutation } from "@/redux/features/wallet/wallet.api"; // Changed import
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent } from "@/components/ui/dialog";

// Payment method types
type PaymentMethod = "sslcommerz" | "bank" | "card";

// Interface for payment data
interface PaymentRequest {
  amount: number;
  description: string;
}

export default function AddMoney() {
  const navigate = useNavigate();
  const [addMoney, { isLoading }] = useAddMoneyMutation(); // Use mutation hook
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("sslcommerz");
  const [paymentData, setPaymentData] = useState<any>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "processing" | "success" | "error">("idle");

  // Predefined amount options
  const amountOptions = [100, 500, 1000, 2000, 5000];

  const handleAmountSelect = (selectedAmount: number) => {
    setAmount(selectedAmount.toString());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || parseFloat(amount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    try {
      setPaymentStatus("processing");

      // Create payment request data
      const paymentRequest: PaymentRequest = {
        amount: parseFloat(amount),
        description: description || "Added money to wallet"
      };

      // Use the mutation
      const result = await addMoney(paymentRequest).unwrap();

      if (result.success && result.data.paymentUrl) {
        setPaymentData(result.data);
        setIsPaymentModalOpen(true);
        setPaymentStatus("idle");
        // Redirect to SSLCommerz in the same tab
        window.location.href = result.data.paymentUrl;
      }
    } catch (err: any) {
      console.error("Payment initialization failed:", err);

      // Handle specific backend validation errors
      if (err.data?.message) {
        alert(`Payment failed: ${err.data.message}`);
      } else {
        alert("Payment initialization failed. Please try again.");
      }

      setPaymentStatus("error");
      setTimeout(() => setPaymentStatus("idle"), 3000);
    }
  };

  const handlePaymentComplete = () => {
    setIsPaymentModalOpen(false);
    setPaymentData(null);
    setAmount("");
    setDescription("");
    // You might want to refetch wallet data here
    navigate("/user/wallet");
  };

  const handlePaymentCancel = () => {
    setIsPaymentModalOpen(false);
    setPaymentData(null);
  };

  // Display backend error message if available
  // const errorMessage = error
  //   ? ("data" in error ? error.data.message : "Failed to initialize payment")
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
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Add Money</h1>
          <p className="text-gray-600 dark:text-gray-300">Fund your wallet securely</p>
        </div>
      </div>


      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Payment Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Add Funds to Your Wallet</CardTitle>
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
                    min="1"
                    step="0.01"
                    className="text-lg font-semibold"
                    required
                  />

                  {/* Quick Amount Buttons */}
                  <div className="flex flex-wrap gap-2">
                    {amountOptions.map((option) => (
                      <Button
                        key={option}
                        type="button"
                        variant={amount === option.toString() ? "default" : "outline"}
                        onClick={() => handleAmountSelect(option)}
                        className="flex-1 min-w-[80px]"
                      >
                        ৳{option}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    placeholder="What's this payment for?"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                  />
                </div>

                {/* Payment Method */}
                <div className="space-y-4">
                  <Label>Payment Method</Label>
                  <RadioGroup
                    value={paymentMethod}
                    onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}
                    className="grid grid-cols-1 gap-4"
                  >
                    <div className="flex items-center space-x-3 rounded-lg border p-4 hover:bg-gray-50 dark:hover:bg-gray-800">
                      <RadioGroupItem value="sslcommerz" id="sslcommerz" />
                      <Label htmlFor="sslcommerz" className="flex items-center gap-3 cursor-pointer">
                        <CreditCard className="w-5 h-5 text-blue-500" />
                        <div>
                          <p className="font-medium">SSLCommerz</p>
                          <p className="text-sm text-gray-500">Credit/Debit Card, Mobile Banking</p>
                        </div>
                      </Label>
                    </div>

                    <div className="flex items-center space-x-3 rounded-lg border p-4 hover:bg-gray-50 dark:hover:bg-gray-800 opacity-50">
                      <RadioGroupItem value="bank" id="bank" disabled />
                      <Label htmlFor="bank" className="flex items-center gap-3 cursor-not-allowed">
                        <Banknote className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-400">Bank Transfer</p>
                          <p className="text-sm text-gray-400">Coming soon</p>
                        </div>
                      </Label>
                    </div>

                    <div className="flex items-center space-x-3 rounded-lg border p-4 hover:bg-gray-50 dark:hover:bg-gray-800 opacity-50">
                      <RadioGroupItem value="card" id="card" disabled />
                      <Label htmlFor="card" className="flex items-center gap-3 cursor-not-allowed">
                        <CreditCard className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-400">Saved Card</p>
                          <p className="text-sm text-gray-400">Coming soon</p>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isLoading || !amount}
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
                      <Plus className="w-5 h-5 mr-2" />
                      Add ৳{amount || "0"}
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Payment Info */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Amount</span>
                <span className="font-semibold">৳{amount || "0"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Fee</span>
                <span className="text-green-600">৳0.00</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t pt-3">
                <span>Total</span>
                <span>৳{amount || "0"}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-blue-800 dark:text-blue-200">Secure Payment</h4>
                  <p className="text-sm text-blue-600 dark:text-blue-300 mt-1">
                    Your payment information is encrypted and secure. We use SSLCommerz for safe transactions.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Payment Modal */}
      <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
        <DialogContent className="sm:max-w-md lg:max-w-2xl h-[80vh]">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">Complete Your Payment</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePaymentCancel}
                className="h-8 w-8"
              >
                <XCircle className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex-1">
              {paymentData?.paymentUrl ? (
                <iframe
                  src={paymentData.paymentUrl}
                  className="w-full h-full border-0"
                  title="SSLCommerz Payment Gateway"
                  sandbox="allow-forms allow-scripts allow-same-origin allow-popups"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                </div>
              )}
            </div>

            <div className="p-4 border-t bg-gray-50 dark:bg-gray-800">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-300">
                  Transaction ID: {paymentData?.transactionId}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(paymentData?.paymentUrl, '_blank')}
                  className="gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  Open in new tab
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Payment Status Modal */}
      <Dialog open={paymentStatus !== "idle"} onOpenChange={() => setPaymentStatus("idle")}>
        <DialogContent className="sm:max-w-md">
          <div className="text-center p-6">
            {paymentStatus === "processing" && (
              <>
                <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Processing Payment</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Initializing your payment with SSLCommerz...
                </p>
              </>
            )}

            {paymentStatus === "success" && (
              <>
                <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Payment Successful!</h3>
                <p className="text-gray-600 dark:text-gray-3 mb-4">
                  Your wallet has been funded successfully.
                </p>
                <Button onClick={handlePaymentComplete} className="w-full">
                  Continue to Wallet
                </Button>
              </>
            )}

            {paymentStatus === "error" && (
              <>
                <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Payment Failed</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  There was an error processing your payment. Please try again.
                </p>
                <Button onClick={() => setPaymentStatus("idle")} variant="outline" className="w-full">
                  Try Again
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Shield icon component
function Shield(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}