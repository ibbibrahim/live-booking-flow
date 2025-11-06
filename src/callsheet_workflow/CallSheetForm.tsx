import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Send, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { CallSheetTab } from './components/CallSheetTab';
import { EquipmentTab } from './components/EquipmentTab';
import { TransportTab } from './components/TransportTab';

const CallSheetForm = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  // Call Sheet data
  const [department, setDepartment] = useState('');
  const [title, setTitle] = useState('');
  const [filmingDate, setFilmingDate] = useState('');
  const [callTime, setCallTime] = useState('');
  const [wrapTime, setWrapTime] = useState('');
  const [location, setLocation] = useState('');
  const [focalPoint, setFocalPoint] = useState('');
  const [focalContact, setFocalContact] = useState('');
  const [driverNeeded, setDriverNeeded] = useState(false);
  const [assignments, setAssignments] = useState<Array<{ role: string; name: string; phone: string }>>([]);
  const [acknowledgements, setAcknowledgements] = useState<Record<string, { acknowledge: boolean; approve: boolean; comment: string }>>({
    newsMedia: { acknowledge: false, approve: false, comment: '' },
    tv37: { acknowledge: false, approve: false, comment: '' },
    technical: { acknowledge: false, approve: false, comment: '' },
    storekeeper: { acknowledge: false, approve: false, comment: '' },
  });

  // Equipment data
  const [equipment, setEquipment] = useState<Array<{ category: string; item: string; quantity: number }>>([]);
  const [departmentsToApprove, setDepartmentsToApprove] = useState<string[]>([]);
  const [departmentsToNotify, setDepartmentsToNotify] = useState<string[]>([]);

  // Transport data
  const [transportReason, setTransportReason] = useState('');
  const [startDateTime, setStartDateTime] = useState('');
  const [returnDateTime, setReturnDateTime] = useState('');
  const [driverName, setDriverName] = useState('');
  const [vehicleNo, setVehicleNo] = useState('');
  const [requestedBy, setRequestedBy] = useState('Current User');
  const [notifications, setNotifications] = useState<Record<string, boolean>>({
    tMinus1Day: true,
    tDay8AM: true,
    wrapPlus30: true,
    onConflict: true,
  });

  const handleSubmit = (isDraft: boolean) => {
    if (!title || !department || !filmingDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSubmitting(true);

    const callSheetData = {
      department,
      title,
      filmingDate,
      callTime,
      wrapTime,
      location,
      focalPoint,
      focalContact,
      driverNeeded,
      assignments,
      acknowledgements,
      equipment,
      departmentsToApprove,
      departmentsToNotify,
      transportReason,
      startDateTime,
      returnDateTime,
      driverName,
      vehicleNo,
      requestedBy,
      notifications,
      status: isDraft ? 'Draft' : 'Submitted',
    };

    console.log('Call Sheet Data:', callSheetData);
    
    setTimeout(() => {
      toast.success(isDraft ? 'Call sheet saved as draft' : 'Call sheet submitted successfully');
      setSubmitting(false);
      navigate('/callsheet');
    }, 1000);
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate('/callsheet')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-3xl font-bold text-foreground">New Call Sheet</h2>
            <p className="text-muted-foreground mt-1">Create a new call sheet with equipment and transportation requests</p>
          </div>
        </div>

        <Tabs defaultValue="callsheet" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="callsheet">Request & Metadata</TabsTrigger>
            <TabsTrigger value="equipment">Resource Summary</TabsTrigger>
            <TabsTrigger value="transport">Data Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="callsheet">
            <CallSheetTab
              department={department}
              setDepartment={setDepartment}
              title={title}
              setTitle={setTitle}
              filmingDate={filmingDate}
              setFilmingDate={setFilmingDate}
              callTime={callTime}
              setCallTime={setCallTime}
              wrapTime={wrapTime}
              setWrapTime={setWrapTime}
              location={location}
              setLocation={setLocation}
              focalPoint={focalPoint}
              setFocalPoint={setFocalPoint}
              focalContact={focalContact}
              setFocalContact={setFocalContact}
              driverNeeded={driverNeeded}
              setDriverNeeded={setDriverNeeded}
              assignments={assignments}
              setAssignments={setAssignments}
              acknowledgements={acknowledgements}
              setAcknowledgements={setAcknowledgements}
            />
          </TabsContent>

          <TabsContent value="equipment">
            <EquipmentTab
              equipment={equipment}
              setEquipment={setEquipment}
              departmentsToApprove={departmentsToApprove}
              setDepartmentsToApprove={setDepartmentsToApprove}
              departmentsToNotify={departmentsToNotify}
              setDepartmentsToNotify={setDepartmentsToNotify}
            />
          </TabsContent>

          <TabsContent value="transport">
            <TransportTab
              transportReason={transportReason}
              setTransportReason={setTransportReason}
              startDateTime={startDateTime}
              setStartDateTime={setStartDateTime}
              returnDateTime={returnDateTime}
              setReturnDateTime={setReturnDateTime}
              driverName={driverName}
              setDriverName={setDriverName}
              vehicleNo={vehicleNo}
              setVehicleNo={setVehicleNo}
              requestedBy={requestedBy}
              setRequestedBy={setRequestedBy}
              notifications={notifications}
              setNotifications={setNotifications}
              callSheetData={{
                department,
                title,
                filmingDate,
                callTime,
                wrapTime,
                location,
                focalPoint,
                equipment,
              }}
            />
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => handleSubmit(true)} disabled={submitting}>
            <Save className="h-4 w-4 mr-2" />
            Save Draft
          </Button>
          <Button onClick={() => handleSubmit(false)} disabled={submitting}>
            <Send className="h-4 w-4 mr-2" />
            Submit
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default CallSheetForm;
