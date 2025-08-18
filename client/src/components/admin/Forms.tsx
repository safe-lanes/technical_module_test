import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Edit } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AddComponentForm from './AddComponentForm';

interface FormConfig {
  id: number;
  formName: string;
  formSubGroup: string;
  versionNo: string;
  versionDate: string;
}

export default function Forms() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('forms');
  const [addComponentFormOpen, setAddComponentFormOpen] = useState(false);

  // Sample data matching the image
  const formsData: FormConfig[] = [
    {
      id: 1,
      formName: 'Add Component Form',
      formSubGroup: 'NA',
      versionNo: '01',
      versionDate: '15 Jan 2025'
    },
    {
      id: 2,
      formName: 'Work Order Form',
      formSubGroup: 'New Work Order (Planned)',
      versionNo: '02',
      versionDate: '22 Mar 2025'
    },
    {
      id: 3,
      formName: 'Work Order Form',
      formSubGroup: 'New Unplanned Work Order',
      versionNo: '01',
      versionDate: '9 Jul 2025'
    }
  ];

  const filteredForms = formsData.filter(form =>
    form.formName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    form.formSubGroup.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Forms Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Tab Navigation */}
          <div className="flex items-center justify-between">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="bg-gray-100">
                <TabsTrigger value="bulk-data" className="data-[state=active]:bg-white">Bulk Data Imp</TabsTrigger>
                <TabsTrigger value="alerts" className="data-[state=active]:bg-white">Alerts</TabsTrigger>
                <TabsTrigger value="forms" className="text-white data-[state=active]:text-white" style={{ backgroundColor: '#52baf3' }}>
                  Forms
                </TabsTrigger>
                <TabsTrigger value="adm4" className="data-[state=active]:bg-white">Adm 4</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search Form"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Forms Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-[#52baf3]" style={{ backgroundColor: '#52baf3' }}>
                  <TableHead className="font-semibold text-white">Form Name</TableHead>
                  <TableHead className="font-semibold text-white">Form Sub Group</TableHead>
                  <TableHead className="font-semibold text-white text-center">Version No</TableHead>
                  <TableHead className="font-semibold text-white text-center">Version Date</TableHead>
                  <TableHead className="font-semibold text-white text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredForms.length > 0 ? (
                  filteredForms.map((form) => (
                    <TableRow key={form.id}>
                      <TableCell className="font-medium">{form.formName}</TableCell>
                      <TableCell>{form.formSubGroup}</TableCell>
                      <TableCell className="text-center">{form.versionNo}</TableCell>
                      <TableCell className="text-center">{form.versionDate}</TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            if (form.formName === 'Add Component Form') {
                              setAddComponentFormOpen(true);
                            } else {
                              console.log('Edit form:', form.id);
                            }
                          }}
                          className="h-8 w-8"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                      No forms found matching your search criteria
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add Component Form Dialog */}
      <AddComponentForm 
        open={addComponentFormOpen}
        onOpenChange={setAddComponentFormOpen}
      />
    </div>
  );
}