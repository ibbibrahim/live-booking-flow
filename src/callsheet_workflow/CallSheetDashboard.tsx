import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ClipboardList, Wrench } from 'lucide-react';
import { toast } from 'sonner';
import { CallsheetRequest, RoleType } from './types';
import { initialCallsheetRequests } from './callsheetStore';
import { CallsheetCreateForm } from './components/CallsheetCreateForm';
import { CallsheetList } from './components/CallsheetList';
import { CallsheetDetailPanel } from './components/CallsheetDetailPanel';

const CallSheetDashboard = () => {
  const [currentRole, setCurrentRole] = useState<RoleType>('Callsheet');
  const [requests, setRequests] = useState<CallsheetRequest[]>(initialCallsheetRequests);
  const [selectedRequest, setSelectedRequest] = useState<CallsheetRequest | null>(null);

  const handleCreateRequest = (newRequest: Omit<CallsheetRequest, 'id' | 'equipmentAssigned' | 'status' | 'lastActionBy' | 'lastComment'>) => {
    const status = newRequest.driverNeeded ? 'PendingTechnical' : 'Completed';
    const request: CallsheetRequest = {
      ...newRequest,
      id: Math.max(0, ...requests.map(r => r.id)) + 1,
      equipmentAssigned: [...newRequest.equipmentRequested],
      status,
      lastActionBy: 'Callsheet',
      lastComment: '',
    };
    setRequests(prev => [request, ...prev]);
    toast.success(
      status === 'Completed' 
        ? 'Callsheet created and completed (no driver needed)' 
        : 'Callsheet created and sent to Technical Store'
    );
  };

  const handleUpdateRequest = (updatedRequest: CallsheetRequest) => {
    setRequests(prev => prev.map(r => r.id === updatedRequest.id ? updatedRequest : r));
    toast.success('Request updated successfully');
  };

  const handleSelectRequest = (request: CallsheetRequest) => {
    setSelectedRequest(request);
  };

  const handleCloseDetail = () => {
    setSelectedRequest(null);
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header with Role Toggle */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Call Sheet Workflow</h2>
            <p className="text-muted-foreground mt-1">
              {currentRole === 'Callsheet' 
                ? 'Create and manage your callsheet requests' 
                : 'Review and assign equipment for callsheet requests'}
            </p>
          </div>
          <Tabs value={currentRole} onValueChange={(v) => {
            setCurrentRole(v as RoleType);
            setSelectedRequest(null);
          }}>
            <TabsList>
              <TabsTrigger value="Callsheet" className="gap-2">
                <ClipboardList className="h-4 w-4" />
                View as Callsheet
              </TabsTrigger>
              <TabsTrigger value="TechnicalStore" className="gap-2">
                <Wrench className="h-4 w-4" />
                View as Technical Store
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Main Content */}
        {selectedRequest ? (
          <CallsheetDetailPanel
            request={selectedRequest}
            currentRole={currentRole}
            onClose={handleCloseDetail}
            onUpdate={handleUpdateRequest}
          />
        ) : (
          <div className="space-y-6">
            {/* Create Form - Only for Callsheet view */}
            {currentRole === 'Callsheet' && (
              <CallsheetCreateForm onSubmit={handleCreateRequest} />
            )}

            {/* List */}
            <div>
              <h3 className="text-lg font-semibold mb-4">
                {currentRole === 'Callsheet' ? 'All Callsheets' : 'Pending Requests'}
              </h3>
              <CallsheetList
                requests={requests}
                onSelect={handleSelectRequest}
                currentRole={currentRole}
              />
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CallSheetDashboard;
