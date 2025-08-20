import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Wrench, Package, FileText, Archive } from 'lucide-react';

interface ModifyOption {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  route: string;
}

const modifyOptions: ModifyOption[] = [
  {
    id: 'components',
    title: 'Components',
    description: 'Modify component hierarchy and details',
    icon: <Wrench className="h-6 w-6" />,
    route: '/pms/components?modify=1'
  },
  {
    id: 'work-orders',
    title: 'Work Orders Planned',
    description: 'Edit planned maintenance schedules',
    icon: <FileText className="h-6 w-6" />,
    route: '/pms/work-orders?modify=1'
  },
  {
    id: 'spares',
    title: 'Spares',
    description: 'Update spare parts inventory',
    icon: <Package className="h-6 w-6" />,
    route: '/pms/spares?modify=1'
  },
  {
    id: 'stores',
    title: 'Stores',
    description: 'Manage store inventory items',
    icon: <Archive className="h-6 w-6" />,
    route: '/pms/stores?modify=1'
  }
];

export function ModifyPMS() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<ModifyOption | null>(null);
  const [location, setLocation] = useLocation();

  const handleOptionSelect = (option: ModifyOption) => {
    setSelectedOption(option);
  };

  const handleProceed = () => {
    if (selectedOption) {
      // Navigate to the selected module with modify flag
      setLocation(selectedOption.route);
    }
  };

  const handleCancel = () => {
    setSelectedOption(null);
    setIsModalOpen(false);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Modify PMS</h1>
        <p className="text-muted-foreground mt-2">
          Create change requests to modify PMS data. Changes require approval before being applied.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card 
          className="cursor-pointer hover:border-primary transition-colors"
          onClick={() => setIsModalOpen(true)}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wrench className="h-5 w-5 text-primary" />
              New Change Request
            </CardTitle>
            <CardDescription>
              Create a new modification request for PMS data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Select the module you want to modify and navigate to the specific item to propose changes.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-orange-500" />
              Pending Requests
            </CardTitle>
            <CardDescription>
              View and manage your pending change requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Track the status of your submitted change requests and respond to reviewer feedback.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Archive className="h-5 w-5 text-green-500" />
              Request History
            </CardTitle>
            <CardDescription>
              View approved and rejected requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Access the complete history of all change requests including approved and rejected items.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 2-Step Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {selectedOption ? 'Confirm Selection' : 'Select Module to Modify'}
            </DialogTitle>
            <DialogDescription>
              {selectedOption 
                ? `You will be navigated to ${selectedOption.title} in modify mode.`
                : 'Choose which PMS module you want to modify.'}
            </DialogDescription>
          </DialogHeader>

          {!selectedOption ? (
            // Step 1: Module Selection
            <div className="grid gap-4 py-4">
              {modifyOptions.map((option) => (
                <Card
                  key={option.id}
                  className="cursor-pointer hover:border-primary transition-colors"
                  onClick={() => handleOptionSelect(option)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className="text-primary">{option.icon}</div>
                      <div>
                        <CardTitle className="text-base">{option.title}</CardTitle>
                        <CardDescription className="text-sm mt-1">
                          {option.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          ) : (
            // Step 2: Confirmation
            <div className="py-6">
              <Card className="border-primary">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="text-primary">{selectedOption.icon}</div>
                    <div>
                      <CardTitle>{selectedOption.title}</CardTitle>
                      <CardDescription className="mt-1">
                        {selectedOption.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
              
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <h4 className="font-semibold text-sm mb-2">What happens next:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• You'll navigate to the {selectedOption.title} module</li>
                  <li>• Select the specific item you want to modify</li>
                  <li>• Make your changes (highlighted in blue and red)</li>
                  <li>• Submit your change request for approval</li>
                </ul>
              </div>
            </div>
          )}

          <DialogFooter>
            {selectedOption ? (
              <>
                <Button variant="outline" onClick={() => setSelectedOption(null)}>
                  Back
                </Button>
                <Button onClick={handleProceed}>
                  Proceed to {selectedOption.title}
                </Button>
              </>
            ) : (
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}