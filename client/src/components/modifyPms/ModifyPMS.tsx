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
import { Wrench, Package, FileText, Archive, ArrowLeft, Eye, Check, X } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMutation } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';

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

type ViewMode = 'dashboard' | 'pending' | 'history';

interface ChangeRequest {
  id: number;
  vesselId: string;
  category: string;
  title: string;
  reason: string;
  status: 'draft' | 'submitted' | 'returned' | 'approved' | 'rejected';
  requestedByUserId: string;
  submittedAt: Date | null;
  reviewedByUserId: string | null;
  reviewedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export function ModifyPMS() {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left Sidebar - Blue Background */}
      <div className="w-64 bg-[#52BAF3] text-white">
        <div className="p-4">
          <div className="bg-[#40a8e0] px-4 py-3 rounded-t-lg">
            <h2 className="text-white font-medium">Category</h2>
          </div>
          <div className="bg-white rounded-b-lg">
            <div className="p-4 space-y-1">
              <button className="w-full text-left px-3 py-2 text-sm rounded transition-colors text-gray-700 hover:bg-gray-50">
                1. Components
              </button>
              <button className="w-full text-left px-3 py-2 text-sm rounded transition-colors text-gray-700 hover:bg-gray-50">
                2. Work orders
              </button>
              <button className="w-full text-left px-3 py-2 text-sm rounded transition-colors text-gray-700 hover:bg-gray-50">
                3. Spares
              </button>
              <button className="w-full text-left px-3 py-2 text-sm rounded transition-colors text-gray-700 hover:bg-gray-50">
                4. Stores
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Modify PMS - Change Requests</h1>
          
          <div className="flex justify-between items-center">
            <div className="relative">
              <input
                type="text"
                placeholder="Search Status"
                className="pl-10 w-80 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <Button className="bg-[#52BAF3] hover:bg-[#40a8e0] text-white px-6">
              + New Change Request
            </Button>
          </div>
        </div>

        {/* Table Content */}
        <div className="flex-1 p-6">
          <div className="bg-white rounded-lg border border-gray-200 h-full">
            <div className="h-full flex flex-col">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#52BAF3] hover:bg-[#52BAF3] border-b-0">
                    <TableHead className="text-white font-medium py-4 px-6">Request Title</TableHead>
                    <TableHead className="text-white font-medium py-4 px-6">Requested By</TableHead>
                    <TableHead className="text-white font-medium py-4 px-6">Date</TableHead>
                    <TableHead className="text-white font-medium py-4 px-6">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className="border-b border-gray-200 hover:bg-gray-50">
                    <TableCell className="py-4 px-6">
                      <div className="font-medium text-gray-900">Modify Main Engine Maintenance Schedule</div>
                    </TableCell>
                    <TableCell className="py-4 px-6 text-gray-700">Chief Engineer</TableCell>
                    <TableCell className="py-4 px-6 text-gray-700">2025-05-20</TableCell>
                    <TableCell className="py-4 px-6">
                      <Badge className="bg-[#52BAF3] text-white px-3 py-1 text-xs rounded-full">
                        Pending Approval
                      </Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow className="border-b border-gray-200 hover:bg-gray-50">
                    <TableCell className="py-4 px-6">
                      <div className="font-medium text-gray-900">Update Steering System Component Details</div>
                    </TableCell>
                    <TableCell className="py-4 px-6 text-gray-700">2nd Engineer</TableCell>
                    <TableCell className="py-4 px-6 text-gray-700">2025-05-18</TableCell>
                    <TableCell className="py-4 px-6">
                      <Badge className="bg-green-500 text-white px-3 py-1 text-xs rounded-full">
                        Approved
                      </Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow className="border-b border-gray-200 hover:bg-gray-50">
                    <TableCell className="py-4 px-6">
                      <div className="font-medium text-gray-900">Request Special Tool for Aux Engine</div>
                    </TableCell>
                    <TableCell className="py-4 px-6 text-gray-700">3rd Engineer</TableCell>
                    <TableCell className="py-4 px-6 text-gray-700">2025-05-10</TableCell>
                    <TableCell className="py-4 px-6">
                      <Badge className="bg-red-500 text-white px-3 py-1 text-xs rounded-full">
                        Rejected
                      </Badge>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              
              {/* Pagination info at bottom */}
              <div className="mt-auto px-6 py-4 border-t border-gray-200 text-sm text-gray-500">
                0 to 3 of 3
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}