import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Settings, Wrench, Package, Archive } from 'lucide-react';
import { useLocation } from 'wouter';
export function ChangeRequestModal(_a) {
  var open = _a.open,
    onClose = _a.onClose;
  var _b = useLocation(),
    setLocation = _b[1];
  var tiles = [
    {
      id: 'components',
      title: 'Components',
      description:
        'Modify component hierarchy, specifications, and configuration',
      icon: Settings,
      color: 'bg-blue-50 hover:bg-blue-100 border-blue-200',
      iconColor: 'text-blue-600',
    },
    {
      id: 'work_orders',
      title: 'Planned Work Orders',
      description: 'Update maintenance schedules, procedures, and requirements',
      icon: Wrench,
      color: 'bg-green-50 hover:bg-green-100 border-green-200',
      iconColor: 'text-green-600',
    },
    {
      id: 'spares',
      title: 'Spares',
      description:
        'Adjust spare parts inventory, specifications, and stock levels',
      icon: Package,
      color: 'bg-orange-50 hover:bg-orange-100 border-orange-200',
      iconColor: 'text-orange-600',
    },
    {
      id: 'stores',
      title: 'Stores',
      description: 'Modify store items, categories, and inventory management',
      icon: Archive,
      color: 'bg-purple-50 hover:bg-purple-100 border-purple-200',
      iconColor: 'text-purple-600',
    },
  ];
  var handleTileClick = function (moduleId) {
    onClose();
    // Navigate to the respective module with modify mode enabled
    switch (moduleId) {
      case 'components':
        setLocation('/pms/components?modify=1');
        break;
      case 'work_orders':
        setLocation('/pms/work-orders?modify=1');
        break;
      case 'spares':
        setLocation('/pms/spares?modify=1');
        break;
      case 'stores':
        setLocation('/pms/stores?modify=1');
        break;
    }
  };
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className='max-w-4xl'>
        <DialogHeader>
          <DialogTitle className='text-xl font-semibold'>
            New Change Request
          </DialogTitle>
          <p className='text-sm text-gray-600 mt-2'>
            Select the module you want to modify. You'll be able to navigate to
            specific items and make changes.
          </p>
        </DialogHeader>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-6'>
          {tiles.map(function (tile) {
            var IconComponent = tile.icon;
            return (
              <Card
                key={tile.id}
                className={'cursor-pointer transition-all duration-200 '.concat(
                  tile.color,
                  ' hover:shadow-md'
                )}
                onClick={function () {
                  return handleTileClick(tile.id);
                }}
              >
                <CardHeader className='pb-3'>
                  <div className='flex items-center space-x-3'>
                    <div className={'p-2 rounded-lg bg-white shadow-sm'}>
                      <IconComponent
                        className={'h-6 w-6 '.concat(tile.iconColor)}
                      />
                    </div>
                    <div>
                      <CardTitle className='text-lg font-semibold text-gray-900'>
                        {tile.title}
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className='pt-0'>
                  <CardDescription className='text-sm text-gray-600 leading-relaxed'>
                    {tile.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className='flex justify-end mt-6 pt-4 border-t'>
          <Button variant='outline' onClick={onClose}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
//# sourceMappingURL=ChangeRequestModal.jsx.map
