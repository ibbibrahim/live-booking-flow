import { Badge } from '@/components/ui/badge';
import { CallsheetStatus } from '../types';

const statusConfig: Record<CallsheetStatus, { className: string; label: string }> = {
  'New': { className: 'bg-muted text-muted-foreground', label: 'New' },
  'PendingTechnical': { className: 'bg-orange-500/20 text-orange-600 dark:text-orange-400', label: 'Pending Technical' },
  'PendingRequesterApproval': { className: 'bg-blue-500/20 text-blue-600 dark:text-blue-400', label: 'Pending Approval' },
  'ClarificationRequested': { className: 'bg-purple-500/20 text-purple-600 dark:text-purple-400', label: 'Clarification Requested' },
  'Completed': { className: 'bg-green-500/20 text-green-600 dark:text-green-400', label: 'Completed' },
};

interface CallsheetStatusBadgeProps {
  status: CallsheetStatus;
  className?: string;
}

export const CallsheetStatusBadge = ({ status, className = '' }: CallsheetStatusBadgeProps) => {
  const config = statusConfig[status];
  
  return (
    <Badge variant="outline" className={`${config.className} border-0 ${className}`}>
      {config.label}
    </Badge>
  );
};
