import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Trash2 } from 'lucide-react';

interface Equipment {
  category: string;
  item: string;
  quantity: number;
}

interface EquipmentTabProps {
  equipment: Equipment[];
  setEquipment: (val: Equipment[]) => void;
  departmentsToApprove: string[];
  setDepartmentsToApprove: (val: string[]) => void;
  departmentsToNotify: string[];
  setDepartmentsToNotify: (val: string[]) => void;
}

const equipmentCategories = {
  Camera: ['Z90', 'FX6', 'GoPro', 'Canon C300', 'RED Komodo'],
  Lighting: ['LED Panel 1x1', 'Fresnel 2K', 'Kino Flo 4ft', 'Softbox Kit', 'Light Stand'],
  Sound: ['Shotgun Mic', 'Lavalier Set', 'Boom Pole', 'Audio Recorder', 'Wireless Kit'],
  'SD Cards': ['64GB', '128GB', '256GB', '512GB'],
};

const departments = [
  'News Media Dept',
  '37TV Production',
  'Technical Support',
  'Storekeeper',
  'Transportation',
  'Graphics Team'
];

export const EquipmentTab = ({
  equipment,
  setEquipment,
  departmentsToApprove,
  setDepartmentsToApprove,
  departmentsToNotify,
  setDepartmentsToNotify
}: EquipmentTabProps) => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedItem, setSelectedItem] = useState('');
  const [quantity, setQuantity] = useState(1);

  const addEquipment = () => {
    if (!selectedCategory || !selectedItem) return;

    setEquipment([
      ...equipment,
      { category: selectedCategory, item: selectedItem, quantity }
    ]);

    setSelectedCategory('');
    setSelectedItem('');
    setQuantity(1);
  };

  const removeEquipment = (index: number) => {
    setEquipment(equipment.filter((_, i) => i !== index));
  };

  const toggleDepartment = (dept: string, list: string[], setter: (val: string[]) => void) => {
    if (list.includes(dept)) {
      setter(list.filter(d => d !== dept));
    } else {
      setter([...list, dept]);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add Equipment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={selectedCategory} onValueChange={(val) => {
                setSelectedCategory(val);
                setSelectedItem('');
              }}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(equipmentCategories).map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="item">Item</Label>
              <Select 
                value={selectedItem} 
                onValueChange={setSelectedItem}
                disabled={!selectedCategory}
              >
                <SelectTrigger id="item">
                  <SelectValue placeholder="Select item" />
                </SelectTrigger>
                <SelectContent>
                  {selectedCategory && equipmentCategories[selectedCategory as keyof typeof equipmentCategories]?.map((item) => (
                    <SelectItem key={item} value={item}>{item}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              />
            </div>

            <div className="flex items-end">
              <Button onClick={addEquipment} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Equipment List</CardTitle>
        </CardHeader>
        <CardContent>
          {equipment.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No equipment added yet</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead>Item</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {equipment.map((eq, index) => (
                  <TableRow key={index}>
                    <TableCell>{eq.category}</TableCell>
                    <TableCell>{eq.item}</TableCell>
                    <TableCell>{eq.quantity}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeEquipment(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Departments to Approve</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {departments.map((dept) => (
              <div key={dept} className="flex items-center space-x-2">
                <Checkbox
                  id={`approve-${dept}`}
                  checked={departmentsToApprove.includes(dept)}
                  onCheckedChange={() => toggleDepartment(dept, departmentsToApprove, setDepartmentsToApprove)}
                />
                <Label htmlFor={`approve-${dept}`}>{dept}</Label>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Departments to Notify</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {departments.map((dept) => (
              <div key={dept} className="flex items-center space-x-2">
                <Checkbox
                  id={`notify-${dept}`}
                  checked={departmentsToNotify.includes(dept)}
                  onCheckedChange={() => toggleDepartment(dept, departmentsToNotify, setDepartmentsToNotify)}
                />
                <Label htmlFor={`notify-${dept}`}>{dept}</Label>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
