import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

interface IngestActionsProps {
  requestId: string;
  currentState: string;
  onUpdate: () => void;
}

export const IngestActions = ({ requestId, currentState, onUpdate }: IngestActionsProps) => {
  const { user } = useAuth();
  const [ingestStatus, setIngestStatus] = useState('');
  const [notDoneReason, setNotDoneReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleUpdateStatus = async () => {
    if (!user || !ingestStatus) {
      toast.error('Please select a status');
      return;
    }

    if (ingestStatus === 'Not Done' && !notDoneReason) {
      toast.error('Please provide a reason for Not Done');
      return;
    }

    setSubmitting(true);

    try {
      const updates: any = {
        state: ingestStatus,
        ingest_status: ingestStatus,
      };

      if (ingestStatus === 'Not Done') {
        updates.ingest_not_done_reason = notDoneReason;
      }

      await supabase
        .from('requests')
        .update(updates)
        .eq('id', requestId);

      await supabase.from('workflow_transitions').insert([{
        request_id: requestId,
        from_state: currentState as any,
        to_state: ingestStatus as any,
        actor_id: user.id,
        role: 'Ingest',
        notes: ingestStatus === 'Not Done' 
          ? `Not Done: ${notDoneReason}` 
          : 'Request completed successfully',
      }]);

      toast.success(`Status updated to ${ingestStatus}`);
      onUpdate();
    } catch (error: any) {
      toast.error('Failed to update status: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ingest Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="ingestStatus">Ingest Status</Label>
          <Select value={ingestStatus} onValueChange={setIngestStatus} disabled={submitting}>
            <SelectTrigger id="ingestStatus">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Not Done">Not Done</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {ingestStatus === 'Not Done' && (
          <div className="space-y-2">
            <Label htmlFor="notDoneReason">If Not Done, Reason</Label>
            <Input
              id="notDoneReason"
              value={notDoneReason}
              onChange={(e) => setNotDoneReason(e.target.value)}
              placeholder="e.g., Source failure, file missing, guest no-show"
              disabled={submitting}
            />
          </div>
        )}

        <Button onClick={handleUpdateStatus} disabled={submitting || !ingestStatus}>
          Update Ingest Status
        </Button>
      </CardContent>
    </Card>
  );
};
