import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';

interface TransportTabProps {
  transportReason: string;
  setTransportReason: (val: string) => void;
  startDateTime: string;
  setStartDateTime: (val: string) => void;
  returnDateTime: string;
  setReturnDateTime: (val: string) => void;
  driverName: string;
  setDriverName: (val: string) => void;
  vehicleNo: string;
  setVehicleNo: (val: string) => void;
  requestedBy: string;
  setRequestedBy: (val: string) => void;
  notifications: Record<string, boolean>;
  setNotifications: (val: Record<string, boolean>) => void;
  callSheetData: any;
}

export const TransportTab = ({
  transportReason, setTransportReason,
  startDateTime, setStartDateTime,
  returnDateTime, setReturnDateTime,
  driverName, setDriverName,
  vehicleNo, setVehicleNo,
  requestedBy, setRequestedBy,
  notifications, setNotifications,
  callSheetData
}: TransportTabProps) => {
  
  const toggleNotification = (key: string) => {
    setNotifications({ ...notifications, [key]: !notifications[key] });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Transportation Request</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="reason">Reason</Label>
              <Select value={transportReason} onValueChange={setTransportReason}>
                <SelectTrigger id="reason">
                  <SelectValue placeholder="Select reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Filming">Filming</SelectItem>
                  <SelectItem value="Recce">Recce</SelectItem>
                  <SelectItem value="Meeting">Meeting</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="startDateTime">Start Date & Time</Label>
              <Input
                id="startDateTime"
                type="datetime-local"
                value={startDateTime}
                onChange={(e) => setStartDateTime(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="returnDateTime">Return Date & Time</Label>
              <Input
                id="returnDateTime"
                type="datetime-local"
                value={returnDateTime}
                onChange={(e) => setReturnDateTime(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="driverName">Driver Name</Label>
              <Input
                id="driverName"
                value={driverName}
                onChange={(e) => setDriverName(e.target.value)}
                placeholder="Assigned driver"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="vehicleNo">Vehicle No</Label>
              <Input
                id="vehicleNo"
                value={vehicleNo}
                onChange={(e) => setVehicleNo(e.target.value)}
                placeholder="e.g., VH-1234"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="requestedBy">Requested By</Label>
              <Input
                id="requestedBy"
                value={requestedBy}
                onChange={(e) => setRequestedBy(e.target.value)}
                disabled
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Automated Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="tMinus1Day"
              checked={notifications.tMinus1Day}
              onCheckedChange={() => toggleNotification('tMinus1Day')}
            />
            <Label htmlFor="tMinus1Day">T–1 Day — Team Call & Location</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="tDay8AM"
              checked={notifications.tDay8AM}
              onCheckedChange={() => toggleNotification('tDay8AM')}
            />
            <Label htmlFor="tDay8AM">T Day 08:00 — Equipment Ready</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="wrapPlus30"
              checked={notifications.wrapPlus30}
              onCheckedChange={() => toggleNotification('wrapPlus30')}
            />
            <Label htmlFor="wrapPlus30">+30 min after Wrap — Return Reminder</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="onConflict"
              checked={notifications.onConflict}
              onCheckedChange={() => toggleNotification('onConflict')}
            />
            <Label htmlFor="onConflict">On Conflict — Manager Escalation</Label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Call Sheet Preview</CardTitle>
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            Print / Save PDF
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border rounded-lg p-6 bg-muted/30 space-y-4">
            <div className="text-center border-b pb-4">
              <h3 className="text-2xl font-bold">Call Sheet</h3>
              <p className="text-muted-foreground">{callSheetData.title}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-semibold">Department:</p>
                <p>{callSheetData.department || '—'}</p>
              </div>
              <div>
                <p className="font-semibold">Filming Date:</p>
                <p>{callSheetData.filmingDate || '—'}</p>
              </div>
              <div>
                <p className="font-semibold">Call Time:</p>
                <p>{callSheetData.callTime || '—'}</p>
              </div>
              <div>
                <p className="font-semibold">Wrap Time:</p>
                <p>{callSheetData.wrapTime || '—'}</p>
              </div>
              <div>
                <p className="font-semibold">Location:</p>
                <p>{callSheetData.location || '—'}</p>
              </div>
              <div>
                <p className="font-semibold">Focal Point:</p>
                <p>{callSheetData.focalPoint || '—'}</p>
              </div>
            </div>

            {callSheetData.equipment && callSheetData.equipment.length > 0 && (
              <div className="border-t pt-4">
                <p className="font-semibold mb-2">Equipment Required:</p>
                <ul className="list-disc list-inside text-sm space-y-1">
                  {callSheetData.equipment.map((eq: any, i: number) => (
                    <li key={i}>{eq.quantity}× {eq.item} ({eq.category})</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
