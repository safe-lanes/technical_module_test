import React, { useState, useMemo, useEffect } from 'react';
import { ColDef, GridReadyEvent, GridApi } from 'ag-grid-enterprise';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Search,
  Edit,
  Clock,
  Trash2,
  FileSpreadsheet,
  X,
  MessageSquare,
  Calendar,
  Plus,
  Archive,
  Download,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import * as XLSX from 'xlsx';
import AgGridTable from '@/components/common/AgGridTable';
import { 
  StockStatusCellRenderer, 
  StoresActionsCellRenderer 
} from '@/components/common/AgGridCellRenderers';

interface StoreItem {
  id: number;
  itemCode: string;
  itemName: string;
  storesCategory: string;
  uom?: string;
  rob: number;
  min: number;
  stock: string;
  location: string;
  category: 'stores' | 'lubes' | 'chemicals' | 'others';
  notes?: string;
  isArchived?: boolean;
}

interface StoresHistoryItem {
  id: number;
  dateLocal: string;
  eventType: string;
  itemName: string;
  partCode: string;
  uom?: string;
  qtyChange: number;
  robAfter: number;
  place?: string;
  userId: string;
  remarks?: string;
  ref?: string;
}

// UOM options
const UOM_OPTIONS = [
  'pcs',
  'set',
  'box',
  'pkt',
  'kg',
  'g',
  'ltr',
  'ml',
  'm',
  'cm',
  'roll',
  'drum',
  'can',
  'bottle',
  'jar',
  'tube',
  'pair',
  'kit',
  'Other',
];

const hardcodedStoreItems: StoreItem[] = [
  {
    id: 1,
    itemCode: 'ST-TOOL-001',
    itemName: 'Torque Wrench',
    storesCategory: 'Engine Stores',
    uom: 'pcs',
    rob: 2,
    min: 1,
    stock: 'OK',
    location: 'Store Room A',
    category: 'stores',
  },
  {
    id: 2,
    itemCode: 'ST-CONS-001',
    itemName: 'Cotton rags',
    storesCategory: 'Main Engine / Deck General',
    uom: 'kg',
    rob: 2,
    min: 1,
    stock: '',
    location: 'Store Room B',
    category: 'stores',
  },
  {
    id: 3,
    itemCode: 'ST-SEAL-001',
    itemName: 'O-Ring Set',
    storesCategory: 'Pumps & Valves',
    uom: 'set',
    rob: 3,
    min: 1,
    stock: '',
    location: 'Store Room B',
    category: 'stores',
  },
  {
    id: 4,
    itemCode: 'ST-SAFE-001',
    itemName: 'Safety Goggles',
    storesCategory: 'PPE / All Sections',
    uom: 'pair',
    rob: 4,
    min: 2,
    stock: '',
    location: 'Safety Locker',
    category: 'stores',
  },
  {
    id: 5,
    itemCode: 'ST-TOOL-002',
    itemName: 'Teflon Gasket',
    storesCategory: 'General Tools',
    uom: 'pcs',
    rob: 4,
    min: 2,
    stock: '',
    location: 'Store Room D',
    category: 'stores',
  },
  {
    id: 6,
    itemCode: 'SP-ME-001',
    itemName: 'GP gasket',
    storesCategory: 'General Tools',
    uom: 'pcs',
    rob: 1,
    min: 2,
    stock: 'Low',
    location: 'Store Room A',
    category: 'stores',
  },
  {
    id: 7,
    itemCode: 'ST-CONS-002',
    itemName: 'Industrial Wipers',
    storesCategory: 'General Tools',
    uom: 'pkt',
    rob: 2,
    min: 1,
    stock: '',
    location: 'Store Room B',
    category: 'stores',
  },
  {
    id: 8,
    itemCode: 'ST-BOLT-001',
    itemName: 'Hex Bolt Kit M6-M20',
    storesCategory: 'General Machinery',
    uom: 'kit',
    rob: 2,
    min: 1,
    stock: '',
    location: 'Store Room B',
    category: 'stores',
  },
  {
    id: 9,
    itemCode: 'ST-GASKET-001',
    itemName: 'Gasket Sheet Material',
    storesCategory: 'General Machinery',
    uom: 'm',
    rob: 3,
    min: 1,
    stock: '',
    location: 'Store Room C',
    category: 'stores',
  },
  {
    id: 10,
    itemCode: 'SP-COOL-001',
    itemName: 'Gasket Sheet Material',
    storesCategory: 'General Machinery',
    uom: 'm',
    rob: 4,
    min: 2,
    stock: '',
    location: 'Store Room D',
    category: 'stores',
  },
  {
    id: 11,
    itemCode: 'ST-SAFE-002',
    itemName: 'Safety Shoes',
    storesCategory: 'PPE / All Sections',
    uom: 'pair',
    rob: 5,
    min: 2,
    stock: '',
    location: 'Safety Locker',
    category: 'stores',
  },
  {
    id: 12,
    itemCode: 'ST-PAINT-001',
    itemName: 'Zinc Primer Paint',
    storesCategory: 'Deck Maintenance',
    uom: 'ltr',
    rob: 2,
    min: 10,
    stock: 'Low',
    location: 'Paint Locker',
    category: 'stores',
  },
  // Lubes data
  {
    id: 13,
    itemCode: 'SAE 70 EN',
    itemName: 'Cylinder Oil',
    storesCategory: 'Main Engine',
    uom: 'ltr',
    rob: 500,
    min: 1,
    stock: 'OK',
    location: 'Lube Tank A',
    category: 'lubes',
  },
  {
    id: 14,
    itemCode: 'SAE 30',
    itemName: 'System Oil',
    storesCategory: 'DG #1',
    uom: 'ltr',
    rob: 300,
    min: 1,
    stock: '',
    location: 'Lube Tank B',
    category: 'lubes',
  },
  {
    id: 15,
    itemCode: 'ISO VG 68',
    itemName: 'Hydraulic Oil',
    storesCategory: 'Steering Gear',
    uom: 'ltr',
    rob: 200,
    min: 1,
    stock: '',
    location: 'Steering Flat',
    category: 'lubes',
  },
  {
    id: 16,
    itemCode: 'EP 320',
    itemName: 'Gear Oil',
    storesCategory: 'Crane Gearbox',
    uom: 'ltr',
    rob: 80,
    min: 2,
    stock: '',
    location: 'Deck Lube Store',
    category: 'lubes',
  },
  {
    id: 17,
    itemCode: 'ISO VG 100',
    itemName: 'Compressor Oil',
    storesCategory: 'Air Compressor #2',
    uom: 'ltr',
    rob: 60,
    min: 2,
    stock: '',
    location: 'ECR Store',
    category: 'lubes',
  },
  {
    id: 18,
    itemCode: 'Synthetic',
    itemName: 'Stabilizer Oil',
    storesCategory: 'Fin Stabilizer',
    uom: 'ltr',
    rob: 50,
    min: 2,
    stock: 'Low',
    location: 'AFT Equipment',
    category: 'lubes',
  },
  {
    id: 19,
    itemCode: 'ISO 220',
    itemName: 'Winch Oil',
    storesCategory: 'Mooring Winch',
    uom: 'ltr',
    rob: 70,
    min: 1,
    stock: '',
    location: 'Deck Store',
    category: 'lubes',
  },
  {
    id: 20,
    itemCode: 'ISO 32',
    itemName: 'RO Pump Oil',
    storesCategory: 'RO High Pressure Pump',
    uom: 'ltr',
    rob: 10,
    min: 1,
    stock: '',
    location: 'RO Area Locker',
    category: 'lubes',
  },
  {
    id: 21,
    itemCode: 'VG 46',
    itemName: 'CPP Hydraulic Oil',
    storesCategory: 'Propeller System',
    uom: 'ltr',
    rob: 150,
    min: 1,
    stock: '',
    location: 'Stern Room',
    category: 'lubes',
  },
  {
    id: 22,
    itemCode: 'SAE 30',
    itemName: 'Emergency DG Oil',
    storesCategory: 'Emergency Generator',
    uom: 'ltr',
    rob: 4,
    min: 2,
    stock: '',
    location: 'ECR Tank',
    category: 'lubes',
  },
  {
    id: 23,
    itemCode: 'SAE 30',
    itemName: 'Emergency DG Oil',
    storesCategory: 'Emergency Generator',
    uom: 'ltr',
    rob: 6,
    min: 2,
    stock: '',
    location: 'ECR Tank',
    category: 'lubes',
  },
  {
    id: 24,
    itemCode: 'SAE 30',
    itemName: 'Emergency DG Oil',
    storesCategory: 'Emergency Generator',
    uom: 'ltr',
    rob: 2,
    min: 10,
    stock: 'Low',
    location: 'ECR Tank',
    category: 'lubes',
  },
  // Chemicals data
  {
    id: 25,
    itemCode: 'CHM-ALK-001',
    itemName: 'Alkaline Cleaner',
    storesCategory: 'Engine Bilge Cleaning',
    rob: 2,
    min: 1,
    stock: 'OK',
    location: 'Chem Locker',
    category: 'chemicals',
  },
  {
    id: 26,
    itemCode: 'CHM-WTP-001',
    itemName: 'Boiler Water Test',
    storesCategory: 'Boiler Feed Water',
    rob: 2,
    min: 1,
    stock: '',
    location: 'Chem Locker',
    category: 'chemicals',
  },
  {
    id: 27,
    itemCode: 'CHM-WTP-002',
    itemName: 'RO Antiscalant',
    storesCategory: 'RO Plant',
    rob: 3,
    min: 1,
    stock: '',
    location: 'Chem Locker',
    category: 'chemicals',
  },
  {
    id: 28,
    itemCode: 'CHM-TEST-001',
    itemName: 'RO Antiscalant',
    storesCategory: 'RO Plant',
    rob: 4,
    min: 2,
    stock: '',
    location: 'Chem Locker',
    category: 'chemicals',
  },
  {
    id: 29,
    itemCode: 'CHM-WTP-002',
    itemName: 'RO Antiscalant',
    storesCategory: 'RO Plant',
    rob: 4,
    min: 2,
    stock: '',
    location: 'Chem Locker',
    category: 'chemicals',
  },
  {
    id: 30,
    itemCode: 'CHM-FW-001',
    itemName: 'Fresh Water Biocide',
    storesCategory: 'Domestic Water Tank',
    rob: 1,
    min: 2,
    stock: 'Low',
    location: 'Chem Locker',
    category: 'chemicals',
  },
  {
    id: 31,
    itemCode: 'CHM-CWT-001',
    itemName: 'Fresh Water Biocide',
    storesCategory: 'Domestic Water Tank',
    rob: 2,
    min: 1,
    stock: '',
    location: 'Chem Locker',
    category: 'chemicals',
  },
  {
    id: 32,
    itemCode: 'CHM-SAN-001',
    itemName: 'Sanitizer 70% IPA',
    storesCategory: 'Galley & Food Area',
    rob: 2,
    min: 1,
    stock: '',
    location: 'Chem Locker',
    category: 'chemicals',
  },
  {
    id: 33,
    itemCode: 'CHM-FW-001',
    itemName: 'Fresh Water Biocide',
    storesCategory: 'Domestic Water Tank',
    rob: 3,
    min: 1,
    stock: '',
    location: 'Chem Locker',
    category: 'chemicals',
  },
  {
    id: 34,
    itemCode: 'CHM-TANKCL-01',
    itemName: 'Descaling Agent',
    storesCategory: 'Aux Boiler & PHEs',
    rob: 4,
    min: 2,
    stock: '',
    location: 'Chem Locker',
    category: 'chemicals',
  },
  {
    id: 35,
    itemCode: 'CHM-TANKCL-01',
    itemName: 'Descaling Agent',
    storesCategory: 'Aux Boiler & PHEs',
    rob: 6,
    min: 2,
    stock: '',
    location: 'Chem Locker',
    category: 'chemicals',
  },
  {
    id: 36,
    itemCode: 'CHM-TANKCL-01',
    itemName: 'Descaling Agent',
    storesCategory: 'Aux Boiler & PHEs',
    rob: 2,
    min: 10,
    stock: 'Low',
    location: 'Chem Locker',
    category: 'chemicals',
  },
  // Others data - Maritime Paints
  {
    id: 37,
    itemCode: 'PT-DECK-001',
    itemName: 'Non-Skid Deck Paint',
    storesCategory: 'Deck Coating',
    rob: 5,
    min: 2,
    stock: 'OK',
    location: 'Paint Locker',
    category: 'others',
  },
  {
    id: 38,
    itemCode: 'PT-HULL-001',
    itemName: 'Anti-Fouling Paint',
    storesCategory: 'Hull Coating',
    rob: 15,
    min: 5,
    stock: 'OK',
    location: 'Paint Locker',
    category: 'others',
  },
  {
    id: 39,
    itemCode: 'PT-PRIM-001',
    itemName: 'Zinc Rich Primer',
    storesCategory: 'Primer Coating',
    rob: 8,
    min: 3,
    stock: 'OK',
    location: 'Paint Locker',
    category: 'others',
  },
  {
    id: 40,
    itemCode: 'PT-MACH-001',
    itemName: 'Machinery Paint',
    storesCategory: 'Engine Room Coating',
    rob: 4,
    min: 2,
    stock: '',
    location: 'Paint Locker',
    category: 'others',
  },
  {
    id: 41,
    itemCode: 'PT-FIRE-001',
    itemName: 'Fire Retardant Paint',
    storesCategory: 'Safety Coating',
    rob: 3,
    min: 1,
    stock: '',
    location: 'Paint Locker',
    category: 'others',
  },
  {
    id: 42,
    itemCode: 'PT-MARK-001',
    itemName: 'Marking Paint White',
    storesCategory: 'Deck Marking',
    rob: 2,
    min: 3,
    stock: 'Low',
    location: 'Paint Locker',
    category: 'others',
  },
  {
    id: 43,
    itemCode: 'PT-MARK-002',
    itemName: 'Marking Paint Yellow',
    storesCategory: 'Deck Marking',
    rob: 1,
    min: 2,
    stock: 'Low',
    location: 'Paint Locker',
    category: 'others',
  },
  {
    id: 44,
    itemCode: 'PT-THINN-001',
    itemName: 'Paint Thinner',
    storesCategory: 'Paint Solvent',
    rob: 6,
    min: 2,
    stock: 'OK',
    location: 'Paint Locker',
    category: 'others',
  },
  {
    id: 45,
    itemCode: 'PT-BRUSH-001',
    itemName: 'Paint Brushes Set',
    storesCategory: 'Paint Accessories',
    rob: 3,
    min: 1,
    stock: '',
    location: 'Paint Locker',
    category: 'others',
  },
  {
    id: 46,
    itemCode: 'PT-ROLL-001',
    itemName: 'Paint Rollers',
    storesCategory: 'Paint Accessories',
    rob: 2,
    min: 1,
    stock: '',
    location: 'Paint Locker',
    category: 'others',
  },
  {
    id: 47,
    itemCode: 'PT-SAND-001',
    itemName: 'Sandpaper Sheets',
    storesCategory: 'Surface Preparation',
    rob: 10,
    min: 5,
    stock: 'OK',
    location: 'Paint Locker',
    category: 'others',
  },
  {
    id: 48,
    itemCode: 'PT-CLEAN-001',
    itemName: 'Paint Cleaner',
    storesCategory: 'Paint Solvent',
    rob: 2,
    min: 4,
    stock: 'Low',
    location: 'Paint Locker',
    category: 'others',
  },
];

const Stores: React.FC = () => {
  const { toast } = useToast();
  
  // API query to fetch stores data from MySQL
  const { data: apiStoreItems = [], isLoading: storeItemsLoading } = useQuery({
    queryKey: ['/api/stores', 'V001'],
    queryFn: () => fetch('/api/stores/V001').then(res => res.json())
  });

  // Mutation for store transactions (receive, consume)
  const createTransactionMutation = useMutation({
    mutationFn: async (transaction: any) => {
      const response = await fetch('/api/stores/V001/transaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transaction)
      });
      if (!response.ok) throw new Error('Failed to create transaction');
      return response.json();
    },
    onSuccess: () => {
      // Refetch store items to get updated data
      queryClient.invalidateQueries({ queryKey: ['/api/stores', 'V001'] });
    }
  });
  const [activeTab, setActiveTab] = useState<
    'stores' | 'lubes' | 'chemicals' | 'others'
  >('stores');
  const [viewMode, setViewMode] = useState<'inventory' | 'history'>(
    'inventory'
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [stockFilter, setStockFilter] = useState('');
  const [vesselFilter, setVesselFilter] = useState('');
  const [isBulkUpdateModalOpen, setIsBulkUpdateModalOpen] = useState(false);
  const [bulkUpdateData, setBulkUpdateData] = useState<{
    [key: number]: {
      consumed: number;
      received: number;
      receivedDate?: string;
      receivedPlace?: string;
      comments?: string;
    };
  }>({});
  const [placeReceived, setPlaceReceived] = useState('');
  const [dateReceived, setDateReceived] = useState('');
  const [items, setItems] = useState<StoreItem[]>([]);
  const [gridApi, setGridApi] = useState<GridApi | null>(null);

  // Transform API data when it loads
  useEffect(() => {
    if (apiStoreItems && apiStoreItems.length > 0) {
      console.log('🔄 Loading store items from MySQL database:', apiStoreItems);
      // Transform API data to match component interface
      const transformedItems = apiStoreItems.map((item: any, index: number) => ({
        id: index + 1,
        itemCode: item.item_code || item.itemCode,
        itemName: item.item_name || item.itemName,
        storesCategory: 'General Stores', // Default category
        uom: item.uom,
        rob: parseFloat(item.rob) || 0,
        min: parseFloat(item.min_stock) || 1,
        stock: item.stock || 'OK',
        location: item.location || 'Store Room',
        category: 'stores' as const,
      }));
      setItems(transformedItems);
    } else {
      console.log('📋 Using fallback hardcoded store data');
      // Fallback to hardcoded data if no API data
      setItems(hardcodedStoreItems);
    }
  }, [apiStoreItems]);

  // History filters
  const [historyDateFrom, setHistoryDateFrom] = useState('');
  const [historyDateTo, setHistoryDateTo] = useState('');
  const [historySearch, setHistorySearch] = useState('');
  const [historyEventFilter, setHistoryEventFilter] = useState('all');
  const [historyItems, setHistoryItems] = useState<StoresHistoryItem[]>([
    {
      id: 1001,
      dateLocal: '12 AUG 2025 09:15',
      eventType: 'RECEIVE',
      itemName: 'Bearing SKF 6205',
      partCode: 'SKF-6205',
      uom: 'Pcs',
      qtyChange: 5,
      robAfter: 12,
      place: 'Singapore',
      userId: 'John Smith',
      remarks: 'Regular stock replenishment',
      ref: 'PO-2025-089',
    },
    {
      id: 1002,
      dateLocal: '11 AUG 2025 14:30',
      eventType: 'CONSUME',
      itemName: 'Hydraulic Oil 68',
      partCode: 'HYD-68',
      uom: 'Ltr',
      qtyChange: -20,
      robAfter: 180,
      place: '',
      userId: 'Mike Johnson',
      remarks: 'Used for hydraulic system maintenance',
      ref: '',
    },
    {
      id: 1003,
      dateLocal: '10 AUG 2025 11:45',
      eventType: 'ARCHIVE',
      itemName: 'Obsolete Filter',
      partCode: 'FLT-OLD-001',
      uom: 'Pcs',
      qtyChange: 0,
      robAfter: 2,
      place: '',
      userId: 'Sarah Lee',
      remarks: 'Item archived - obsolete model',
      ref: '',
    },
  ]);

  // Edit modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<StoreItem | null>(null);
  const [editForm, setEditForm] = useState({
    itemName: '',
    uom: '',
    customUom: '',
    min: 0,
    location: '',
    notes: '',
  });

  // Receive modal state
  const [isReceiveModalOpen, setIsReceiveModalOpen] = useState(false);
  const [receivingItem, setReceivingItem] = useState<StoreItem | null>(null);
  const [receiveForm, setReceiveForm] = useState({
    quantity: '',
    dateLocal: new Date().toISOString().split('T')[0],
    place: '',
    supplierPO: '',
    remarks: '',
  });

  // Add to history function
  const addToHistory = (
    item: StoreItem,
    eventType: string,
    qtyChange: number,
    robAfter: number,
    place?: string,
    ref?: string,
    remarks?: string
  ) => {
    const now = new Date();
    const dateLocal = now
      .toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
      .toUpperCase()
      .replace(',', '');

    const historyEntry: StoresHistoryItem = {
      id: Date.now(),
      dateLocal,
      eventType,
      itemName: item.itemName,
      partCode: item.itemCode,
      uom: item.uom,
      qtyChange,
      robAfter,
      place: place || '',
      userId: 'Current User',
      remarks: remarks || '',
      ref: ref || '',
    };

    setHistoryItems(prev => [historyEntry, ...prev]);
  };

  // Calculate stock status based on ROB and Min
  const calculateStockStatus = (rob: number, min: number): string => {
    if (min === null || min === 0) return 'N/A';
    if (rob >= min) return 'OK';
    return 'Low';
  };

  // Update stock status for all items
  const updateItemsStock = (itemList: StoreItem[]): StoreItem[] => {
    return itemList.map(item => ({
      ...item,
      stock: calculateStockStatus(item.rob, item.min),
    }));
  };

  const filteredItems = useMemo(() => {
    const updatedItems = updateItemsStock(items);
    return updatedItems.filter(item => {
      if (item.isArchived) return false; // Hide archived items
      const matchesTab = item.category === activeTab;
      const matchesSearch =
        item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.itemCode.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        !categoryFilter ||
        categoryFilter === 'all' ||
        item.storesCategory.includes(categoryFilter);
      const matchesStock =
        !stockFilter ||
        stockFilter === 'all' ||
        item.stock.toLowerCase() === stockFilter.toLowerCase();

      return matchesTab && matchesSearch && matchesCategory && matchesStock;
    });
  }, [activeTab, searchTerm, categoryFilter, stockFilter, items]);

  // AG Grid column definitions
  const columnDefs = useMemo((): ColDef[] => [
    {
      headerName: activeTab === 'lubes' ? 'Lube Grade' : activeTab === 'chemicals' ? 'Chem Code' : 'Item Code',
      field: 'itemCode',
      width: 150,
      pinned: 'left'
    },
    {
      headerName: activeTab === 'lubes' ? 'Lube Type' : activeTab === 'chemicals' ? 'Chemical Name' : 'Item Name',
      field: 'itemName',
      width: 200
    },
    {
      headerName: activeTab === 'lubes' ? 'Application' : activeTab === 'chemicals' ? 'Application Area' : 'Stores Category',
      field: 'storesCategory',
      width: 200
    },
    {
      headerName: 'UOM',
      field: 'uom',
      width: 80
    },
    {
      headerName: 'ROB',
      field: 'rob',
      width: 80,
      cellRenderer: (params) => {
        return <span className="font-medium">{params.value}</span>;
      }
    },
    {
      headerName: 'Min',
      field: 'min',
      width: 80,
      cellRenderer: (params) => {
        return <span className="font-medium">{params.value}</span>;
      }
    },
    {
      headerName: 'Stock',
      field: 'stock',
      width: 100,
      cellRenderer: StockStatusCellRenderer
    },
    {
      headerName: 'Location',
      field: 'location',
      width: 150
    },
    {
      headerName: 'Actions',
      field: 'actions',
      width: 140,
      cellRenderer: StoresActionsCellRenderer,
      sortable: false,
      filter: false,
      pinned: 'right'
    }
  ], [activeTab]);

  // AG Grid context for action handlers
  const gridContext = useMemo(() => ({
    onEdit: (item: StoreItem) => {
      openEditModal(item);
    },
    onConsume: (item: StoreItem) => {
      // Implement consume functionality
      console.log('Consume item:', item);
    },
    onReceive: (item: StoreItem) => {
      // Implement receive functionality
      console.log('Receive item:', item);
    }
  }), []);

  const onGridReady = (params: GridReadyEvent) => {
    setGridApi(params.api);
  };

  const getStockColor = (stock: string) => {
    if (stock === 'Low') return 'bg-yellow-100 text-yellow-800';
    if (stock === 'OK') return 'bg-green-100 text-green-800';
    if (stock === 'N/A') return 'bg-gray-100 text-gray-800';
    return '';
  };

  // Export to Excel functions
  const exportInventoryToExcel = () => {
    const now = new Date();
    const timestamp = now
      .toISOString()
      .replace(/[-:]/g, '')
      .replace('T', '_')
      .slice(0, 15);
    const filename = `stores_${activeTab}_inventory_${timestamp}.xlsx`;

    const data = filteredItems.map(item => ({
      'Item Name': item.itemName,
      'Part Code': item.itemCode,
      UOM: item.uom || '-',
      ROB: item.rob,
      Min: item.min,
      Stock: item.stock,
      Location: item.location,
      Category: item.storesCategory,
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Inventory');
    XLSX.writeFile(wb, filename);

    toast({
      title: 'Export Successful',
      description: `Exported ${data.length} items to ${filename}`,
    });
  };

  const exportHistoryToExcel = () => {
    const now = new Date();
    const timestamp = now
      .toISOString()
      .replace(/[-:]/g, '')
      .replace('T', '_')
      .slice(0, 15);
    const filename = `stores_${activeTab}_history_${timestamp}.xlsx`;

    const data = filteredHistoryItems.map(item => ({
      Date: item.dateLocal,
      Event: item.eventType,
      'Item Name': item.itemName,
      'Part Code': item.partCode,
      UOM: item.uom || '-',
      'Qty Change':
        item.qtyChange > 0 ? `+${item.qtyChange}` : item.qtyChange.toString(),
      'ROB After': item.robAfter,
      Place: item.place || '-',
      User: item.userId,
      'Remarks/Ref': item.remarks || item.ref || '-',
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'History');
    XLSX.writeFile(wb, filename);

    toast({
      title: 'Export Successful',
      description: `Exported ${data.length} entries to ${filename}`,
    });
  };

  // Filter history items
  const filteredHistoryItems = useMemo(() => {
    return historyItems.filter(item => {
      // Filter by search
      if (
        historySearch &&
        !item.itemName.toLowerCase().includes(historySearch.toLowerCase()) &&
        !item.partCode.toLowerCase().includes(historySearch.toLowerCase())
      ) {
        return false;
      }

      // Filter by event type
      if (
        historyEventFilter !== 'all' &&
        item.eventType !== historyEventFilter
      ) {
        return false;
      }

      // Filter by date range (would need proper date parsing for production)
      // For now, we'll skip date filtering as it requires proper date handling

      return true;
    });
  }, [
    historyItems,
    historySearch,
    historyEventFilter,
    historyDateFrom,
    historyDateTo,
  ]);

  const handleBulkUpdateChange = (
    itemId: number,
    field:
      | 'consumed'
      | 'received'
      | 'receivedDate'
      | 'receivedPlace'
      | 'comments',
    value: string
  ) => {
    if (field === 'consumed' || field === 'received') {
      const numValue = parseInt(value) || 0;
      setBulkUpdateData(prev => ({
        ...prev,
        [itemId]: {
          ...prev[itemId],
          [field]: numValue,
        },
      }));
    } else {
      setBulkUpdateData(prev => ({
        ...prev,
        [itemId]: {
          ...prev[itemId],
          [field]: value,
        },
      }));
    }
  };

  const openBulkUpdateModal = () => {
    setIsBulkUpdateModalOpen(true);
    const initialData: typeof bulkUpdateData = {};
    filteredItems.forEach(item => {
      initialData[item.id] = {
        consumed: 0,
        received: 0,
        receivedDate: dateReceived,
        receivedPlace: placeReceived,
        comments: '',
      };
    });
    setBulkUpdateData(initialData);
    setPlaceReceived('');
    setDateReceived(new Date().toISOString().split('T')[0]);
  };

  const saveBulkUpdates = async () => {
    let updatedCount = 0;
    let skippedCount = 0;
    let failedCount = 0;

    const updatedItems = [...items];

    for (const item of items) {
      const updateData = bulkUpdateData[item.id];
      if (!updateData) continue;

      const consumed = updateData.consumed || 0;
      const received = updateData.received || 0;

      if (consumed === 0 && received === 0) {
        skippedCount++;
        continue;
      }

      const newRob = item.rob - consumed + received;

      // Validate
      if (newRob < 0) {
        failedCount++;
        continue;
      }

      if (received > 0 && !dateReceived) {
        failedCount++;
        continue;
      }

      try {
        // Create consume transaction if needed
        if (consumed > 0) {
          await createTransactionMutation.mutateAsync({
            itemCode: item.itemCode,
            itemName: item.itemName,
            unit: item.uom,
            eventType: 'CONSUME',
            quantity: -consumed,
            robAfter: item.rob - consumed,
            place: '',
            dateLocal: new Date().toISOString().split('T')[0],
            tz: 'UTC',
            remarks: updateData.comments
          });
        }

        // Create receive transaction if needed
        if (received > 0) {
          await createTransactionMutation.mutateAsync({
            itemCode: item.itemCode,
            itemName: item.itemName,
            unit: item.uom,
            eventType: 'RECEIVE',
            quantity: received,
            robAfter: newRob,
            place: placeReceived,
            dateLocal: dateReceived,
            tz: 'UTC',
            remarks: updateData.comments
          });
        }

        // Add history entries for local display
        if (consumed > 0) {
          addToHistory(
            item,
            'CONSUME',
            -consumed,
            newRob,
            '',
            '',
            updateData.comments
          );
        }

        if (received > 0) {
          addToHistory(
            item,
            'RECEIVE',
            received,
            newRob,
            placeReceived,
            '',
            updateData.comments
          );
        }

        // Update local item
        const itemIndex = updatedItems.findIndex(i => i.id === item.id);
        if (itemIndex >= 0) {
          updatedItems[itemIndex] = {
            ...item,
            rob: newRob,
          };
        }

        updatedCount++;
      } catch (error) {
        console.error('Failed to save transaction:', error);
        failedCount++;
      }
    }

    setItems(updatedItems);
    setIsBulkUpdateModalOpen(false);
    toast({
      title: 'Bulk Update Complete',
      description: `Updated: ${updatedCount}, Skipped: ${skippedCount}, Failed: ${failedCount} - saved to database`,
    });
  };

  // Handle Edit Item
  const openEditModal = (item: StoreItem) => {
    setEditingItem(item);
    const isCustomUom = !UOM_OPTIONS.includes(item.uom || '');
    setEditForm({
      itemName: item.itemName,
      uom: isCustomUom ? 'Other' : item.uom || '',
      customUom: isCustomUom ? item.uom || '' : '',
      min: item.min,
      location: item.location,
      notes: item.notes || '',
    });
    setIsEditModalOpen(true);
  };

  const saveEditItem = () => {
    if (!editingItem) return;

    const uom = editForm.uom === 'Other' ? editForm.customUom : editForm.uom;

    const updatedItems = items.map(item => {
      if (item.id === editingItem.id) {
        const updatedItem = {
          ...item,
          itemName: editForm.itemName,
          uom: uom,
          min: editForm.min,
          location: editForm.location,
          notes: editForm.notes,
        };

        // Recalculate stock status
        const newStock = calculateStockStatus(item.rob, editForm.min);

        // Add to history if min changed
        if (item.min !== editForm.min) {
          addToHistory(
            updatedItem,
            'EDIT',
            0,
            item.rob,
            '',
            '',
            `Min changed from ${item.min} to ${editForm.min}`
          );
        }

        return { ...updatedItem, stock: newStock };
      }
      return item;
    });

    setItems(updatedItems);
    setIsEditModalOpen(false);
    toast({ title: 'Success', description: 'Item updated successfully' });
  };

  // Handle Receive
  const openReceiveModal = (item: StoreItem) => {
    setReceivingItem(item);
    setReceiveForm({
      quantity: '',
      dateLocal: new Date().toISOString().split('T')[0],
      place: '',
      supplierPO: '',
      remarks: '',
    });
    setIsReceiveModalOpen(true);
  };

  const saveReceive = async () => {
    if (!receivingItem) return;

    const quantity = parseInt(receiveForm.quantity);
    if (!quantity || quantity < 1) {
      toast({
        title: 'Error',
        description: 'Quantity must be at least 1',
        variant: 'destructive',
      });
      return;
    }

    if (!receiveForm.dateLocal) {
      toast({
        title: 'Error',
        description: 'Date is required',
        variant: 'destructive',
      });
      return;
    }

    const newRob = receivingItem.rob + quantity;

    try {
      // Create transaction in database
      await createTransactionMutation.mutateAsync({
        itemCode: receivingItem.itemCode,
        itemName: receivingItem.itemName,
        unit: receivingItem.uom,
        eventType: 'RECEIVE',
        quantity: quantity,
        robAfter: newRob,
        place: receiveForm.place,
        reference: receiveForm.supplierPO,
        dateLocal: receiveForm.dateLocal,
        tz: 'UTC',
        remarks: receiveForm.remarks
      });

      // Update local state immediately for better UX
      const updatedItems = items.map(item => {
        if (item.id === receivingItem.id) {
          return {
            ...item,
            rob: newRob,
          };
        }
        return item;
      });

      // Add to history
      addToHistory(
        receivingItem,
        'RECEIVE',
        quantity,
        newRob,
        receiveForm.place,
        receiveForm.supplierPO,
        receiveForm.remarks
      );

      setItems(updatedItems);
      setIsReceiveModalOpen(false);
      toast({
        title: 'Success',
        description: `Received ${quantity} ${receivingItem.uom || 'units'} - saved to database`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save transaction to database',
        variant: 'destructive',
      });
    }
  };

  // Handle Archive
  const handleArchive = (item: StoreItem) => {
    const confirmMessage =
      item.rob > 0
        ? `This item has stock on hand (ROB = ${item.rob}). Archive anyway?`
        : `Archive ${item.itemName}?`;

    if (confirm(confirmMessage)) {
      const updatedItems = items.map(i =>
        i.id === item.id ? { ...i, isArchived: true } : i
      );

      // Add to history
      addToHistory(item, 'ARCHIVE', 0, item.rob, '', '', 'Item archived');

      setItems(updatedItems);
      toast({ title: 'Success', description: 'Item archived' });
    }
  };

  return (
    <div className='flex-1 p-6 bg-gray-50 min-h-screen'>
      {/* Header */}
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold text-gray-800'>
          {activeTab === 'stores'
            ? 'Stores Inventory'
            : activeTab === 'lubes'
              ? 'Lubes Inventory'
              : activeTab === 'chemicals'
                ? 'Chemicals Inventory'
                : 'Others Inventory'}
        </h1>
        <Button
          className='bg-[#52baf3] hover:bg-[#40a8e0] text-white'
          onClick={openBulkUpdateModal}
        >
          + Bulk Update {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
        </Button>
      </div>

      {/* Tabs */}
      <div className='flex gap-1 mb-6'>
        <button
          onClick={() => setActiveTab('stores')}
          className={`px-6 py-2 rounded-t text-sm font-medium ${
            activeTab === 'stores'
              ? 'bg-[#52baf3] text-white'
              : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
          }`}
        >
          Stores
        </button>
        <button
          onClick={() => setActiveTab('lubes')}
          className={`px-6 py-2 rounded-t text-sm font-medium ${
            activeTab === 'lubes'
              ? 'bg-[#52baf3] text-white'
              : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
          }`}
        >
          Lubes
        </button>
        <button
          onClick={() => setActiveTab('chemicals')}
          className={`px-6 py-2 rounded-t text-sm font-medium ${
            activeTab === 'chemicals'
              ? 'bg-[#52baf3] text-white'
              : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
          }`}
        >
          Chemicals
        </button>
        <button
          onClick={() => setActiveTab('others')}
          className={`px-6 py-2 rounded-t text-sm font-medium ${
            activeTab === 'others'
              ? 'bg-[#52baf3] text-white'
              : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
          }`}
        >
          Others
        </button>
      </div>

      {/* View Mode Tabs */}
      <div className='flex gap-2 mb-4'>
        <Button
          variant={viewMode === 'inventory' ? 'default' : 'outline'}
          onClick={() => setViewMode('inventory')}
          className='text-sm'
        >
          Inventory
        </Button>
        <Button
          variant={viewMode === 'history' ? 'default' : 'outline'}
          onClick={() => setViewMode('history')}
          className='text-sm'
        >
          History
        </Button>
      </div>

      {/* Filters - Show different filters based on view mode */}
      {viewMode === 'inventory' ? (
        <div className='flex gap-4 mb-6'>
          <div className='flex-1'>
            <Input
              placeholder='Vessel'
              value={vesselFilter}
              onChange={e => setVesselFilter(e.target.value)}
              className='text-sm'
            />
          </div>
          <div className='flex-1 relative'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
            <Input
              placeholder='Search'
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className='pl-10 text-sm'
            />
          </div>
          <div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className='w-40 text-sm'>
                <SelectValue placeholder='All Categories' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Categories</SelectItem>
                <SelectItem value='Engine'>Engine Stores</SelectItem>
                <SelectItem value='General'>General Tools</SelectItem>
                <SelectItem value='PPE'>PPE / All Sections</SelectItem>
                <SelectItem value='Machinery'>General Machinery</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Select value={stockFilter} onValueChange={setStockFilter}>
              <SelectTrigger className='w-32 text-sm'>
                <SelectValue placeholder='Stock' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All</SelectItem>
                <SelectItem value='OK'>OK</SelectItem>
                <SelectItem value='Low'>Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            variant='ghost'
            size='sm'
            className='text-blue-600'
            onClick={exportInventoryToExcel}
          >
            <FileSpreadsheet className='h-4 w-4 mr-1' />
            Export
          </Button>
          <Button
            variant='ghost'
            size='sm'
            className='text-gray-600'
            onClick={() => {
              setSearchTerm('');
              setCategoryFilter('all');
              setStockFilter('all');
              setVesselFilter('');
            }}
          >
            Clear
          </Button>
        </div>
      ) : (
        /* History Filters */
        <div className='flex gap-4 mb-6'>
          <div className='flex-1 relative'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
            <Input
              placeholder='Search history...'
              value={historySearch}
              onChange={e => setHistorySearch(e.target.value)}
              className='pl-10 text-sm'
            />
          </div>
          <div>
            <Select
              value={historyEventFilter}
              onValueChange={setHistoryEventFilter}
            >
              <SelectTrigger className='w-40 text-sm'>
                <SelectValue placeholder='All Events' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Events</SelectItem>
                <SelectItem value='RECEIVE'>Receive</SelectItem>
                <SelectItem value='CONSUME'>Consume</SelectItem>
                <SelectItem value='ARCHIVE'>Archive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className='flex items-center gap-2'>
            <Input
              type='date'
              value={historyDateFrom}
              onChange={e => setHistoryDateFrom(e.target.value)}
              className='text-sm'
              placeholder='From'
            />
            <span className='text-gray-500'>to</span>
            <Input
              type='date'
              value={historyDateTo}
              onChange={e => setHistoryDateTo(e.target.value)}
              className='text-sm'
              placeholder='To'
            />
          </div>
          <Button
            variant='ghost'
            size='sm'
            className='text-blue-600'
            onClick={exportHistoryToExcel}
          >
            <FileSpreadsheet className='h-4 w-4 mr-1' />
            Export
          </Button>
        </div>
      )}

      {/* Table */}
      {viewMode === 'inventory' ? (
        <div className='bg-white rounded-lg'>
          <AgGridTable
            rowData={filteredItems}
            columnDefs={columnDefs}
            onGridReady={onGridReady}
            context={gridContext}
            height="calc(100vh - 280px)"
            enableExport={true}
            enableSideBar={true}
            enableStatusBar={true}
            pagination={true}
            paginationPageSize={50}
            animateRows={true}
            suppressRowClickSelection={true}
            className="rounded-lg shadow-sm"
          />
        </div>
      ) : (
        /* History Table */
        <div className='bg-white rounded-lg shadow overflow-hidden'>
          <div className='bg-[#52baf3] text-white p-4'>
            <div className='grid grid-cols-12 gap-4 items-center text-sm font-medium'>
              <div className='col-span-2'>Date/Time</div>
              <div className='col-span-1'>Event</div>
              <div className='col-span-2'>Item Name</div>
              <div className='col-span-1'>Part Code</div>
              <div className='col-span-1'>UOM</div>
              <div className='col-span-1'>Qty Change</div>
              <div className='col-span-1'>ROB After</div>
              <div className='col-span-1'>Place</div>
              <div className='col-span-1'>User</div>
              <div className='col-span-1'>Remarks</div>
            </div>
          </div>

          <div className='divide-y divide-gray-200'>
            {filteredHistoryItems.length === 0 ? (
              <div className='p-8 text-center text-gray-500'>
                No history entries found. Actions like Receive, Consume, and
                Archive will appear here.
              </div>
            ) : (
              filteredHistoryItems.map(item => (
                <div key={item.id} className='p-4 hover:bg-gray-50'>
                  <div className='grid grid-cols-12 gap-4 items-center text-sm'>
                    <div className='col-span-2 text-gray-700'>
                      {item.dateLocal}
                    </div>
                    <div className='col-span-1'>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          item.eventType === 'RECEIVE'
                            ? 'bg-green-100 text-green-800'
                            : item.eventType === 'CONSUME'
                              ? 'bg-orange-100 text-orange-800'
                              : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {item.eventType}
                      </span>
                    </div>
                    <div className='col-span-2 text-gray-700'>
                      {item.itemName}
                    </div>
                    <div className='col-span-1 text-gray-600'>
                      {item.partCode}
                    </div>
                    <div className='col-span-1 text-gray-600'>
                      {item.uom || '-'}
                    </div>
                    <div className='col-span-1'>
                      <span
                        className={
                          item.qtyChange > 0
                            ? 'text-green-600'
                            : 'text-orange-600'
                        }
                      >
                        {item.qtyChange > 0 ? '+' : ''}
                        {item.qtyChange}
                      </span>
                    </div>
                    <div className='col-span-1 text-gray-700'>
                      {item.robAfter}
                    </div>
                    <div className='col-span-1 text-gray-600'>
                      {item.place || '-'}
                    </div>
                    <div className='col-span-1 text-gray-600'>
                      {item.userId}
                    </div>
                    <div
                      className='col-span-1 text-gray-600 truncate'
                      title={item.remarks || item.ref}
                    >
                      {item.remarks || item.ref || '-'}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Edit Item Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>Edit Item</DialogTitle>
          </DialogHeader>
          <div className='grid gap-4 py-4'>
            <div className='grid gap-2'>
              <Label htmlFor='itemName'>Item Name</Label>
              <Input
                id='itemName'
                value={editForm.itemName}
                onChange={e =>
                  setEditForm({ ...editForm, itemName: e.target.value })
                }
              />
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='uom'>Unit of Measure</Label>
              <Select
                value={editForm.uom}
                onValueChange={value =>
                  setEditForm({ ...editForm, uom: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder='Select UOM' />
                </SelectTrigger>
                <SelectContent>
                  {UOM_OPTIONS.map(opt => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {editForm.uom === 'Other' && (
                <Input
                  placeholder='Enter custom UOM'
                  value={editForm.customUom}
                  onChange={e =>
                    setEditForm({ ...editForm, customUom: e.target.value })
                  }
                />
              )}
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='min'>Minimum Stock</Label>
              <Input
                id='min'
                type='number'
                min='0'
                value={editForm.min}
                onChange={e =>
                  setEditForm({
                    ...editForm,
                    min: parseInt(e.target.value) || 0,
                  })
                }
              />
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='location'>Location</Label>
              <Input
                id='location'
                value={editForm.location}
                onChange={e =>
                  setEditForm({ ...editForm, location: e.target.value })
                }
              />
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='notes'>Notes</Label>
              <Textarea
                id='notes'
                value={editForm.notes}
                onChange={e =>
                  setEditForm({ ...editForm, notes: e.target.value })
                }
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveEditItem}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Receive Item Modal */}
      <Dialog open={isReceiveModalOpen} onOpenChange={setIsReceiveModalOpen}>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>Receive {receivingItem?.itemName}</DialogTitle>
          </DialogHeader>
          <div className='grid gap-4 py-4'>
            <div className='grid gap-2'>
              <Label htmlFor='quantity'>
                Quantity to Receive ({receivingItem?.uom || 'units'})
              </Label>
              <Input
                id='quantity'
                type='number'
                min='1'
                value={receiveForm.quantity}
                onChange={e =>
                  setReceiveForm({ ...receiveForm, quantity: e.target.value })
                }
              />
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='dateLocal'>Date Received</Label>
              <Input
                id='dateLocal'
                type='date'
                value={receiveForm.dateLocal}
                onChange={e =>
                  setReceiveForm({ ...receiveForm, dateLocal: e.target.value })
                }
              />
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='place'>Place/Port</Label>
              <Input
                id='place'
                value={receiveForm.place}
                onChange={e =>
                  setReceiveForm({ ...receiveForm, place: e.target.value })
                }
              />
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='supplierPO'>Supplier/PO#</Label>
              <Input
                id='supplierPO'
                value={receiveForm.supplierPO}
                onChange={e =>
                  setReceiveForm({ ...receiveForm, supplierPO: e.target.value })
                }
              />
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='remarks'>Remarks</Label>
              <Textarea
                id='remarks'
                value={receiveForm.remarks}
                onChange={e =>
                  setReceiveForm({ ...receiveForm, remarks: e.target.value })
                }
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setIsReceiveModalOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={saveReceive}>Receive</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Update Stores Modal */}
      {isBulkUpdateModalOpen && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg shadow-lg w-[95%] max-w-7xl max-h-[90vh] overflow-auto'>
            {/* Modal Header */}
            <div className='flex justify-between items-center p-4 border-b'>
              <h2 className='text-xl font-semibold text-gray-800'>
                Bulk Update{' '}
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
              </h2>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => setIsBulkUpdateModalOpen(false)}
                className='h-8 w-8 p-0'
              >
                <X className='h-4 w-4' />
              </Button>
            </div>

            {/* Modal Body */}
            <div className='p-6'>
              {/* Place Received and Date Fields */}
              <div className='grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded border'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Place Received
                  </label>
                  <Input
                    placeholder='Enter place received'
                    value={placeReceived}
                    onChange={e => setPlaceReceived(e.target.value)}
                    className='text-sm'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Date
                  </label>
                  <div className='relative'>
                    <Input
                      type='date'
                      value={dateReceived}
                      onChange={e => setDateReceived(e.target.value)}
                      className='text-sm pr-10'
                    />
                    <Calendar className='absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none' />
                  </div>
                </div>
              </div>

              {/* Table Headers */}
              <div className='grid grid-cols-9 gap-3 bg-gray-50 p-3 rounded-t text-sm font-medium text-gray-600 border'>
                <div>
                  {activeTab === 'lubes'
                    ? 'Lube Grade'
                    : activeTab === 'chemicals'
                      ? 'Chem Code'
                      : 'Item Code'}
                </div>
                <div>
                  {activeTab === 'lubes'
                    ? 'Lube Type'
                    : activeTab === 'chemicals'
                      ? 'Chemical Name'
                      : 'Item Name'}
                </div>
                <div>
                  {activeTab === 'lubes'
                    ? 'Application'
                    : activeTab === 'chemicals'
                      ? 'Application Area'
                      : 'Category'}
                </div>
                <div>UOM</div>
                <div>ROB</div>
                <div>Consumed</div>
                <div>Received</div>
                <div>New ROB</div>
                <div>Comments</div>
              </div>

              {/* Table Body */}
              <div className='border border-t-0 rounded-b max-h-[400px] overflow-y-auto'>
                {filteredItems.map(item => {
                  const consumed = bulkUpdateData[item.id]?.consumed || 0;
                  const received = bulkUpdateData[item.id]?.received || 0;
                  const newRob = item.rob - consumed + received;
                  const hasError =
                    newRob < 0 ||
                    (received > 0 && !bulkUpdateData[item.id]?.receivedDate);

                  return (
                    <div
                      key={item.id}
                      className={`grid grid-cols-9 gap-3 p-3 border-b ${hasError ? 'bg-red-50' : 'bg-white'} items-center`}
                    >
                      <div className='text-gray-900 text-sm'>
                        {item.itemCode}
                      </div>
                      <div className='text-gray-900 text-sm'>
                        {item.itemName}
                      </div>
                      <div className='text-gray-700 text-sm'>
                        {item.storesCategory}
                      </div>
                      <div className='text-gray-700 text-sm'>
                        {item.uom || '-'}
                      </div>
                      <div className='text-gray-700 text-sm'>{item.rob}</div>
                      <div>
                        <Input
                          type='number'
                          min='0'
                          max={item.rob}
                          className={`text-sm h-8 ${newRob < 0 ? 'border-red-500' : ''}`}
                          placeholder='0'
                          value={consumed || ''}
                          onChange={e =>
                            handleBulkUpdateChange(
                              item.id,
                              'consumed',
                              e.target.value
                            )
                          }
                        />
                      </div>
                      <div>
                        <Input
                          type='number'
                          min='0'
                          className='text-sm h-8'
                          placeholder='0'
                          value={received || ''}
                          onChange={e =>
                            handleBulkUpdateChange(
                              item.id,
                              'received',
                              e.target.value
                            )
                          }
                        />
                      </div>
                      <div
                        className={`text-sm font-medium ${newRob < 0 ? 'text-red-600' : newRob < item.min ? 'text-yellow-600' : 'text-gray-900'}`}
                      >
                        {newRob}
                        {newRob < 0 && (
                          <div className='text-xs'>Insufficient stock</div>
                        )}
                      </div>
                      <div>
                        <Input
                          type='text'
                          className='text-sm h-8'
                          placeholder='Comments'
                          value={bulkUpdateData[item.id]?.comments || ''}
                          onChange={e =>
                            handleBulkUpdateChange(
                              item.id,
                              'comments',
                              e.target.value
                            )
                          }
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Modal Footer */}
            <div className='flex justify-end gap-3 p-4 border-t bg-gray-50'>
              <Button
                variant='outline'
                onClick={() => setIsBulkUpdateModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                className='bg-green-600 hover:bg-green-700 text-white'
                onClick={saveBulkUpdates}
              >
                Save Updates
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Stores;
