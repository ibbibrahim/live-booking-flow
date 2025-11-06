import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

interface CallSheet {
  id: string;
  title: string;
  department: string;
  filmingDate: string;
  location: string;
  status: 'Draft' | 'Submitted' | 'Approved';
}

const CallSheetDashboard = () => {
  const navigate = useNavigate();
  const [callSheets, setCallSheets] = useState<CallSheet[]>([
    {
      id: '1',
      title: 'News Segment - City Hall',
      department: 'News',
      filmingDate: '2025-11-15',
      location: 'City Hall',
      status: 'Approved',
    },
    {
      id: '2',
      title: 'Sports Interview',
      department: 'Sports',
      filmingDate: '2025-11-16',
      location: 'Stadium',
      status: 'Submitted',
    },
  ]);

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this call sheet?')) {
      setCallSheets(prev => prev.filter(sheet => sheet.id !== id));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Draft': return 'bg-muted text-muted-foreground';
      case 'Submitted': return 'bg-accent/10 text-accent';
      case 'Approved': return 'bg-success/10 text-success';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Call Sheet Workflow</h2>
            <p className="text-muted-foreground mt-1">Manage call sheets, equipment, and transportation requests</p>
          </div>
          <Button onClick={() => navigate('/callsheet/new')} className="gap-2">
            <Plus className="h-4 w-4" />
            New Call Sheet
          </Button>
        </div>

        <div className="bg-card rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Filming Date</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {callSheets.map((sheet) => (
                <TableRow 
                  key={sheet.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => navigate(`/callsheet/${sheet.id}`)}
                >
                  <TableCell className="font-medium">{sheet.title}</TableCell>
                  <TableCell>{sheet.department}</TableCell>
                  <TableCell>{format(new Date(sheet.filmingDate), 'MM/dd/yyyy')}</TableCell>
                  <TableCell>{sheet.location}</TableCell>
                  <TableCell>
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(sheet.status)}`}>
                      {sheet.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/callsheet/${sheet.id}`);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(sheet.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {callSheets.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                    No call sheets found. Create your first one!
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </Layout>
  );
};

export default CallSheetDashboard;
