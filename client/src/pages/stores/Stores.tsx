import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Edit, Clock, Trash2, FileSpreadsheet, X, MessageSquare, Calendar } from "lucide-react";

interface StoreItem {
  id: number;
  itemCode: string;
  itemName: string;
  storesCategory: string;
  rob: number;
  min: number;
  stock: string;
  location: string;
  category: "stores" | "lubes" | "chemicals" | "others";
}

const storeItems: StoreItem[] = [
  {
    id: 1,
    itemCode: "ST-TOOL-001",
    itemName: "Torque Wrench",
    storesCategory: "Engine Stores",
    rob: 2,
    min: 1,
    stock: "OK",
    location: "Store Room A",
    category: "stores"
  },
  {
    id: 2,
    itemCode: "ST-CONS-001",
    itemName: "Cotton rags",
    storesCategory: "Main Engine / Deck General",
    rob: 2,
    min: 1,
    stock: "",
    location: "Store Room B",
    category: "stores"
  },
  {
    id: 3,
    itemCode: "ST-SEAL-001",
    itemName: "O-Ring Set",
    storesCategory: "Pumps & Valves",
    rob: 3,
    min: 1,
    stock: "",
    location: "Store Room B",
    category: "stores"
  },
  {
    id: 4,
    itemCode: "ST-SAFE-001",
    itemName: "Safety Goggles",
    storesCategory: "PPE / All Sections",
    rob: 4,
    min: 2,
    stock: "",
    location: "Safety Locker",
    category: "stores"
  },
  {
    id: 5,
    itemCode: "ST-TOOL-002",
    itemName: "Teflon Gasket",
    storesCategory: "General Tools",
    rob: 4,
    min: 2,
    stock: "",
    location: "Store Room D",
    category: "stores"
  },
  {
    id: 6,
    itemCode: "SP-ME-001",
    itemName: "GP gasket",
    storesCategory: "General Tools",
    rob: 1,
    min: 2,
    stock: "Low",
    location: "Store Room A",
    category: "stores"
  },
  {
    id: 7,
    itemCode: "ST-CONS-002",
    itemName: "Industrial Wipers",
    storesCategory: "General Tools",
    rob: 2,
    min: 1,
    stock: "",
    location: "Store Room B",
    category: "stores"
  },
  {
    id: 8,
    itemCode: "ST-BOLT-001",
    itemName: "Hex Bolt Kit M6-M20",
    storesCategory: "General Machinery",
    rob: 2,
    min: 1,
    stock: "",
    location: "Store Room B",
    category: "stores"
  },
  {
    id: 9,
    itemCode: "ST-GASKET-001",
    itemName: "Gasket Sheet Material",
    storesCategory: "General Machinery",
    rob: 3,
    min: 1,
    stock: "",
    location: "Store Room C",
    category: "stores"
  },
  {
    id: 10,
    itemCode: "SP-COOL-001",
    itemName: "Gasket Sheet Material",
    storesCategory: "General Machinery",
    rob: 4,
    min: 2,
    stock: "",
    location: "Store Room D",
    category: "stores"
  },
  {
    id: 11,
    itemCode: "ST-SAFE-002",
    itemName: "Safety Shoes",
    storesCategory: "PPE / All Sections",
    rob: 5,
    min: 2,
    stock: "",
    location: "Safety Locker",
    category: "stores"
  },
  {
    id: 12,
    itemCode: "ST-PAINT-001",
    itemName: "Zinc Primer Paint",
    storesCategory: "Deck Maintenance",
    rob: 2,
    min: 10,
    stock: "Low",
    location: "Paint Locker",
    category: "stores"
  },
  // Lubes data
  {
    id: 13,
    itemCode: "SAE 70 EN",
    itemName: "Cylinder Oil",
    storesCategory: "Main Engine",
    rob: 500,
    min: 1,
    stock: "OK",
    location: "Lube Tank A",
    category: "lubes"
  },
  {
    id: 14,
    itemCode: "SAE 30",
    itemName: "System Oil",
    storesCategory: "DG #1",
    rob: 300,
    min: 1,
    stock: "",
    location: "Lube Tank B",
    category: "lubes"
  },
  {
    id: 15,
    itemCode: "ISO VG 68",
    itemName: "Hydraulic Oil",
    storesCategory: "Steering Gear",
    rob: 200,
    min: 1,
    stock: "",
    location: "Steering Flat",
    category: "lubes"
  },
  {
    id: 16,
    itemCode: "EP 320",
    itemName: "Gear Oil",
    storesCategory: "Crane Gearbox",
    rob: 80,
    min: 2,
    stock: "",
    location: "Deck Lube Store",
    category: "lubes"
  },
  {
    id: 17,
    itemCode: "ISO VG 100",
    itemName: "Compressor Oil",
    storesCategory: "Air Compressor #2",
    rob: 60,
    min: 2,
    stock: "",
    location: "ECR Store",
    category: "lubes"
  },
  {
    id: 18,
    itemCode: "Synthetic",
    itemName: "Stabilizer Oil",
    storesCategory: "Fin Stabilizer",
    rob: 50,
    min: 2,
    stock: "Low",
    location: "AFT Equipment",
    category: "lubes"
  },
  {
    id: 19,
    itemCode: "ISO 220",
    itemName: "Winch Oil",
    storesCategory: "Mooring Winch",
    rob: 70,
    min: 1,
    stock: "",
    location: "Deck Store",
    category: "lubes"
  },
  {
    id: 20,
    itemCode: "ISO 32",
    itemName: "RO Pump Oil",
    storesCategory: "RO High Pressure Pump",
    rob: 10,
    min: 1,
    stock: "",
    location: "RO Area Locker",
    category: "lubes"
  },
  {
    id: 21,
    itemCode: "VG 46",
    itemName: "CPP Hydraulic Oil",
    storesCategory: "Propeller System",
    rob: 150,
    min: 1,
    stock: "",
    location: "Stern Room",
    category: "lubes"
  },
  {
    id: 22,
    itemCode: "SAE 30",
    itemName: "Emergency DG Oil",
    storesCategory: "Emergency Generator",
    rob: 4,
    min: 2,
    stock: "",
    location: "ECR Tank",
    category: "lubes"
  },
  {
    id: 23,
    itemCode: "SAE 30",
    itemName: "Emergency DG Oil",
    storesCategory: "Emergency Generator",
    rob: 6,
    min: 2,
    stock: "",
    location: "ECR Tank",
    category: "lubes"
  },
  {
    id: 24,
    itemCode: "SAE 30",
    itemName: "Emergency DG Oil",
    storesCategory: "Emergency Generator",
    rob: 2,
    min: 10,
    stock: "Low",
    location: "ECR Tank",
    category: "lubes"
  },
  // Chemicals data
  {
    id: 25,
    itemCode: "CHM-ALK-001",
    itemName: "Alkaline Cleaner",
    storesCategory: "Engine Bilge Cleaning",
    rob: 2,
    min: 1,
    stock: "OK",
    location: "Chem Locker",
    category: "chemicals"
  },
  {
    id: 26,
    itemCode: "CHM-WTP-001",
    itemName: "Boiler Water Test",
    storesCategory: "Boiler Feed Water",
    rob: 2,
    min: 1,
    stock: "",
    location: "Chem Locker",
    category: "chemicals"
  },
  {
    id: 27,
    itemCode: "CHM-WTP-002",
    itemName: "RO Antiscalant",
    storesCategory: "RO Plant",
    rob: 3,
    min: 1,
    stock: "",
    location: "Chem Locker",
    category: "chemicals"
  },
  {
    id: 28,
    itemCode: "CHM-TEST-001",
    itemName: "RO Antiscalant",
    storesCategory: "RO Plant",
    rob: 4,
    min: 2,
    stock: "",
    location: "Chem Locker",
    category: "chemicals"
  },
  {
    id: 29,
    itemCode: "CHM-WTP-002",
    itemName: "RO Antiscalant",
    storesCategory: "RO Plant",
    rob: 4,
    min: 2,
    stock: "",
    location: "Chem Locker",
    category: "chemicals"
  },
  {
    id: 30,
    itemCode: "CHM-FW-001",
    itemName: "Fresh Water Biocide",
    storesCategory: "Domestic Water Tank",
    rob: 1,
    min: 2,
    stock: "Low",
    location: "Chem Locker",
    category: "chemicals"
  },
  {
    id: 31,
    itemCode: "CHM-CWT-001",
    itemName: "Fresh Water Biocide",
    storesCategory: "Domestic Water Tank",
    rob: 2,
    min: 1,
    stock: "",
    location: "Chem Locker",
    category: "chemicals"
  },
  {
    id: 32,
    itemCode: "CHM-SAN-001",
    itemName: "Sanitizer 70% IPA",
    storesCategory: "Galley & Food Area",
    rob: 2,
    min: 1,
    stock: "",
    location: "Chem Locker",
    category: "chemicals"
  },
  {
    id: 33,
    itemCode: "CHM-FW-001",
    itemName: "Fresh Water Biocide",
    storesCategory: "Domestic Water Tank",
    rob: 3,
    min: 1,
    stock: "",
    location: "Chem Locker",
    category: "chemicals"
  },
  {
    id: 34,
    itemCode: "CHM-TANKCL-01",
    itemName: "Descaling Agent",
    storesCategory: "Aux Boiler & PHEs",
    rob: 4,
    min: 2,
    stock: "",
    location: "Chem Locker",
    category: "chemicals"
  },
  {
    id: 35,
    itemCode: "CHM-TANKCL-01",
    itemName: "Descaling Agent",
    storesCategory: "Aux Boiler & PHEs",
    rob: 6,
    min: 2,
    stock: "",
    location: "Chem Locker",
    category: "chemicals"
  },
  {
    id: 36,
    itemCode: "CHM-TANKCL-01",
    itemName: "Descaling Agent",
    storesCategory: "Aux Boiler & PHEs",
    rob: 2,
    min: 10,
    stock: "Low",
    location: "Chem Locker",
    category: "chemicals"
  }
];

const Stores: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"stores" | "lubes" | "chemicals" | "others">("stores");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [stockFilter, setStockFilter] = useState("");
  const [vesselFilter, setVesselFilter] = useState("");
  const [isBulkUpdateModalOpen, setIsBulkUpdateModalOpen] = useState(false);
  const [bulkUpdateData, setBulkUpdateData] = useState<{[key: number]: {consumed: number, received: number}}>({});
  const [placeReceived, setPlaceReceived] = useState("");
  const [dateReceived, setDateReceived] = useState("");

  const filteredItems = useMemo(() => {
    return storeItems.filter(item => {
      const matchesTab = item.category === activeTab;
      const matchesSearch = item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.itemCode.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !categoryFilter || categoryFilter === "all" || item.storesCategory.includes(categoryFilter);
      const matchesStock = !stockFilter || stockFilter === "all" || item.stock.toLowerCase() === stockFilter.toLowerCase();
      
      return matchesTab && matchesSearch && matchesCategory && matchesStock;
    });
  }, [activeTab, searchTerm, categoryFilter, stockFilter]);

  const getStockColor = (stock: string, rob: number, min: number) => {
    if (stock === "Low" || rob < min) return "bg-red-100 text-red-800";
    if (stock === "OK") return "bg-green-100 text-green-800";
    return "";
  };

  const handleBulkUpdateChange = (itemId: number, field: 'consumed' | 'received', value: string) => {
    const numValue = parseInt(value) || 0;
    setBulkUpdateData(prev => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        [field]: numValue
      }
    }));
  };

  const openBulkUpdateModal = () => {
    setIsBulkUpdateModalOpen(true);
    setBulkUpdateData({});
    setPlaceReceived("");
    setDateReceived("");
  };

  const saveBulkUpdates = () => {
    console.log("Bulk updates saved:", bulkUpdateData);
    console.log("Place received:", placeReceived);
    console.log("Date received:", dateReceived);
    setIsBulkUpdateModalOpen(false);
  };

  return (
    <div className="flex-1 p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          {activeTab === "stores" ? "Stores Inventory" : 
           activeTab === "lubes" ? "Lubes Inventory" :
           activeTab === "chemicals" ? "Chemicals Inventory" : "Others Inventory"}
        </h1>
        <Button className="bg-[#52baf3] hover:bg-[#40a8e0] text-white" onClick={openBulkUpdateModal}>
          + Bulk Update {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6">
        <button
          onClick={() => setActiveTab("stores")}
          className={`px-6 py-2 rounded-t text-sm font-medium ${
            activeTab === "stores"
              ? "bg-[#52baf3] text-white"
              : "bg-gray-200 text-gray-600 hover:bg-gray-300"
          }`}
        >
          Stores
        </button>
        <button
          onClick={() => setActiveTab("lubes")}
          className={`px-6 py-2 rounded-t text-sm font-medium ${
            activeTab === "lubes"
              ? "bg-[#52baf3] text-white"
              : "bg-gray-200 text-gray-600 hover:bg-gray-300"
          }`}
        >
          Lubes
        </button>
        <button
          onClick={() => setActiveTab("chemicals")}
          className={`px-6 py-2 rounded-t text-sm font-medium ${
            activeTab === "chemicals"
              ? "bg-[#52baf3] text-white"
              : "bg-gray-200 text-gray-600 hover:bg-gray-300"
          }`}
        >
          Chemicals
        </button>
        <button
          onClick={() => setActiveTab("others")}
          className={`px-6 py-2 rounded-t text-sm font-medium ${
            activeTab === "others"
              ? "bg-[#52baf3] text-white"
              : "bg-gray-200 text-gray-600 hover:bg-gray-300"
          }`}
        >
          Others
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <Input
            placeholder="Vessel"
            value={vesselFilter}
            onChange={(e) => setVesselFilter(e.target.value)}
            className="text-sm"
          />
        </div>
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 text-sm"
          />
        </div>
        <div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-40 text-sm">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Engine">Engine Stores</SelectItem>
              <SelectItem value="General">General Tools</SelectItem>
              <SelectItem value="PPE">PPE / All Sections</SelectItem>
              <SelectItem value="Machinery">General Machinery</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Select value={stockFilter} onValueChange={setStockFilter}>
            <SelectTrigger className="w-32 text-sm">
              <SelectValue placeholder="Stock" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="OK">OK</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button variant="ghost" size="sm" className="text-blue-600">
          <FileSpreadsheet className="h-4 w-4 mr-1" />
        </Button>
        <Button variant="ghost" size="sm" className="text-gray-600">
          Clear
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Table Header */}
        <div className="bg-[#52baf3] text-white p-4">
          <div className="grid grid-cols-12 gap-4 items-center text-sm font-medium">
            <div className="col-span-2">
              {activeTab === "lubes" ? "Lube Grade" : 
               activeTab === "chemicals" ? "Chem Code" : "Item Code"}
            </div>
            <div className="col-span-2">
              {activeTab === "lubes" ? "Lube Type" : 
               activeTab === "chemicals" ? "Chemical Name" : "Item Name"}
            </div>
            <div className="col-span-3">
              {activeTab === "lubes" ? "Application" : 
               activeTab === "chemicals" ? "Application Area" : "Stores Category"}
            </div>
            <div className="col-span-1">
              {activeTab === "lubes" || activeTab === "chemicals" ? "ROB (Ltr)" : "ROB"}
            </div>
            <div className="col-span-1">Min</div>
            <div className="col-span-1">Stock</div>
            <div className="col-span-2">Location</div>
          </div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-gray-200">
          {filteredItems.map((item) => (
            <div key={item.id} className="p-4 hover:bg-gray-50">
              <div className="grid grid-cols-12 gap-4 items-center text-sm">
                <div className="col-span-2 font-medium text-gray-900">
                  {item.itemCode}
                </div>
                <div className="col-span-2 text-gray-700">
                  {item.itemName}
                </div>
                <div className="col-span-3 text-gray-600">
                  {item.storesCategory}
                </div>
                <div className="col-span-1 text-gray-700">
                  {item.rob}
                </div>
                <div className="col-span-1 text-gray-700">
                  {item.min}
                </div>
                <div className="col-span-1">
                  {item.stock && (
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStockColor(item.stock, item.rob, item.min)}`}>
                      {item.stock}
                    </span>
                  )}
                </div>
                <div className="col-span-1 text-gray-600">
                  {item.location}
                </div>
                <div className="col-span-1 flex gap-1">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Edit className="h-4 w-4 text-gray-500" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Clock className="h-4 w-4 text-gray-500" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Trash2 className="h-4 w-4 text-gray-500" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bulk Update Stores Modal */}
      {isBulkUpdateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-[95%] max-w-7xl max-h-[90vh] overflow-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-semibold text-gray-800">Bulk Update {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h2>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsBulkUpdateModalOpen(false)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {/* Place Received and Date Fields */}
              <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded border">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Place Received</label>
                  <Input 
                    placeholder="Enter place received" 
                    value={placeReceived}
                    onChange={(e) => setPlaceReceived(e.target.value)}
                    className="text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                  <div className="relative">
                    <Input 
                      type="date" 
                      value={dateReceived}
                      onChange={(e) => setDateReceived(e.target.value)}
                      className="text-sm pr-10"
                    />
                    <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Table Headers */}
              <div className="grid grid-cols-8 gap-3 bg-gray-50 p-3 rounded-t text-sm font-medium text-gray-600 border">
                <div>
                  {activeTab === "lubes" ? "Lube Grade" : 
                   activeTab === "chemicals" ? "Chem Code" : "Item Code"}
                </div>
                <div>
                  {activeTab === "lubes" ? "Lube Type" : 
                   activeTab === "chemicals" ? "Chemical Name" : "Item Name"}
                </div>
                <div>
                  {activeTab === "lubes" ? "Application" : 
                   activeTab === "chemicals" ? "Application Area" : "Category"}
                </div>
                <div>
                  {activeTab === "lubes" || activeTab === "chemicals" ? "ROB (Ltr)" : "ROB"}
                </div>
                <div>Consumed</div>
                <div>Received</div>
                <div>New ROB</div>
                <div>Comments</div>
              </div>

              {/* Table Body */}
              <div className="border border-t-0 rounded-b max-h-[400px] overflow-y-auto">
                {filteredItems.map((item) => {
                  const consumed = bulkUpdateData[item.id]?.consumed || 0;
                  const received = bulkUpdateData[item.id]?.received || 0;
                  const newRob = item.rob - consumed + received;
                  
                  return (
                    <div key={item.id} className="grid grid-cols-8 gap-3 p-3 border-b bg-white items-center">
                      <div className="text-gray-900 text-sm">{item.itemCode}</div>
                      <div className="text-gray-900 text-sm">{item.itemName}</div>
                      <div className="text-gray-700 text-sm">{item.storesCategory}</div>
                      <div className="text-gray-700 text-sm">{item.rob}</div>
                      <div>
                        <Input 
                          type="number" 
                          min="0" 
                          className="text-sm h-8" 
                          placeholder="0"
                          value={consumed || ''}
                          onChange={(e) => handleBulkUpdateChange(item.id, 'consumed', e.target.value)}
                        />
                      </div>
                      <div>
                        <Input 
                          type="number" 
                          min="0" 
                          className="text-sm h-8" 
                          placeholder="0"
                          value={received || ''}
                          onChange={(e) => handleBulkUpdateChange(item.id, 'received', e.target.value)}
                        />
                      </div>
                      <div className={`text-sm font-medium ${newRob < item.min ? 'text-red-600' : 'text-gray-900'}`}>
                        {newRob}
                      </div>
                      <div className="flex justify-center">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0"
                          onClick={() => {
                            const comment = prompt(`Add comment for ${item.itemName}:`);
                            if (comment) {
                              console.log(`Comment for ${item.itemName}: ${comment}`);
                            }
                          }}
                        >
                          <MessageSquare className="h-4 w-4 text-gray-500" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 p-4 border-t bg-gray-50">
              <Button 
                variant="outline" 
                onClick={() => setIsBulkUpdateModalOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                className="bg-green-600 hover:bg-green-700 text-white"
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