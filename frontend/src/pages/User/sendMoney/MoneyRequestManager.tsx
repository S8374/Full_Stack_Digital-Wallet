/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/MoneyRequestManager.tsx

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CheckCircle2, XCircle, Clock, User, Loader2 } from 'lucide-react';
import { 
  useGetMyRequestsQuery, 
  useApproveRequestMutation, 
  useRejectRequestMutation 
} from '@/redux/features/moneyRequest/moneyRequest.api';

interface MoneyRequest {
  _id: string;
  fromUser: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
  };
  amount: number;
  description?: string;
  status: string;
  createdAt: string;
}

export default function MoneyRequestManager() {
  const { data: requestsData, isLoading, error, refetch } = useGetMyRequestsQuery('received');
  const [approveRequest, { isLoading: isApproving }] = useApproveRequestMutation();
  const [rejectRequest, { isLoading: isRejecting }] = useRejectRequestMutation();

  const handleApprove = async (requestId: string) => {
    try {
      await approveRequest(requestId).unwrap();
      refetch(); // Refresh the list after approval
    } catch (error: any) {
      console.error('Failed to approve request:', error);
    }
  };

  const handleReject = async (requestId: string) => {
    try {
      await rejectRequest(requestId).unwrap();
      refetch(); // Refresh the list after rejection
    } catch (error: any) {
      console.error('Failed to reject request:', error);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-BD', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
          <Clock className="h-3 w-3 mr-1" /> Pending
        </Badge>;
      case 'approved':
        return <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100">
          <CheckCircle2 className="h-3 w-3 mr-1" /> Approved
        </Badge>;
      case 'rejected':
        return <Badge variant="secondary" className="bg-red-100 text-red-800 hover:bg-red-100">
          <XCircle className="h-3 w-3 mr-1" /> Rejected
        </Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Money Requests</CardTitle>
          <CardDescription>Requests from other users</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Money Requests</CardTitle>
          <CardDescription>Requests from other users</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load money requests
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const receivedRequests = requestsData?.data || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Money Requests</CardTitle>
        <CardDescription>
          {receivedRequests.length > 0 
            ? `${receivedRequests.length} pending request${receivedRequests.length !== 1 ? 's' : ''} from other users`
            : 'No pending money requests'
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        {receivedRequests.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <User className="mx-auto h-12 w-12 mb-4" />
            <p>No money requests found</p>
            <p className="text-sm">Users will appear here when they request money from you</p>
          </div>
        ) : (
          <ScrollArea className="h-96 rounded-md">
            <div className="space-y-4">
              {receivedRequests.map((request: MoneyRequest) => (
                <Card key={request._id} className={
                  request.status === 'pending' 
                    ? 'border-yellow-200 bg-yellow-50' 
                    : request.status === 'approved'
                    ? 'border-green-200 bg-green-50'
                    : 'border-red-200 bg-red-50'
                }>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarFallback className={
                            request.status === 'pending' 
                              ? 'bg-yellow-100 text-yellow-800' 
                              : request.status === 'approved'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }>
                            {request.fromUser.name ? request.fromUser.name.charAt(0).toUpperCase() : request.fromUser.email.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{request.fromUser.name || request.fromUser.email}</p>
                          <p className="text-sm text-muted-foreground">{request.fromUser.phone || request.fromUser.email}</p>
                          {request.description && (
                            <p className="text-sm mt-1">{request.description}</p>
                          )}
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatDate(request.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">{formatCurrency(request.amount)}</p>
                        <div className="mt-2">
                          {getStatusBadge(request.status)}
                        </div>
                      </div>
                    </div>
                    
                    {request.status === 'pending' && (
                      <div className="flex space-x-2 mt-4">
                        <Button
                          size="sm"
                          onClick={() => handleApprove(request._id)}
                          disabled={isApproving}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          {isApproving ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-1" />
                          ) : (
                            <CheckCircle2 className="h-4 w-4 mr-1" />
                          )}
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleReject(request._id)}
                          disabled={isRejecting}
                          className="text-red-600 border-red-300 hover:bg-red-50"
                        >
                          {isRejecting ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-1" />
                          ) : (
                            <XCircle className="h-4 w-4 mr-1" />
                          )}
                          Reject
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}