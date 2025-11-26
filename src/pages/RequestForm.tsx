import { useState, useMemo } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { BookingType, Language, Priority, SourceType, ReturnPath, KeyFill, YesNo } from '@/types/workflow';
import { ArrowLeft, Send, Save, Info, Calendar as CalendarIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { format, addDays, eachDayOfInterval, getDay } from 'date-fns';
const RequestForm = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [bookingType, setBookingType] = useState<BookingType>('Incoming Feed');
  
  // Booking mode
  const [bookingMode, setBookingMode] = useState<'single' | 'bulk'>('single');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  
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

  // Bulk booking options
  const [bulkStartDate, setBulkStartDate] = useState('');
  const [bulkEndDate, setBulkEndDate] = useState('');
  const [frequency, setFrequency] = useState<'every-day' | 'weekdays' | 'specific-days'>('every-day');
  const [selectedDays, setSelectedDays] = useState<number[]>([0, 1, 2, 3, 4]); // Sun-Thu default
  const [appendDateToTitle, setAppendDateToTitle] = useState(true);

  // Calculate booking dates for bulk mode
  const bookingDates = useMemo(() => {
    if (bookingMode === 'single' || !bulkStartDate || !bulkEndDate) return [];
    
    try {
      const start = new Date(bulkStartDate);
      const end = new Date(bulkEndDate);
      const allDays = eachDayOfInterval({ start, end });
      
      if (frequency === 'every-day') {
        return allDays;
      } else if (frequency === 'weekdays') {
        // Sun-Thu (0-4)
        return allDays.filter(date => {
          const day = getDay(date);
          return day >= 0 && day <= 4;
        });
      } else if (frequency === 'specific-days') {
        return allDays.filter(date => selectedDays.includes(getDay(date)));
      }
      return [];
    } catch {
      return [];
    }
  }, [bookingMode, bulkStartDate, bulkEndDate, frequency, selectedDays]);

  const handleSubmit = async (isDraft: boolean) => {
    // Temporary mock user ID for testing without auth
    const mockUserId = '00000000-0000-0000-0000-000000000000';

    if (!title || !programSegment || !airDateTime) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Validate bulk booking fields
    if (bookingMode === 'bulk' && (!bulkStartDate || !bulkEndDate)) {
      toast.error('Please select start and end dates for bulk booking');
      return;
    }

    // Show confirmation dialog for bulk bookings
    if (bookingMode === 'bulk' && !isDraft && !showConfirmDialog) {
      setShowConfirmDialog(true);
      return;
    }

    setSubmitting(true);
    setShowConfirmDialog(false);

    try {
      // Determine dates to create bookings for
      const datesToProcess = bookingMode === 'bulk' ? bookingDates : [new Date(airDateTime)];

      if (datesToProcess.length === 0) {
        toast.error('No valid dates to create bookings');
        setSubmitting(false);
        return;
      }

      const requestsToInsert = [];
      const transitionsToInsert = [];

      for (const date of datesToProcess) {
        // Extract time from airDateTime for bulk bookings
        const timeString = airDateTime.split('T')[1] || '00:00';
        const bookingDateTime = bookingMode === 'bulk' 
          ? `${format(date, 'yyyy-MM-dd')}T${timeString}`
          : airDateTime;

        const bookingTitle = bookingMode === 'bulk' && appendDateToTitle
          ? `${title} – ${format(date, 'dd MMM yyyy')}`
          : title;

        const baseData = {
          booking_type: bookingType,
          title: bookingTitle,
          program_segment: programSegment,
          air_date_time: bookingDateTime,
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

        requestsToInsert.push(requestData);
      }

      // Insert all requests
      const { data: insertedRequests, error } = await supabase
        .from('requests')
        .insert(requestsToInsert as any)
        .select();

      if (error) throw error;

      // Create workflow transitions if submitted
      if (!isDraft && insertedRequests) {
        for (const request of insertedRequests) {
          transitionsToInsert.push({
            request_id: request.id,
            from_state: 'Draft',
            to_state: (nocRequired === 'Yes' ? 'With NOC' : 'Submitted') as any,
            actor_id: mockUserId,
            role: 'Booking',
            notes: 'Initial submission',
          });

          // Update request state if NOC required
          if (nocRequired === 'Yes') {
            await supabase
              .from('requests')
              .update({ state: 'With NOC' })
              .eq('id', request.id);
          }
        }

        if (transitionsToInsert.length > 0) {
          await supabase.from('workflow_transitions').insert(transitionsToInsert);
        }
      }

      const count = insertedRequests?.length || 1;
      toast.success(
        isDraft 
          ? `${count} booking${count > 1 ? 's' : ''} saved as draft` 
          : `${count} booking${count > 1 ? 's' : ''} submitted successfully`
      );
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

        {/* Booking Mode Toggle */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-3">
              <Label>Booking Mode</Label>
              <RadioGroup value={bookingMode} onValueChange={(val) => setBookingMode(val as 'single' | 'bulk')}>
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="single" id="single" />
                    <Label htmlFor="single" className="font-normal cursor-pointer">Single Booking</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="bulk" id="bulk" />
                    <Label htmlFor="bulk" className="font-normal cursor-pointer">Bulk / Series Booking</Label>
                  </div>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
        </Card>

        {/* Info Banner for Bulk Mode */}
        {bookingMode === 'bulk' && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Bulk mode: We'll create multiple bookings using this form as a template. Review carefully before submitting.
            </AlertDescription>
          </Alert>
        )}

        <div>
          <Tabs defaultValue="metadata" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="metadata">Request & Metadata</TabsTrigger>
              <TabsTrigger value="resources">Resource Summary</TabsTrigger>
              <TabsTrigger value="preview">Data Preview</TabsTrigger>
            </TabsList>

            <TabsContent value="metadata" className="space-y-6">
              {/* Bulk Booking Options */}
              {bookingMode === 'bulk' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Bulk Booking Options</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="bulkStartDate">Start Date *</Label>
                        <Input
                          id="bulkStartDate"
                          type="date"
                          value={bulkStartDate}
                          onChange={(e) => setBulkStartDate(e.target.value)}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bulkEndDate">End Date *</Label>
                        <Input
                          id="bulkEndDate"
                          type="date"
                          value={bulkEndDate}
                          onChange={(e) => setBulkEndDate(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground">
                      We'll create one booking per selected day, based on the pattern below.
                    </p>

                    <div className="space-y-2">
                      <Label htmlFor="frequency">Frequency</Label>
                      <Select value={frequency} onValueChange={(val: any) => setFrequency(val)}>
                        <SelectTrigger id="frequency">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="every-day">Every day</SelectItem>
                          <SelectItem value="weekdays">Weekdays only (Sun–Thu)</SelectItem>
                          <SelectItem value="specific-days">Specific days of week</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {frequency === 'specific-days' && (
                      <div className="space-y-2">
                        <Label>Select Days</Label>
                        <div className="flex gap-2">
                          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day, index) => (
                            <Button
                              key={day}
                              type="button"
                              variant={selectedDays.includes(index) ? 'default' : 'outline'}
                              size="sm"
                              className="w-12 h-10"
                              onClick={() => {
                                setSelectedDays(prev =>
                                  prev.includes(index)
                                    ? prev.filter(d => d !== index)
                                    : [...prev, index].sort()
                                );
                              }}
                            >
                              {day}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="appendDate"
                        checked={appendDateToTitle}
                        onCheckedChange={(checked) => setAppendDateToTitle(checked === true)}
                      />
                      <Label htmlFor="appendDate" className="font-normal cursor-pointer">
                        Append date to title automatically
                      </Label>
                    </div>

                    {bookingDates.length > 0 && (
                      <div className="space-y-2 pt-2 border-t">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm font-medium">Occurrences</Label>
                          <span className="text-sm text-muted-foreground">{bookingDates.length} bookings</span>
                        </div>
                        <div className="bg-muted p-3 rounded-md space-y-1 max-h-32 overflow-y-auto">
                          <p className="text-xs text-muted-foreground mb-2">Preview:</p>
                          {bookingDates.slice(0, 5).map((date, i) => (
                            <p key={i} className="text-sm">
                              {appendDateToTitle ? `${title} – ${format(date, 'dd MMM yyyy')}` : title} ({format(date, 'EEE, dd MMM yyyy')})
                            </p>
                          ))}
                          {bookingDates.length > 5 && (
                            <p className="text-xs text-muted-foreground pt-1">
                              ... and {bookingDates.length - 5} more
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

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
                      <Label htmlFor="airDateTime">
                        {bookingMode === 'bulk' ? 'Air Time (Local) *' : 'Air Date / Time (Local) *'}
                      </Label>
                      <Input
                        id="airDateTime"
                        type="datetime-local"
                        value={airDateTime}
                        onChange={(e) => setAirDateTime(e.target.value)}
                        required
                      />
                      {bookingMode === 'bulk' && (
                        <p className="text-xs text-muted-foreground">
                          Time will be applied to each booking date from Bulk Booking Options
                        </p>
                      )}
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

        {/* Confirmation Dialog for Bulk Bookings */}
        <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Bulk Booking</AlertDialogTitle>
              <AlertDialogDescription className="space-y-2">
                <p>
                  You're about to create <strong>{bookingDates.length} bookings</strong> from{' '}
                  {bulkStartDate && format(new Date(bulkStartDate), 'dd MMM yyyy')} to{' '}
                  {bulkEndDate && format(new Date(bulkEndDate), 'dd MMM yyyy')}.
                </p>
                {bookingDates.length > 0 && (
                  <div className="bg-muted p-3 rounded-md mt-3 max-h-48 overflow-y-auto">
                    <p className="text-xs font-medium mb-2">Dates:</p>
                    <div className="space-y-1">
                      {bookingDates.map((date, i) => (
                        <p key={i} className="text-xs">
                          {format(date, 'EEE, dd MMM yyyy')}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => handleSubmit(false)} disabled={submitting}>
                Create {bookingDates.length} Bookings
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Layout>
  );
};

export default RequestForm;
