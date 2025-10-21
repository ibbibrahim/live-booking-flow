import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockRequests, mockResources, mockTransitions } from '@/data/mockData';
import { FileText, Radio, Clock, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import { WorkflowState } from '@/types/workflow';

const AdminDashboard = () => {
  const totalRequests = mockRequests.length;
  const completedRequests = mockRequests.filter(r => r.state === 'Completed').length;
  const pendingRequests = mockRequests.filter(r => !['Completed', 'Not Done'].includes(r.state)).length;
  const urgentRequests = mockRequests.filter(r => r.priority === 'Urgent').length;
  const allocatedResources = mockResources.length;
  const totalTransitions = mockTransitions.length;

  const stateBreakdown: Record<WorkflowState, number> = {
    'Draft': 0,
    'Submitted': 0,
    'With NOC': 0,
    'Clarification Requested': 0,
    'Resources Added': 0,
    'With Ingest': 0,
    'Completed': 0,
    'Not Done': 0,
  };

  mockRequests.forEach(req => {
    stateBreakdown[req.state]++;
  });

  const bookingTypeBreakdown = mockRequests.reduce((acc, req) => {
    acc[req.bookingType] = (acc[req.bookingType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const teamActivity = {
    'Booking': mockRequests.length,
    'NOC': mockResources.length,
    'Ingest': mockRequests.filter(r => r.state === 'With Ingest' || r.state === 'Completed').length,
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Admin Dashboard</h2>
          <p className="text-muted-foreground mt-1">System-wide analytics and team performance</p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Total Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{totalRequests}</div>
              <p className="text-xs text-muted-foreground mt-1">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-success" />
                Completed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-success">{completedRequests}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {Math.round((completedRequests / totalRequests) * 100)}% completion rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Clock className="h-4 w-4 text-info" />
                Pending
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-info">{pendingRequests}</div>
              <p className="text-xs text-muted-foreground mt-1">In progress</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-warning" />
                Urgent
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-warning">{urgentRequests}</div>
              <p className="text-xs text-muted-foreground mt-1">Requires attention</p>
            </CardContent>
          </Card>
        </div>

        {/* Resource and Activity Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Radio className="h-4 w-4" />
                Resources Allocated
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{allocatedResources}</div>
              <p className="text-xs text-muted-foreground mt-1">Active allocations</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Workflow Transitions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{totalTransitions}</div>
              <p className="text-xs text-muted-foreground mt-1">State changes logged</p>
            </CardContent>
          </Card>
        </div>

        {/* Workflow State Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Requests by Workflow State</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(stateBreakdown).map(([state, count]) => {
                const percentage = totalRequests > 0 ? (count / totalRequests) * 100 : 0;
                return (
                  <div key={state}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{state}</span>
                      <span className="text-sm text-muted-foreground">{count}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary rounded-full h-2 transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Team Activity and Booking Types */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Team Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(teamActivity).map(([team, count]) => (
                  <div key={team} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-primary font-semibold">{team[0]}</span>
                      </div>
                      <span className="font-medium">{team}</span>
                    </div>
                    <span className="text-2xl font-bold text-foreground">{count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Booking Types</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(bookingTypeBreakdown).map(([type, count]) => {
                  const percentage = totalRequests > 0 ? (count / totalRequests) * 100 : 0;
                  return (
                    <div key={type} className="p-3 bg-muted rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm">{type}</span>
                        <span className="text-2xl font-bold text-foreground">{count}</span>
                      </div>
                      <div className="w-full bg-background rounded-full h-2">
                        <div
                          className="bg-accent rounded-full h-2 transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{percentage.toFixed(1)}% of total</p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
