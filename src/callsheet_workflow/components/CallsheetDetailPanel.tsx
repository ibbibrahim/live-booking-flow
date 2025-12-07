import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { X, ArrowLeft, Check, HelpCircle, Send, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';
import { CallsheetRequest, RoleType } from '../types';
import { CallsheetStatusBadge } from './CallsheetStatusBadge';
import { equipmentOptions } from '../callsheetStore';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface CallsheetDetailPanelProps {
  request: CallsheetRequest;
  currentRole: RoleType;
  onClose: () => void;
  onUpdate: (updatedRequest: CallsheetRequest) => void;
}

export const CallsheetDetailPanel = ({ 
  request, 
  currentRole, 
  onClose, 
  onUpdate 
}: CallsheetDetailPanelProps) => {
  const [comment, setComment] = useState('');
  const [equipmentAssigned, setEquipmentAssigned] = useState<string[]>(request.equipmentAssigned);
  const [equipmentOpen, setEquipmentOpen] = useState(false);

  const isCallsheetView = currentRole === 'Callsheet';
  const isTechnicalView = currentRole === 'TechnicalStore';

  // Check if equipment has changed
  const equipmentChanged = JSON.stringify([...equipmentAssigned].sort()) !== 
                           JSON.stringify([...request.equipmentRequested].sort());

  // Callsheet actions
  const handleApprove = () => {
    onUpdate({
      ...request,
      status: 'Completed',
      lastActionBy: 'Callsheet',
      lastComment: comment || 'Approved',
      equipmentAssigned,
    });
    onClose();
  };

  const handleRequestClarification = () => {
    if (!comment.trim()) return;
    onUpdate({
      ...request,
      status: 'ClarificationRequested',
      lastActionBy: 'Callsheet',
      lastComment: comment,
    });
    onClose();
  };

  // Technical Store actions
  const handleTechnicalSubmit = () => {
    const newStatus = equipmentChanged ? 'PendingRequesterApproval' : 'Completed';
    onUpdate({
      ...request,
      status: newStatus,
      lastActionBy: 'TechnicalStore',
      lastComment: comment,
      equipmentAssigned,
    });
    onClose();
  };

  const toggleEquipment = (item: string) => {
    setEquipmentAssigned(prev => 
      prev.includes(item) 
        ? prev.filter(e => e !== item)
        : [...prev, item]
    );
  };

  const canCallsheetTakeAction = isCallsheetView && request.status === 'PendingRequesterApproval';
  const canTechnicalTakeAction = isTechnicalView && 
    (request.status === 'PendingTechnical' || request.status === 'ClarificationRequested');

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onClose}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <CardTitle>{request.title}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {format(new Date(request.date), 'MMMM dd, yyyy')} • By {request.createdBy}
            </p>
          </div>
        </div>
        <CallsheetStatusBadge status={request.status} />
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Basic Info */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-muted-foreground text-sm">Date</Label>
            <p className="font-medium">{format(new Date(request.date), 'MM/dd/yyyy')}</p>
          </div>
          <div>
            <Label className="text-muted-foreground text-sm">Driver Needed</Label>
            <p className="font-medium">{request.driverNeeded ? 'Yes' : 'No'}</p>
          </div>
        </div>

        <Separator />

        {/* Equipment Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-muted-foreground text-sm mb-2 block">Equipment Requested (Original)</Label>
            <div className="flex flex-wrap gap-2">
              {request.equipmentRequested.length > 0 ? (
                request.equipmentRequested.map((item) => (
                  <Badge key={item} variant="outline">{item}</Badge>
                ))
              ) : (
                <span className="text-muted-foreground text-sm">None</span>
              )}
            </div>
          </div>
          <div>
            <Label className="text-muted-foreground text-sm mb-2 block">
              Equipment Assigned {canTechnicalTakeAction && '(Editable)'}
            </Label>
            {canTechnicalTakeAction ? (
              <>
                <Popover open={equipmentOpen} onOpenChange={setEquipmentOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="w-full justify-start mb-2">
                      Modify equipment...
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64 p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Search equipment..." />
                      <CommandList>
                        <CommandEmpty>No equipment found.</CommandEmpty>
                        <CommandGroup>
                          {equipmentOptions.map((item) => (
                            <CommandItem
                              key={item}
                              onSelect={() => toggleEquipment(item)}
                              className="cursor-pointer"
                            >
                              <Checkbox
                                checked={equipmentAssigned.includes(item)}
                                className="mr-2"
                              />
                              {item}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <div className="flex flex-wrap gap-2">
                  {equipmentAssigned.map((item) => {
                    const isNew = !request.equipmentRequested.includes(item);
                    return (
                      <Badge 
                        key={item} 
                        variant={isNew ? 'default' : 'secondary'}
                        className="gap-1"
                      >
                        {item}
                        <X
                          className="h-3 w-3 cursor-pointer hover:text-destructive"
                          onClick={() => toggleEquipment(item)}
                        />
                      </Badge>
                    );
                  })}
                  {equipmentAssigned.length === 0 && (
                    <span className="text-muted-foreground text-sm">None</span>
                  )}
                </div>
                {equipmentChanged && (
                  <Alert className="mt-2">
                    <AlertDescription className="text-sm">
                      Equipment differs from original request. Submitting will require requester approval.
                    </AlertDescription>
                  </Alert>
                )}
              </>
            ) : (
              <div className="flex flex-wrap gap-2">
                {equipmentAssigned.map((item) => {
                  const isNew = !request.equipmentRequested.includes(item);
                  const isRemoved = request.equipmentRequested.includes(item) && !equipmentAssigned.includes(item);
                  return (
                    <Badge 
                      key={item} 
                      variant={isNew ? 'default' : 'secondary'}
                    >
                      {item}
                    </Badge>
                  );
                })}
                {equipmentAssigned.length === 0 && (
                  <span className="text-muted-foreground text-sm">None</span>
                )}
              </div>
            )}
          </div>
        </div>

        <Separator />

        {/* Last Comment */}
        {request.lastComment && (
          <>
            <div>
              <Label className="text-muted-foreground text-sm mb-2 flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Last Comment (from {request.lastActionBy})
              </Label>
              <div className="bg-muted/50 p-3 rounded-md">
                <p className="text-sm">{request.lastComment}</p>
              </div>
            </div>
            <Separator />
          </>
        )}

        {/* Action Section */}
        {(canCallsheetTakeAction || canTechnicalTakeAction) && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="comment">Comment</Label>
              <Textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={
                  canTechnicalTakeAction 
                    ? "Explain any equipment changes or respond to clarification..." 
                    : "Add a comment (optional for approval, required for clarification)..."
                }
                rows={3}
              />
            </div>

            <div className="flex gap-2">
              {canCallsheetTakeAction && (
                <>
                  <Button onClick={handleApprove} className="flex-1 gap-2">
                    <Check className="h-4 w-4" />
                    Approve
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleRequestClarification}
                    disabled={!comment.trim()}
                    className="flex-1 gap-2"
                  >
                    <HelpCircle className="h-4 w-4" />
                    Request Clarification
                  </Button>
                </>
              )}
              {canTechnicalTakeAction && (
                <Button onClick={handleTechnicalSubmit} className="w-full gap-2">
                  <Send className="h-4 w-4" />
                  Submit
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Read-only message */}
        {!canCallsheetTakeAction && !canTechnicalTakeAction && (
          <div className="text-center text-muted-foreground text-sm py-4">
            {request.status === 'Completed' 
              ? 'This request has been completed.'
              : isCallsheetView 
                ? 'Waiting for Technical Store to review.'
                : 'No action available for this status.'}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
