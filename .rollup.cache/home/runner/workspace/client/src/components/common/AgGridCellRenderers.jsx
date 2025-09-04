import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pen, Timer, Eye, Edit, Plus, Minus } from 'lucide-react';
// Status badge renderer
export var StatusCellRenderer = function (params) {
    var getStatusColor = function (status) {
        var normalizedStatus = status.toLowerCase();
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
    if (!params.value)
        return '';
    return (<Badge className={getStatusColor(params.value)}>
      {params.value.toUpperCase()}
    </Badge>);
};
// Critical indicator cell renderer
export var CriticalCellRenderer = function (params) {
    var isCritical = params.value === 'Yes' || params.value === 'Critical';
    return (<Badge className={isCritical ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}>
      {isCritical ? 'Critical' : 'No'}
    </Badge>);
};
// Stock status cell renderer for spares
export var StockStatusCellRenderer = function (params) {
    var data = params.data;
    if (!data)
        return '';
    // Calculate stock status based on ROB and minimum values
    var stockStatus = '';
    var rob = data.rob || 0;
    var min = data.min || 0;
    if (rob >= min && min > 0) {
        stockStatus = 'OK';
    }
    else if (rob > 0 && rob < min) {
        stockStatus = 'Low';
    }
    else if (rob === 0) {
        stockStatus = 'Minimum';
    }
    // Use provided stock status if available, otherwise calculated
    var status = data.stock || stockStatus;
    return (<StatusCellRenderer value={status} data={data} node={params.node} colDef={params.colDef} column={params.column} rowIndex={params.rowIndex} api={params.api} columnApi={params.columnApi} context={params.context}/>);
};
// Work Orders actions cell renderer
export var WorkOrderActionsCellRenderer = function (params) {
    var data = params.data, context = params.context;
    if (!data || !context)
        return null;
    var handleEdit = function () {
        if (context.onEdit) {
            context.onEdit(data);
        }
    };
    var handlePostpone = function () {
        if (context.onPostpone) {
            context.onPostpone(data);
        }
    };
    var handleApprove = function () {
        console.log('🎯 Approve button clicked!', data);
        if (context.onApprove) {
            context.onApprove(data);
        }
        else {
            console.log('❌ context.onApprove not available');
        }
    };
    var handleReject = function () {
        console.log('🎯 Reject button clicked!', data);
        if (context.onReject) {
            context.onReject(data);
        }
        else {
            console.log('❌ context.onReject not available');
        }
    };
    // Show different actions based on record type and status
    var isExecution = data.isExecution;
    var isPendingApproval = data.status === 'Pending Approval';
    return (<div className='flex gap-1 justify-center'>
      {!isExecution && (<>
          <Button size='sm' variant='outline' onClick={handleEdit}>
            <Pen className='w-3 h-3'/>
          </Button>
          <Button size='sm' variant='outline' onClick={handlePostpone}>
            <Timer className='w-3 h-3'/>
          </Button>
        </>)}

      {isExecution && isPendingApproval && (<>
          <Button size='sm' variant='outline' onClick={handleApprove}>
            Approve
          </Button>
          <Button size='sm' variant='outline' onClick={handleReject}>
            Reject
          </Button>
        </>)}
    </div>);
};
// Running Hours actions cell renderer
export var RunningHoursActionsCellRenderer = function (params) {
    var data = params.data, context = params.context;
    if (!data || !context)
        return null;
    var handleUpdate = function () {
        if (context.onUpdate) {
            context.onUpdate(data);
        }
    };
    return (<div className='flex gap-1 justify-center'>
      <Button size='sm' variant='outline' onClick={handleUpdate} className='bg-[#52baf3] hover:bg-[#4aa3d9] text-white border-[#52baf3]'>
        Update RH
      </Button>
    </div>);
};
// Spares actions cell renderer
export var SparesActionsCellRenderer = function (params) {
    var data = params.data, context = params.context;
    if (!data || !context)
        return null;
    var handleConsume = function () {
        if (context.onConsume) {
            context.onConsume(data);
        }
    };
    var handleReceive = function () {
        if (context.onReceive) {
            context.onReceive(data);
        }
    };
    var handleEdit = function () {
        if (context.onEdit) {
            context.onEdit(data);
        }
    };
    var handleHistory = function () {
        if (context.onHistory) {
            context.onHistory(data);
        }
    };
    return (<div className='flex gap-1 justify-center'>
      <Button size='sm' variant='outline' onClick={handleConsume}>
        <Minus className='w-3 h-3'/>
      </Button>
      <Button size='sm' variant='outline' onClick={handleReceive}>
        <Plus className='w-3 h-3'/>
      </Button>
      <Button size='sm' variant='outline' onClick={handleEdit}>
        <Edit className='w-3 h-3'/>
      </Button>
      <Button size='sm' variant='outline' onClick={handleHistory}>
        <Eye className='w-3 h-3'/>
      </Button>
    </div>);
};
// Utilization rate cell renderer
export var UtilizationRateCellRenderer = function (params) {
    var rate = params.value;
    if (rate === null) {
        return <span className='text-gray-400'>N/A</span>;
    }
    if (rate === undefined) {
        return <span className='text-gray-400'>Loading...</span>;
    }
    return <span>{rate.toFixed(1)} hrs/day</span>;
};
// Date cell renderer
export var DateCellRenderer = function (params) {
    if (!params.value)
        return '';
    // Handle non-date strings (like 'Never')
    if (typeof params.value === 'string' && isNaN(Date.parse(params.value))) {
        return params.value;
    }
    // Format date consistently
    var date = new Date(params.value);
    if (isNaN(date.getTime())) {
        return params.value;
    }
    return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
};
// Numbers cell renderer with formatting
export var NumberCellRenderer = function (params) {
    if (!params.value && params.value !== 0)
        return '';
    var value = typeof params.value === 'string'
        ? parseFloat(params.value.replace(/[^0-9.-]/g, ''))
        : params.value;
    return value.toLocaleString();
};
// Stores actions cell renderer
export var StoresActionsCellRenderer = function (params) {
    var data = params.data, context = params.context;
    if (!data || !context)
        return null;
    var handleEdit = function () {
        if (context.onEdit) {
            context.onEdit(data);
        }
    };
    var handleConsume = function () {
        if (context.onConsume) {
            context.onConsume(data);
        }
    };
    var handleReceive = function () {
        if (context.onReceive) {
            context.onReceive(data);
        }
    };
    return (<div className='flex gap-1 justify-center'>
      <Button size='sm' variant='outline' onClick={handleEdit}>
        <Edit className='w-3 h-3'/>
      </Button>
      <Button size='sm' variant='outline' onClick={handleConsume}>
        <Minus className='w-3 h-3'/>
      </Button>
      <Button size='sm' variant='outline' onClick={handleReceive}>
        <Plus className='w-3 h-3'/>
      </Button>
    </div>);
};
//# sourceMappingURL=AgGridCellRenderers.jsx.map