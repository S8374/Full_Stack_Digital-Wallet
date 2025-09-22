/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/User/Wallet/SendMoneyRequest.tsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Search, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { useCreateMoneyRequestMutation, useSearchUsersQuery } from "@/redux/features/moneyRequest/moneyRequest.api";

const requestSchema = z.object({
  toUserId: z.string().min(1, "Please select a user"),
  amount: z.number().min(1, "Amount must be at least 1 BDT"),
  description: z.string().max(200).optional(),
});

type RequestFormData = z.infer<typeof requestSchema>;

export default function SendMoneyRequest() {
  const navigate = useNavigate();
  const [createRequest, { isLoading }] = useCreateMoneyRequestMutation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  
  const { data: searchResults, isLoading: isSearching } = useSearchUsersQuery(
    searchQuery,
    { skip: searchQuery.length < 3 }
  );

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<RequestFormData>({
    resolver: zodResolver(requestSchema),
  });

  const onSubmit = async (data: RequestFormData) => {
    try {
      const result = await createRequest(data).unwrap();
      if (result.success) {
        alert("Money request sent successfully!");
        navigate("/user/requests/sent");
      }
    } catch (err) {
      console.error("Failed to send request:", err);
    }
  };

  const handleUserSelect = (user: any) => {
    setSelectedUser(user);
    setValue("toUserId", user._id);
    setSearchQuery("");
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Request Form */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Request Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* User Search */}
              <div className="space-y-3">
                <Label>Select User</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search users by name, email, or phone"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Search Results */}
                {searchQuery.length >= 3 && (
                  <div className="border rounded-lg max-h-60 overflow-y-auto">
                    {isSearching ? (
                      <div className="p-4 text-center text-gray-500">Searching...</div>
                    ) : searchResults?.data?.length ? (
                      searchResults.data.map((user: any) => (
                        <div
                          key={user._id}
                          onClick={() => handleUserSelect(user)}
                          className="p-3 border-b hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                              <User className="w-5 h-5 text-blue-500" />
                            </div>
                            <div>
                              <p className="font-medium">{user.name}</p>
                              <p className="text-sm text-gray-500">{user.email}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-gray-500">No users found</div>
                    )}
                  </div>
                )}

                {/* Selected User */}
                {selectedUser && (
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-green-500" />
                      </div>
                      <div>
                        <p className="font-medium">{selectedUser.name}</p>
                        <p className="text-sm text-gray-500">{selectedUser.email}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Amount */}
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (BDT)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter amount"
                  {...register("amount", { valueAsNumber: true })}
                  className="text-lg font-semibold"
                />
                {errors.amount && (
                  <p className="text-sm text-red-500">{errors.amount.message}</p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="What is this request for?"
                  {...register("description")}
                  rows={3}
                />
                {errors.description && (
                  <p className="text-sm text-red-500">{errors.description.message}</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isLoading || !selectedUser}
                className="w-full h-12 text-lg font-semibold"
                size="lg"
              >
                {isLoading ? "Sending Request..." : "Send Request"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Info Sidebar */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>How it works</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-semibold">1. Find User</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Search for the user you want to request money from by their name, email, or phone number.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold">2. Set Amount</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Enter the amount you need. The recipient will see this request in their pending requests.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold">3. Add Description</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Optionally add a note explaining what the money is for. This helps the recipient understand your request.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold">4. Wait for Approval</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                The recipient can approve or reject your request. You'll be notified when they respond.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}