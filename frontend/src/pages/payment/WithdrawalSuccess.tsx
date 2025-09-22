// src/pages/Payment/WithdrawalSuccess.tsx
import { useSearchParams, useNavigate } from "react-router-dom";
import { CheckCircle2, ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function WithdrawalSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const transactionId = searchParams.get('transactionId');
  const amount = searchParams.get('amount');
  const message = searchParams.get('message');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            Withdrawal Successful!
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            {message || "Your withdrawal request has been processed successfully."}
          </p>
          
          {amount && (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-6">
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
                  <p className="text-green-600 dark:text-green-400 font-semibold">Processing</p>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Estimated Time:</span>
                  <p className="font-semibold">1-3 business days</p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <Button
              onClick={() => navigate("/user/wallet")}
              className="w-full gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Return to Wallet
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}