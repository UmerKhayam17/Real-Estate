// /app/(pages)/company_admin/dealer/page.jsx
"use client";
import React from 'react';
import { useCompanyDealerRequests } from '@/hooks/useCompanyDealerRequests';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import {
  Building,
  MapPin,
  Phone,
  Mail,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  Loader2
} from 'lucide-react';
import { useState } from 'react';

export default function CompanyDealersPage() {
  const {
    pendingRequests,
    stats,
    isLoading,
    respondToRequest,
    isResponding,
  } = useCompanyDealerRequests();

  const [selectedRequest, setSelectedRequest] = useState(null);
  const [responseDialog, setResponseDialog] = useState(false);
  const [responseAction, setResponseAction] = useState('');
  const [responseReason, setResponseReason] = useState('');

  const handleResponse = (request, action) => {
    setSelectedRequest(request);
    setResponseAction(action);
    setResponseDialog(true);
  };

  const confirmResponse = () => {
    if (selectedRequest) {
      respondToRequest({
        requestId: selectedRequest.requestId,
        action: responseAction,
        reason: responseReason,
      });
      setResponseDialog(false);
      setSelectedRequest(null);
      setResponseReason('');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dealer Management</h1>
        <p className="text-muted-foreground mt-2">
          Manage dealer join requests and your company&apos;s dealer team
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Dealers</p>
                <p className="text-2xl font-bold">{stats.currentDealers}</p>
              </div>
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Requests</p>
                <p className="text-2xl font-bold">{stats.totalPending}</p>
              </div>
              <Clock className="h-8 w-8 text-amber-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Dealer Limit</p>
                <p className="text-2xl font-bold">{stats.dealerLimit}</p>
              </div>
              <Building className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Available Slots</p>
                <p className="text-2xl font-bold text-green-600">
                  {Math.max(0, stats.dealerLimit - stats.currentDealers)}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pending" className="space-y-6">
        <TabsList>
          <TabsTrigger value="pending" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Pending Requests ({stats.totalPending})
          </TabsTrigger>
          <TabsTrigger value="approved" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Approved Dealers ({stats.currentDealers})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {pendingRequests.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Pending Requests</h3>
                <p className="text-muted-foreground">
                  You don&apos;t have any pending dealer join requests at the moment.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {pendingRequests.map((request) => (
                <Card key={request.requestId}>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-lg font-semibold">
                            {request.dealer.businessName}
                          </h3>
                          <Badge variant="outline" className="bg-amber-50 text-amber-700">
                            Pending
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <span>{request.dealer.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            <span>{request.dealer.email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            <span>{request.dealer.phone}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span>{request.dealer.officeCity}</span>
                          </div>
                        </div>

                        {request.dealer.yearsOfExperience > 0 && (
                          <div className="mt-2">
                            <Badge variant="secondary">
                              {request.dealer.yearsOfExperience} years experience
                            </Badge>
                          </div>
                        )}

                        <div className="mt-3 text-xs text-muted-foreground flex items-center gap-2">
                          <Calendar className="h-3 w-3" />
                          Requested {new Date(request.requestedAt).toLocaleDateString()}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleResponse(request, 'approve')}
                          disabled={!stats.canAcceptMore}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Approve
                        </Button>
                        <Button
                          onClick={() => handleResponse(request, 'reject')}
                          variant="outline"
                          className="text-red-600 border-red-200 hover:bg-red-50"
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Reject
                        </Button>
                      </div>
                    </div>

                    {!stats.canAcceptMore && (
                      <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
                        <p className="text-sm text-red-700">
                          Cannot approve more dealers. You&apos;ve reached your dealer limit of {stats.dealerLimit}.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="approved">
          <Card>
            <CardHeader>
              <CardTitle>Approved Dealers</CardTitle>
              <CardDescription>
                Dealers who are currently part of your company
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-8">
                This section will show your approved dealers. You can manage them here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Response Dialog */}
      <Dialog open={responseDialog} onOpenChange={setResponseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {responseAction === 'approve' ? 'Approve Dealer Request' : 'Reject Dealer Request'}
            </DialogTitle>
            <DialogDescription>
              {responseAction === 'approve'
                ? `Are you sure you want to approve ${selectedRequest?.dealer?.name} to join your company?`
                : `Are you sure you want to reject ${selectedRequest?.dealer?.name}'s join request?`
              }
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {responseAction === 'approve' ? 'Welcome Message (Optional)' : 'Rejection Reason (Optional)'}
              </label>
              <Textarea
                placeholder={
                  responseAction === 'approve'
                    ? 'Add a welcome message for the dealer...'
                    : 'Provide a reason for rejection...'
                }
                value={responseReason}
                onChange={(e) => setResponseReason(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setResponseDialog(false)}
              disabled={isResponding}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmResponse}
              disabled={isResponding}
              variant={responseAction === 'approve' ? 'default' : 'destructive'}
            >
              {isResponding ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              {responseAction === 'approve' ? 'Approve Request' : 'Reject Request'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}