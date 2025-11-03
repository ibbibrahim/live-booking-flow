import { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { StatusBadge } from '@/components/StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Search, RefreshCw, Grid, List, Filter, Download, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
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
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const paginatedRequests = filteredRequests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
              <Button 
                variant={viewMode === 'grid' ? 'default' : 'outline'} 
                size="icon"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button 
                variant={viewMode === 'list' ? 'default' : 'outline'} 
                size="icon"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
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

        {/* Table */}
        <div className="bg-card rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Program</TableHead>
                <TableHead>Air Date</TableHead>
                <TableHead>State</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedRequests.map((request) => (
                <TableRow 
                  key={request.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => navigate(`/request/${request.id}`)}
                >
                  <TableCell className="font-mono text-xs">{request.id?.slice(0, 8)}</TableCell>
                  <TableCell className="font-medium">{request.title}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{request.program_segment}</TableCell>
                  <TableCell className="text-sm">
                    {format(new Date(request.air_date_time), 'MM/dd/yyyy')}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={request.state} />
                  </TableCell>
                  <TableCell>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      request.priority === 'Urgent' 
                        ? 'bg-warning/10 text-warning' 
                        : request.priority === 'High'
                        ? 'bg-accent/10 text-accent'
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {request.priority}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/request/${request.id}`);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(request.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {paginatedRequests.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                    No requests found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {filteredRequests.length > 0 
              ? `${(currentPage - 1) * itemsPerPage + 1}-${Math.min(currentPage * itemsPerPage, filteredRequests.length)} of ${filteredRequests.length}`
              : '0 results'}
          </p>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm">
              Page {currentPage} of {totalPages || 1}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
