// src/pages/Admin/AgentManagement.tsx
import { useState } from "react";
import {
  Search,
  Filter,
  MoreVertical,
  User,
  Eye,
  CheckCircle,
  XCircle,
  Loader2,
  UserCheck,
  UserX
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
  DialogFooter,
} from "@/components/ui/dialog";
import {
  useGetAllAgentsQuery,
  useGetPendingAgentsQuery,
  useUpdateAgentStatusMutation
} from "@/redux/features/admin/admin.api";
import { UserStatus } from "@/types/user.types";
import { formatCurrency, formatDate } from "@/utils/utils";

interface Agent {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  status: UserStatus;
  createdAt: string;
  wallet?: {
    balance: number;
    currency: string;
    status: string;
  };
}

export default function AgentManagement() {
  const [activeTab, setActiveTab] = useState<"all" | "pending">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [statusAction, setStatusAction] = useState<"approve" | "reject">("approve");
const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);

  const { data: allAgentsData, isLoading: allAgentsLoading, refetch: refetchAll } = useGetAllAgentsQuery(undefined);
  const { data: pendingAgentsData, isLoading: pendingAgentsLoading, refetch: refetchPending } = useGetPendingAgentsQuery(undefined);
  const [updateAgentStatus, { isLoading: isUpdating }] = useUpdateAgentStatusMutation();

  const allAgents = allAgentsData?.data || [];
  const pendingAgents = pendingAgentsData?.data || [];
console.log('agent',allAgentsData)
  const agents = activeTab === "all" ? allAgents : pendingAgents;
  const isLoading = activeTab === "all" ? allAgentsLoading : pendingAgentsLoading;

  const handleStatusUpdate = async () => {
    if (!selectedAgent) return;

    try {
      await updateAgentStatus({
        agentId: selectedAgent._id,
        status: statusAction === "approve" ? UserStatus.ACTIVE : UserStatus.BLOCKED
      }).unwrap();

      setIsStatusDialogOpen(false);
      refetchAll();
      refetchPending();
    } catch (error) {
      console.error("Failed to update agent status:", error);
    }
  };

  const openStatusDialog = (agent: Agent, action: "approve" | "reject") => {
    setSelectedAgent(agent);
    setStatusAction(action);
    setIsStatusDialogOpen(true);
  };

  const getStatusVariant = (status: UserStatus) => {
    switch (status) {
      case UserStatus.ACTIVE:
        return "success";
      case UserStatus.BLOCKED:
        return "destructive";
      case UserStatus.PENDING:
        return "secondary";
      default:
        return "outline";
    }
  };

  const filteredAgents = agents.filter((agent: Agent) =>
    agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (agent.phone && agent.phone.includes(searchTerm))
  );

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Agent Management</h1>
          <p className="text-muted-foreground">Manage agent accounts and approvals</p>
        </div>
      </div>

      <div className="flex space-x-1 rounded-lg bg-muted p-1">
        <Button
          variant={activeTab === "all" ? "default" : "ghost"}
          className="flex-1"
          onClick={() => setActiveTab("all")}
        >
          <UserCheck className="h-4 w-4 mr-2" />
          All Agents ({allAgents.length})
        </Button>
        <Button
          variant={activeTab === "pending" ? "default" : "ghost"}
          className="flex-1"
          onClick={() => setActiveTab("pending")}
        >
          <UserX className="h-4 w-4 mr-2" />
          Pending Approval ({pendingAgents.length})
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle>
              {activeTab === "all" ? "All Agents" : "Pending Agents"}
            </CardTitle>
            <CardDescription>
              {filteredAgents.length} agents found
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search agents..."
                className="pl-10 w-[250px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Agent</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Balance</TableHead>
                <TableHead>Joined</TableHead>
                {activeTab === "pending" && <TableHead>Action</TableHead>}
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={activeTab === "pending" ? 6 : 5} className="h-24 text-center">
                    <div className="flex items-center justify-center">
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Loading agents...
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredAgents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={activeTab === "pending" ? 6 : 5} className="h-24 text-center">
                    No agents found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredAgents.map((agent: Agent) => (
                  <TableRow key={agent._id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                          <User className="w-4 h-4" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium">{agent.name}</span>
                          <span className="text-sm text-muted-foreground">{agent.email}</span>
                          {agent.phone && (
                            <span className="text-sm text-muted-foreground">{agent.phone}</span>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(agent.status)}>
                        {agent.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-semibold">
                      {agent.wallet ? formatCurrency(agent.wallet.balance) : 'N/A'}
                    </TableCell>
                    <TableCell>{formatDate(agent.createdAt)}</TableCell>
                    {activeTab === "pending" && (
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 px-2"
                            onClick={() => openStatusDialog(agent, 'approve')}
                          >
                            <CheckCircle className="h-3 w-3 mr-1 text-green-600" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 px-2"
                            onClick={() => openStatusDialog(agent, 'reject')}
                          >
                            <XCircle className="h-3 w-3 mr-1 text-red-600" />
                            Reject
                          </Button>
                        </div>
                      </TableCell>
                    )}
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => {
  setSelectedAgent(agent);
  setIsDetailsDialogOpen(true);
}}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          {agent.status === UserStatus.ACTIVE ? (
                            <DropdownMenuItem onClick={() => openStatusDialog(agent, 'reject')}>
                              <XCircle className="h-4 w-4 mr-2 text-red-600" />
                              Suspend Agent
                            </DropdownMenuItem>
                          ) : agent.status === UserStatus.BLOCKED ? (
                            <DropdownMenuItem onClick={() => openStatusDialog(agent, 'approve')}>
                              <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                              Activate Agent
                            </DropdownMenuItem>
                          ) : null}
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

      {/* Status Update Dialog */}
      <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {statusAction === 'approve' ? 'Approve Agent' : 'Reject Agent'}
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to {statusAction} {selectedAgent?.name}?
              {statusAction === 'reject' && ' This will block the agent account.'}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsStatusDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleStatusUpdate}
              disabled={isUpdating}
              variant={statusAction === 'approve' ? 'default' : 'destructive'}
            >
              {isUpdating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                `${statusAction === 'approve' ? 'Approve' : 'Reject'} Agent`
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Agent Details Dialog */}
<Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
  <DialogContent className="sm:max-w-lg">
    <DialogHeader>
      <DialogTitle>Agent Details</DialogTitle>
      <DialogDescription>
        Information about {selectedAgent?.name}
      </DialogDescription>
    </DialogHeader>
    {selectedAgent && (
      <div className="space-y-3">
        <p><strong>Name:</strong> {selectedAgent.name}</p>
        <p><strong>Email:</strong> {selectedAgent.email}</p>
        <p><strong>Phone:</strong> {selectedAgent.phone || "N/A"}</p>
        <p><strong>Status:</strong> {selectedAgent.status}</p>
        <p><strong>Joined:</strong> {formatDate(selectedAgent.createdAt)}</p>
        {selectedAgent.wallet && (
          <p>
            <strong>Wallet:</strong>{" "}
            {formatCurrency(selectedAgent.wallet.balance)} {selectedAgent.wallet.currency} ({selectedAgent.wallet.status})
          </p>
        )}
      </div>
    )}
    <DialogFooter>
      <Button onClick={() => setIsDetailsDialogOpen(false)}>Close</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

    </div>
  );
}