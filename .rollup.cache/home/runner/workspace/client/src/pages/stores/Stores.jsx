import { __assign, __awaiter, __generator, __spreadArray } from "tslib";
import React, { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from '@/components/ui/select';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Search, FileSpreadsheet, X, Calendar, } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import * as XLSX from 'xlsx';
import AgGridTable from '@/components/common/AgGridTable';
import { StockStatusCellRenderer, StoresActionsCellRenderer, } from '@/components/common/AgGridCellRenderers';
// UOM options
var UOM_OPTIONS = [
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
var hardcodedStoreItems = [
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
var Stores = function () {
    var toast = useToast().toast;
    // API query to fetch stores data from MySQL
    var _a = useQuery({
        queryKey: ['/api/stores', 'V001'],
        queryFn: function () { return fetch('/api/stores/V001').then(function (res) { return res.json(); }); },
    }), _b = _a.data, apiStoreItems = _b === void 0 ? [] : _b, storeItemsLoading = _a.isLoading;
    // Mutation for store transactions (receive, consume)
    var createTransactionMutation = useMutation({
        mutationFn: function (transaction) { return __awaiter(void 0, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch('/api/stores/V001/transaction', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(transaction),
                        })];
                    case 1:
                        response = _a.sent();
                        if (!response.ok)
                            throw new Error('Failed to create transaction');
                        return [2 /*return*/, response.json()];
                }
            });
        }); },
        onSuccess: function () {
            // Refetch store items to get updated data
            queryClient.invalidateQueries({ queryKey: ['/api/stores', 'V001'] });
        },
    });
    // Mutation for updating store item details
    var updateItemMutation = useMutation({
        mutationFn: function (updateData) { return __awaiter(void 0, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch("/api/stores/V001/item/".concat(updateData.itemCode), {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(updateData),
                        })];
                    case 1:
                        response = _a.sent();
                        if (!response.ok)
                            throw new Error('Failed to update store item');
                        return [2 /*return*/, response.json()];
                }
            });
        }); },
        onSuccess: function () {
            // Force refetch by removing cache and fetching fresh data
            queryClient.removeQueries({ queryKey: ['/api/stores', 'V001'] });
            queryClient.invalidateQueries({ queryKey: ['/api/stores', 'V001'] });
        },
    });
    var _c = useState('stores'), activeTab = _c[0], setActiveTab = _c[1];
    var _d = useState('inventory'), viewMode = _d[0], setViewMode = _d[1];
    var _e = useState(''), searchTerm = _e[0], setSearchTerm = _e[1];
    var _f = useState(''), categoryFilter = _f[0], setCategoryFilter = _f[1];
    var _g = useState(''), stockFilter = _g[0], setStockFilter = _g[1];
    var _h = useState(''), vesselFilter = _h[0], setVesselFilter = _h[1];
    var _j = useState(false), isBulkUpdateModalOpen = _j[0], setIsBulkUpdateModalOpen = _j[1];
    var _k = useState({}), bulkUpdateData = _k[0], setBulkUpdateData = _k[1];
    var _l = useState(''), placeReceived = _l[0], setPlaceReceived = _l[1];
    var _m = useState(''), dateReceived = _m[0], setDateReceived = _m[1];
    var _o = useState([]), items = _o[0], setItems = _o[1];
    var _p = useState(null), gridApi = _p[0], setGridApi = _p[1];
    // Transform API data when it loads
    useEffect(function () {
        if (apiStoreItems && apiStoreItems.length > 0) {
            console.log('🔄 Loading store items from MySQL database:', apiStoreItems);
            // Transform API data to match component interface
            var transformedItems = apiStoreItems.map(function (item, index) { return ({
                id: index + 1,
                itemCode: item.item_code || item.itemCode,
                itemName: item.item_name || item.itemName,
                storesCategory: 'General Stores', // Default category
                uom: item.uom,
                rob: parseFloat(item.rob) || 0,
                min: parseFloat(item.min_stock) || 1,
                stock: item.stock || 'OK',
                location: item.location || 'Store Room',
                category: 'stores',
            }); });
            setItems(transformedItems);
        }
        else {
            console.log('📋 Using fallback hardcoded store data');
            // Fallback to hardcoded data if no API data
            setItems(hardcodedStoreItems);
        }
    }, [apiStoreItems]);
    // History filters
    var _q = useState(''), historyDateFrom = _q[0], setHistoryDateFrom = _q[1];
    var _r = useState(''), historyDateTo = _r[0], setHistoryDateTo = _r[1];
    var _s = useState(''), historySearch = _s[0], setHistorySearch = _s[1];
    var _t = useState('all'), historyEventFilter = _t[0], setHistoryEventFilter = _t[1];
    var _u = useState([
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
    ]), historyItems = _u[0], setHistoryItems = _u[1];
    // Edit modal state
    var _v = useState(false), isEditModalOpen = _v[0], setIsEditModalOpen = _v[1];
    var _w = useState(null), editingItem = _w[0], setEditingItem = _w[1];
    var _x = useState({
        itemName: '',
        uom: '',
        customUom: '',
        min: 0,
        location: '',
        notes: '',
    }), editForm = _x[0], setEditForm = _x[1];
    // Receive modal state
    var _y = useState(false), isReceiveModalOpen = _y[0], setIsReceiveModalOpen = _y[1];
    var _z = useState(null), receivingItem = _z[0], setReceivingItem = _z[1];
    var _0 = useState({
        quantity: '',
        dateLocal: new Date().toISOString().split('T')[0],
        place: '',
        supplierPO: '',
        remarks: '',
    }), receiveForm = _0[0], setReceiveForm = _0[1];
    // Add item modal state
    var _1 = useState(false), isAddItemModalOpen = _1[0], setIsAddItemModalOpen = _1[1];
    var _2 = useState({
        itemCode: '',
        itemName: '',
        uom: 'pcs',
        customUom: '',
        initialQty: '',
        minStock: '1',
        location: 'Store Room',
        notes: '',
    }), addItemForm = _2[0], setAddItemForm = _2[1];
    // Add to history function
    var addToHistory = function (item, eventType, qtyChange, robAfter, place, ref, remarks) {
        var now = new Date();
        var dateLocal = now
            .toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        })
            .toUpperCase()
            .replace(',', '');
        var historyEntry = {
            id: Date.now(),
            dateLocal: dateLocal,
            eventType: eventType,
            itemName: item.itemName,
            partCode: item.itemCode,
            uom: item.uom,
            qtyChange: qtyChange,
            robAfter: robAfter,
            place: place || '',
            userId: 'Current User',
            remarks: remarks || '',
            ref: ref || '',
        };
        setHistoryItems(function (prev) { return __spreadArray([historyEntry], prev, true); });
    };
    // Calculate stock status based on ROB and Min
    var calculateStockStatus = function (rob, min) {
        if (min === null || min === 0)
            return 'N/A';
        if (rob >= min)
            return 'OK';
        return 'Low';
    };
    // Update stock status for all items
    var updateItemsStock = function (itemList) {
        return itemList.map(function (item) { return (__assign(__assign({}, item), { stock: calculateStockStatus(item.rob, item.min) })); });
    };
    var filteredItems = useMemo(function () {
        var updatedItems = updateItemsStock(items);
        return updatedItems.filter(function (item) {
            if (item.isArchived)
                return false; // Hide archived items
            var matchesTab = item.category === activeTab;
            var matchesSearch = item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.itemCode.toLowerCase().includes(searchTerm.toLowerCase());
            var matchesCategory = !categoryFilter ||
                categoryFilter === 'all' ||
                item.storesCategory.includes(categoryFilter);
            var matchesStock = !stockFilter ||
                stockFilter === 'all' ||
                item.stock.toLowerCase() === stockFilter.toLowerCase();
            return matchesTab && matchesSearch && matchesCategory && matchesStock;
        });
    }, [activeTab, searchTerm, categoryFilter, stockFilter, items]);
    // AG Grid column definitions
    var columnDefs = useMemo(function () { return [
        {
            headerName: activeTab === 'lubes'
                ? 'Lube Grade'
                : activeTab === 'chemicals'
                    ? 'Chem Code'
                    : 'Item Code',
            field: 'itemCode',
            width: 150,
            pinned: 'left',
        },
        {
            headerName: activeTab === 'lubes'
                ? 'Lube Type'
                : activeTab === 'chemicals'
                    ? 'Chemical Name'
                    : 'Item Name',
            field: 'itemName',
            width: 200,
        },
        {
            headerName: activeTab === 'lubes'
                ? 'Application'
                : activeTab === 'chemicals'
                    ? 'Application Area'
                    : 'Stores Category',
            field: 'storesCategory',
            width: 200,
        },
        {
            headerName: 'UOM',
            field: 'uom',
            width: 80,
        },
        {
            headerName: 'ROB',
            field: 'rob',
            width: 80,
            cellRenderer: function (params) {
                return <span className='font-medium'>{params.value}</span>;
            },
        },
        {
            headerName: 'Min',
            field: 'min',
            width: 80,
            cellRenderer: function (params) {
                return <span className='font-medium'>{params.value}</span>;
            },
        },
        {
            headerName: 'Stock',
            field: 'stock',
            width: 100,
            cellRenderer: StockStatusCellRenderer,
        },
        {
            headerName: 'Location',
            field: 'location',
            width: 150,
        },
        {
            headerName: 'Actions',
            field: 'actions',
            width: 140,
            cellRenderer: StoresActionsCellRenderer,
            sortable: false,
            filter: false,
            pinned: 'right',
        },
    ]; }, [activeTab]);
    // AG Grid context for action handlers
    var gridContext = useMemo(function () { return ({
        onEdit: function (item) {
            openEditModal(item);
        },
        onConsume: function (item) {
            // Quick consume - open a simple prompt
            var quantity = prompt("How much ".concat(item.uom || 'units', " of ").concat(item.itemName, " to consume?"), '1');
            if (quantity && !isNaN(Number(quantity))) {
                handleQuickConsume(item, Number(quantity));
            }
        },
        onReceive: function (item) {
            openReceiveModal(item);
        },
    }); }, []);
    var onGridReady = function (params) {
        setGridApi(params.api);
    };
    var getStockColor = function (stock) {
        if (stock === 'Low')
            return 'bg-yellow-100 text-yellow-800';
        if (stock === 'OK')
            return 'bg-green-100 text-green-800';
        if (stock === 'N/A')
            return 'bg-gray-100 text-gray-800';
        return '';
    };
    // Export to Excel functions
    var exportInventoryToExcel = function () {
        var now = new Date();
        var timestamp = now
            .toISOString()
            .replace(/[-:]/g, '')
            .replace('T', '_')
            .slice(0, 15);
        var filename = "stores_".concat(activeTab, "_inventory_").concat(timestamp, ".xlsx");
        var data = filteredItems.map(function (item) { return ({
            'Item Name': item.itemName,
            'Part Code': item.itemCode,
            UOM: item.uom || '-',
            ROB: item.rob,
            Min: item.min,
            Stock: item.stock,
            Location: item.location,
            Category: item.storesCategory,
        }); });
        var ws = XLSX.utils.json_to_sheet(data);
        var wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Inventory');
        XLSX.writeFile(wb, filename);
        toast({
            title: 'Export Successful',
            description: "Exported ".concat(data.length, " items to ").concat(filename),
        });
    };
    var exportHistoryToExcel = function () {
        var now = new Date();
        var timestamp = now
            .toISOString()
            .replace(/[-:]/g, '')
            .replace('T', '_')
            .slice(0, 15);
        var filename = "stores_".concat(activeTab, "_history_").concat(timestamp, ".xlsx");
        var data = filteredHistoryItems.map(function (item) { return ({
            Date: item.dateLocal,
            Event: item.eventType,
            'Item Name': item.itemName,
            'Part Code': item.partCode,
            UOM: item.uom || '-',
            'Qty Change': item.qtyChange > 0 ? "+".concat(item.qtyChange) : item.qtyChange.toString(),
            'ROB After': item.robAfter,
            Place: item.place || '-',
            User: item.userId,
            'Remarks/Ref': item.remarks || item.ref || '-',
        }); });
        var ws = XLSX.utils.json_to_sheet(data);
        var wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'History');
        XLSX.writeFile(wb, filename);
        toast({
            title: 'Export Successful',
            description: "Exported ".concat(data.length, " entries to ").concat(filename),
        });
    };
    // Filter history items
    var filteredHistoryItems = useMemo(function () {
        return historyItems.filter(function (item) {
            // Filter by search
            if (historySearch &&
                !item.itemName.toLowerCase().includes(historySearch.toLowerCase()) &&
                !item.partCode.toLowerCase().includes(historySearch.toLowerCase())) {
                return false;
            }
            // Filter by event type
            if (historyEventFilter !== 'all' &&
                item.eventType !== historyEventFilter) {
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
    var handleBulkUpdateChange = function (itemId, field, value) {
        if (field === 'consumed' || field === 'received') {
            var numValue_1 = parseInt(value) || 0;
            setBulkUpdateData(function (prev) {
                var _a, _b;
                return (__assign(__assign({}, prev), (_a = {}, _a[itemId] = __assign(__assign({}, prev[itemId]), (_b = {}, _b[field] = numValue_1, _b)), _a)));
            });
        }
        else {
            setBulkUpdateData(function (prev) {
                var _a, _b;
                return (__assign(__assign({}, prev), (_a = {}, _a[itemId] = __assign(__assign({}, prev[itemId]), (_b = {}, _b[field] = value, _b)), _a)));
            });
        }
    };
    var openBulkUpdateModal = function () {
        setIsBulkUpdateModalOpen(true);
        var initialData = {};
        filteredItems.forEach(function (item) {
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
    var saveBulkUpdates = function () { return __awaiter(void 0, void 0, void 0, function () {
        var updatedCount, skippedCount, failedCount, updatedItems, _loop_1, _i, items_1, item;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    updatedCount = 0;
                    skippedCount = 0;
                    failedCount = 0;
                    updatedItems = __spreadArray([], items, true);
                    _loop_1 = function (item) {
                        var updateData, consumed, received, newRob, itemIndex, error_1;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    updateData = bulkUpdateData[item.id];
                                    if (!updateData)
                                        return [2 /*return*/, "continue"];
                                    consumed = updateData.consumed || 0;
                                    received = updateData.received || 0;
                                    if (consumed === 0 && received === 0) {
                                        skippedCount++;
                                        return [2 /*return*/, "continue"];
                                    }
                                    newRob = item.rob - consumed + received;
                                    // Validate
                                    if (newRob < 0) {
                                        failedCount++;
                                        return [2 /*return*/, "continue"];
                                    }
                                    if (received > 0 && !dateReceived) {
                                        failedCount++;
                                        return [2 /*return*/, "continue"];
                                    }
                                    _b.label = 1;
                                case 1:
                                    _b.trys.push([1, 6, , 7]);
                                    if (!(consumed > 0)) return [3 /*break*/, 3];
                                    return [4 /*yield*/, createTransactionMutation.mutateAsync({
                                            itemCode: item.itemCode,
                                            itemName: item.itemName,
                                            unit: item.uom,
                                            eventType: 'CONSUME',
                                            quantity: -consumed,
                                            robAfter: item.rob - consumed,
                                            place: '',
                                            dateLocal: new Date().toISOString().split('T')[0],
                                            tz: 'UTC',
                                            remarks: updateData.comments,
                                        })];
                                case 2:
                                    _b.sent();
                                    _b.label = 3;
                                case 3:
                                    if (!(received > 0)) return [3 /*break*/, 5];
                                    return [4 /*yield*/, createTransactionMutation.mutateAsync({
                                            itemCode: item.itemCode,
                                            itemName: item.itemName,
                                            unit: item.uom,
                                            eventType: 'RECEIVE',
                                            quantity: received,
                                            robAfter: newRob,
                                            place: placeReceived,
                                            dateLocal: dateReceived,
                                            tz: 'UTC',
                                            remarks: updateData.comments,
                                        })];
                                case 4:
                                    _b.sent();
                                    _b.label = 5;
                                case 5:
                                    // Add history entries for local display
                                    if (consumed > 0) {
                                        addToHistory(item, 'CONSUME', -consumed, newRob, '', '', updateData.comments);
                                    }
                                    if (received > 0) {
                                        addToHistory(item, 'RECEIVE', received, newRob, placeReceived, '', updateData.comments);
                                    }
                                    itemIndex = updatedItems.findIndex(function (i) { return i.id === item.id; });
                                    if (itemIndex >= 0) {
                                        updatedItems[itemIndex] = __assign(__assign({}, item), { rob: newRob });
                                    }
                                    updatedCount++;
                                    return [3 /*break*/, 7];
                                case 6:
                                    error_1 = _b.sent();
                                    console.error('Failed to save transaction:', error_1);
                                    failedCount++;
                                    return [3 /*break*/, 7];
                                case 7: return [2 /*return*/];
                            }
                        });
                    };
                    _i = 0, items_1 = items;
                    _a.label = 1;
                case 1:
                    if (!(_i < items_1.length)) return [3 /*break*/, 4];
                    item = items_1[_i];
                    return [5 /*yield**/, _loop_1(item)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4:
                    setItems(updatedItems);
                    setIsBulkUpdateModalOpen(false);
                    toast({
                        title: 'Bulk Update Complete',
                        description: "Updated: ".concat(updatedCount, ", Skipped: ").concat(skippedCount, ", Failed: ").concat(failedCount, " - saved to database"),
                    });
                    return [2 /*return*/];
            }
        });
    }); };
    // Handle Edit Item
    var openEditModal = function (item) {
        setEditingItem(item);
        var isCustomUom = !UOM_OPTIONS.includes(item.uom || '');
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
    var saveEditItem = function () { return __awaiter(void 0, void 0, void 0, function () {
        var uom, updatedItems, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!editingItem)
                        return [2 /*return*/];
                    uom = editForm.uom === 'Other' ? editForm.customUom : editForm.uom;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    // Update item in database
                    return [4 /*yield*/, updateItemMutation.mutateAsync({
                            itemCode: editingItem.itemCode,
                            itemName: editForm.itemName,
                            uom: uom,
                            minStock: editForm.min,
                            location: editForm.location,
                            notes: editForm.notes,
                        })];
                case 2:
                    // Update item in database
                    _a.sent();
                    updatedItems = items.map(function (item) {
                        if (item.id === editingItem.id) {
                            var updatedItem = __assign(__assign({}, item), { itemName: editForm.itemName, uom: uom, min: editForm.min, location: editForm.location, notes: editForm.notes });
                            // Recalculate stock status
                            var newStock = calculateStockStatus(item.rob, editForm.min);
                            // Add to history if min changed
                            if (item.min !== editForm.min) {
                                addToHistory(updatedItem, 'EDIT', 0, item.rob, '', '', "Min changed from ".concat(item.min, " to ").concat(editForm.min));
                            }
                            return __assign(__assign({}, updatedItem), { stock: newStock });
                        }
                        return item;
                    });
                    setItems(updatedItems);
                    setIsEditModalOpen(false);
                    toast({
                        title: 'Success',
                        description: 'Item updated successfully - saved to database',
                    });
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _a.sent();
                    console.error('Failed to update item:', error_2);
                    toast({
                        title: 'Error',
                        description: 'Failed to update item in database',
                        variant: 'destructive',
                    });
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    // Handle Receive
    var openReceiveModal = function (item) {
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
    var saveReceive = function () { return __awaiter(void 0, void 0, void 0, function () {
        var quantity, newRob, updatedItems, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!receivingItem)
                        return [2 /*return*/];
                    quantity = parseInt(receiveForm.quantity);
                    if (!quantity || quantity < 1) {
                        toast({
                            title: 'Error',
                            description: 'Quantity must be at least 1',
                            variant: 'destructive',
                        });
                        return [2 /*return*/];
                    }
                    if (!receiveForm.dateLocal) {
                        toast({
                            title: 'Error',
                            description: 'Date is required',
                            variant: 'destructive',
                        });
                        return [2 /*return*/];
                    }
                    newRob = receivingItem.rob + quantity;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    // Create transaction in database
                    return [4 /*yield*/, createTransactionMutation.mutateAsync({
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
                            remarks: receiveForm.remarks,
                        })];
                case 2:
                    // Create transaction in database
                    _a.sent();
                    updatedItems = items.map(function (item) {
                        if (item.id === receivingItem.id) {
                            return __assign(__assign({}, item), { rob: newRob });
                        }
                        return item;
                    });
                    // Add to history
                    addToHistory(receivingItem, 'RECEIVE', quantity, newRob, receiveForm.place, receiveForm.supplierPO, receiveForm.remarks);
                    setItems(updatedItems);
                    setIsReceiveModalOpen(false);
                    toast({
                        title: 'Success',
                        description: "Received ".concat(quantity, " ").concat(receivingItem.uom || 'units', " - saved to database"),
                    });
                    return [3 /*break*/, 4];
                case 3:
                    error_3 = _a.sent();
                    toast({
                        title: 'Error',
                        description: 'Failed to save transaction to database',
                        variant: 'destructive',
                    });
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    // Handle Add New Item
    var handleAddNewItem = function () { return __awaiter(void 0, void 0, void 0, function () {
        var initialQty, uom, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!addItemForm.itemCode ||
                        !addItemForm.itemName ||
                        !addItemForm.initialQty) {
                        toast({
                            title: 'Error',
                            description: 'Item code, name, and initial quantity are required',
                            variant: 'destructive',
                        });
                        return [2 /*return*/];
                    }
                    initialQty = parseInt(addItemForm.initialQty);
                    if (isNaN(initialQty) || initialQty < 0) {
                        toast({
                            title: 'Error',
                            description: 'Initial quantity must be a valid number',
                            variant: 'destructive',
                        });
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 5, , 6]);
                    uom = addItemForm.uom === 'Other' ? addItemForm.customUom : addItemForm.uom;
                    // Create initial transaction for new item
                    return [4 /*yield*/, createTransactionMutation.mutateAsync({
                            itemCode: addItemForm.itemCode,
                            itemName: addItemForm.itemName,
                            unit: uom,
                            eventType: 'INITIAL',
                            quantity: initialQty,
                            robAfter: initialQty,
                            place: addItemForm.location,
                            dateLocal: new Date().toISOString().split('T')[0],
                            tz: 'UTC',
                            remarks: "Initial stock - ".concat(addItemForm.notes || 'New item added'),
                        })];
                case 2:
                    // Create initial transaction for new item
                    _a.sent();
                    if (!(addItemForm.minStock !== '1' || addItemForm.notes)) return [3 /*break*/, 4];
                    return [4 /*yield*/, createTransactionMutation.mutateAsync({
                            itemCode: addItemForm.itemCode,
                            itemName: addItemForm.itemName,
                            unit: uom,
                            eventType: 'CATALOG_UPDATE',
                            quantity: 0,
                            robAfter: initialQty,
                            place: addItemForm.location,
                            dateLocal: new Date().toISOString().split('T')[0],
                            tz: 'UTC',
                            remarks: JSON.stringify({
                                minStock: parseInt(addItemForm.minStock),
                                notes: addItemForm.notes,
                                location: addItemForm.location,
                                updatedAt: new Date().toISOString(),
                            }),
                        })];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4:
                    // Reset form and close modal
                    setAddItemForm({
                        itemCode: '',
                        itemName: '',
                        uom: 'pcs',
                        customUom: '',
                        initialQty: '',
                        minStock: '1',
                        location: 'Store Room',
                        notes: '',
                    });
                    setIsAddItemModalOpen(false);
                    toast({
                        title: 'Success',
                        description: "Added new item: ".concat(addItemForm.itemName, " - saved to database"),
                    });
                    return [3 /*break*/, 6];
                case 5:
                    error_4 = _a.sent();
                    toast({
                        title: 'Error',
                        description: 'Failed to add new item to database',
                        variant: 'destructive',
                    });
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    // Handle Quick Consume
    var handleQuickConsume = function (item, quantity) { return __awaiter(void 0, void 0, void 0, function () {
        var newRob_1, updatedItems, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (quantity <= 0) {
                        toast({
                            title: 'Error',
                            description: 'Quantity must be greater than 0',
                            variant: 'destructive',
                        });
                        return [2 /*return*/];
                    }
                    if (quantity > item.rob) {
                        toast({
                            title: 'Error',
                            description: 'Insufficient stock available',
                            variant: 'destructive',
                        });
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    newRob_1 = item.rob - quantity;
                    // Create consume transaction in database
                    return [4 /*yield*/, createTransactionMutation.mutateAsync({
                            itemCode: item.itemCode,
                            itemName: item.itemName,
                            unit: item.uom,
                            eventType: 'CONSUME',
                            quantity: -quantity,
                            robAfter: newRob_1,
                            place: '',
                            dateLocal: new Date().toISOString().split('T')[0],
                            tz: 'UTC',
                            remarks: "Quick consume: ".concat(quantity, " ").concat(item.uom || 'units'),
                        })];
                case 2:
                    // Create consume transaction in database
                    _a.sent();
                    updatedItems = items.map(function (i) {
                        return i.id === item.id ? __assign(__assign({}, i), { rob: newRob_1 }) : i;
                    });
                    // Add to history
                    addToHistory(item, 'CONSUME', -quantity, newRob_1, '', '', "Quick consume: ".concat(quantity, " ").concat(item.uom || 'units'));
                    setItems(updatedItems);
                    toast({
                        title: 'Success',
                        description: "Consumed ".concat(quantity, " ").concat(item.uom || 'units', " of ").concat(item.itemName, " - saved to database"),
                    });
                    return [3 /*break*/, 4];
                case 3:
                    error_5 = _a.sent();
                    toast({
                        title: 'Error',
                        description: 'Failed to save consume transaction to database',
                        variant: 'destructive',
                    });
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    // Handle Archive
    var handleArchive = function (item) {
        var confirmMessage = item.rob > 0
            ? "This item has stock on hand (ROB = ".concat(item.rob, "). Archive anyway?")
            : "Archive ".concat(item.itemName, "?");
        if (confirm(confirmMessage)) {
            var updatedItems = items.map(function (i) {
                return i.id === item.id ? __assign(__assign({}, i), { isArchived: true }) : i;
            });
            // Add to history
            addToHistory(item, 'ARCHIVE', 0, item.rob, '', '', 'Item archived');
            setItems(updatedItems);
            toast({ title: 'Success', description: 'Item archived' });
        }
    };
    return (<div className='flex-1 p-6 bg-gray-50 min-h-screen'>
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
        <div className='flex gap-2'>
          <Button className='bg-blue-600 hover:bg-blue-700 text-white' onClick={function () { return setIsAddItemModalOpen(true); }}>
            + Add New Item
          </Button>
          <Button className='bg-[#52baf3] hover:bg-[#40a8e0] text-white' onClick={openBulkUpdateModal}>
            + Bulk Update{' '}
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className='flex gap-1 mb-6'>
        <button onClick={function () { return setActiveTab('stores'); }} className={"px-6 py-2 rounded-t text-sm font-medium ".concat(activeTab === 'stores'
            ? 'bg-[#52baf3] text-white'
            : 'bg-gray-200 text-gray-600 hover:bg-gray-300')}>
          Stores
        </button>
        <button onClick={function () { return setActiveTab('lubes'); }} className={"px-6 py-2 rounded-t text-sm font-medium ".concat(activeTab === 'lubes'
            ? 'bg-[#52baf3] text-white'
            : 'bg-gray-200 text-gray-600 hover:bg-gray-300')}>
          Lubes
        </button>
        <button onClick={function () { return setActiveTab('chemicals'); }} className={"px-6 py-2 rounded-t text-sm font-medium ".concat(activeTab === 'chemicals'
            ? 'bg-[#52baf3] text-white'
            : 'bg-gray-200 text-gray-600 hover:bg-gray-300')}>
          Chemicals
        </button>
        <button onClick={function () { return setActiveTab('others'); }} className={"px-6 py-2 rounded-t text-sm font-medium ".concat(activeTab === 'others'
            ? 'bg-[#52baf3] text-white'
            : 'bg-gray-200 text-gray-600 hover:bg-gray-300')}>
          Others
        </button>
      </div>

      {/* View Mode Tabs */}
      <div className='flex gap-2 mb-4'>
        <Button variant={viewMode === 'inventory' ? 'default' : 'outline'} onClick={function () { return setViewMode('inventory'); }} className='text-sm'>
          Inventory
        </Button>
        <Button variant={viewMode === 'history' ? 'default' : 'outline'} onClick={function () { return setViewMode('history'); }} className='text-sm'>
          History
        </Button>
      </div>

      {/* Filters - Show different filters based on view mode */}
      {viewMode === 'inventory' ? (<div className='flex gap-4 mb-6'>
          <div className='flex-1'>
            <Input placeholder='Vessel' value={vesselFilter} onChange={function (e) { return setVesselFilter(e.target.value); }} className='text-sm'/>
          </div>
          <div className='flex-1 relative'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400'/>
            <Input placeholder='Search' value={searchTerm} onChange={function (e) { return setSearchTerm(e.target.value); }} className='pl-10 text-sm'/>
          </div>
          <div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className='w-40 text-sm'>
                <SelectValue placeholder='All Categories'/>
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
                <SelectValue placeholder='Stock'/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All</SelectItem>
                <SelectItem value='OK'>OK</SelectItem>
                <SelectItem value='Low'>Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button variant='ghost' size='sm' className='text-blue-600' onClick={exportInventoryToExcel}>
            <FileSpreadsheet className='h-4 w-4 mr-1'/>
            Export
          </Button>
          <Button variant='ghost' size='sm' className='text-gray-600' onClick={function () {
                setSearchTerm('');
                setCategoryFilter('all');
                setStockFilter('all');
                setVesselFilter('');
            }}>
            Clear
          </Button>
        </div>) : (
        /* History Filters */
        <div className='flex gap-4 mb-6'>
          <div className='flex-1 relative'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400'/>
            <Input placeholder='Search history...' value={historySearch} onChange={function (e) { return setHistorySearch(e.target.value); }} className='pl-10 text-sm'/>
          </div>
          <div>
            <Select value={historyEventFilter} onValueChange={setHistoryEventFilter}>
              <SelectTrigger className='w-40 text-sm'>
                <SelectValue placeholder='All Events'/>
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
            <Input type='date' value={historyDateFrom} onChange={function (e) { return setHistoryDateFrom(e.target.value); }} className='text-sm' placeholder='From'/>
            <span className='text-gray-500'>to</span>
            <Input type='date' value={historyDateTo} onChange={function (e) { return setHistoryDateTo(e.target.value); }} className='text-sm' placeholder='To'/>
          </div>
          <Button variant='ghost' size='sm' className='text-blue-600' onClick={exportHistoryToExcel}>
            <FileSpreadsheet className='h-4 w-4 mr-1'/>
            Export
          </Button>
        </div>)}

      {/* Table */}
      {viewMode === 'inventory' ? (<div className='bg-white rounded-lg'>
          <AgGridTable rowData={filteredItems} columnDefs={columnDefs} onGridReady={onGridReady} context={gridContext} height='calc(100vh - 280px)' enableExport={true} enableSideBar={true} enableStatusBar={true} pagination={true} paginationPageSize={50} animateRows={true} suppressRowClickSelection={true} className='rounded-lg shadow-sm'/>
        </div>) : (
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
            {filteredHistoryItems.length === 0 ? (<div className='p-8 text-center text-gray-500'>
                No history entries found. Actions like Receive, Consume, and
                Archive will appear here.
              </div>) : (filteredHistoryItems.map(function (item) { return (<div key={item.id} className='p-4 hover:bg-gray-50'>
                  <div className='grid grid-cols-12 gap-4 items-center text-sm'>
                    <div className='col-span-2 text-gray-700'>
                      {item.dateLocal}
                    </div>
                    <div className='col-span-1'>
                      <span className={"px-2 py-1 rounded text-xs font-medium ".concat(item.eventType === 'RECEIVE'
                    ? 'bg-green-100 text-green-800'
                    : item.eventType === 'CONSUME'
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-gray-100 text-gray-800')}>
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
                      <span className={item.qtyChange > 0
                    ? 'text-green-600'
                    : 'text-orange-600'}>
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
                    <div className='col-span-1 text-gray-600 truncate' title={item.remarks || item.ref}>
                      {item.remarks || item.ref || '-'}
                    </div>
                  </div>
                </div>); }))}
          </div>
        </div>)}

      {/* Edit Item Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>Edit Item</DialogTitle>
          </DialogHeader>
          <div className='grid gap-4 py-4'>
            <div className='grid gap-2'>
              <Label htmlFor='itemName'>Item Name</Label>
              <Input id='itemName' value={editForm.itemName} onChange={function (e) {
            return setEditForm(__assign(__assign({}, editForm), { itemName: e.target.value }));
        }}/>
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='uom'>Unit of Measure</Label>
              <Select value={editForm.uom} onValueChange={function (value) {
            return setEditForm(__assign(__assign({}, editForm), { uom: value }));
        }}>
                <SelectTrigger>
                  <SelectValue placeholder='Select UOM'/>
                </SelectTrigger>
                <SelectContent>
                  {UOM_OPTIONS.map(function (opt) { return (<SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>); })}
                </SelectContent>
              </Select>
              {editForm.uom === 'Other' && (<Input placeholder='Enter custom UOM' value={editForm.customUom} onChange={function (e) {
                return setEditForm(__assign(__assign({}, editForm), { customUom: e.target.value }));
            }}/>)}
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='min'>Minimum Stock</Label>
              <Input id='min' type='number' min='0' value={editForm.min} onChange={function (e) {
            return setEditForm(__assign(__assign({}, editForm), { min: parseInt(e.target.value) || 0 }));
        }}/>
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='location'>Location</Label>
              <Input id='location' value={editForm.location} onChange={function (e) {
            return setEditForm(__assign(__assign({}, editForm), { location: e.target.value }));
        }}/>
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='notes'>Notes</Label>
              <Textarea id='notes' value={editForm.notes} onChange={function (e) {
            return setEditForm(__assign(__assign({}, editForm), { notes: e.target.value }));
        }} rows={3}/>
            </div>
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={function () { return setIsEditModalOpen(false); }}>
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
            <DialogTitle>Receive {receivingItem === null || receivingItem === void 0 ? void 0 : receivingItem.itemName}</DialogTitle>
          </DialogHeader>
          <div className='grid gap-4 py-4'>
            <div className='grid gap-2'>
              <Label htmlFor='quantity'>
                Quantity to Receive ({(receivingItem === null || receivingItem === void 0 ? void 0 : receivingItem.uom) || 'units'})
              </Label>
              <Input id='quantity' type='number' min='1' value={receiveForm.quantity} onChange={function (e) {
            return setReceiveForm(__assign(__assign({}, receiveForm), { quantity: e.target.value }));
        }}/>
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='dateLocal'>Date Received</Label>
              <Input id='dateLocal' type='date' value={receiveForm.dateLocal} onChange={function (e) {
            return setReceiveForm(__assign(__assign({}, receiveForm), { dateLocal: e.target.value }));
        }}/>
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='place'>Place/Port</Label>
              <Input id='place' value={receiveForm.place} onChange={function (e) {
            return setReceiveForm(__assign(__assign({}, receiveForm), { place: e.target.value }));
        }}/>
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='supplierPO'>Supplier/PO#</Label>
              <Input id='supplierPO' value={receiveForm.supplierPO} onChange={function (e) {
            return setReceiveForm(__assign(__assign({}, receiveForm), { supplierPO: e.target.value }));
        }}/>
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='remarks'>Remarks</Label>
              <Textarea id='remarks' value={receiveForm.remarks} onChange={function (e) {
            return setReceiveForm(__assign(__assign({}, receiveForm), { remarks: e.target.value }));
        }} rows={3}/>
            </div>
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={function () { return setIsReceiveModalOpen(false); }}>
              Cancel
            </Button>
            <Button onClick={saveReceive}>Receive</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Update Stores Modal */}
      {isBulkUpdateModalOpen && (<div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg shadow-lg w-[95%] max-w-7xl max-h-[90vh] overflow-auto'>
            {/* Modal Header */}
            <div className='flex justify-between items-center p-4 border-b'>
              <h2 className='text-xl font-semibold text-gray-800'>
                Bulk Update{' '}
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
              </h2>
              <Button variant='ghost' size='sm' onClick={function () { return setIsBulkUpdateModalOpen(false); }} className='h-8 w-8 p-0'>
                <X className='h-4 w-4'/>
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
                  <Input placeholder='Enter place received' value={placeReceived} onChange={function (e) { return setPlaceReceived(e.target.value); }} className='text-sm'/>
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Date
                  </label>
                  <div className='relative'>
                    <Input type='date' value={dateReceived} onChange={function (e) { return setDateReceived(e.target.value); }} className='text-sm pr-10'/>
                    <Calendar className='absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none'/>
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
                {filteredItems.map(function (item) {
                var _a, _b, _c, _d;
                var consumed = ((_a = bulkUpdateData[item.id]) === null || _a === void 0 ? void 0 : _a.consumed) || 0;
                var received = ((_b = bulkUpdateData[item.id]) === null || _b === void 0 ? void 0 : _b.received) || 0;
                var newRob = item.rob - consumed + received;
                var hasError = newRob < 0 ||
                    (received > 0 && !((_c = bulkUpdateData[item.id]) === null || _c === void 0 ? void 0 : _c.receivedDate));
                return (<div key={item.id} className={"grid grid-cols-9 gap-3 p-3 border-b ".concat(hasError ? 'bg-red-50' : 'bg-white', " items-center")}>
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
                        <Input type='number' min='0' max={item.rob} className={"text-sm h-8 ".concat(newRob < 0 ? 'border-red-500' : '')} placeholder='0' value={consumed || ''} onChange={function (e) {
                        return handleBulkUpdateChange(item.id, 'consumed', e.target.value);
                    }}/>
                      </div>
                      <div>
                        <Input type='number' min='0' className='text-sm h-8' placeholder='0' value={received || ''} onChange={function (e) {
                        return handleBulkUpdateChange(item.id, 'received', e.target.value);
                    }}/>
                      </div>
                      <div className={"text-sm font-medium ".concat(newRob < 0 ? 'text-red-600' : newRob < item.min ? 'text-yellow-600' : 'text-gray-900')}>
                        {newRob}
                        {newRob < 0 && (<div className='text-xs'>Insufficient stock</div>)}
                      </div>
                      <div>
                        <Input type='text' className='text-sm h-8' placeholder='Comments' value={((_d = bulkUpdateData[item.id]) === null || _d === void 0 ? void 0 : _d.comments) || ''} onChange={function (e) {
                        return handleBulkUpdateChange(item.id, 'comments', e.target.value);
                    }}/>
                      </div>
                    </div>);
            })}
              </div>
            </div>

            {/* Modal Footer */}
            <div className='flex justify-end gap-3 p-4 border-t bg-gray-50'>
              <Button variant='outline' onClick={function () { return setIsBulkUpdateModalOpen(false); }}>
                Cancel
              </Button>
              <Button className='bg-green-600 hover:bg-green-700 text-white' onClick={saveBulkUpdates}>
                Save Updates
              </Button>
            </div>
          </div>
        </div>)}
    </div>);
};
export default Stores;
//# sourceMappingURL=Stores.jsx.map