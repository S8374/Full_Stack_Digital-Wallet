/* eslint-disable @typescript-eslint/no-unused-vars */
// src/pages/Admin/TransactionManagement.tsx
import { useState } from "react";
import {
  Search,
  Filter,
  MoreVertical,
  Eye,
  Download,
  Calendar,
  ArrowUpRight,
  ArrowDownLeft,
  CheckCircle,
  XCircle,
  Clock,
  Loader2
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  useGetAllTransactionsQuery,
} from "@/redux/features/admin/admin.api";
import { formatCurrency, formatDate, formatDateTime } from "@/utils/utils";

interface Transaction {
  _id: string;
  type: string;
  amount: number;
  fee: number;
  commission: number;
  netAmount: number;
  status: string;
  reference: string;
  description: string;
  createdAt: string;
  initiatedBy: {
    _id: string;
    name: string;
    email: string;
  };
  fromWallet?: {
    userId: {
      _id: string;
      name: string;
      email: string;
    };
    balance: number;
    currency: string;
  };
  toWallet?: {
    userId: {
      _id: string;
      name: string;
      email: string;
    };
    balance: number;
    currency: string;
  };
}

export default function TransactionManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const { data: transactionsData, isLoading } = useGetAllTransactionsQuery({
    page: 1,
    limit: 50
  });

  const transactions = transactionsData?.data?.transactions || [];
  const pagination = transactionsData?.data?.pagination;

  const openTransactionDetail = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsDetailDialogOpen(true);
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'secondary';
      case 'failed':
        return 'destructive';
      case 'processing':
        return 'default';
      default:
        return 'outline';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'deposit':
      case 'cash_in':
        return <ArrowDownLeft className="h-4 w-4 text-green-600" />;
      case 'withdrawal':
      case 'cash_out':
        return <ArrowUpRight className="h-4 w-4 text-red-600" />;
      case 'transfer':
        return <ArrowUpRight className="h-4 w-4 text-blue-600" />;
      default:
        return null;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'deposit': return 'Deposit';
      case 'withdrawal': return 'Withdrawal';
      case 'transfer': return 'Transfer';
      case 'cash_in': return 'Cash In';
      case 'cash_out': return 'Cash Out';
      default: return type;
    }
  };

  const filteredTransactions = transactions.filter((transaction: Transaction) =>
    transaction.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.initiatedBy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.initiatedBy.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transaction Management</h1>
          <p className="text-muted-foreground">Monitor and manage all system transactions</p>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Total Transactions</p>
                <p className="text-2xl font-bold">{pagination?.total || 0}</p>
              </div>
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <ArrowUpRight className="h-4 w-4 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Completed</p>
                <p className="text-2xl font-bold">
                  {transactions.filter((t: { status: string; }) => t.status === 'completed').length}
                </p>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Pending</p>
                <p className="text-2xl font-bold">
                  {transactions.filter((t: { status: string; }) => t.status === 'pending').length}
                </p>
              </div>
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <Clock className="h-4 w-4 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Failed</p>
                <p className="text-2xl font-bold">
                  {transactions.filter((t: { status: string; }) => t.status === 'failed').length}
                </p>
              </div>
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <XCircle className="h-4 w-4 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle>Transactions</CardTitle>
            <CardDescription>
              {filteredTransactions.length} transactions found
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search transactions..."
                className="pl-10 w-[250px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Calendar className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    <div className="flex items-center justify-center">
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Loading transactions...
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredTransactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No transactions found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredTransactions.map((transaction: Transaction) => (
                  <TableRow key={transaction._id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{transaction.reference}</span>
                        <span className="text-sm text-muted-foreground">
                          {transaction.description}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getTypeIcon(transaction.type)}
                        <span>{getTypeLabel(transaction.type)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{transaction.initiatedBy.name}</span>
                        <span className="text-sm text-muted-foreground">
                          {transaction.initiatedBy.email}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold">
                      {formatCurrency(transaction.amount)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(transaction.status)}>
                        {transaction.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(transaction.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openTransactionDetail(transaction)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Transaction Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Transaction Details</DialogTitle>
            <DialogDescription>
              Reference: {selectedTransaction?.reference}
            </DialogDescription>
          </DialogHeader>
          {selectedTransaction && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Transaction Information</h4>
                  <div className="text-sm">
                    <p><strong>Type:</strong> {getTypeLabel(selectedTransaction.type)}</p>
                    <p><strong>Amount:</strong> {formatCurrency(selectedTransaction.amount)}</p>
                    <p><strong>Fee:</strong> {formatCurrency(selectedTransaction.fee)}</p>
                    <p><strong>Commission:</strong> {formatCurrency(selectedTransaction.commission)}</p>
                    <p><strong>Net Amount:</strong> {formatCurrency(selectedTransaction.netAmount)}</p>
                    <p><strong>Status:</strong> 
                      <Badge variant={getStatusVariant(selectedTransaction.status)} className="ml-2">
                        {selectedTransaction.status}
                      </Badge>
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">User Information</h4>
                  <div className="text-sm">
                    <p><strong>Initiated By:</strong> {selectedTransaction.initiatedBy.name}</p>
                    <p><strong>Email:</strong> {selectedTransaction.initiatedBy.email}</p>
                    <p><strong>Date:</strong> {formatDateTime(selectedTransaction.createdAt)}</p>
                    <p><strong>Description:</strong> {selectedTransaction.description}</p>
                  </div>
                </div>
              </div>

              {(selectedTransaction.fromWallet || selectedTransaction.toWallet) && (
                <div className="space-y-2">
                  <h4 className="font-medium">Wallet Information</h4>
                  <div className="text-sm grid grid-cols-2 gap-4">
                    {selectedTransaction.fromWallet && (
                      <div>
                        <p><strong>From:</strong> {selectedTransaction.fromWallet.userId.name}</p>
                        <p><strong>Balance:</strong> {formatCurrency(selectedTransaction.fromWallet.balance)}</p>
                      </div>
                    )}
                    {selectedTransaction.toWallet && (
                      <div>
                        <p><strong>To:</strong> {selectedTransaction.toWallet.userId.name}</p>
                        <p><strong>Balance:</strong> {formatCurrency(selectedTransaction.toWallet.balance)}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}