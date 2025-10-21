import { WorkflowState } from '@/types/workflow';
import { Badge } from '@/components/ui/badge';

const statusConfig: Record<WorkflowState, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; className: string }> = {
  'Draft': { variant: 'outline', className: 'bg-muted text-muted-foreground border-muted-foreground/20' },
  'Submitted': { variant: 'default', className: 'bg-info text-info-foreground' },
  'With NOC': { variant: 'default', className: 'bg-primary text-primary-foreground' },
  'Clarification Requested': { variant: 'default', className: 'bg-warning text-warning-foreground' },
  'Resources Added': { variant: 'default', className: 'bg-primary text-primary-foreground' },
  'With Ingest': { variant: 'default', className: 'bg-info text-info-foreground' },
  'Completed': { variant: 'default', className: 'bg-success text-success-foreground' },
  'Not Done': { variant: 'destructive', className: '' },
};

interface StatusBadgeProps {
  status: WorkflowState;
  className?: string;
}

export const StatusBadge = ({ status, className = '' }: StatusBadgeProps) => {
  const config = statusConfig[status];
  
  return (
    <Badge variant={config.variant} className={`${config.className} ${className}`}>
      {status}
    </Badge>
  );
};
