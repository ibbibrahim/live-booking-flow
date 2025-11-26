import { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { StatusBadge } from '@/components/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Search, RefreshCw, Filter, Download, Edit, Trash2, MoreHorizontal } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { WorkflowState, Priority } from '@/types/workflow';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { useRealtimeRequests } from '@/hooks/useRealtimeRequests';
import { toast } from 'sonner';

const Dashboard = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterState, setFilterState] = useState<WorkflowState | 'All'>('All');
  const [filterPriority, setFilterPriority] = useState<Priority | 'All'>('All');
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const { isConnected } = useRealtimeRequests({
    onRequestCreated: (data) => {
      console.log('New request created:', data);
      setRequests(prev => [data, ...prev]);
    },
    onRequestUpdated: (data) => {
      console.log('Request updated:', data);
      setRequests(prev => 
        prev.map(req => req.id === data.id ? { ...req, ...data } : req)
      );
    },
    onRequestDeleted: (data) => {
      console.log('Request deleted:', data);
      setRequests(prev => prev.filter(req => req.id !== data.id));
    },
  });

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

  const getFilteredRequests = () => {
    let filtered = requests;

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

  const filteredRequests = getFilteredRequests();

  const workflowStates: WorkflowState[] = [
    'Draft',
    'Submitted',
    'With NOC',
    'Clarification Requested',
    'Resources Added',
    'With Ingest',
    'Completed',
    'Not Done'
  ];

  const getRequestsByState = (state: WorkflowState) => {
    return filteredRequests.filter(req => req.state === state);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this request?')) {
      try {
        await supabase.from('requests').delete().eq('id', id);
        fetchRequests();
      } catch (error) {
        console.error('Error deleting request:', error);
      }
    }
  };

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
            <p className="text-sm text-muted-foreground mb-1">Requests</p>
            <h2 className="text-3xl font-bold text-foreground">Requests</h2>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={fetchRequests}>
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button onClick={() => navigate('/request/new')} className="gap-2">
              <Plus className="h-4 w-4" />
              Create
            </Button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="bg-muted/50 rounded-lg p-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex flex-wrap gap-2">
              <Select value={filterState} onValueChange={(val) => setFilterState(val as WorkflowState | 'All')}>
                <SelectTrigger className="w-[160px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="State" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All States</SelectItem>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Submitted">Submitted</SelectItem>
                  <SelectItem value="With NOC">With NOC</SelectItem>
                  <SelectItem value="Clarification Requested">Clarification</SelectItem>
                  <SelectItem value="Resources Added">Resources Added</SelectItem>
                  <SelectItem value="With Ingest">With Ingest</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Not Done">Not Done</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Download className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </div>

        {/* Kanban Board */}
        <ScrollArea className="w-full">
          <div className="flex gap-4 pb-4 min-w-max">
            {workflowStates.map((state) => {
              const stateRequests = getRequestsByState(state);
              
              return (
                <div key={state} className="flex-shrink-0 w-[320px]">
                  <Card className="h-full bg-muted/30">
                    <CardHeader className="pb-3 space-y-0">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-medium text-muted-foreground uppercase">
                          {state}
                        </CardTitle>
                        <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                          {stateRequests.length}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <ScrollArea className="h-[calc(100vh-320px)]">
                        <div className="space-y-2 pr-4">
                          {stateRequests.map((request) => (
                            <Card 
                              key={request.id}
                              className="cursor-pointer hover:shadow-md transition-shadow bg-card"
                              onClick={() => navigate(`/request/${request.id}`)}
                            >
                              <CardContent className="p-3 space-y-2">
                                <div className="flex items-start justify-between gap-2">
                                  <h4 className="text-sm font-medium leading-tight line-clamp-2">
                                    {request.title}
                                  </h4>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 flex-shrink-0"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                    }}
                                  >
                                    <MoreHorizontal className="h-3 w-3" />
                                  </Button>
                                </div>
                                
                                <div className="space-y-1.5">
                                  <p className="text-xs text-muted-foreground line-clamp-1">
                                    {request.program_segment}
                                  </p>
                                  
                                  <div className="flex items-center justify-between gap-2">
                                    <span className="text-xs text-muted-foreground">
                                      {format(new Date(request.air_date_time), 'MMM dd, yyyy')}
                                    </span>
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                                      request.priority === 'Urgent' 
                                        ? 'bg-warning/10 text-warning' 
                                        : request.priority === 'High'
                                        ? 'bg-accent/10 text-accent'
                                        : 'bg-muted text-muted-foreground'
                                    }`}>
                                      {request.priority}
                                    </span>
                                  </div>
                                  
                                  <p className="text-xs font-mono text-muted-foreground">
                                    {request.id?.slice(0, 8)}
                                  </p>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                          
                          {stateRequests.length === 0 && (
                            <div className="text-center py-8 text-sm text-muted-foreground">
                              No requests
                            </div>
                          )}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </div>
    </Layout>
  );
};

export default Dashboard;
