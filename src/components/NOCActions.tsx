import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

interface NOCActionsProps {
  requestId: string;
  currentState: string;
  onUpdate: () => void;
}

export const NOCActions = ({ requestId, currentState, onUpdate }: NOCActionsProps) => {
  const { user } = useAuth();
  const [acknowledged, setAcknowledged] = useState(false);
  const [assignedResources, setAssignedResources] = useState('');
  const [clarification, setClarification] = useState('');
  const [forwardToIngest, setForwardToIngest] = useState('No');
  const [submitting, setSubmitting] = useState(false);

  const handleAcknowledge = async () => {
    if (!user) return;
    setSubmitting(true);
    
    try {
      await supabase
        .from('requests')
        .update({ noc_acknowledged: true })
        .eq('id', requestId);

      await supabase.from('workflow_transitions').insert([{
        request_id: requestId,
        from_state: currentState as any,
        to_state: 'With NOC',
        actor_id: user.id,
        role: 'NOC',
        notes: 'NOC acknowledged the request',
      }]);

      toast.success('Request acknowledged');
      onUpdate();
      setAcknowledged(true);
    } catch (error: any) {
      toast.error('Failed to acknowledge: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveUpdates = async () => {
    if (!user) return;
    setSubmitting(true);

    try {
      const updates: any = {};
      if (assignedResources) updates.noc_assigned_resources = assignedResources;
      if (clarification) updates.noc_clarification = clarification;
      if (forwardToIngest === 'Yes') updates.noc_forward_to_ingest = 'Yes';

      await supabase
        .from('requests')
        .update(updates)
        .eq('id', requestId);

      // Create resource allocation if resources assigned
      if (assignedResources) {
        await supabase.from('resource_allocations').insert([{
          request_id: requestId,
          resource_type: 'NOC Resources',
          details: assignedResources,
          allocated_by: user.id,
        }]);
      }

      await supabase.from('workflow_transitions').insert([{
        request_id: requestId,
        from_state: currentState as any,
        to_state: 'Resources Added',
        actor_id: user.id,
        role: 'NOC',
        notes: `NOC updated: ${assignedResources ? 'Resources assigned' : ''} ${clarification ? 'Clarification provided' : ''}`,
      }]);

      toast.success('Updates saved successfully');
      onUpdate();
    } catch (error: any) {
      toast.error('Failed to save updates: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRequestClarification = async () => {
    if (!user || !clarification) {
      toast.error('Please provide clarification details');
      return;
    }
    setSubmitting(true);

    try {
      await supabase
        .from('requests')
        .update({ 
          state: 'Clarification Requested',
          noc_clarification: clarification
        })
        .eq('id', requestId);

      await supabase.from('workflow_transitions').insert([{
        request_id: requestId,
        from_state: currentState as any,
        to_state: 'Clarification Requested',
        actor_id: user.id,
        role: 'NOC',
        notes: `Clarification requested: ${clarification}`,
      }]);

      toast.success('Clarification requested');
      onUpdate();
    } catch (error: any) {
      toast.error('Failed to request clarification: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleForwardToIngest = async () => {
    if (!user) return;
    setSubmitting(true);

    try {
      await supabase
        .from('requests')
        .update({ state: 'With Ingest' })
        .eq('id', requestId);

      await supabase.from('workflow_transitions').insert([{
        request_id: requestId,
        from_state: currentState as any,
        to_state: 'With Ingest',
        actor_id: user.id,
        role: 'NOC',
        notes: 'Request forwarded to Ingest team',
      }]);

      toast.success('Request forwarded to Ingest');
      onUpdate();
    } catch (error: any) {
      toast.error('Failed to forward: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>NOC Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="acknowledge">Acknowledge</Label>
          <Select value={acknowledged ? 'Yes' : 'No'} onValueChange={(v) => v === 'Yes' && handleAcknowledge()} disabled={acknowledged || submitting}>
            <SelectTrigger id="acknowledge">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="No">—</SelectItem>
              <SelectItem value="Yes">Yes</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="assignedResources">Assigned Resources (NOC)</Label>
          <Input
            id="assignedResources"
            value={assignedResources}
            onChange={(e) => setAssignedResources(e.target.value)}
            placeholder="e.g., Encoder-01, SRT-TX-A, SDI Patchbay 3"
            disabled={submitting}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="clarification">Clarification for Booking (if needed)</Label>
          <Textarea
            id="clarification"
            value={clarification}
            onChange={(e) => setClarification(e.target.value)}
            placeholder="e.g., Need guest confirmed number and SRT pub key"
            rows={3}
            disabled={submitting}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="forwardToIngest">Forward to Ingest?</Label>
          <Select value={forwardToIngest} onValueChange={setForwardToIngest} disabled={submitting}>
            <SelectTrigger id="forwardToIngest">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="No">No</SelectItem>
              <SelectItem value="Yes">Yes</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-3">
          <Button onClick={handleSaveUpdates} disabled={submitting}>
            Save NOC Updates
          </Button>
          <Button variant="outline" onClick={handleRequestClarification} disabled={submitting || !clarification}>
            Request Clarification
          </Button>
          <Button variant="default" onClick={handleForwardToIngest} disabled={submitting}>
            Send to Ingest
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
