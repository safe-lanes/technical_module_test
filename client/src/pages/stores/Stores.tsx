import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Edit, Clock, Trash2, FileSpreadsheet } from "lucide-react";

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
  }
];

const Stores: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"stores" | "lubes" | "chemicals" | "others">("stores");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [stockFilter, setStockFilter] = useState("");
  const [vesselFilter, setVesselFilter] = useState("");

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

  return (
    <div className="flex-1 p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Stores Inventory</h1>
        <Button className="bg-[#52baf3] hover:bg-[#40a8e0] text-white">
          + Bulk Update Stores
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
            <div className="col-span-2">Item Code</div>
            <div className="col-span-2">Item Name</div>
            <div className="col-span-3">Stores Category</div>
            <div className="col-span-1">ROB</div>
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
    </div>
  );
};

export default Stores;