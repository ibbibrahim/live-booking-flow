import { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Radio, AlertCircle } from 'lucide-react';
import { useRealtimeRequests } from '@/hooks/useRealtimeRequests';
import { supabase } from '@/integrations/supabase/client';

const NOC = () => {
  const [activeStreams, setActiveStreams] = useState(0);
  const [scheduled, setScheduled] = useState(0);
  const [alerts, setAlerts] = useState(0);

  useEffect(() => {
    const fetchNOCData = async () => {
      const { data } = await supabase
        .from('requests')
        .select('*')
        .in('state', ['Submitted', 'With NOC', 'Clarification Requested']);
      
      if (data) {
        setScheduled(data.length);
      }
    };

    fetchNOCData();
  }, []);

  useRealtimeRequests({
    onRequestCreated: (data) => {
      if (data.state === 'Submitted') {
        setScheduled(prev => prev + 1);
      }
    },
    onRequestUpdated: (data) => {
      console.log('NOC received update:', data);
    },
  });

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold text-foreground">NOC Workspace</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Network Operations Center - Monitor and manage live broadcasts
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Streams</CardTitle>
              <Radio className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeStreams}</div>
              <p className="text-xs text-muted-foreground">Currently broadcasting</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
              <Radio className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{scheduled}</div>
              <p className="text-xs text-muted-foreground">Upcoming broadcasts</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Alerts</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{alerts}</div>
              <p className="text-xs text-muted-foreground">Active alerts</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Live Monitoring</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Badge variant="default">All Channels</Badge>
                <Badge variant="outline">HD</Badge>
                <Badge variant="outline">SD</Badge>
                <Badge variant="outline">Outdoor</Badge>
              </div>
              <p className="text-sm text-muted-foreground text-center py-12">
                No active broadcasts. Monitoring systems are operational.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default NOC;
