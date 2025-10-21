import { Layout } from '@/components/Layout';
import { StatusBadge } from '@/components/StatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { mockRequests, mockTransitions, mockResources, mockNotifications } from '@/data/mockData';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Radio, Clock } from 'lucide-react';
import { format } from 'date-fns';

const RequestDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const request = mockRequests.find(r => r.id === id);
  const transitions = mockTransitions.filter(t => t.requestId === id);
  const resources = mockResources.filter(r => r.requestId === id);
  const notifications = mockNotifications.filter(n => n.requestId === id);
  
  if (!request) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Request not found</p>
          <Button onClick={() => navigate('/')} className="mt-4">
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
          <Button variant="outline" size="icon" onClick={() => navigate('/')}>
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
              <Badge variant="outline">{request.bookingType}</Badge>
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
                    <p className="font-medium">{request.programSegment}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Language</p>
                    <p className="font-medium">{request.language}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Air Date / Time</p>
                    <p className="font-medium">{format(new Date(request.airDateTime), 'MMM dd, yyyy · HH:mm')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">NOC Required</p>
                    <p className="font-medium">{request.nocRequired}</p>
                  </div>
                </div>

                <Separator />

                {request.bookingType === 'Incoming Feed' && 'sourceType' in request && (
                  <>
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Feed Configuration</p>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-muted-foreground">Source Type</p>
                          <p className="font-medium">{request.sourceType}</p>
                        </div>
                        {request.vmixInputNumber && (
                          <div>
                            <p className="text-xs text-muted-foreground">vMix Input</p>
                            <p className="font-medium">{request.vmixInputNumber}</p>
                          </div>
                        )}
                        <div>
                          <p className="text-xs text-muted-foreground">Return Path</p>
                          <p className="font-medium">{request.returnPath}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Key/Fill</p>
                          <p className="font-medium">{request.keyFill}</p>
                        </div>
                      </div>
                    </div>
                    <Separator />
                  </>
                )}

                {request.bookingType === 'Guest for iNEWS Rundown' && 'guestName' in request && (
                  <>
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Guest Information</p>
                      <div className="space-y-2">
                        <div>
                          <p className="text-xs text-muted-foreground">Name</p>
                          <p className="font-medium">{request.guestName}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Contact</p>
                          <p className="font-medium">{request.guestContact}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mt-2">
                          <div>
                            <p className="text-xs text-muted-foreground">Rundown ID</p>
                            <p className="font-medium font-mono text-sm">{request.inewsRundownId}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Story Slug</p>
                            <p className="font-medium font-mono text-sm">{request.storySlug}</p>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Position</p>
                          <p className="font-medium">{request.rundownPosition}</p>
                        </div>
                      </div>
                    </div>
                    <Separator />
                  </>
                )}

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Resources Needed</p>
                  <p className="font-medium">{request.resourcesNeeded}</p>
                </div>

                {request.complianceTags && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Compliance Tags</p>
                    <div className="flex flex-wrap gap-2">
                      {request.complianceTags.split(',').map((tag, idx) => (
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

                {request.newsroomTicket && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Newsroom Ticket</p>
                    <p className="font-mono text-sm">{request.newsroomTicket}</p>
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
                          <p className="font-medium">{resource.resourceType}</p>
                          <p className="text-sm text-muted-foreground">{resource.details}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Allocated by {resource.allocatedBy} · {format(new Date(resource.allocatedAt), 'MMM dd, HH:mm')}
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
                    <p className="font-medium">{request.createdBy}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Created at</p>
                    <p className="font-medium">{format(new Date(request.createdAt), 'MMM dd, yyyy HH:mm')}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Last updated</p>
                    <p className="font-medium">{format(new Date(request.updatedAt), 'MMM dd, yyyy HH:mm')}</p>
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
                          <p className="text-sm font-medium">{transition.toState}</p>
                          <p className="text-xs text-muted-foreground">
                            by {transition.actor} · {format(new Date(transition.timestamp), 'MMM dd, HH:mm')}
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

            {notifications.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Notifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={`p-3 rounded-lg text-sm ${
                          notif.read ? 'bg-muted' : 'bg-primary/10 border border-primary/20'
                        }`}
                      >
                        <p className="font-medium text-xs text-muted-foreground mb-1">To: {notif.recipient}</p>
                        <p>{notif.message}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default RequestDetail;
