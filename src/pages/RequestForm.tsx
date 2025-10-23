import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookingType, Language, Priority, SourceType, ReturnPath, KeyFill, YesNo } from '@/types/workflow';
import { ArrowLeft, Send, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
const RequestForm = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [bookingType, setBookingType] = useState<BookingType>('Incoming Feed');
  
  // Common fields
  const [title, setTitle] = useState('');
  const [programSegment, setProgramSegment] = useState('');
  const [airDateTime, setAirDateTime] = useState('');
  const [language, setLanguage] = useState<Language>('English');
  const [priority, setPriority] = useState<Priority>('Normal');
  const [nocRequired, setNocRequired] = useState<YesNo>('Yes');
  const [resourcesNeeded, setResourcesNeeded] = useState('');
  const [newsroomTicket, setNewsroomTicket] = useState('');
  const [complianceTags, setComplianceTags] = useState('');
  const [notes, setNotes] = useState('');
  
  // Incoming Feed specific
  const [sourceType, setSourceType] = useState<SourceType>('vMix');
  const [vmixInputNumber, setVmixInputNumber] = useState('');
  const [returnPath, setReturnPath] = useState<ReturnPath>('Enabled');
  const [keyFill, setKeyFill] = useState<KeyFill>('None');
  
  // Guest Rundown specific
  const [guestName, setGuestName] = useState('');
  const [guestContact, setGuestContact] = useState('');
  const [inewsRundownId, setInewsRundownId] = useState('');
  const [storySlug, setStorySlug] = useState('');
  const [rundownPosition, setRundownPosition] = useState('');

  const handleSubmit = async (isDraft: boolean) => {
    // Temporary mock user ID for testing without auth
    const mockUserId = '00000000-0000-0000-0000-000000000000';

    if (!title || !programSegment || !airDateTime) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSubmitting(true);

    const baseData = {
      booking_type: bookingType,
      title,
      program_segment: programSegment,
      air_date_time: airDateTime,
      language,
      priority,
      noc_required: nocRequired,
      resources_needed: resourcesNeeded,
      newsroom_ticket: newsroomTicket,
      compliance_tags: complianceTags,
      notes,
      created_by: mockUserId,
      state: isDraft ? 'Draft' : 'Submitted',
    };

    const requestData = bookingType === 'Incoming Feed'
      ? {
          ...baseData,
          source_type: sourceType,
          vmix_input_number: vmixInputNumber || null,
          return_path: returnPath,
          key_fill: keyFill,
        }
      : {
          ...baseData,
          guest_name: guestName,
          guest_contact: guestContact,
          inews_rundown_id: inewsRundownId,
          story_slug: storySlug,
          rundown_position: rundownPosition,
        };

    try {
      const { data, error } = await supabase
        .from('requests')
        .insert([requestData as any])
        .select()
        .single();

      if (error) throw error;

      // Create workflow transition if submitted
      if (!isDraft) {
        await supabase.from('workflow_transitions').insert([{
          request_id: data.id,
          from_state: 'Draft',
          to_state: (nocRequired === 'Yes' ? 'With NOC' : 'Submitted') as any,
          actor_id: mockUserId,
          role: 'Booking',
          notes: 'Initial submission',
        }]);

        // Update request state if NOC required
        if (nocRequired === 'Yes') {
          await supabase
            .from('requests')
            .update({ state: 'With NOC' })
            .eq('id', data.id);
        }
      }

      toast.success(isDraft ? 'Request saved as draft' : 'Request submitted successfully');
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Error creating request:', error);
      toast.error(error.message || 'Failed to create request');
    } finally {
      setSubmitting(false);
    }
  };

  const getPayloadPreview = () => {
    const payload = {
      bookingType,
      title,
      programSegment,
      airDateTime,
      language,
      priority,
      nocRequired,
      resourcesNeeded,
      newsroomTicket,
      complianceTags,
      notes,
      ...(bookingType === 'Incoming Feed' && {
        sourceType,
        vmixInputNumber,
        returnPath,
        keyFill,
      }),
      ...(bookingType === 'Guest for iNEWS Rundown' && {
        guestName,
        guestContact,
        inewsRundownId,
        storySlug,
        rundownPosition,
      }),
    };
    return JSON.stringify(payload, null, 2);
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-3xl font-bold text-foreground">New Workflow Request</h2>
            <p className="text-muted-foreground mt-1">Create a new booking request for NOC and Ingest teams</p>
          </div>
        </div>

        <div>
          <Tabs defaultValue="metadata" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="metadata">Request & Metadata</TabsTrigger>
              <TabsTrigger value="resources">Resource Summary</TabsTrigger>
              <TabsTrigger value="preview">Data Preview</TabsTrigger>
            </TabsList>

            <TabsContent value="metadata" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Booking Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="bookingType">Booking Type *</Label>
                      <Select value={bookingType} onValueChange={(val) => setBookingType(val as BookingType)}>
                        <SelectTrigger id="bookingType">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Incoming Feed">Incoming Feed</SelectItem>
                          <SelectItem value="Guest for iNEWS Rundown">Guest for iNEWS Rundown</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="title">Title *</Label>
                      <Input
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter request title"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="programSegment">Program / Segment *</Label>
                      <Input
                        id="programSegment"
                        value={programSegment}
                        onChange={(e) => setProgramSegment(e.target.value)}
                        placeholder="e.g., Evening News"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="airDateTime">Air Date / Time (Local) *</Label>
                      <Input
                        id="airDateTime"
                        type="datetime-local"
                        value={airDateTime}
                        onChange={(e) => setAirDateTime(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="language">Language</Label>
                      <Select value={language} onValueChange={(val) => setLanguage(val as Language)}>
                        <SelectTrigger id="language">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="English">English</SelectItem>
                          <SelectItem value="Arabic">Arabic</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="priority">Priority</Label>
                      <Select value={priority} onValueChange={(val) => setPriority(val as Priority)}>
                        <SelectTrigger id="priority">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Normal">Normal</SelectItem>
                          <SelectItem value="High">High</SelectItem>
                          <SelectItem value="Urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Incoming Feed Specific Fields */}
              {bookingType === 'Incoming Feed' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Feed Configuration</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="sourceType">Source Type</Label>
                        <Select value={sourceType} onValueChange={(val) => setSourceType(val as SourceType)}>
                          <SelectTrigger id="sourceType">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="vMix">vMix</SelectItem>
                            <SelectItem value="SRT">SRT</SelectItem>
                            <SelectItem value="Satellite">Satellite</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="vmixInputNumber">vMix Input Number</Label>
                        <Input
                          id="vmixInputNumber"
                          value={vmixInputNumber}
                          onChange={(e) => setVmixInputNumber(e.target.value)}
                          placeholder="e.g., Input 5"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="returnPath">Return Path</Label>
                        <Select value={returnPath} onValueChange={(val) => setReturnPath(val as ReturnPath)}>
                          <SelectTrigger id="returnPath">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Enabled">Enabled</SelectItem>
                            <SelectItem value="Disabled">Disabled</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="keyFill">Key/Fill</Label>
                        <Select value={keyFill} onValueChange={(val) => setKeyFill(val as KeyFill)}>
                          <SelectTrigger id="keyFill">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="None">None</SelectItem>
                            <SelectItem value="Key">Key</SelectItem>
                            <SelectItem value="Fill">Fill</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Guest Rundown Specific Fields */}
              {bookingType === 'Guest for iNEWS Rundown' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Guest & Rundown Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="guestName">Guest Name</Label>
                        <Input
                          id="guestName"
                          value={guestName}
                          onChange={(e) => setGuestName(e.target.value)}
                          placeholder="Full name of guest"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="guestContact">Guest Contact</Label>
                        <Input
                          id="guestContact"
                          value={guestContact}
                          onChange={(e) => setGuestContact(e.target.value)}
                          placeholder="Phone or email"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="inewsRundownId">iNEWS Rundown ID</Label>
                        <Input
                          id="inewsRundownId"
                          value={inewsRundownId}
                          onChange={(e) => setInewsRundownId(e.target.value)}
                          placeholder="e.g., RUN-20251023-001"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="storySlug">Story Slug</Label>
                        <Input
                          id="storySlug"
                          value={storySlug}
                          onChange={(e) => setStorySlug(e.target.value)}
                          placeholder="e.g., TECH-CEO-INTV"
                        />
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="rundownPosition">Rundown Position</Label>
                        <Input
                          id="rundownPosition"
                          value={rundownPosition}
                          onChange={(e) => setRundownPosition(e.target.value)}
                          placeholder="e.g., A Block - Story 3"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Common Additional Fields */}
              <Card>
                <CardHeader>
                  <CardTitle>Additional Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nocRequired">NOC Required</Label>
                      <Select value={nocRequired} onValueChange={(val) => setNocRequired(val as YesNo)}>
                        <SelectTrigger id="nocRequired">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Yes">Yes</SelectItem>
                          <SelectItem value="No">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="newsroomTicket">Newsroom Ticket / Ref</Label>
                      <Input
                        id="newsroomTicket"
                        value={newsroomTicket}
                        onChange={(e) => setNewsroomTicket(e.target.value)}
                        placeholder="e.g., NEWS-4523"
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="resourcesNeeded">Resources Needed (Booking)</Label>
                      <Input
                        id="resourcesNeeded"
                        value={resourcesNeeded}
                        onChange={(e) => setResourcesNeeded(e.target.value)}
                        placeholder="e.g., vMix operator, Audio engineer"
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="complianceTags">Compliance Tags</Label>
                      <Input
                        id="complianceTags"
                        value={complianceTags}
                        onChange={(e) => setComplianceTags(e.target.value)}
                        placeholder="e.g., Financial Content, Time Sensitive"
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="notes">Notes</Label>
                      <Textarea
                        id="notes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Additional notes or special requirements..."
                        rows={4}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="resources">
              <Card>
                <CardHeader>
                  <CardTitle>Resource Allocation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-muted-foreground">
                    <p>Resources will be allocated by the NOC team after submission.</p>
                    <p className="text-sm mt-2">Requested resources: {resourcesNeeded || 'None specified'}</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preview">
              <Card>
                <CardHeader>
                  <CardTitle>JSON Data Payload</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="bg-muted p-4 rounded-lg overflow-auto text-sm">
                    <code>{getPayloadPreview()}</code>
                  </pre>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-3 mt-6">
            <Button type="button" variant="outline" onClick={() => navigate('/')} disabled={submitting}>
              Cancel
            </Button>
            <Button type="button" variant="outline" onClick={() => handleSubmit(true)} disabled={submitting} className="gap-2">
              <Save className="h-4 w-4" />
              Save as Draft
            </Button>
            <Button type="button" onClick={() => handleSubmit(false)} disabled={submitting} className="gap-2">
              <Send className="h-4 w-4" />
              Submit Request
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default RequestForm;
