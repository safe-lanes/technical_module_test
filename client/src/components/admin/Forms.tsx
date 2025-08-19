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
import { Search, Edit, History, Plus, Eye } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import AddComponentForm from './AddComponentForm';
import FormSchemaEditor from './FormSchemaEditor';

interface FormDefinition {
  id: number;
  name: string;
  subgroup: string;
  versionNo: number;
  versionDate: string;
  status: string;
}

interface FormVersion {
  id: number;
  formId: number;
  versionNo: number;
  versionDate: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  authorUserId: string;
  changelog: string | null;
  schemaJson: string;
}

export default function Forms() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('forms');
  const [addComponentFormOpen, setAddComponentFormOpen] = useState(false);
  const [selectedForm, setSelectedForm] = useState<FormDefinition | null>(null);
  const [versionDialogOpen, setVersionDialogOpen] = useState(false);
  const [editorDialogOpen, setEditorDialogOpen] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState<FormVersion | null>(null);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch forms list
  const { data: forms = [], isLoading } = useQuery<FormDefinition[]>({
    queryKey: ['/api/admin/forms'],
  });

  // Fetch versions for selected form
  const { data: versions = [] } = useQuery<FormVersion[]>({
    queryKey: ['/api/admin/forms', selectedForm?.id, 'versions'],
    queryFn: () => apiRequest(`/api/admin/forms/${selectedForm?.id}/versions`),
    enabled: !!selectedForm && versionDialogOpen,
  });

  // Create draft mutation
  const createDraftMutation = useMutation({
    mutationFn: (formId: number) => 
      apiRequest(`/api/admin/forms/${formId}/versions`, {
        method: 'POST',
        body: JSON.stringify({ userId: 'admin' }),
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/forms'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/forms', selectedForm?.id, 'versions'] });
      toast({
        title: 'Success',
        description: 'Draft version created successfully',
      });
      setSelectedVersion(data);
      setEditorDialogOpen(true);
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create draft',
        variant: 'destructive',
      });
    },
  });

  const filteredForms = forms.filter(form =>
    form.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    form.subgroup.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getFormDisplayName = (name: string) => {
    switch (name) {
      case 'ADD_COMPONENT':
        return 'Add Component Form';
      case 'WO_PLANNED':
        return 'Work Order Form';
      case 'WO_UNPLANNED':
        return 'Work Order Form';
      default:
        return name;
    }
  };

  const handleEditForm = async (form: FormDefinition) => {
    setSelectedForm(form);
    
    // Check if there's a draft version
    const versionsResponse = await apiRequest(`/api/admin/forms/${form.id}/versions`);
    const draftVersion = versionsResponse.find((v: FormVersion) => v.status === 'DRAFT');
    
    if (draftVersion) {
      setSelectedVersion(draftVersion);
      setEditorDialogOpen(true);
    } else {
      // Create a new draft
      createDraftMutation.mutate(form.id);
    }
  };

  const handleViewVersions = (form: FormDefinition) => {
    setSelectedForm(form);
    setVersionDialogOpen(true);
  };

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
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                      Loading forms...
                    </TableCell>
                  </TableRow>
                ) : filteredForms.length > 0 ? (
                  filteredForms.map((form) => (
                    <TableRow key={form.id}>
                      <TableCell className="font-medium">{getFormDisplayName(form.name)}</TableCell>
                      <TableCell>{form.subgroup}</TableCell>
                      <TableCell className="text-center">
                        <span className="font-mono">v{form.versionNo}</span>
                      </TableCell>
                      <TableCell className="text-center">
                        {form.versionDate ? format(new Date(form.versionDate), 'dd MMM yyyy') : '-'}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditForm(form)}
                            className="h-8 w-8"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewVersions(form)}
                            className="h-8 w-8"
                          >
                            <History className="h-4 w-4" />
                          </Button>
                        </div>
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

      {/* Version History Dialog */}
      <Dialog open={versionDialogOpen} onOpenChange={setVersionDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Version History - {getFormDisplayName(selectedForm?.name || '')}</DialogTitle>
            <DialogDescription>
              View and manage form versions
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-4">
            <table className="w-full">
              <thead className="border-b">
                <tr>
                  <th className="text-left py-2 px-3 font-medium text-gray-700">Version</th>
                  <th className="text-center py-2 px-3 font-medium text-gray-700">Status</th>
                  <th className="text-left py-2 px-3 font-medium text-gray-700">Author</th>
                  <th className="text-left py-2 px-3 font-medium text-gray-700">Date</th>
                  <th className="text-left py-2 px-3 font-medium text-gray-700">Changelog</th>
                  <th className="text-right py-2 px-3 font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {versions.map((version) => (
                  <tr key={version.id} className="hover:bg-gray-50">
                    <td className="py-3 px-3">
                      <span className="font-mono">v{version.versionNo}</span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <Badge className={
                        version.status === 'PUBLISHED' ? 'bg-green-100 text-green-800' :
                        version.status === 'DRAFT' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }>
                        {version.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-3 text-gray-600">{version.authorUserId}</td>
                    <td className="py-3 px-3 text-gray-600">
                      {format(new Date(version.versionDate), 'MMM dd, yyyy')}
                    </td>
                    <td className="py-3 px-3 text-gray-600 text-sm">
                      {version.changelog || '-'}
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex justify-end gap-1">
                        {version.status === 'DRAFT' ? (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setSelectedVersion(version);
                              setEditorDialogOpen(true);
                            }}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setSelectedVersion(version);
                              // View mode - could open a preview
                            }}
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DialogContent>
      </Dialog>

      {/* Schema Editor Dialog */}
      {selectedVersion && (
        <FormSchemaEditor
          open={editorDialogOpen}
          onOpenChange={setEditorDialogOpen}
          version={selectedVersion}
          formName={getFormDisplayName(selectedForm?.name || '')}
          onUpdate={() => {
            queryClient.invalidateQueries({ queryKey: ['/api/admin/forms'] });
            queryClient.invalidateQueries({ queryKey: ['/api/admin/forms', selectedForm?.id, 'versions'] });
          }}
        />
      )}
    </div>
  );
}