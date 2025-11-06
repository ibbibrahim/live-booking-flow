import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Trash2 } from 'lucide-react';

interface Assignment {
  role: string;
  name: string;
  phone: string;
}

interface Acknowledgement {
  acknowledge: boolean;
  approve: boolean;
  comment: string;
}

interface CallSheetTabProps {
  department: string;
  setDepartment: (val: string) => void;
  title: string;
  setTitle: (val: string) => void;
  filmingDate: string;
  setFilmingDate: (val: string) => void;
  callTime: string;
  setCallTime: (val: string) => void;
  wrapTime: string;
  setWrapTime: (val: string) => void;
  location: string;
  setLocation: (val: string) => void;
  focalPoint: string;
  setFocalPoint: (val: string) => void;
  focalContact: string;
  setFocalContact: (val: string) => void;
  driverNeeded: boolean;
  setDriverNeeded: (val: boolean) => void;
  assignments: Assignment[];
  setAssignments: (val: Assignment[]) => void;
  acknowledgements: Record<string, Acknowledgement>;
  setAcknowledgements: (val: Record<string, Acknowledgement>) => void;
}

export const CallSheetTab = ({
  department, setDepartment, title, setTitle, filmingDate, setFilmingDate,
  callTime, setCallTime, wrapTime, setWrapTime, location, setLocation,
  focalPoint, setFocalPoint, focalContact, setFocalContact,
  driverNeeded, setDriverNeeded, assignments, setAssignments,
  acknowledgements, setAcknowledgements
}: CallSheetTabProps) => {
  
  const addAssignment = () => {
    setAssignments([...assignments, { role: '', name: '', phone: '' }]);
  };

  const removeAssignment = (index: number) => {
    setAssignments(assignments.filter((_, i) => i !== index));
  };

  const updateAssignment = (index: number, field: keyof Assignment, value: string) => {
    const updated = [...assignments];
    updated[index][field] = value;
    setAssignments(updated);
  };

  const updateAcknowledgement = (dept: string, field: keyof Acknowledgement, value: boolean | string) => {
    setAcknowledgements({
      ...acknowledgements,
      [dept]: { ...acknowledgements[dept], [field]: value }
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Booking Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="department">Department *</Label>
              <Select value={department} onValueChange={setDepartment}>
                <SelectTrigger id="department">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="News">News</SelectItem>
                  <SelectItem value="Sports">Sports</SelectItem>
                  <SelectItem value="Production">Production</SelectItem>
                  <SelectItem value="Documentary">Documentary</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter call sheet title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="filmingDate">Filming Date *</Label>
              <Input
                id="filmingDate"
                type="date"
                value={filmingDate}
                onChange={(e) => setFilmingDate(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="callTime">Call Time</Label>
              <Input
                id="callTime"
                type="time"
                value={callTime}
                onChange={(e) => setCallTime(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="wrapTime">Wrap Time</Label>
              <Input
                id="wrapTime"
                type="time"
                value={wrapTime}
                onChange={(e) => setWrapTime(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Filming location"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="focalPoint">Focal Point</Label>
              <Input
                id="focalPoint"
                value={focalPoint}
                onChange={(e) => setFocalPoint(e.target.value)}
                placeholder="Name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="focalContact">Focal Contact</Label>
              <Input
                id="focalContact"
                value={focalContact}
                onChange={(e) => setFocalContact(e.target.value)}
                placeholder="Phone number"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="driverNeeded"
                checked={driverNeeded}
                onCheckedChange={setDriverNeeded}
              />
              <Label htmlFor="driverNeeded">Driver Needed</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Crew Assignments</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {assignments.map((assignment, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div className="space-y-2">
                <Label>Role</Label>
                <Input
                  value={assignment.role}
                  onChange={(e) => updateAssignment(index, 'role', e.target.value)}
                  placeholder="e.g., Cameraman"
                />
              </div>
              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  value={assignment.name}
                  onChange={(e) => updateAssignment(index, 'name', e.target.value)}
                  placeholder="Full name"
                />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input
                  value={assignment.phone}
                  onChange={(e) => updateAssignment(index, 'phone', e.target.value)}
                  placeholder="Contact number"
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeAssignment(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button variant="outline" onClick={addAssignment} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Assignment
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Department Acknowledgements</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {Object.entries({
            newsMedia: 'News Media Department',
            tv37: '37TV Production Team',
            technical: 'Technical Support',
            storekeeper: 'Storekeeper'
          }).map(([key, label]) => (
            <div key={key} className="border rounded-lg p-4 space-y-3">
              <h4 className="font-medium">{label}</h4>
              <div className="flex items-center gap-6">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`${key}-ack`}
                    checked={acknowledgements[key]?.acknowledge}
                    onCheckedChange={(checked) => 
                      updateAcknowledgement(key, 'acknowledge', checked === true)
                    }
                  />
                  <Label htmlFor={`${key}-ack`}>Acknowledge</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`${key}-app`}
                    checked={acknowledgements[key]?.approve}
                    onCheckedChange={(checked) => 
                      updateAcknowledgement(key, 'approve', checked === true)
                    }
                  />
                  <Label htmlFor={`${key}-app`}>Approve</Label>
                </div>
              </div>
              <Textarea
                placeholder="Comments"
                value={acknowledgements[key]?.comment || ''}
                onChange={(e) => updateAcknowledgement(key, 'comment', e.target.value)}
              />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
