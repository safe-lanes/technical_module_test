import React from 'react';
import { ICellRendererParams } from 'ag-grid-community';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pen, Timer, Eye, Edit, Trash2, Plus, Minus } from 'lucide-react';

// Status badge renderer
export const StatusCellRenderer = (params: ICellRendererParams) => {
  const getStatusColor = (status: string) => {
    const normalizedStatus = status.toLowerCase();
    switch (normalizedStatus) {
      case 'completed':
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'due':
        return 'bg-yellow-100 text-yellow-800';
      case 'due (grace p)':
        return 'bg-orange-100 text-orange-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      case 'postponed':
        return 'bg-blue-100 text-blue-800';
      case 'pending approval':
        return 'bg-purple-100 text-purple-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'ok':
        return 'bg-green-100 text-green-800';
      case 'low':
        return 'bg-orange-100 text-orange-800';
      case 'minimum':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!params.value) return '';

  return (
    <Badge className={getStatusColor(params.value)}>
      {params.value.toUpperCase()}
    </Badge>
  );
};

// Critical indicator cell renderer
export const CriticalCellRenderer = (params: ICellRendererParams) => {
  const isCritical = params.value === 'Yes' || params.value === 'Critical';
  
  return (
    <Badge className={isCritical ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}>
      {isCritical ? 'Critical' : 'No'}
    </Badge>
  );
};

// Stock status cell renderer for spares
export const StockStatusCellRenderer = (params: ICellRendererParams) => {
  const { data } = params;
  
  if (!data) return '';
  
  // Calculate stock status based on ROB and minimum values
  let stockStatus = '';
  const rob = data.rob || 0;
  const min = data.min || 0;
  
  if (rob >= min && min > 0) {
    stockStatus = 'OK';
  } else if (rob > 0 && rob < min) {
    stockStatus = 'Low';
  } else if (rob === 0) {
    stockStatus = 'Minimum';
  }
  
  // Use provided stock status if available, otherwise calculated
  const status = data.stock || stockStatus;
  
  return <StatusCellRenderer value={status} />;
};

// Work Orders actions cell renderer
export const WorkOrderActionsCellRenderer = (params: ICellRendererParams) => {
  const { data, context } = params;
  
  if (!data || !context) return null;

  const handleEdit = () => {
    if (context.onEdit) {
      context.onEdit(data);
    }
  };

  const handlePostpone = () => {
    if (context.onPostpone) {
      context.onPostpone(data);
    }
  };

  const handleApprove = () => {
    if (context.onApprove) {
      context.onApprove(data);
    }
  };

  const handleReject = () => {
    if (context.onReject) {
      context.onReject(data);
    }
  };

  // Show different actions based on record type and status
  const isExecution = data.isExecution;
  const isPendingApproval = data.status === 'Pending Approval';

  return (
    <div className="flex gap-1 justify-center">
      {!isExecution && (
        <>
          <Button size="sm" variant="outline" onClick={handleEdit}>
            <Pen className="w-3 h-3" />
          </Button>
          <Button size="sm" variant="outline" onClick={handlePostpone}>
            <Timer className="w-3 h-3" />
          </Button>
        </>
      )}
      
      {isExecution && isPendingApproval && (
        <>
          <Button size="sm" variant="outline" onClick={handleApprove}>
            Approve
          </Button>
          <Button size="sm" variant="outline" onClick={handleReject}>
            Reject
          </Button>
        </>
      )}
    </div>
  );
};

// Running Hours actions cell renderer
export const RunningHoursActionsCellRenderer = (params: ICellRendererParams) => {
  const { data, context } = params;
  
  if (!data || !context) return null;

  const handleUpdate = () => {
    if (context.onUpdate) {
      context.onUpdate(data);
    }
  };

  return (
    <div className="flex gap-1 justify-center">
      <Button 
        size="sm" 
        variant="outline"
        onClick={handleUpdate}
        className="bg-[#52baf3] hover:bg-[#4aa3d9] text-white border-[#52baf3]"
      >
        Update RH
      </Button>
    </div>
  );
};

// Spares actions cell renderer
export const SparesActionsCellRenderer = (params: ICellRendererParams) => {
  const { data, context } = params;
  
  if (!data || !context) return null;

  const handleConsume = () => {
    if (context.onConsume) {
      context.onConsume(data);
    }
  };

  const handleReceive = () => {
    if (context.onReceive) {
      context.onReceive(data);
    }
  };

  const handleEdit = () => {
    if (context.onEdit) {
      context.onEdit(data);
    }
  };

  const handleHistory = () => {
    if (context.onHistory) {
      context.onHistory(data);
    }
  };

  return (
    <div className="flex gap-1 justify-center">
      <Button size="sm" variant="outline" onClick={handleConsume}>
        <Minus className="w-3 h-3" />
      </Button>
      <Button size="sm" variant="outline" onClick={handleReceive}>
        <Plus className="w-3 h-3" />
      </Button>
      <Button size="sm" variant="outline" onClick={handleEdit}>
        <Edit className="w-3 h-3" />
      </Button>
      <Button size="sm" variant="outline" onClick={handleHistory}>
        <Eye className="w-3 h-3" />
      </Button>
    </div>
  );
};

// Utilization rate cell renderer
export const UtilizationRateCellRenderer = (params: ICellRendererParams) => {
  const rate = params.value;
  
  if (rate === null || rate === undefined) {
    return <span className="text-gray-400">Loading...</span>;
  }
  
  return <span>{rate.toFixed(1)} hrs/day</span>;
};

// Date cell renderer
export const DateCellRenderer = (params: ICellRendererParams) => {
  if (!params.value) return '';
  
  // Format date consistently
  return new Date(params.value).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

// Numbers cell renderer with formatting
export const NumberCellRenderer = (params: ICellRendererParams) => {
  if (!params.value && params.value !== 0) return '';
  
  const value = typeof params.value === 'string' ? 
    parseFloat(params.value.replace(/[^0-9.-]/g, '')) : 
    params.value;
    
  return value.toLocaleString();
};