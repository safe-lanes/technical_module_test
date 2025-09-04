import { __assign, __spreadArray } from 'tslib';
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ArrowLeft,
  Plus,
  Upload,
  Eye,
  ChevronRight,
  ChevronDown,
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { getComponentCategory } from '@/utils/componentUtils';
import AddFieldModal from '@/components/modals/AddFieldModal';
import AddSectionModal from '@/components/modals/AddSectionModal';
// Use the same component tree data as Components screen
var dummyComponents = [
  {
    id: '1',
    code: '1',
    name: 'Ship General',
    children: [
      {
        id: '1.1',
        code: '1.1',
        name: 'Fresh Water System',
        children: [
          {
            id: '1.1.1',
            code: '1.1.1',
            name: 'Hydrophore Unit',
            children: [
              {
                id: '1.1.1.1',
                code: '1.1.1.1',
                name: 'Pressure Vessel',
              },
              {
                id: '1.1.1.2',
                code: '1.1.1.2',
                name: 'Feed Pump',
              },
              {
                id: '1.1.1.3',
                code: '1.1.1.3',
                name: 'Pressure Switch',
              },
            ],
          },
          {
            id: '1.1.2',
            code: '1.1.2',
            name: 'Potable Water Maker',
            children: [],
          },
          {
            id: '1.1.3',
            code: '1.1.3',
            name: 'UV Sterilizer',
            children: [],
          },
        ],
      },
      {
        id: '1.2',
        code: '1.2',
        name: 'Sewage Treatment System',
        children: [],
      },
      {
        id: '1.3',
        code: '1.3',
        name: 'HVAC – Accommodation',
        children: [],
      },
    ],
  },
  {
    id: '2',
    code: '2',
    name: 'Hull',
    children: [
      {
        id: '2.1',
        code: '2.1',
        name: 'Ballast Tanks',
        children: [],
      },
      {
        id: '2.2',
        code: '2.2',
        name: 'Cathodic Protection',
        children: [],
      },
      {
        id: '2.3',
        code: '2.3',
        name: 'Hull Openings – Hatches',
        children: [],
      },
    ],
  },
  {
    id: '3',
    code: '3',
    name: 'Equipment for Cargo',
    children: [
      {
        id: '3.1',
        code: '3.1',
        name: 'Cargo Cranes',
        children: [],
      },
      {
        id: '3.2',
        code: '3.2',
        name: 'Hatch Cover Hydraulics',
        children: [],
      },
      {
        id: '3.3',
        code: '3.3',
        name: 'Cargo Hold Ventilation',
        children: [],
      },
    ],
  },
  {
    id: '4',
    code: '4',
    name: "Ship's Equipment",
    children: [
      {
        id: '4.1',
        code: '4.1',
        name: 'Mooring System',
        children: [],
      },
      {
        id: '4.2',
        code: '4.2',
        name: 'Windlass',
        children: [],
      },
      {
        id: '4.3',
        code: '4.3',
        name: 'Steering Gear',
        children: [],
      },
    ],
  },
  {
    id: '5',
    code: '5',
    name: 'Equipment for Crew & Passengers',
    children: [
      {
        id: '5.1',
        code: '5.1',
        name: 'Lifeboat System',
        children: [],
      },
      {
        id: '5.2',
        code: '5.2',
        name: 'Fire Main System',
        children: [],
      },
      {
        id: '5.3',
        code: '5.3',
        name: 'Emergency Lighting',
        children: [],
      },
    ],
  },
  {
    id: '6',
    code: '6',
    name: 'Machinery Main Components',
    isExpanded: true,
    children: [
      {
        id: '6.1',
        code: '6.1',
        name: 'Main Engine',
        isExpanded: true,
        children: [
          {
            id: '6.1.1',
            code: '6.1.1',
            name: 'Cylinder Head',
            isExpanded: true,
            children: [
              {
                id: '6.1.1.1',
                code: '6.1.1.1',
                name: 'Valve Seats',
              },
              {
                id: '6.1.1.2',
                code: '6.1.1.2',
                name: 'Injector Sleeve',
              },
              {
                id: '6.1.1.3',
                code: '6.1.1.3',
                name: 'Rocker Arm',
              },
            ],
          },
          {
            id: '6.1.2',
            code: '6.1.2',
            name: 'Main Bearings',
            children: [],
          },
          {
            id: '6.1.3',
            code: '6.1.3',
            name: 'Cylinder Liners',
            children: [],
          },
        ],
      },
      {
        id: '6.2',
        code: '6.2',
        name: 'Diesel Generators',
        children: [
          {
            id: '6.2.1',
            code: '6.2.1',
            name: 'DG #1',
            children: [],
          },
          {
            id: '6.2.2',
            code: '6.2.2',
            name: 'DG #2',
            children: [],
          },
          {
            id: '6.2.3',
            code: '6.2.3',
            name: 'DG #3',
            children: [],
          },
        ],
      },
      {
        id: '6.3',
        code: '6.3',
        name: 'Auxiliary Boiler',
        children: [],
      },
    ],
  },
  {
    id: '7',
    code: '7',
    name: 'Systems for Machinery Main Components',
    children: [
      {
        id: '7.1',
        code: '7.1',
        name: 'Fuel Oil System',
        children: [],
      },
    ],
  },
  {
    id: '8',
    code: '8',
    name: 'Ship Common Systems',
    children: [],
  },
];
// Function to get mock data for a component based on its code
var getComponentMockData = function (code) {
  // Generate realistic mock data based on component code and type
  var getComponentDetails = function (code, name) {
    // Parse component hierarchy from code
    var levels = code.split('.');
    var topLevel = levels[0];
    // Department mapping based on top-level code
    var departmentMap = {
      1: 'Hull & Deck',
      2: 'Deck Machinery',
      3: 'Accommodation',
      4: "Ship's Equipment",
      5: 'Safety Equipment',
      6: 'Engine Department',
      7: 'Engine Systems',
      8: 'Common Systems',
    };
    // Location mapping
    var locationMap = {
      1: 'Main Deck',
      2: 'Fore Deck',
      3: 'Accommodation Block',
      4: 'Main Deck',
      5: 'Bridge/Safety Station',
      6: 'Engine Room',
      7: 'Engine Room',
      8: 'Various',
    };
    // Criticality based on component level and type
    var isCritical =
      topLevel === '6' ||
      topLevel === '7' ||
      (topLevel === '1' && levels.length > 2);
    // Generate appropriate maker based on component type
    var getMaker = function () {
      if (topLevel === '6')
        return ['MAN B&W', 'Wärtsilä', 'Caterpillar', 'Yanmar'][
          Math.floor(Math.random() * 4)
        ];
      if (topLevel === '1')
        return ['Hyundai', 'Samsung', 'Daewoo'][Math.floor(Math.random() * 3)];
      if (topLevel === '2')
        return ['MacGregor', 'TTS Marine', 'Rolls-Royce'][
          Math.floor(Math.random() * 3)
        ];
      if (topLevel === '3')
        return ['Marine Air Systems', 'Novenco', 'Heinen & Hopman'][
          Math.floor(Math.random() * 3)
        ];
      if (topLevel === '4')
        return ['Kongsberg', 'Furuno', 'JRC'][Math.floor(Math.random() * 3)];
      if (topLevel === '5')
        return ['Viking', 'Survitec', 'LALIZAS'][Math.floor(Math.random() * 3)];
      return 'OEM Manufacturer';
    };
    // Generate model based on code
    var model = ''
      .concat(getMaker().split(' ')[0].toUpperCase(), '-')
      .concat(code.replace(/\./g, ''), '-')
      .concat(levels.length > 2 ? 'ADV' : 'STD');
    // Generate serial number
    var serialNo = 'SN-'
      .concat(new Date().getFullYear(), '-')
      .concat(code.replace(/\./g, ''), '-')
      .concat(
        Math.floor(Math.random() * 9999)
          .toString()
          .padStart(4, '0')
      );
    // Rating based on component type
    var getRating = function () {
      if (topLevel === '6' && levels.length === 3) return '7,200 kW';
      if (topLevel === '6' && levels.length === 4) return 'High Performance';
      if (topLevel === '2') return 'SWL 25 MT';
      if (topLevel === '7') return 'Medium Pressure';
      return 'Standard';
    };
    return {
      maker: getMaker(),
      model: model,
      serialNo: serialNo,
      drawingNo: 'DWG-'.concat(code.replace(/\./g, '-')),
      department: departmentMap[topLevel] || 'General',
      critical: isCritical ? 'Yes' : 'No',
      classItem: isCritical ? 'Yes' : 'No',
      location: locationMap[topLevel] || 'Ship',
      commissionedDate: '2020-01-15',
      installationDate: '2019-12-20',
      rating: getRating(),
      conditionBased: levels.length > 2 ? 'Yes' : 'No',
      noOfUnits: levels.length === 4 ? '6' : levels.length === 3 ? '2' : '1',
      eqptSystemDept: departmentMap[topLevel] || 'General',
      parentComponent:
        levels.length > 1
          ? 'Level '.concat(levels.slice(0, -1).join('.'))
          : 'Ship Structure',
      dimensionsSize:
        levels.length === 4
          ? '0.5m x 0.3m'
          : levels.length === 3
            ? '2m x 1m'
            : '5m x 3m',
      notes: 'Component '
        .concat(code, ' - ')
        .concat(
          isCritical ? 'Critical for vessel operations' : 'Standard equipment'
        ),
    };
  };
  // Special cases for specific well-known components
  var specialCases = {
    '6.1.1': {
      maker: 'MAN Energy Solutions',
      model: '6S60MC-C',
      serialNo: 'ME-2020-001',
      drawingNo: 'DWG-6-1-1',
      department: 'Engine Department',
      critical: 'Yes',
      classItem: 'Yes',
      location: 'Engine Room',
      commissionedDate: '2020-02-01',
      installationDate: '2020-01-15',
      rating: '7,200 kW @ 105 RPM',
      conditionBased: 'Yes',
      noOfUnits: '1',
      eqptSystemDept: 'Engine Department',
      parentComponent: '6.1 Main Engine',
      dimensionsSize: '15m x 3m x 4m',
      notes: 'Main propulsion engine - 6 cylinder, 2-stroke diesel',
    },
    '1.1.1.1': {
      maker: 'Grundfos',
      model: 'CR-64-3',
      serialNo: 'PV-2020-001',
      drawingNo: 'DWG-1-1-1-1',
      department: 'Hull & Deck',
      critical: 'Yes',
      classItem: 'No',
      location: 'Fresh Water Room',
      commissionedDate: '2020-01-01',
      installationDate: '2019-11-15',
      rating: '300 L/min @ 6 Bar',
      conditionBased: 'Yes',
      noOfUnits: '2',
      eqptSystemDept: 'Hull & Deck',
      parentComponent: '1.1.1 Hydrophore Unit',
      dimensionsSize: '2m x 1m x 1.5m',
      notes: 'Pressure vessel for fresh water system',
    },
  };
  // Return special case if exists, otherwise generate based on pattern
  return specialCases[code] || getComponentDetails(code);
};
var ComponentRegisterForm = function (_a) {
  var isOpen = _a.isOpen,
    onClose = _a.onClose,
    onSubmit = _a.onSubmit,
    parentComponent = _a.parentComponent;
  var toast = useToast().toast;
  var _b = useState(null),
    selectedNode = _b[0],
    setSelectedNode = _b[1];
  var _c = useState(new Set(['6', '6.1', '6.1.1'])),
    expandedNodes = _c[0],
    setExpandedNodes = _c[1];
  var _d = useState(false),
    isAddMode = _d[0],
    setIsAddMode = _d[1];
  var _e = useState(''),
    searchTerm = _e[0],
    setSearchTerm = _e[1];
  // Permission state - mock for now, should come from user context
  var hasFormConfigPermission = useState(true)[0];
  // Modal states for adding fields and sections
  var _f = useState(false),
    showAddFieldModal = _f[0],
    setShowAddFieldModal = _f[1];
  var _g = useState(false),
    showAddSectionModal = _g[0],
    setShowAddSectionModal = _g[1];
  var _h = useState(''),
    currentSection = _h[0],
    setCurrentSection = _h[1];
  // New fields and sections tracking
  var _j = useState({}),
    customFields = _j[0],
    setCustomFields = _j[1];
  var _k = useState([]),
    customSections = _k[0],
    setCustomSections = _k[1];
  var _l = useState(1),
    formVersion = _l[0],
    setFormVersion = _l[1];
  // Track newly added fields for session
  var _m = useState(new Set()),
    sessionAddedFields = _m[0],
    setSessionAddedFields = _m[1];
  var _o = useState(new Set()),
    sessionModifiedFields = _o[0],
    setSessionModifiedFields = _o[1];
  // Auto-generate component code based on parent
  var generateComponentCode = function (parent) {
    var _a;
    if (!parent) return '';
    // Calculate next available number at this level
    var siblingCount =
      ((_a = parent.children) === null || _a === void 0 ? void 0 : _a.length) ||
      0;
    return ''.concat(parent.code, '.').concat(siblingCount + 1);
  };
  // State for editable field labels and deletable fields
  var _p = useState(null),
    editingLabel = _p[0],
    setEditingLabel = _p[1];
  var _q = useState(new Set()),
    deletedFields = _q[0],
    setDeletedFields = _q[1];
  var _r = useState(null),
    showDeleteConfirm = _r[0],
    setShowDeleteConfirm = _r[1];
  var _s = useState({
      maker: 'Maker',
      model: 'Model',
      serialNo: 'Serial No',
      drawingNo: 'Drawing No',
      location: 'Location',
      critical: 'Critical',
      installation: 'Installation Date',
      commissionedDate: 'Commissioned Date',
      rating: 'Rating',
      conditionBased: 'Condition Based',
      noOfUnits: 'No of Units',
      eqptSystemDept: 'Eqpt / System Department',
      parentComponent: 'Parent Component',
      dimensionsSize: 'Dimensions/Size',
      notes: 'Notes',
      runningHours: 'Running Hours',
      dateUpdated: 'Date Updated',
      nextDue: 'Next Due',
      metric: 'Metric',
      alertsThresholds: 'Alerts/ Thresholds',
      woTitle: 'WO Title',
      assignedTo: 'Assigned To',
      maintenanceType: 'Maintenance Type',
      frequency: 'Frequency',
      initialNextDue: 'Initial Next Due',
      classificationProvider: 'Classification Provider',
      certificateNo: 'Certificate No.',
      lastDataSurvey: 'Last Data Survey',
      nextDataSurvey: 'Next Data Survey',
      surveyType: 'Survey Type',
      classRequirements: 'Class Requirements',
      classCode: 'Class Code',
      information: 'Information',
    }),
    fieldLabels = _s[0],
    setFieldLabels = _s[1];
  var _t = useState({
      componentId: '601.003.XXX',
      componentName: '',
      serialNo: '',
      drawingNo: '',
      componentCode: '',
      equipmentCategory: '',
      location: '',
      installation: '',
      componentType: '',
      rating: '',
      noOfUnits: '',
      equipmentDepartment: '',
      parentComponent: '',
      facility: '',
      runningHoursUnit1: '',
      runningHoursUnit2: '',
      maker: '',
      model: '',
      department: '',
      critical: 'No',
      classItem: 'No',
      conditionBased: 'No',
      dimensionsSize: '',
      notes: '',
      commissionedDate: '',
      installationDate: '',
      eqptSystemDept: '',
      // Section B: Running Hours & Condition Monitoring
      runningHours: '20000',
      dateUpdated: '',
      metric: '',
      alertsThresholds: '',
      // Section C: Work Orders
      woTitle: '',
      assignedTo: '',
      maintenanceType: '',
      frequency: '',
      initialNextDue: '',
      // Section D: Maintenance History
      workOrderNo: 'WO-2025-01',
      performedBy: 'Kane',
      totalTimeHrs: '3',
      completionDate: '08-Jan-2025',
      status: 'Completed',
      // Section E: Spare Parts
      partCode: 'SP-306-001',
      partName: 'Fuel Injection',
      minQty: '5',
      criticalQty: '5',
      locationStore: 'Engine Room R-3',
      // Section H: Requisitions
      reqNo: 'REQ-2025-089',
      reqPart: 'Fuel Injection Pump',
      reqQty: '2',
      reqDate: '15-Jan-2025',
      reqStatus: 'Pending',
      conditionMonitoringMetrics: {
        metric: '',
        interval: '',
        temperature: '',
        pressure: '',
      },
      workOrders: [],
      maintenanceHistory: [],
      spares: [],
      drawings: [],
      classificationData: {
        classificationProvider: '',
        certificateNo: '',
        lastDataSurvey: '',
        nextDataSurvey: '',
        surveyType: '',
        classRequirements: '',
        classCode: '',
        information: '',
      },
    }),
    componentData = _t[0],
    setComponentData = _t[1];
  // Handle node selection
  var handleNodeSelect = function (node) {
    setSelectedNode(node);
    setIsAddMode(false);
    // Load mock data for the selected component
    var mockData = getComponentMockData(node.code);
    setComponentData(function (prev) {
      return __assign(__assign({}, prev), {
        componentName: node.name,
        componentCode: node.code,
        serialNo: mockData.serialNo || '',
        drawingNo: mockData.drawingNo || '',
        maker: mockData.maker || '',
        model: mockData.model || '',
        location: mockData.location || '',
        installation: mockData.installationDate || '',
        rating: mockData.rating || '',
        noOfUnits: mockData.noOfUnits || '',
        equipmentDepartment: mockData.eqptSystemDept || '',
        parentComponent: mockData.parentComponent || '',
        critical: mockData.critical || 'No',
        classItem: mockData.classItem || 'No',
        conditionBased: mockData.conditionBased || 'No',
        dimensionsSize: mockData.dimensionsSize || '',
        notes: mockData.notes || '',
        commissionedDate: mockData.commissionedDate || '',
        department: mockData.department || '',
      });
    });
  };
  // Handle Add Sub Component
  var handleAddSubComponent = function () {
    if (!selectedNode) {
      toast({
        title: 'No Parent Selected',
        description: 'Select a parent in the tree to add a child component.',
        variant: 'destructive',
      });
      return;
    }
    setIsAddMode(true);
    var newCode = generateComponentCode(selectedNode);
    // Reset form for new component
    setComponentData({
      componentId: '601.003.XXX',
      componentName: '',
      serialNo: '',
      drawingNo: '',
      componentCode: newCode,
      equipmentCategory: '',
      location: '',
      critical: 'No',
      conditionBased: 'No',
      department: '',
      installation: '',
      noOfUnits: '',
      equipmentDepartment: '',
      parentComponent: selectedNode.name,
      classificationData: {
        classificationProvider: '',
        certificateNo: '',
        lastDataSurvey: '',
        nextDataSurvey: '',
        surveyType: '',
        classRequirements: '',
        classCode: '',
        information: '',
      },
    });
  };
  // Toggle node expansion
  var toggleNode = function (nodeId) {
    setExpandedNodes(function (prev) {
      var newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  };
  // Render component tree
  var renderComponentTree = function (nodes, level) {
    if (level === void 0) {
      level = 0;
    }
    return nodes.map(function (node) {
      var hasChildren = node.children && node.children.length > 0;
      var isExpanded = expandedNodes.has(node.id);
      var isSelected =
        (selectedNode === null || selectedNode === void 0
          ? void 0
          : selectedNode.id) === node.id;
      return (
        <div key={node.id}>
          <div
            className={'flex items-center px-3 py-2 cursor-pointer hover:bg-white/10 '.concat(
              isSelected ? 'bg-white/20' : ''
            )}
            style={{ paddingLeft: ''.concat(level * 20 + 12, 'px') }}
            onClick={function () {
              return handleNodeSelect(node);
            }}
          >
            <button
              className='mr-2 flex-shrink-0'
              onClick={function (e) {
                e.stopPropagation();
                if (hasChildren) {
                  toggleNode(node.id);
                }
              }}
            >
              {hasChildren ? (
                isExpanded ? (
                  <ChevronDown className='h-4 w-4 text-white' />
                ) : (
                  <ChevronRight className='h-4 w-4 text-white' />
                )
              ) : (
                <ChevronRight className='h-4 w-4 text-white/50' />
              )}
            </button>
            <span className='text-sm text-white'>
              {node.code} {node.name}
            </span>
          </div>
          {hasChildren && isExpanded && (
            <div>{renderComponentTree(node.children, level + 1)}</div>
          )}
        </div>
      );
    });
  };
  var handleInputChange = function (field, value) {
    if (field.includes('.')) {
      var _a = field.split('.'),
        parent_1 = _a[0],
        child_1 = _a[1];
      setComponentData(function (prev) {
        var _a, _b;
        var parentValue = prev[parent_1];
        return __assign(
          __assign({}, prev),
          ((_a = {}),
          (_a[parent_1] = __assign(
            __assign(
              {},
              typeof parentValue === 'object' && parentValue !== null
                ? parentValue
                : {}
            ),
            ((_b = {}), (_b[child_1] = value), _b)
          )),
          _a)
        );
      });
    } else {
      setComponentData(function (prev) {
        var _a;
        return __assign(
          __assign({}, prev),
          ((_a = {}), (_a[field] = value), _a)
        );
      });
    }
  };
  // Handle label editing
  var handleLabelEdit = function (fieldKey) {
    setEditingLabel(fieldKey);
  };
  var handleLabelSave = function (fieldKey, newLabel) {
    setFieldLabels(function (prev) {
      var _a;
      return __assign(
        __assign({}, prev),
        ((_a = {}), (_a[fieldKey] = newLabel), _a)
      );
    });
    setEditingLabel(null);
  };
  var handleLabelCancel = function () {
    setEditingLabel(null);
  };
  // Field deletion handlers
  var handleFieldDelete = function (fieldKey) {
    setShowDeleteConfirm(fieldKey);
  };
  var confirmFieldDelete = function () {
    if (showDeleteConfirm) {
      setDeletedFields(function (prev) {
        return new Set(
          __spreadArray(
            __spreadArray([], Array.from(prev), true),
            [showDeleteConfirm],
            false
          )
        );
      });
      setShowDeleteConfirm(null);
      toast({
        title: 'Field Deleted',
        description: ''.concat(
          fieldLabels[showDeleteConfirm],
          ' field has been removed.'
        ),
      });
    }
  };
  var cancelFieldDelete = function () {
    setShowDeleteConfirm(null);
  };
  // Editable Label Component with deletion support
  var EditableLabel = function (_a) {
    var fieldKey = _a.fieldKey,
      _b = _a.className,
      className = _b === void 0 ? 'text-sm text-[#8798ad]' : _b;
    var _c = useState(fieldLabels[fieldKey] || fieldKey),
      tempLabel = _c[0],
      setTempLabel = _c[1];
    if (editingLabel === fieldKey) {
      return (
        <Input
          value={tempLabel}
          onChange={function (e) {
            return setTempLabel(e.target.value);
          }}
          onBlur={function () {
            return handleLabelSave(fieldKey, tempLabel);
          }}
          onKeyDown={function (e) {
            if (e.key === 'Enter') {
              handleLabelSave(fieldKey, tempLabel);
            } else if (e.key === 'Escape') {
              setTempLabel(fieldLabels[fieldKey] || fieldKey);
              handleLabelCancel();
            } else if (e.key === 'Delete') {
              e.preventDefault();
              handleFieldDelete(fieldKey);
            }
          }}
          className='h-6 text-sm border-[#52baf3] focus:border-[#52baf3]'
          autoFocus
        />
      );
    }
    return (
      <Label
        className={''.concat(
          className,
          ' text-[#52baf3] cursor-pointer hover:underline'
        )}
        onClick={function () {
          return handleLabelEdit(fieldKey);
        }}
        onKeyDown={function (e) {
          if (e.key === 'Delete') {
            e.preventDefault();
            handleFieldDelete(fieldKey);
          }
        }}
        tabIndex={0}
        title='Click to edit field label, press Delete to remove field'
      >
        {fieldLabels[fieldKey] || fieldKey}
      </Label>
    );
  };
  // Deletable Field Wrapper Component
  var DeletableField = function (_a) {
    var fieldKey = _a.fieldKey,
      children = _a.children,
      _b = _a.className,
      className = _b === void 0 ? 'space-y-2' : _b;
    if (deletedFields.has(fieldKey)) {
      return null;
    }
    return <div className={className}>{children}</div>;
  };
  // Render custom field based on type
  var renderCustomField = function (field) {
    var _a, _b, _c, _d, _e, _f;
    var isNewField = sessionAddedFields.has(field.key);
    var isModified = sessionModifiedFields.has(field.key);
    var borderColor = isModified ? '#FF3B30' : '#52baf3';
    switch (field.type) {
      case 'textarea':
        return (
          <div key={field.id} className='space-y-2'>
            <Label
              className={'text-sm '.concat(
                isModified ? 'text-[#FF3B30]' : 'text-[#52baf3]',
                ' cursor-pointer hover:underline'
              )}
            >
              {field.label} {field.required && '*'}
            </Label>
            <Textarea
              placeholder={field.placeholder}
              className={'border-2 focus:border-['.concat(borderColor, ']')}
              style={{ borderColor: borderColor }}
            />
          </div>
        );
      case 'number':
        return (
          <div key={field.id} className='space-y-2'>
            <Label
              className={'text-sm '.concat(
                isModified ? 'text-[#FF3B30]' : 'text-[#52baf3]',
                ' cursor-pointer hover:underline'
              )}
            >
              {field.label} {field.unit && '('.concat(field.unit, ')')}{' '}
              {field.required && '*'}
            </Label>
            <Input
              type='number'
              placeholder={field.placeholder}
              className={'border-2 focus:border-['.concat(borderColor, ']')}
              style={{ borderColor: borderColor }}
              min={
                (_a = field.validation) === null || _a === void 0
                  ? void 0
                  : _a.min
              }
              max={
                (_b = field.validation) === null || _b === void 0
                  ? void 0
                  : _b.max
              }
            />
          </div>
        );
      case 'date':
        return (
          <div key={field.id} className='space-y-2'>
            <Label
              className={'text-sm '.concat(
                isModified ? 'text-[#FF3B30]' : 'text-[#52baf3]',
                ' cursor-pointer hover:underline'
              )}
            >
              {field.label} {field.required && '*'}
            </Label>
            <Input
              type='date'
              placeholder={field.placeholder}
              className={'border-2 focus:border-['.concat(borderColor, ']')}
              style={{ borderColor: borderColor }}
              min={
                (_c = field.validation) === null || _c === void 0
                  ? void 0
                  : _c.minDate
              }
              max={
                (_d = field.validation) === null || _d === void 0
                  ? void 0
                  : _d.maxDate
              }
            />
          </div>
        );
      case 'boolean':
        return (
          <div key={field.id} className='flex items-center space-x-2'>
            <Switch defaultChecked={field.defaultValue === 'true'} />
            <Label
              className={'text-sm '.concat(
                isModified ? 'text-[#FF3B30]' : 'text-[#52baf3]',
                ' cursor-pointer hover:underline'
              )}
            >
              {field.label} {field.required && '*'}
            </Label>
          </div>
        );
      case 'select':
        return (
          <div key={field.id} className='space-y-2'>
            <Label
              className={'text-sm '.concat(
                isModified ? 'text-[#FF3B30]' : 'text-[#52baf3]',
                ' cursor-pointer hover:underline'
              )}
            >
              {field.label} {field.required && '*'}
            </Label>
            <Select defaultValue={field.defaultValue}>
              <SelectTrigger
                className={'border-2 focus:border-['.concat(borderColor, ']')}
                style={{ borderColor: borderColor }}
              >
                <SelectValue placeholder={field.placeholder || 'Select...'} />
              </SelectTrigger>
              <SelectContent>
                {(_e = field.options) === null || _e === void 0
                  ? void 0
                  : _e.map(function (option) {
                      return (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      );
                    })}
              </SelectContent>
            </Select>
          </div>
        );
      default:
        return (
          <div key={field.id} className='space-y-2'>
            <Label
              className={'text-sm '.concat(
                isModified ? 'text-[#FF3B30]' : 'text-[#52baf3]',
                ' cursor-pointer hover:underline'
              )}
            >
              {field.label} {field.required && '*'}
            </Label>
            <Input
              placeholder={field.placeholder}
              defaultValue={field.defaultValue}
              className={'border-2 focus:border-['.concat(borderColor, ']')}
              style={{ borderColor: borderColor }}
              maxLength={
                (_f = field.validation) === null || _f === void 0
                  ? void 0
                  : _f.maxLength
              }
            />
          </div>
        );
    }
  };
  var handleSubmit = function () {
    // Validate Component Name is required
    if (
      !componentData.componentName ||
      componentData.componentName.trim() === ''
    ) {
      toast({
        title: 'Validation Error',
        description: 'Component Name is required.',
        variant: 'destructive',
      });
      return;
    }
    // Validate Component Code matches tree position
    if (isAddMode && selectedNode) {
      var expectedCode = generateComponentCode(selectedNode);
      if (componentData.componentCode !== expectedCode) {
        toast({
          title: 'Validation Error',
          description: 'Component Code must match tree position.',
          variant: 'destructive',
        });
        return;
      }
    }
    if (onSubmit) {
      onSubmit(componentData);
      onClose();
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='w-[95vw] max-w-none h-[95vh] flex flex-col'>
        <DialogHeader className='pb-4 pr-12'>
          <div className='flex items-center justify-between'>
            <DialogTitle>
              Component Register -{' '}
              {isAddMode ? 'Add Component' : 'Edit Component'}
            </DialogTitle>
            <div className='flex items-center gap-2'>
              <Button
                size='sm'
                className='bg-[#52baf3] hover:bg-[#4aa3d9] text-white'
                onClick={handleAddSubComponent}
              >
                <Plus className='h-4 w-4 mr-1' />
                Add Sub Component
              </Button>
              <Button
                size='sm'
                className='bg-[#52baf3] hover:bg-[#4aa3d9] text-white'
                onClick={handleSubmit}
              >
                Save
              </Button>
              <Button variant='outline' size='sm' onClick={onClose}>
                <ArrowLeft className='h-4 w-4 mr-1' />
                Back
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className='flex flex-1 overflow-hidden'>
          {/* Left Sidebar - Components Tree */}
          <div className='w-80 bg-[#52baf3] text-white p-4 overflow-auto'>
            <div className='mb-4'>
              <h3 className='font-semibold text-white mb-2'>COMPONENTS</h3>
              <div className='mb-3'>
                <Input
                  placeholder='Search components...'
                  value={searchTerm}
                  onChange={function (e) {
                    return setSearchTerm(e.target.value);
                  }}
                  className='bg-white/20 border-white/30 text-white placeholder-white/60'
                />
              </div>
              <div className='space-y-0'>
                {renderComponentTree(dummyComponents)}
              </div>
            </div>
          </div>

          {/* Right Content Area */}
          <div className='flex-1 overflow-auto p-6'>
            <div className='bg-white border border-gray-200 rounded-lg'>
              <div className='bg-gray-50 px-6 py-4 border-b border-gray-200'>
                <div className='flex items-center justify-between'>
                  <div className='flex-1'>
                    <Input
                      value={componentData.componentName || ''}
                      onChange={function (e) {
                        return handleInputChange(
                          'componentName',
                          e.target.value
                        );
                      }}
                      placeholder='Component Name (required)'
                      className='text-lg font-semibold mb-1'
                      required
                    />
                    <div className='text-sm text-gray-500'>
                      Component Code:{' '}
                      {componentData.componentCode || 'Auto-generated'}
                    </div>
                  </div>
                  <div className='flex gap-2'>
                    <Select defaultValue='vessel'>
                      <SelectTrigger className='w-32'>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='vessel'>Vessel</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input placeholder='Search Components' className='w-48' />
                    <Select defaultValue='criticality'>
                      <SelectTrigger className='w-32'>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='criticality'>Criticality</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className='p-6 space-y-6'>
                {/* A. Component Information */}
                <div>
                  <div className='flex justify-between items-center mb-4'>
                    <h4 className='text-lg font-semibold text-[#16569e]'>
                      A. Component Information
                    </h4>
                    {hasFormConfigPermission && (
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={function () {
                          setCurrentSection('A');
                          setShowAddFieldModal(true);
                        }}
                        className='text-[#52baf3] hover:text-[#52baf3]'
                      >
                        <Plus className='h-3 w-3 mr-1' /> Add field
                      </Button>
                    )}
                  </div>
                  <div className='grid grid-cols-4 gap-6'>
                    <div className='space-y-2'>
                      <EditableLabel fieldKey='maker' />
                      <Input
                        value={componentData.maker}
                        onChange={function (e) {
                          return handleInputChange('maker', e.target.value);
                        }}
                        className='border-[#52baf3] border-2 focus:border-[#52baf3]'
                      />
                    </div>
                    <div className='space-y-2'>
                      <EditableLabel fieldKey='model' />
                      <Input
                        value={componentData.model}
                        onChange={function (e) {
                          return handleInputChange('model', e.target.value);
                        }}
                        className='border-[#52baf3] border-2 focus:border-[#52baf3]'
                      />
                    </div>
                    <div className='space-y-2'>
                      <EditableLabel fieldKey='serialNo' />
                      <Input
                        value={componentData.serialNo}
                        onChange={function (e) {
                          return handleInputChange('serialNo', e.target.value);
                        }}
                        className='border-[#52baf3] border-2 focus:border-[#52baf3]'
                      />
                    </div>
                    <div className='space-y-2'>
                      <EditableLabel fieldKey='drawingNo' />
                      <Input
                        value={componentData.drawingNo}
                        onChange={function (e) {
                          return handleInputChange('drawingNo', e.target.value);
                        }}
                        className='border-[#52baf3] border-2 focus:border-[#52baf3]'
                      />
                    </div>
                    <div className='space-y-2'>
                      <Label className='text-sm text-[#8798ad]'>
                        Component Code
                      </Label>
                      <Input
                        value={componentData.componentCode}
                        readOnly
                        className='border-gray-300 bg-gray-50'
                        title='Component Code is auto-generated based on tree position'
                      />
                    </div>
                    <div className='space-y-2'>
                      <Label className='text-sm text-[#8798ad]'>
                        Component Category
                      </Label>
                      <Input
                        value={
                          selectedNode
                            ? getComponentCategory(selectedNode.id)
                            : ''
                        }
                        readOnly
                        className='border-gray-300 bg-gray-50'
                        title="Component Category is derived from the component's tree position"
                      />
                    </div>
                    <div className='space-y-2'>
                      <EditableLabel fieldKey='location' />
                      <Input
                        value={componentData.location}
                        onChange={function (e) {
                          return handleInputChange('location', e.target.value);
                        }}
                        className='border-[#52baf3] border-2 focus:border-[#52baf3]'
                      />
                    </div>
                    <div className='space-y-2'>
                      <EditableLabel fieldKey='critical' />
                      <Input
                        value={componentData.critical}
                        onChange={function (e) {
                          return handleInputChange('critical', e.target.value);
                        }}
                        className='border-[#52baf3] border-2 focus:border-[#52baf3]'
                      />
                    </div>
                    <div className='space-y-2'>
                      <EditableLabel fieldKey='installation' />
                      <Input
                        value={componentData.installation}
                        onChange={function (e) {
                          return handleInputChange(
                            'installation',
                            e.target.value
                          );
                        }}
                        className='border-[#52baf3] border-2 focus:border-[#52baf3]'
                      />
                    </div>
                    <div className='space-y-2'>
                      <EditableLabel fieldKey='commissionedDate' />
                      <Input
                        value={componentData.commissionedDate}
                        onChange={function (e) {
                          return handleInputChange(
                            'commissionedDate',
                            e.target.value
                          );
                        }}
                        className='border-[#52baf3] border-2 focus:border-[#52baf3]'
                      />
                    </div>
                    <div className='space-y-2'>
                      <EditableLabel fieldKey='rating' />
                      <Input
                        value={componentData.rating}
                        onChange={function (e) {
                          return handleInputChange('rating', e.target.value);
                        }}
                        className='border-[#52baf3] border-2 focus:border-[#52baf3]'
                      />
                    </div>
                    <div className='space-y-2'>
                      <EditableLabel fieldKey='conditionBased' />
                      <Input
                        value={componentData.conditionBased}
                        onChange={function (e) {
                          return handleInputChange(
                            'conditionBased',
                            e.target.value
                          );
                        }}
                        className='border-[#52baf3] border-2 focus:border-[#52baf3]'
                      />
                    </div>
                    <DeletableField fieldKey='noOfUnits'>
                      <EditableLabel fieldKey='noOfUnits' />
                      <Input
                        value={componentData.noOfUnits}
                        onChange={function (e) {
                          return handleInputChange('noOfUnits', e.target.value);
                        }}
                        className='border-[#52baf3] border-2 focus:border-[#52baf3]'
                      />
                    </DeletableField>
                    <DeletableField fieldKey='eqptSystemDept'>
                      <EditableLabel fieldKey='eqptSystemDept' />
                      <Input
                        value={componentData.equipmentDepartment}
                        onChange={function (e) {
                          return handleInputChange(
                            'equipmentDepartment',
                            e.target.value
                          );
                        }}
                        className='border-[#52baf3] border-2 focus:border-[#52baf3]'
                      />
                    </DeletableField>
                    <DeletableField fieldKey='parentComponent'>
                      <EditableLabel fieldKey='parentComponent' />
                      <Input
                        value={componentData.parentComponent}
                        onChange={function (e) {
                          return handleInputChange(
                            'parentComponent',
                            e.target.value
                          );
                        }}
                        className='border-[#52baf3] border-2 focus:border-[#52baf3]'
                      />
                    </DeletableField>
                    <DeletableField fieldKey='dimensionsSize'>
                      <EditableLabel fieldKey='dimensionsSize' />
                      <Input
                        value={componentData.dimensionsSize}
                        onChange={function (e) {
                          return handleInputChange(
                            'dimensionsSize',
                            e.target.value
                          );
                        }}
                        className='border-[#52baf3] border-2 focus:border-[#52baf3]'
                      />
                    </DeletableField>
                  </div>
                  <div className='mt-4'>
                    <DeletableField fieldKey='notes'>
                      <EditableLabel fieldKey='notes' />
                      <Textarea
                        value={componentData.notes}
                        onChange={function (e) {
                          return handleInputChange('notes', e.target.value);
                        }}
                        placeholder='Notes'
                        className='border-[#52baf3] border-2 focus:border-[#52baf3]'
                        rows={2}
                      />
                    </DeletableField>
                  </div>

                  {/* Custom Fields for Section A */}
                  {customFields['A'] && customFields['A'].length > 0 && (
                    <div className='grid grid-cols-4 gap-6 mt-6 pt-6 border-t border-gray-200'>
                      {customFields['A'].map(function (field) {
                        return renderCustomField(field);
                      })}
                    </div>
                  )}
                </div>

                {/* B. Running Hours & Condition Monitoring Metrics */}
                <div>
                  <div className='flex justify-between items-center mb-4'>
                    <h4 className='text-lg font-semibold text-[#16569e]'>
                      B. Running Hours & Condition Monitoring Metrics
                    </h4>
                    {hasFormConfigPermission && (
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={function () {
                          setCurrentSection('B');
                          setShowAddFieldModal(true);
                        }}
                        className='text-[#52baf3] hover:text-[#52baf3]'
                      >
                        <Plus className='h-3 w-3 mr-1' /> Add field
                      </Button>
                    )}
                  </div>
                  <div className='grid grid-cols-2 gap-6 mb-4'>
                    <DeletableField fieldKey='runningHours'>
                      <EditableLabel fieldKey='runningHours' />
                      <Input
                        value={componentData.runningHours}
                        onChange={function (e) {
                          return handleInputChange(
                            'runningHours',
                            e.target.value
                          );
                        }}
                        placeholder='20000'
                        className='border-[#52baf3] border-2 focus:border-[#52baf3]'
                      />
                    </DeletableField>
                    <DeletableField fieldKey='dateUpdated'>
                      <EditableLabel fieldKey='dateUpdated' />
                      <Input
                        value={componentData.dateUpdated}
                        onChange={function (e) {
                          return handleInputChange(
                            'dateUpdated',
                            e.target.value
                          );
                        }}
                        placeholder='dd-mm-yyyy'
                        className='border-[#52baf3] border-2 focus:border-[#52baf3]'
                      />
                    </DeletableField>
                  </div>
                  <div className='space-y-4'>
                    <div className='flex items-center justify-between'>
                      <h5 className='font-medium text-gray-900'>
                        Condition Monitoring Metrics
                      </h5>
                      <Button
                        size='sm'
                        className='bg-[#52baf3] hover:bg-[#4aa3d9] text-white'
                      >
                        <Plus className='h-4 w-4 mr-1' />
                        Add Metric
                      </Button>
                    </div>
                    <div className='grid grid-cols-2 gap-6'>
                      <DeletableField fieldKey='metric'>
                        <EditableLabel fieldKey='metric' />
                        <Input
                          value={componentData.metric}
                          onChange={function (e) {
                            return handleInputChange('metric', e.target.value);
                          }}
                          className='border-[#52baf3] border-2 focus:border-[#52baf3]'
                        />
                      </DeletableField>
                      <DeletableField fieldKey='alertsThresholds'>
                        <EditableLabel fieldKey='alertsThresholds' />
                        <Input
                          value={componentData.alertsThresholds}
                          onChange={function (e) {
                            return handleInputChange(
                              'alertsThresholds',
                              e.target.value
                            );
                          }}
                          className='border-[#52baf3] border-2 focus:border-[#52baf3]'
                        />
                      </DeletableField>
                    </div>
                  </div>

                  {/* Custom Fields for Section B */}
                  {customFields['B'] && customFields['B'].length > 0 && (
                    <div className='grid grid-cols-2 gap-6 mt-6 pt-6 border-t border-gray-200'>
                      {customFields['B'].map(function (field) {
                        return renderCustomField(field);
                      })}
                    </div>
                  )}
                </div>

                {/* C. Work Orders */}
                <div>
                  <div className='flex items-center justify-between mb-4'>
                    <h4 className='text-lg font-semibold text-[#16569e]'>
                      C. Work Orders
                    </h4>
                    <div className='flex gap-2'>
                      {hasFormConfigPermission && (
                        <Button
                          variant='outline'
                          size='sm'
                          onClick={function () {
                            setCurrentSection('C');
                            setShowAddFieldModal(true);
                          }}
                          className='text-[#52baf3] hover:text-[#52baf3]'
                        >
                          <Plus className='h-3 w-3 mr-1' /> Add field
                        </Button>
                      )}
                      <Button
                        size='sm'
                        className='bg-[#52baf3] hover:bg-[#4aa3d9] text-white'
                      >
                        <Plus className='h-4 w-4 mr-1' />
                        Add W.O
                      </Button>
                    </div>
                  </div>
                  <div className='border border-gray-200 rounded'>
                    <div className='bg-gray-50 px-4 py-3 border-b border-gray-200'>
                      <div className='grid grid-cols-6 gap-4 text-sm font-medium text-gray-700'>
                        <div className='flex items-center gap-2'>
                          <EditableLabel
                            fieldKey='woTitle'
                            className='text-sm font-medium text-gray-700'
                          />
                        </div>
                        <div className='flex items-center gap-2'>
                          <EditableLabel
                            fieldKey='assignedTo'
                            className='text-sm font-medium text-gray-700'
                          />
                        </div>
                        <div className='flex items-center gap-2'>
                          <EditableLabel
                            fieldKey='maintenanceType'
                            className='text-sm font-medium text-gray-700'
                          />
                        </div>
                        <div className='flex items-center gap-2'>
                          <EditableLabel
                            fieldKey='frequency'
                            className='text-sm font-medium text-gray-700'
                          />
                        </div>
                        <div className='flex items-center gap-2'>
                          <EditableLabel
                            fieldKey='initialNextDue'
                            className='text-sm font-medium text-gray-700'
                          />
                        </div>
                        <div></div>
                      </div>
                    </div>
                    <div className='divide-y divide-gray-200'>
                      {isAddMode ? (
                        <div className='px-4 py-8 text-center text-sm text-gray-500'>
                          No work orders yet. Click "Add W.O" to create one.
                        </div>
                      ) : (
                        <>
                          <div className='px-4 py-3'>
                            <div className='grid grid-cols-6 gap-4 text-sm items-center'>
                              <div className='text-gray-900'>
                                Main Engine Overhaul - Replace Main Bearings
                              </div>
                              <div className='text-gray-900'>
                                Chief Engineer
                              </div>
                              <div className='text-gray-900'>Running Hours</div>
                              <div className='text-gray-900'>500</div>
                              <div className='text-gray-900'>02-Jun-2025</div>
                              <div className='flex gap-2'>
                                <button className='text-gray-400 hover:text-gray-600'>
                                  <Eye className='w-4 h-4' />
                                </button>
                              </div>
                            </div>
                          </div>
                          <div className='px-4 py-3'>
                            <div className='grid grid-cols-6 gap-4 text-sm items-center'>
                              <div className='text-gray-900'>
                                Main Engine Overhaul - Replace Main Bearings
                              </div>
                              <div className='text-gray-900'>
                                Chief Engineer
                              </div>
                              <div className='text-gray-900'>Calendar</div>
                              <div className='text-gray-900'>30</div>
                              <div className='text-gray-900'>02-Jun-2025</div>
                              <div className='flex gap-2'>
                                <button className='text-gray-400 hover:text-gray-600'>
                                  <Eye className='w-4 h-4' />
                                </button>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* D. Maintenance History */}
                <div>
                  <div className='flex items-center justify-between mb-4'>
                    <h4 className='text-lg font-semibold text-[#16569e]'>
                      D. Maintenance History
                    </h4>
                    <div className='flex gap-2'>
                      {hasFormConfigPermission && (
                        <Button
                          variant='outline'
                          size='sm'
                          onClick={function () {
                            setCurrentSection('D');
                            setShowAddFieldModal(true);
                          }}
                          className='text-[#52baf3] hover:text-[#52baf3]'
                        >
                          <Plus className='h-3 w-3 mr-1' /> Add field
                        </Button>
                      )}
                      <Button
                        size='sm'
                        className='bg-[#52baf3] hover:bg-[#4aa3d9] text-white'
                      >
                        <Plus className='h-4 w-4 mr-1' />
                        Add M History
                      </Button>
                    </div>
                  </div>
                  <div className='border border-gray-200 rounded'>
                    <div className='bg-gray-50 px-4 py-3 border-b border-gray-200'>
                      <div className='grid grid-cols-5 gap-4 text-sm font-medium text-gray-700'>
                        <div className='flex items-center gap-2'>
                          <EditableLabel
                            fieldKey='woTitle'
                            className='text-sm font-medium text-gray-700'
                          />
                        </div>
                        <div className='flex items-center gap-2'>
                          <EditableLabel
                            fieldKey='assignedTo'
                            className='text-sm font-medium text-gray-700'
                          />
                        </div>
                        <div className='flex items-center gap-2'>
                          <EditableLabel
                            fieldKey='frequency'
                            className='text-sm font-medium text-gray-700'
                          />
                        </div>
                        <div className='flex items-center gap-2'>
                          <EditableLabel
                            fieldKey='dateUpdated'
                            className='text-sm font-medium text-gray-700'
                          />
                        </div>
                        <div className='flex items-center gap-2'>
                          <EditableLabel
                            fieldKey='maintenanceType'
                            className='text-sm font-medium text-gray-700'
                          />
                        </div>
                      </div>
                    </div>
                    {isAddMode ? (
                      <div className='px-4 py-8 text-center text-sm text-gray-500'>
                        No maintenance history yet. Click "Add M History" to
                        create one.
                      </div>
                    ) : (
                      <div className='px-4 py-3'>
                        <div className='grid grid-cols-5 gap-4 text-sm items-center'>
                          <div>
                            <Input
                              value={componentData.workOrderNo}
                              onChange={function (e) {
                                return handleInputChange(
                                  'workOrderNo',
                                  e.target.value
                                );
                              }}
                              className='border-[#52baf3] border-2 focus:border-[#52baf3] text-sm'
                            />
                          </div>
                          <div>
                            <Input
                              value={componentData.performedBy}
                              onChange={function (e) {
                                return handleInputChange(
                                  'performedBy',
                                  e.target.value
                                );
                              }}
                              className='border-[#52baf3] border-2 focus:border-[#52baf3] text-sm'
                            />
                          </div>
                          <div>
                            <Input
                              value={componentData.totalTimeHrs}
                              onChange={function (e) {
                                return handleInputChange(
                                  'totalTimeHrs',
                                  e.target.value
                                );
                              }}
                              className='border-[#52baf3] border-2 focus:border-[#52baf3] text-sm'
                            />
                          </div>
                          <div>
                            <Input
                              value={componentData.completionDate}
                              onChange={function (e) {
                                return handleInputChange(
                                  'completionDate',
                                  e.target.value
                                );
                              }}
                              className='border-[#52baf3] border-2 focus:border-[#52baf3] text-sm'
                            />
                          </div>
                          <div>
                            <Input
                              value={componentData.status}
                              onChange={function (e) {
                                return handleInputChange(
                                  'status',
                                  e.target.value
                                );
                              }}
                              className='border-[#52baf3] border-2 focus:border-[#52baf3] text-sm'
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* E. Spares */}
                <div>
                  <div className='flex items-center justify-between mb-4'>
                    <h4 className='text-lg font-semibold text-[#16569e]'>
                      E. Spares
                    </h4>
                    <Button
                      size='sm'
                      className='bg-[#52baf3] hover:bg-[#4aa3d9] text-white'
                    >
                      <Plus className='h-4 w-4 mr-1' />
                      Add Spares
                    </Button>
                  </div>
                  <div className='border border-gray-200 rounded'>
                    <div className='bg-gray-50 px-4 py-3 border-b border-gray-200'>
                      <div className='grid grid-cols-5 gap-4 text-sm font-medium text-gray-700'>
                        <div className='flex items-center gap-2'>
                          <EditableLabel
                            fieldKey='woTitle'
                            className='text-sm font-medium text-gray-700'
                          />
                        </div>
                        <div className='flex items-center gap-2'>
                          <EditableLabel
                            fieldKey='assignedTo'
                            className='text-sm font-medium text-gray-700'
                          />
                        </div>
                        <div className='flex items-center gap-2'>
                          <EditableLabel
                            fieldKey='metric'
                            className='text-sm font-medium text-gray-700'
                          />
                        </div>
                        <div className='flex items-center gap-2'>
                          <EditableLabel
                            fieldKey='alertsThresholds'
                            className='text-sm font-medium text-gray-700'
                          />
                        </div>
                        <div className='flex items-center gap-2'>
                          <EditableLabel
                            fieldKey='frequency'
                            className='text-sm font-medium text-gray-700'
                          />
                        </div>
                      </div>
                    </div>
                    <div className='px-4 py-3'>
                      <div className='grid grid-cols-5 gap-4 text-sm items-center'>
                        <div>
                          <Input
                            value={componentData.partCode}
                            onChange={function (e) {
                              return handleInputChange(
                                'partCode',
                                e.target.value
                              );
                            }}
                            className='border-[#52baf3] border-2 focus:border-[#52baf3] text-sm'
                          />
                        </div>
                        <div>
                          <Input
                            value={componentData.partName}
                            onChange={function (e) {
                              return handleInputChange(
                                'partName',
                                e.target.value
                              );
                            }}
                            className='border-[#52baf3] border-2 focus:border-[#52baf3] text-sm'
                          />
                        </div>
                        <div>
                          <Input
                            value={componentData.minQty}
                            onChange={function (e) {
                              return handleInputChange(
                                'minQty',
                                e.target.value
                              );
                            }}
                            className='border-[#52baf3] border-2 focus:border-[#52baf3] text-sm'
                          />
                        </div>
                        <div>
                          <Input
                            value={componentData.criticalQty}
                            onChange={function (e) {
                              return handleInputChange(
                                'criticalQty',
                                e.target.value
                              );
                            }}
                            className='border-[#52baf3] border-2 focus:border-[#52baf3] text-sm'
                          />
                        </div>
                        <div>
                          <Input
                            value={componentData.locationStore}
                            onChange={function (e) {
                              return handleInputChange(
                                'locationStore',
                                e.target.value
                              );
                            }}
                            className='border-[#52baf3] border-2 focus:border-[#52baf3] text-sm'
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* F. Drawings & Manuals */}
                <div>
                  <div className='flex items-center justify-between mb-4'>
                    <h4 className='text-lg font-semibold text-[#16569e]'>
                      F. Drawings & Manuals
                    </h4>
                    <Button
                      size='sm'
                      className='bg-[#52baf3] hover:bg-[#4aa3d9] text-white'
                    >
                      <Plus className='h-4 w-4 mr-1' />
                      Add Document
                    </Button>
                  </div>
                  <div className='space-y-2'>
                    <div className='flex items-center justify-between p-2 border border-[#52baf3] rounded'>
                      <div className='flex items-center gap-2'>
                        <EditableLabel fieldKey='woTitle' className='text-sm' />
                      </div>
                      <Upload className='h-4 w-4 text-[#52baf3]' />
                    </div>
                    <div className='flex items-center justify-between p-2 border border-[#52baf3] rounded'>
                      <div className='flex items-center gap-2'>
                        <EditableLabel
                          fieldKey='assignedTo'
                          className='text-sm'
                        />
                      </div>
                      <Upload className='h-4 w-4 text-[#52baf3]' />
                    </div>
                    <div className='flex items-center justify-between p-2 border border-[#52baf3] rounded'>
                      <div className='flex items-center gap-2'>
                        <EditableLabel fieldKey='metric' className='text-sm' />
                      </div>
                      <Upload className='h-4 w-4 text-[#52baf3]' />
                    </div>
                    <div className='flex items-center justify-between p-2 border border-[#52baf3] rounded'>
                      <div className='flex items-center gap-2'>
                        <EditableLabel
                          fieldKey='alertsThresholds'
                          className='text-sm'
                        />
                      </div>
                      <Upload className='h-4 w-4 text-[#52baf3]' />
                    </div>
                  </div>
                </div>

                {/* G. Classification & Regulatory Data */}
                <div>
                  <h4 className='text-lg font-semibold mb-4 text-[#16569e]'>
                    G. Classification & Regulatory Data
                  </h4>
                  <div className='grid grid-cols-2 gap-6'>
                    <DeletableField fieldKey='classificationProvider'>
                      <EditableLabel fieldKey='classificationProvider' />
                      <Input
                        value={
                          componentData.classificationData
                            .classificationProvider
                        }
                        onChange={function (e) {
                          return handleInputChange(
                            'classificationData.classificationProvider',
                            e.target.value
                          );
                        }}
                        className='border-[#52baf3] border-2 focus:border-[#52baf3]'
                      />
                    </DeletableField>
                    <DeletableField fieldKey='certificateNo'>
                      <EditableLabel fieldKey='certificateNo' />
                      <Input
                        value={componentData.classificationData.certificateNo}
                        onChange={function (e) {
                          return handleInputChange(
                            'classificationData.certificateNo',
                            e.target.value
                          );
                        }}
                        className='border-[#52baf3] border-2 focus:border-[#52baf3]'
                      />
                    </DeletableField>
                    <DeletableField fieldKey='lastDataSurvey'>
                      <EditableLabel fieldKey='lastDataSurvey' />
                      <Input
                        value={componentData.classificationData.lastDataSurvey}
                        onChange={function (e) {
                          return handleInputChange(
                            'classificationData.lastDataSurvey',
                            e.target.value
                          );
                        }}
                        className='border-[#52baf3] border-2 focus:border-[#52baf3]'
                      />
                    </DeletableField>
                    <DeletableField fieldKey='nextDataSurvey'>
                      <EditableLabel fieldKey='nextDataSurvey' />
                      <Input
                        value={componentData.classificationData.nextDataSurvey}
                        onChange={function (e) {
                          return handleInputChange(
                            'classificationData.nextDataSurvey',
                            e.target.value
                          );
                        }}
                        className='border-[#52baf3] border-2 focus:border-[#52baf3]'
                      />
                    </DeletableField>
                    <DeletableField fieldKey='surveyType'>
                      <EditableLabel fieldKey='surveyType' />
                      <Input
                        value={componentData.classificationData.surveyType}
                        onChange={function (e) {
                          return handleInputChange(
                            'classificationData.surveyType',
                            e.target.value
                          );
                        }}
                        className='border-[#52baf3] border-2 focus:border-[#52baf3]'
                      />
                    </DeletableField>
                    <DeletableField fieldKey='classRequirements'>
                      <EditableLabel fieldKey='classRequirements' />
                      <Input
                        value={
                          componentData.classificationData.classRequirements
                        }
                        onChange={function (e) {
                          return handleInputChange(
                            'classificationData.classRequirements',
                            e.target.value
                          );
                        }}
                        className='border-[#52baf3] border-2 focus:border-[#52baf3]'
                      />
                    </DeletableField>
                    <DeletableField fieldKey='classCode'>
                      <EditableLabel fieldKey='classCode' />
                      <Input
                        value={componentData.classificationData.classCode}
                        onChange={function (e) {
                          return handleInputChange(
                            'classificationData.classCode',
                            e.target.value
                          );
                        }}
                        className='border-[#52baf3] border-2 focus:border-[#52baf3]'
                      />
                    </DeletableField>
                    <DeletableField fieldKey='information'>
                      <EditableLabel fieldKey='information' />
                      <Input
                        value={componentData.classificationData.information}
                        onChange={function (e) {
                          return handleInputChange(
                            'classificationData.information',
                            e.target.value
                          );
                        }}
                        className='border-[#52baf3] border-2 focus:border-[#52baf3]'
                      />
                    </DeletableField>
                  </div>
                </div>

                {/* H. Requisitions */}
                <div>
                  <div className='flex items-center justify-between mb-4'>
                    <h4 className='text-lg font-semibold text-[#16569e]'>
                      H. Requisitions
                    </h4>
                    <div className='flex gap-2'>
                      {hasFormConfigPermission && (
                        <Button
                          variant='outline'
                          size='sm'
                          onClick={function () {
                            setCurrentSection('H');
                            setShowAddFieldModal(true);
                          }}
                          className='text-[#52baf3] hover:text-[#52baf3]'
                        >
                          <Plus className='h-3 w-3 mr-1' /> Add field
                        </Button>
                      )}
                      <Button
                        size='sm'
                        className='bg-[#52baf3] hover:bg-[#4aa3d9] text-white'
                      >
                        <Plus className='h-4 w-4 mr-1' />
                        Add Requisition
                      </Button>
                    </div>
                  </div>
                  <div className='border border-gray-200 rounded'>
                    <div className='bg-gray-50 px-4 py-3 border-b border-gray-200'>
                      <div className='grid grid-cols-5 gap-4 text-sm font-medium text-gray-700'>
                        <div className='flex items-center gap-2'>
                          <EditableLabel
                            fieldKey='woTitle'
                            className='text-sm font-medium text-gray-700'
                          />
                        </div>
                        <div className='flex items-center gap-2'>
                          <EditableLabel
                            fieldKey='assignedTo'
                            className='text-sm font-medium text-gray-700'
                          />
                        </div>
                        <div className='flex items-center gap-2'>
                          <EditableLabel
                            fieldKey='metric'
                            className='text-sm font-medium text-gray-700'
                          />
                        </div>
                        <div className='flex items-center gap-2'>
                          <EditableLabel
                            fieldKey='dateUpdated'
                            className='text-sm font-medium text-gray-700'
                          />
                        </div>
                        <div className='flex items-center gap-2'>
                          <EditableLabel
                            fieldKey='frequency'
                            className='text-sm font-medium text-gray-700'
                          />
                        </div>
                      </div>
                    </div>
                    <div className='px-4 py-3'>
                      <div className='grid grid-cols-5 gap-4 text-sm items-center'>
                        <div>
                          <Input
                            value={componentData.reqNo}
                            onChange={function (e) {
                              return handleInputChange('reqNo', e.target.value);
                            }}
                            className='border-[#52baf3] border-2 focus:border-[#52baf3] text-sm'
                          />
                        </div>
                        <div>
                          <Input
                            value={componentData.reqPart}
                            onChange={function (e) {
                              return handleInputChange(
                                'reqPart',
                                e.target.value
                              );
                            }}
                            className='border-[#52baf3] border-2 focus:border-[#52baf3] text-sm'
                          />
                        </div>
                        <div>
                          <Input
                            value={componentData.reqQty}
                            onChange={function (e) {
                              return handleInputChange(
                                'reqQty',
                                e.target.value
                              );
                            }}
                            className='border-[#52baf3] border-2 focus:border-[#52baf3] text-sm'
                          />
                        </div>
                        <div>
                          <Input
                            value={componentData.reqDate}
                            onChange={function (e) {
                              return handleInputChange(
                                'reqDate',
                                e.target.value
                              );
                            }}
                            className='border-[#52baf3] border-2 focus:border-[#52baf3] text-sm'
                          />
                        </div>
                        <div>
                          <Input
                            value={componentData.reqStatus}
                            onChange={function (e) {
                              return handleInputChange(
                                'reqStatus',
                                e.target.value
                              );
                            }}
                            className='border-[#52baf3] border-2 focus:border-[#52baf3] text-sm'
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Render Custom Sections */}
                {customSections.map(function (section) {
                  var _a, _b;
                  return (
                    <div key={section.id}>
                      <div className='flex justify-between items-center mb-4'>
                        <h4 className='text-lg font-semibold text-[#52baf3]'>
                          {section.title}
                        </h4>
                        {hasFormConfigPermission && (
                          <Button
                            variant='outline'
                            size='sm'
                            onClick={function () {
                              setCurrentSection(section.id);
                              setShowAddFieldModal(true);
                            }}
                            className='text-[#52baf3] hover:text-[#52baf3]'
                          >
                            <Plus className='h-3 w-3 mr-1' /> Add field
                          </Button>
                        )}
                      </div>
                      <div className='grid grid-cols-3 gap-4'>
                        {(_a = section.fields) === null || _a === void 0
                          ? void 0
                          : _a.map(function (field) {
                              return renderCustomField(field);
                            })}
                        {(_b = customFields[section.id]) === null ||
                        _b === void 0
                          ? void 0
                          : _b.map(function (field) {
                              return renderCustomField(field);
                            })}
                      </div>
                    </div>
                  );
                })}

                {/* Add New Section Button - Only for admins */}
                {hasFormConfigPermission && (
                  <div className='mt-6 pt-6 border-t'>
                    <Button
                      variant='outline'
                      className='w-full sm:w-auto sm:float-right text-[#52baf3] hover:text-[#52baf3] border-[#52baf3]'
                      onClick={function () {
                        return setShowAddSectionModal(true);
                      }}
                    >
                      <Plus className='h-4 w-4 mr-2' />
                      Add new section
                    </Button>
                  </div>
                )}

                {/* Submit Button */}
                <div className='flex justify-end pt-6'>
                  <Button
                    size='lg'
                    className='bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-base font-medium'
                    onClick={handleSubmit}
                  >
                    Submit
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>

      {/* Field Deletion Confirmation Dialog */}
      <AlertDialog open={!!showDeleteConfirm} onOpenChange={cancelFieldDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Field</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the "
              {showDeleteConfirm ? fieldLabels[showDeleteConfirm] : ''}" field?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelFieldDelete}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmFieldDelete}
              className='bg-red-600 hover:bg-red-700'
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Add Field Modal */}
      <AddFieldModal
        isOpen={showAddFieldModal}
        onClose={function () {
          setShowAddFieldModal(false);
          setCurrentSection('');
        }}
        onSave={function (fieldData) {
          // Add field to the appropriate section
          setCustomFields(function (prev) {
            var _a;
            return __assign(
              __assign({}, prev),
              ((_a = {}),
              (_a[currentSection] = __spreadArray(
                __spreadArray([], prev[currentSection] || [], true),
                [fieldData],
                false
              )),
              _a)
            );
          });
          // Mark field as newly added
          setSessionAddedFields(function (prev) {
            return new Set(
              __spreadArray(
                __spreadArray([], Array.from(prev), true),
                [fieldData.key],
                false
              )
            );
          });
          // Increment form version
          setFormVersion(function (prev) {
            return prev + 1;
          });
          toast({
            title: 'Field Added',
            description: 'Field "'
              .concat(fieldData.label, '" has been added to Section ')
              .concat(currentSection, '.'),
          });
          setShowAddFieldModal(false);
          setCurrentSection('');
        }}
        section={currentSection}
        existingKeys={Object.keys(fieldLabels)}
        isAdmin={hasFormConfigPermission}
      />

      {/* Add Section Modal */}
      <AddSectionModal
        isOpen={showAddSectionModal}
        onClose={function () {
          return setShowAddSectionModal(false);
        }}
        onSave={function (sectionData) {
          // Add new section
          setCustomSections(function (prev) {
            return __spreadArray(
              __spreadArray([], prev, true),
              [sectionData],
              false
            );
          });
          // Increment form version
          setFormVersion(function (prev) {
            return prev + 1;
          });
          toast({
            title: 'Section Added',
            description: 'Section "'.concat(
              sectionData.title,
              '" has been added to the form.'
            ),
          });
          setShowAddSectionModal(false);
        }}
        nextSectionLetter={String.fromCharCode(72 + customSections.length + 1)} // Start from I (H=72, I=73)
      />
    </Dialog>
  );
};
export default ComponentRegisterForm;
//# sourceMappingURL=ComponentRegisterForm.jsx.map
