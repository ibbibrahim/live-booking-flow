import { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Download, CheckCircle2, XCircle } from 'lucide-react';
import { format } from 'date-fns';

interface CallSheetData {
  id: string;
  title: string;
  department: string;
  filmingDate: string;
  callTime: string;
  wrapTime: string;
  location: string;
  focalPoint: { name: string; contact: string };
  driverNeeded: boolean;
  status: 'Draft' | 'Submitted' | 'Approved';
  assignments: Array<{ role: string; name: string; phone: string }>;
  equipment: Array<{ category: string; item: string; quantity: number }>;
  transport: {
    reason: string;
    startDateTime: string;
    returnDateTime: string;
    driverName: string;
    vehicleNo: string;
    requestedBy: string;
  };
  acknowledgements: Record<string, { acknowledge: boolean; approve: boolean; comment: string }>;
  notifications: Record<string, boolean>;
}

const CallSheetDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [callSheet, setCallSheet] = useState<CallSheetData | null>(null);

  useEffect(() => {
    // Mock data - replace with actual data fetching
    const mockData: CallSheetData = {
      id: id || '1',
      title: 'News Segment - City Hall',
      department: 'News',
      filmingDate: '2025-11-15',
      callTime: '08:00',
      wrapTime: '17:00',
      location: 'City Hall',
      focalPoint: { name: 'John Doe', contact: '+1234567890' },
      driverNeeded: true,
      status: 'Approved',
      assignments: [
        { role: 'Camera Operator', name: 'Alice Smith', phone: '+1234567891' },
        { role: 'Sound Engineer', name: 'Bob Johnson', phone: '+1234567892' },
      ],
      equipment: [
        { category: 'Camera', item: 'Sony FX6', quantity: 2 },
        { category: 'Lighting', item: 'LED Panel 1x1', quantity: 4 },
        { category: 'Sound', item: 'Wireless Mic', quantity: 3 },
      ],
      transport: {
        reason: 'Filming',
        startDateTime: '2025-11-15T07:00',
        returnDateTime: '2025-11-15T18:00',
        driverName: 'Michael Brown',
        vehicleNo: 'VAN-001',
        requestedBy: 'Current User',
      },
      acknowledgements: {
        'News Media Dept': { acknowledge: true, approve: true, comment: 'Approved for coverage' },
        '37TV Production Team': { acknowledge: true, approve: true, comment: '' },
        'Technical Support': { acknowledge: true, approve: false, comment: 'Pending equipment availability' },
        'Storekeeper': { acknowledge: false, approve: false, comment: '' },
      },
      notifications: {
        'T–1 Day — Team Call & Location': true,
        'T Day 08:00 — Equipment Ready': true,
        '+30 min after Wrap — Return Reminder': true,
        'On Conflict — Manager Escalation': false,
      },
    };
    setCallSheet(mockData);
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  if (!callSheet) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading call sheet...</p>
        </div>
      </Layout>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Draft': return 'text-muted-foreground';
      case 'Submitted': return 'text-accent';
      case 'Approved': return 'text-success';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <Layout>
      <div className="space-y-6 print:space-y-4">
        {/* Header */}
        <div className="flex justify-between items-start print:hidden">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/callsheet')}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h2 className="text-3xl font-bold text-foreground">{callSheet.title}</h2>
              <p className="text-muted-foreground mt-1">
                {callSheet.department} • {format(new Date(callSheet.filmingDate), 'MMMM dd, yyyy')}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={handlePrint} className="gap-2">
              <Download className="h-4 w-4" />
              Download PDF
            </Button>
          </div>
        </div>

        {/* Print Header */}
        <div className="hidden print:block mb-6">
          <h1 className="text-2xl font-bold">{callSheet.title}</h1>
          <p className="text-sm text-muted-foreground">
            {callSheet.department} • {format(new Date(callSheet.filmingDate), 'MMMM dd, yyyy')}
          </p>
        </div>

        {/* Status Badge */}
        <div className="print:mb-4">
          <span className={`inline-flex items-center gap-2 text-sm font-medium ${getStatusColor(callSheet.status)}`}>
            {callSheet.status === 'Approved' && <CheckCircle2 className="h-4 w-4" />}
            {callSheet.status}
          </span>
        </div>

        {/* Call Sheet Information */}
        <Card>
          <CardHeader>
            <CardTitle>Call Sheet Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Department</p>
                <p className="font-medium">{callSheet.department}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Filming Date</p>
                <p className="font-medium">{format(new Date(callSheet.filmingDate), 'MM/dd/yyyy')}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Call Time</p>
                <p className="font-medium">{callSheet.callTime}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Wrap Time</p>
                <p className="font-medium">{callSheet.wrapTime}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Location</p>
                <p className="font-medium">{callSheet.location}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Driver Needed</p>
                <p className="font-medium">{callSheet.driverNeeded ? 'Yes' : 'No'}</p>
              </div>
            </div>

            <Separator />

            <div>
              <p className="text-sm text-muted-foreground mb-2">Focal Point</p>
              <div className="bg-muted/50 p-3 rounded-md">
                <p className="font-medium">{callSheet.focalPoint.name}</p>
                <p className="text-sm text-muted-foreground">{callSheet.focalPoint.contact}</p>
              </div>
            </div>

            <Separator />

            <div>
              <p className="text-sm text-muted-foreground mb-3">Crew Assignments</p>
              <div className="space-y-2">
                {callSheet.assignments.map((assignment, index) => (
                  <div key={index} className="flex items-center justify-between bg-muted/50 p-3 rounded-md">
                    <div>
                      <p className="font-medium">{assignment.role}</p>
                      <p className="text-sm text-muted-foreground">{assignment.name}</p>
                    </div>
                    <p className="text-sm">{assignment.phone}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Equipment Request */}
        <Card>
          <CardHeader>
            <CardTitle>Equipment Request</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {callSheet.equipment.map((item, index) => (
                <div key={index} className="flex items-center justify-between bg-muted/50 p-3 rounded-md">
                  <div className="flex items-center gap-4">
                    <span className="text-xs px-2 py-1 bg-background rounded-md text-muted-foreground">
                      {item.category}
                    </span>
                    <p className="font-medium">{item.item}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Transportation */}
        <Card>
          <CardHeader>
            <CardTitle>Transportation Request</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Reason</p>
                <p className="font-medium">{callSheet.transport.reason}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Start Date & Time</p>
                <p className="font-medium">
                  {format(new Date(callSheet.transport.startDateTime), 'MM/dd/yyyy HH:mm')}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Return Date & Time</p>
                <p className="font-medium">
                  {format(new Date(callSheet.transport.returnDateTime), 'MM/dd/yyyy HH:mm')}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Driver Name</p>
                <p className="font-medium">{callSheet.transport.driverName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Vehicle No</p>
                <p className="font-medium">{callSheet.transport.vehicleNo}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Requested By</p>
                <p className="font-medium">{callSheet.transport.requestedBy}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Department Acknowledgements */}
        <Card>
          <CardHeader>
            <CardTitle>Department Acknowledgements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(callSheet.acknowledgements).map(([dept, status]) => (
              <div key={dept} className="bg-muted/50 p-4 rounded-md space-y-2">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{dept}</p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      {status.acknowledge ? (
                        <CheckCircle2 className="h-4 w-4 text-success" />
                      ) : (
                        <XCircle className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span className="text-sm">Acknowledged</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {status.approve ? (
                        <CheckCircle2 className="h-4 w-4 text-success" />
                      ) : (
                        <XCircle className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span className="text-sm">Approved</span>
                    </div>
                  </div>
                </div>
                {status.comment && (
                  <p className="text-sm text-muted-foreground italic">{status.comment}</p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="print:break-before-page">
          <CardHeader>
            <CardTitle>Notification Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(callSheet.notifications).map(([notification, enabled]) => (
                <div key={notification} className="flex items-center gap-3 p-2">
                  {enabled ? (
                    <CheckCircle2 className="h-4 w-4 text-success" />
                  ) : (
                    <XCircle className="h-4 w-4 text-muted-foreground" />
                  )}
                  <p className={enabled ? 'font-medium' : 'text-muted-foreground'}>{notification}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print\\:block, .print\\:block * {
            visibility: visible;
          }
          .print\\:hidden {
            display: none !important;
          }
          @page {
            margin: 1.5cm;
          }
        }
      `}</style>
    </Layout>
  );
};

export default CallSheetDetail;
