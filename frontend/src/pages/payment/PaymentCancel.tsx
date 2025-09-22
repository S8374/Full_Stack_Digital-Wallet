// src/pages/Payment/PaymentCancel.tsx
import { useSearchParams, useNavigate } from "react-router-dom";
import { AlertCircle, ArrowLeft, CreditCard } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function PaymentCancel() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const message = searchParams.get('message') || "Your payment was cancelled.";
  const transactionId = searchParams.get('transactionId');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8 text-yellow-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            Payment Cancelled
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
              <CreditCard className="w-4 h-4" />
              Try Different Payment
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