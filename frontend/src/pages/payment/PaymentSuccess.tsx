/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/Payment/PaymentSuccess.tsx
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CheckCircle2, ArrowLeft, Download, Mail } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useVerifyPaymentMutation } from "@/redux/features/payment/payment.api";

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [verifyPayment, { isLoading }] = useVerifyPaymentMutation();
  const [paymentData, setPaymentData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const transactionId = searchParams.get('transactionId');
  const amount = searchParams.get('amount');
  const message = searchParams.get('message');
  const paymentRequestId = searchParams.get('paymentRequestId');

  useEffect(() => {
    const verifyPaymentStatus = async () => {
      if (paymentRequestId && transactionId) {
        try {
          const result = await verifyPayment({
            paymentRequestId,
            transactionId
          }).unwrap();
          
          if (result.success) {
            setPaymentData(result.data);
          }
        } catch (err: any) {
          setError(err.data?.message || "Payment verification failed");
        }
      }
    };

    verifyPaymentStatus();
  }, [paymentRequestId, transactionId, verifyPayment]);

  const handleDownloadReceipt = () => {
    // Implement receipt download
    console.log("Download receipt");
  };

  const handleEmailReceipt = () => {
    // Implement email receipt
    console.log("Email receipt");
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              Payment Verification Failed
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
            <Button onClick={() => navigate("/user/myWallet")}>
              Return to Wallet
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-green-500" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                Payment Successful!
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                {message || "Your payment has been processed successfully."}
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mb-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Amount:</span>
                  <p className="font-semibold">৳{amount}</p>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Transaction ID:</span>
                  <p className="font-semibold font-mono">{transactionId}</p>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Status:</span>
                  <p className="text-green-600 dark:text-green-400 font-semibold">Completed</p>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Date:</span>
                  <p className="font-semibold">{new Date().toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            {paymentData && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                  Wallet Updated
                </h3>
                <p className="text-blue-600 dark:text-blue-300 text-sm">
                  Your wallet balance has been updated to ৳{paymentData.newBalance}
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={handleDownloadReceipt}
                variant="outline"
                className="flex-1 gap-2"
                disabled={isLoading}
              >
                <Download className="w-4 h-4" />
                Download Receipt
              </Button>
              <Button
                onClick={handleEmailReceipt}
                variant="outline"
                className="flex-1 gap-2"
                disabled={isLoading}
              >
                <Mail className="w-4 h-4" />
                Email Receipt
              </Button>
            </div>

            <div className="mt-8 pt-6 border-t">
              <Button
                onClick={() => navigate("/user/myWallet")}
                className="w-full gap-2"
                size="lg"
              >
                <ArrowLeft className="w-4 h-4" />
                Return to Wallet
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// XCircle component for error state
function XCircle(props: React.SVGProps<SVGSVGElement>) {
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
      <circle cx="12" cy="12" r="10" />
      <path d="m15 9-6 6" />
      <path d="m9 9 6 6" />
    </svg>
  );
}