import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { CallsheetRequest, RoleType } from '../types';
import { CallsheetStatusBadge } from './CallsheetStatusBadge';
import { Car, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CallsheetListProps {
  requests: CallsheetRequest[];
  onSelect: (request: CallsheetRequest) => void;
  currentRole: RoleType;
}

export const CallsheetList = ({ requests, onSelect, currentRole }: CallsheetListProps) => {
  // Filter for Technical Store view
  const filteredRequests = currentRole === 'TechnicalStore'
    ? requests.filter(r => r.status === 'PendingTechnical' || r.status === 'ClarificationRequested')
    : requests;

  if (filteredRequests.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground bg-card rounded-lg border">
        {currentRole === 'TechnicalStore' 
          ? 'No pending requests to review.'
          : 'No callsheets found. Create your first one!'}
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Created By</TableHead>
            <TableHead>Driver</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Action By</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredRequests.map((request) => (
            <TableRow key={request.id} className="cursor-pointer hover:bg-muted/50">
              <TableCell className="font-medium">{request.title}</TableCell>
              <TableCell>{format(new Date(request.date), 'MM/dd/yyyy')}</TableCell>
              <TableCell>{request.createdBy}</TableCell>
              <TableCell>
                {request.driverNeeded && <Car className="h-4 w-4 text-muted-foreground" />}
              </TableCell>
              <TableCell>
                <CallsheetStatusBadge status={request.status} />
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">{request.lastActionBy}</TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onSelect(request)}
                  className="gap-1"
                >
                  <Eye className="h-4 w-4" />
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
