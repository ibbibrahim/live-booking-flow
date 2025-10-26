import { Layout } from '@/components/Layout';
import { StatusBadge } from '@/components/StatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Radio, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { NOCActions } from '@/components/NOCActions';
import { IngestActions } from '@/components/IngestActions';
import { useAuth } from '@/hooks/useAuth';

const RequestDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userRole } = useAuth();
  
  const [request, setRequest] = useState<any>(null);
  const [transitions, setTransitions] = useState<any[]>([]);
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequestData = async () => {
    if (!id) return;

    setLoading(true);
    
    // Fetch request
    const { data: requestData } = await supabase
      .from('requests')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    // Fetch transitions
    const { data: transitionsData } = await supabase
      .from('workflow_transitions')
      .select('*')
      .eq('request_id', id)
      .order('timestamp', { ascending: false });

    // Fetch resources
    const { data: resourcesData } = await supabase
      .from('resource_allocations')
      .select('*')
      .eq('request_id', id);

    setRequest(requestData);
    setTransitions(transitionsData || []);
    setResources(resourcesData || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchRequestData();
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </Layout>
    );
  }
  
  if (!request) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Request not found</p>
          <Button onClick={() => navigate('/dashboard')} className="mt-4">
            Back to Dashboard
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-3xl font-bold text-foreground">{request.title}</h2>
              <StatusBadge status={request.state} />
            </div>
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <span className="font-mono">{request.id}</span>
              <span>·</span>
              <Badge variant="outline">{request.booking_type}</Badge>
              {request.priority !== 'Normal' && (
                <>
                  <span>·</span>
                  <Badge variant={request.priority === 'Urgent' ? 'destructive' : 'default'}>
                    {request.priority}
                  </Badge>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Request Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Program / Segment</p>
                    <p className="font-medium">{request.program_segment}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Language</p>
                    <p className="font-medium">{request.language}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Air Date / Time</p>
                    <p className="font-medium">{format(new Date(request.air_date_time), 'MMM dd, yyyy · HH:mm')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">NOC Required</p>
                    <p className="font-medium">{request.noc_required}</p>
                  </div>
                </div>

                <Separator />

                {request.booking_type === 'Incoming Feed' && request.source_type && (
                  <>
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Feed Configuration</p>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-muted-foreground">Source Type</p>
                          <p className="font-medium">{request.source_type}</p>
                        </div>
                        {request.vmix_input_number && (
                          <div>
                            <p className="text-xs text-muted-foreground">vMix Input</p>
                            <p className="font-medium">{request.vmix_input_number}</p>
                          </div>
                        )}
                        <div>
                          <p className="text-xs text-muted-foreground">Return Path</p>
                          <p className="font-medium">{request.return_path}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Key/Fill</p>
                          <p className="font-medium">{request.key_fill}</p>
                        </div>
                      </div>
                    </div>
                    <Separator />
                  </>
                )}

                {request.booking_type === 'Guest for iNEWS Rundown' && request.guest_name && (
                  <>
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Guest Information</p>
                      <div className="space-y-2">
                        <div>
                          <p className="text-xs text-muted-foreground">Name</p>
                          <p className="font-medium">{request.guest_name}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Contact</p>
                          <p className="font-medium">{request.guest_contact}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mt-2">
                          <div>
                            <p className="text-xs text-muted-foreground">Rundown ID</p>
                            <p className="font-medium font-mono text-sm">{request.inews_rundown_id}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Story Slug</p>
                            <p className="font-medium font-mono text-sm">{request.story_slug}</p>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Position</p>
                          <p className="font-medium">{request.rundown_position}</p>
                        </div>
                      </div>
                    </div>
                    <Separator />
                  </>
                )}

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Resources Needed</p>
                  <p className="font-medium">{request.resources_needed || 'None specified'}</p>
                </div>

                {request.compliance_tags && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Compliance Tags</p>
                    <div className="flex flex-wrap gap-2">
                      {request.compliance_tags.split(',').map((tag: string, idx: number) => (
                        <Badge key={idx} variant="secondary">{tag.trim()}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {request.notes && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Notes</p>
                    <p className="text-sm bg-muted p-3 rounded-md">{request.notes}</p>
                  </div>
                )}

                {request.newsroom_ticket && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Newsroom Ticket</p>
                    <p className="font-mono text-sm">{request.newsroom_ticket}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {resources.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Allocated Resources</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {resources.map((resource) => (
                      <div key={resource.id} className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                        <Radio className="h-5 w-5 text-primary mt-0.5" />
                        <div className="flex-1">
                          <p className="font-medium">{resource.resource_type}</p>
                          <p className="text-sm text-muted-foreground">{resource.details}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Allocated · {format(new Date(resource.allocated_at), 'MMM dd, HH:mm')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Metadata</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Created by</p>
                    <p className="font-medium">{request.created_by}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Created at</p>
                    <p className="font-medium">{format(new Date(request.created_at), 'MMM dd, yyyy HH:mm')}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Last updated</p>
                    <p className="font-medium">{format(new Date(request.updated_at), 'MMM dd, yyyy HH:mm')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {transitions.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Workflow History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {transitions.map((transition, idx) => (
                      <div key={transition.id} className="relative pl-6 pb-4 last:pb-0">
                        {idx !== transitions.length - 1 && (
                          <div className="absolute left-2 top-6 bottom-0 w-0.5 bg-border" />
                        )}
                        <div className="absolute left-0 top-1 h-4 w-4 rounded-full bg-primary" />
                        <div>
                          <p className="text-sm font-medium">{transition.to_state}</p>
                          <p className="text-xs text-muted-foreground">
                            {transition.role} · {format(new Date(transition.timestamp), 'MMM dd, HH:mm')}
                          </p>
                          {transition.notes && (
                            <p className="text-xs text-muted-foreground mt-1">{transition.notes}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* NOC Actions - Show for NOC role when state is appropriate */}
            {userRole === 'NOC' && ['Submitted', 'With NOC', 'Clarification Requested'].includes(request?.state) && (
              <NOCActions 
                requestId={id!} 
                currentState={request.state}
                onUpdate={fetchRequestData}
              />
            )}

            {/* Ingest Actions - Show for Ingest role when state is With Ingest */}
            {userRole === 'Ingest' && request?.state === 'With Ingest' && (
              <IngestActions 
                requestId={id!} 
                currentState={request.state}
                onUpdate={fetchRequestData}
              />
            )}

          </div>
        </div>
      </div>
    </Layout>
  );
};

export default RequestDetail;
