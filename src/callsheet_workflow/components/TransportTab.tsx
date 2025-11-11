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
        <CardContent>
          <div className="border rounded-lg p-8 bg-background space-y-6 print:border-none">
            {/* Header Section */}
            <div className="grid grid-cols-3 gap-4 items-start border-b pb-4">
              <div className="text-sm">
                <p className="font-semibold">Production Company:</p>
                <p className="text-muted-foreground">{callSheetData.department || '—'}</p>
              </div>
              <div className="text-center">
                <h3 className="text-3xl font-bold">Call Time</h3>
                <p className="text-lg font-semibold mt-2">{callSheetData.callTime || '—'}</p>
                <p className="text-sm text-muted-foreground italic mt-1">Please Check Individual Call Times</p>
              </div>
              <div className="text-sm text-right">
                <p><span className="font-semibold">Weather:</span> —</p>
                <p><span className="font-semibold">Sunrise:</span> —</p>
                <p><span className="font-semibold">Sunset:</span> —</p>
                <p><span className="font-semibold">Nearest Hospital:</span> —</p>
              </div>
            </div>

            {/* Client & Day Info */}
            <div className="grid grid-cols-3 gap-4 text-sm border-b pb-4">
              <div className="space-y-1">
                <p><span className="font-semibold">Client:</span> —</p>
                <p><span className="font-semibold">Agency:</span> —</p>
                <p><span className="font-semibold">Producer:</span> {callSheetData.focalPoint || '—'}</p>
                <p><span className="font-semibold">Director:</span> —</p>
                <p><span className="font-semibold">Tel AD:</span> {callSheetData.focalContact || '—'}</p>
              </div>
              <div className="text-center">
                <p className="font-semibold">Day __ of __</p>
              </div>
              <div className="space-y-1 text-right">
                <p><span className="font-semibold">Client Call:</span> —</p>
                <p><span className="font-semibold">Agency Call:</span> —</p>
                <p><span className="font-semibold">Crew Call:</span> {callSheetData.callTime || '—'}</p>
                <p><span className="font-semibold">First Shot:</span> —</p>
                <p><span className="font-semibold">Last Wrap:</span> {callSheetData.wrapTime || '—'}</p>
              </div>
            </div>

            {/* Locations Table */}
            <div>
              <h4 className="text-lg font-bold text-center mb-3">Locations</h4>
              <table className="w-full border-collapse border border-border text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="border border-border p-2 text-left w-12">#</th>
                    <th className="border border-border p-2 text-left">Location</th>
                    <th className="border border-border p-2 text-left">Address</th>
                    <th className="border border-border p-2 text-left">Parking & Notes</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-border p-2">1</td>
                    <td className="border border-border p-2">{callSheetData.location || '—'}</td>
                    <td className="border border-border p-2">—</td>
                    <td className="border border-border p-2">—</td>
                  </tr>
                  {[...Array(3)].map((_, i) => (
                    <tr key={i}>
                      <td className="border border-border p-2">&nbsp;</td>
                      <td className="border border-border p-2">&nbsp;</td>
                      <td className="border border-border p-2">&nbsp;</td>
                      <td className="border border-border p-2">&nbsp;</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Crew Contacts Table */}
            <div>
              <h4 className="text-lg font-bold text-center mb-3">Crew Contacts</h4>
              <table className="w-full border-collapse border border-border text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="border border-border p-2 text-left">Role</th>
                    <th className="border border-border p-2 text-left">Name</th>
                    <th className="border border-border p-2 text-left">Contact Info</th>
                    <th className="border border-border p-2 text-left">Call Time</th>
                  </tr>
                </thead>
                <tbody>
                  {callSheetData.assignments && callSheetData.assignments.length > 0 ? (
                    callSheetData.assignments.map((assignment: any, i: number) => (
                      <tr key={i}>
                        <td className="border border-border p-2">{assignment.role}</td>
                        <td className="border border-border p-2">{assignment.name}</td>
                        <td className="border border-border p-2">{assignment.phone}</td>
                        <td className="border border-border p-2">{callSheetData.callTime || '—'}</td>
                      </tr>
                    ))
                  ) : null}
                  {[...Array(Math.max(5 - (callSheetData.assignments?.length || 0), 0))].map((_, i) => (
                    <tr key={`empty-${i}`}>
                      <td className="border border-border p-2">&nbsp;</td>
                      <td className="border border-border p-2">&nbsp;</td>
                      <td className="border border-border p-2">&nbsp;</td>
                      <td className="border border-border p-2">&nbsp;</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Schedule and Talent Section */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-lg font-bold text-center mb-3">Schedule</h4>
                <table className="w-full border-collapse border border-border text-sm">
                  <thead className="bg-muted">
                    <tr>
                      <th className="border border-border p-2 text-left w-24">Time</th>
                      <th className="border border-border p-2 text-left">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...Array(8)].map((_, i) => (
                      <tr key={i}>
                        <td className="border border-border p-2">&nbsp;</td>
                        <td className="border border-border p-2">&nbsp;</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div>
                <h4 className="text-lg font-bold text-center mb-3">Talent</h4>
                <table className="w-full border-collapse border border-border text-sm mb-4">
                  <thead className="bg-muted">
                    <tr>
                      <th className="border border-border p-2 text-left">Name</th>
                      <th className="border border-border p-2 text-left w-24">Call Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...Array(5)].map((_, i) => (
                      <tr key={i}>
                        <td className="border border-border p-2">&nbsp;</td>
                        <td className="border border-border p-2">&nbsp;</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div>
                  <h5 className="font-bold text-center mb-2">Notes</h5>
                  <div className="border border-border p-4 min-h-[100px] bg-muted/20">
                    <p className="text-sm text-muted-foreground">—</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Equipment Section */}
            {callSheetData.equipment && callSheetData.equipment.length > 0 && (
              <div className="border-t pt-4">
                <h4 className="text-lg font-bold mb-3">Equipment Required</h4>
                <table className="w-full border-collapse border border-border text-sm">
                  <thead className="bg-muted">
                    <tr>
                      <th className="border border-border p-2 text-left">Category</th>
                      <th className="border border-border p-2 text-left">Item</th>
                      <th className="border border-border p-2 text-left w-20">Qty</th>
                    </tr>
                  </thead>
                  <tbody>
                    {callSheetData.equipment.map((eq: any, i: number) => (
                      <tr key={i}>
                        <td className="border border-border p-2">{eq.category}</td>
                        <td className="border border-border p-2">{eq.item}</td>
                        <td className="border border-border p-2">{eq.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Footer */}
            <div className="text-center text-xs text-muted-foreground border-t pt-4">
              <p>Download Call Sheet Template: tv.kcap-inc.com/call-sheet</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
