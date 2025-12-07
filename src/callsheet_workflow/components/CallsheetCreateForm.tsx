import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Plus, X } from 'lucide-react';
import { CallsheetRequest } from '../types';
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

interface CallsheetCreateFormProps {
  onSubmit: (request: Omit<CallsheetRequest, 'id' | 'equipmentAssigned' | 'status' | 'lastActionBy' | 'lastComment'>) => void;
}

export const CallsheetCreateForm = ({ onSubmit }: CallsheetCreateFormProps) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [driverNeeded, setDriverNeeded] = useState(false);
  const [equipmentRequested, setEquipmentRequested] = useState<string[]>([]);
  const [equipmentOpen, setEquipmentOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date) return;

    onSubmit({
      title,
      date,
      createdBy: 'Current User',
      driverNeeded,
      equipmentRequested,
    });

    // Reset form
    setTitle('');
    setDate('');
    setDriverNeeded(false);
    setEquipmentRequested([]);
  };

  const toggleEquipment = (item: string) => {
    setEquipmentRequested(prev => 
      prev.includes(item) 
        ? prev.filter(e => e !== item)
        : [...prev, item]
    );
  };

  const removeEquipment = (item: string) => {
    setEquipmentRequested(prev => prev.filter(e => e !== item));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Create Callsheet
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter callsheet title"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Equipment Requested</Label>
            <Popover open={equipmentOpen} onOpenChange={setEquipmentOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start">
                  {equipmentRequested.length > 0 
                    ? `${equipmentRequested.length} item(s) selected`
                    : 'Select equipment...'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0" align="start">
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
                            checked={equipmentRequested.includes(item)}
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
            {equipmentRequested.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {equipmentRequested.map((item) => (
                  <Badge key={item} variant="secondary" className="gap-1">
                    {item}
                    <X
                      className="h-3 w-3 cursor-pointer hover:text-destructive"
                      onClick={() => removeEquipment(item)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="driverNeeded"
              checked={driverNeeded}
              onCheckedChange={(checked) => setDriverNeeded(checked === true)}
            />
            <Label htmlFor="driverNeeded" className="cursor-pointer">
              Driver needed
            </Label>
          </div>

          <Button type="submit" className="w-full">
            Create Callsheet
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
