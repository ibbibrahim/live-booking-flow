import { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { StatusBadge } from '@/components/StatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Search, Calendar, User, AlertCircle } from 'lucide-react';
import { WorkflowState, Priority } from '@/types/workflow';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
const Dashboard = () => {
  const navigate = useNavigate();
  // Temporarily disable auth for demo purposes
  const userRole = 'Admin'; // Mock role for testing
  const [searchTerm, setSearchTerm] = useState('');
  const [filterState, setFilterState] = useState<WorkflowState | 'All'>('All');
  const [filterPriority, setFilterPriority] = useState<Priority | 'All'>('All');
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredRequests = (roleFilter?: string) => {
    let filtered = requests;

    // Role-based filtering
    if (roleFilter === 'booking') {
      // Show all requests for booking view
      filtered = requests;
    } else if (roleFilter === 'noc') {
      filtered = filtered.filter(r => 
        r.noc_required === 'Yes' && 
        ['Submitted', 'With NOC', 'Clarification Requested', 'Resources Added'].includes(r.state)
      );
    } else if (roleFilter === 'ingest') {
      filtered = filtered.filter(r => 
        ['With Ingest', 'Completed', 'Not Done'].includes(r.state)
      );
    }

    // Search and filters
    filtered = filtered.filter((req) => {
      const matchesSearch = 
        req.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.program_segment?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesState = filterState === 'All' || req.state === filterState;
      const matchesPriority = filterPriority === 'All' || req.priority === filterPriority;
      
      return matchesSearch && matchesState && matchesPriority;
    });

    return filtered;
  };

  const bookingRequests = getFilteredRequests('booking');
  const nocRequests = getFilteredRequests('noc');
  const ingestRequests = getFilteredRequests('ingest');

  const urgentCount = requests.filter(r => r.priority === 'Urgent').length;
  const pendingCount = requests.filter(r => 
    !['Completed', 'Not Done'].includes(r.state)
  ).length;

  const RequestsList = ({ requests }: { requests: any[] }) => (
    <div className="space-y-3">
      {requests.map((request) => (
        <Card 
          key={request.id} 
          className="hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => navigate(`/request/${request.id}`)}
        >
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex-1 space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-mono text-muted-foreground">{request.id}</span>
                  <StatusBadge status={request.state} />
                  {request.priority === 'Urgent' && (
                    <span className="text-xs px-2 py-1 rounded-full bg-warning/10 text-warning font-medium">
                      URGENT
                    </span>
                  )}
                  {request.priority === 'High' && (
                    <span className="text-xs px-2 py-1 rounded-full bg-accent/10 text-accent font-medium">
                      HIGH
                    </span>
                  )}
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{request.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{request.program_segment}</p>
                </div>
                
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{format(new Date(request.air_date_time), 'MMM dd, yyyy · HH:mm')}</span>
                  </div>
                  <div className="px-2 py-1 rounded-md bg-secondary text-secondary-foreground text-xs font-medium">
                    {request.booking_type}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      
      {requests.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground">No requests found</p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Workflow Dashboard</h2>
            <p className="text-muted-foreground mt-1">Manage booking requests across teams</p>
          </div>
          <Button onClick={() => navigate('/request/new')} className="gap-2">
            <Plus className="h-4 w-4" />
            New Request
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{requests.length}</div>
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
              <div className="text-3xl font-bold text-warning">{urgentCount}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-info">{pendingCount}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by ID, title, or program..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              
              <Select value={filterState} onValueChange={(val) => setFilterState(val as WorkflowState | 'All')}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Filter by state" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All States</SelectItem>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Submitted">Submitted</SelectItem>
                  <SelectItem value="With NOC">With NOC</SelectItem>
                  <SelectItem value="Clarification Requested">Clarification Requested</SelectItem>
                  <SelectItem value="Resources Added">Resources Added</SelectItem>
                  <SelectItem value="With Ingest">With Ingest</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Not Done">Not Done</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={filterPriority} onValueChange={(val) => setFilterPriority(val as Priority | 'All')}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Priorities</SelectItem>
                  <SelectItem value="Normal">Normal</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Tabs for different views */}
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All Requests</TabsTrigger>
            <TabsTrigger value="booking">Booking Requests</TabsTrigger>
            <TabsTrigger value="noc">NOC Queue</TabsTrigger>
            <TabsTrigger value="ingest">Ingest Queue</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <RequestsList requests={getFilteredRequests()} />
          </TabsContent>

          <TabsContent value="booking">
            <RequestsList requests={bookingRequests} />
          </TabsContent>

          <TabsContent value="noc">
            <RequestsList requests={nocRequests} />
          </TabsContent>

          <TabsContent value="ingest">
            <RequestsList requests={ingestRequests} />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Dashboard;
