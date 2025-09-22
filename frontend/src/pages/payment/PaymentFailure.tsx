// src/pages/Payment/PaymentFailure.tsx
import { useSearchParams, useNavigate } from "react-router-dom";
import { XCircle, ArrowLeft, RefreshCw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function PaymentFailure() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const message = searchParams.get('message') || "Your payment could not be processed.";
  const transactionId = searchParams.get('transactionId');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            Payment Failed
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">{message}</p>
          {transactionId && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Transaction ID: {transactionId}
            </p>
          )}
          <div className="space-y-3">
            <Button
              onClick={() => navigate("/user/wallet/add-money")}
              className="w-full gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </Button>
            <Button
              onClick={() => navigate("/user/wallet")}
              variant="outline"
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