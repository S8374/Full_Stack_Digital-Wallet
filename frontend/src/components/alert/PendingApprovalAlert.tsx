// src/components/alerts/PendingApprovalAlert.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {  Clock, Mail, User, Shield, Scale3dIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function PendingApprovalAlert() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 dark:bg-yellow-900/30">
            <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
          </div>
          <CardTitle className="mt-4 text-2xl">Account Pending Approval</CardTitle>
          <CardDescription>
            Your agent account is waiting for admin approval
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-medium text-blue-800 dark:text-blue-200">What's happening?</h4>
                <p className="text-sm text-blue-600 dark:text-blue-300 mt-1">
                  Your agent request has been submitted and is currently under review by our admin team.
                  You'll be able to access the dashboard once your account is approved.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">What you can do now:</h4>
            <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Check your email for updates
              </li>
              <li className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Update your profile information
              </li>
              <li className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Typically takes 24-48 hours / Waiting For Approval
              </li>
              <li className="flex items-center gap-2">
                <Scale3dIcon className="h-4 w-4" />
                Cancel Agent Request 
              </li>
            </ul>
          </div>

          <div className="flex gap-3">
           
            <Button asChild className="flex-1">
              <Link to="/">Go Home</Link>
            </Button>
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            Need help? Contact support at support@digitalwallet.com
          </p>
        </CardContent>
      </Card>
    </div>
  );
}