import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, User } from 'lucide-react';

const Booking = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Booking Workspace</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Producer creates a booking → (optional) Creative graphics request → Supervisor assigns editor + suite (1–10) or Outdoor + slot
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Act as</span>
              <Badge variant="secondary" className="text-xs">Role: Producer</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select defaultValue="producer">
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="producer">Producer</SelectItem>
                <SelectItem value="supervisor">Supervisor</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Bookings:</span>
              <Badge variant="outline">0</Badge>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4">
          <div className="flex gap-2">
            <Badge variant="default" className="gap-1">
              <span className="h-2 w-2 rounded-full bg-primary-foreground"></span>
              Requested
            </Badge>
            <Badge variant="secondary" className="gap-1">
              <span className="h-2 w-2 rounded-full bg-purple-500"></span>
              Graphics Pending
            </Badge>
            <Badge variant="secondary" className="gap-1">
              <span className="h-2 w-2 rounded-full bg-green-500"></span>
              Graphics Ready
            </Badge>
            <Badge variant="secondary" className="gap-1">
              <span className="h-2 w-2 rounded-full bg-yellow-500"></span>
              Acknowledged
            </Badge>
            <Badge variant="secondary" className="gap-1">
              <span className="h-2 w-2 rounded-full bg-blue-500"></span>
              Assigned
            </Badge>
          </div>

          <div className="flex gap-2">
            <Badge variant="secondary" className="gap-1">
              <span className="h-2 w-2 rounded-full bg-gray-500"></span>
              Completed
            </Badge>
            <Badge variant="secondary" className="gap-1">
              <span className="h-2 w-2 rounded-full bg-red-500"></span>
              Rejected
            </Badge>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Producer Request</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Producer Name</label>
                  <div className="h-10 px-3 py-2 border rounded-md bg-muted/50"></div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Program / Project</label>
                  <div className="h-10 px-3 py-2 border rounded-md bg-muted/50"></div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground text-center py-8">
                No active bookings. Create a new booking request to get started.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Booking;
