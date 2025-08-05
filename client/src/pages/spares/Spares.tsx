import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, ChevronRight, ChevronDown, Edit, Clock, Trash2, Plus, FileSpreadsheet } from "lucide-react";

interface ComponentNode {
  id: string;
  code: string;
  name: string;
  children?: ComponentNode[];
  isExpanded?: boolean;
}

const componentsTree: ComponentNode[] = [
  {
    id: "1",
    code: "1",
    name: "Ship General",
    children: []
  },
  {
    id: "2", 
    code: "2",
    name: "Hull",
    children: []
  },
  {
    id: "3",
    code: "3", 
    name: "Equipment for Cargo",
    children: []
  },
  {
    id: "4",
    code: "4",
    name: "Ship's Equipment",
    children: []
  },
  {
    id: "5",
    code: "5",
    name: "Equipment for Crew & Passengers",
    children: []
  },
  {
    id: "6",
    code: "6",
    name: "Machinery Main Components",
    isExpanded: true,
    children: [
      {
        id: "6.1",
        code: "60",
        name: "Diesel Engines for Propulsion",
        children: [
          {
            id: "6.1.1",
            code: "601",
            name: "Diesel Engines",
            children: [
              {
                id: "6.1.1.1",
                code: "601.001",
                name: "Main Diesel Engines"
              },
              {
                id: "6.1.1.2",
                code: "601.002",
                name: "ME cylinder covers w/ valves"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "7",
    code: "7",
    name: "Systems for Machinery Main Components",
    children: []
  },
  {
    id: "8",
    code: "8",
    name: "Ship Common Systems",
    children: []
  }
];

const sparesData = [
  {
    id: 1,
    partCode: "SP-ME-001",
    partName: "Fuel Injector",
    component: "Main Engine #1 (Wartsila 8L46F)",
    critical: "Yes",
    rob: 2,
    min: 1,
    stock: "OK",
    location: "Store Room A",
    componentId: "6.01.001"
  },
  {
    id: 2,
    partCode: "SP-ME-002",
    partName: "Cylinder Head Gasket",
    component: "Main Engine #1 (Wartsila 8L46F)",
    critical: "No",
    rob: 2,
    min: 1,
    stock: "",
    location: "Store Room B",
    componentId: "6.01.001"
  },
  {
    id: 3,
    partCode: "SP-ME-003",
    partName: "Piston Ring Set",
    component: "Main Engine #1 (Wartsila 8L46F)",
    critical: "No",
    rob: 3,
    min: 1,
    stock: "",
    location: "Store Room B",
    componentId: "6.01.001"
  },
  {
    id: 4,
    partCode: "SP-ME-004",
    partName: "Main Bearing",
    component: "Main Engine Cooling System",
    critical: "No",
    rob: 4,
    min: 2,
    stock: "",
    location: "Store Room C",
    componentId: "6"
  },
  {
    id: 5,
    partCode: "SP-COOL-001",
    partName: "Cooling Pump Seal",
    component: "Main Engine Cooling System",
    critical: "Critical",
    rob: 4,
    min: 2,
    stock: "",
    location: "Store Room D",
    componentId: "6"
  },
  {
    id: 6,
    partCode: "SP-ME-001",
    partName: "Fuel Injector",
    component: "Main Engine #1 (Wartsila 8L46F)",
    critical: "No",
    rob: 1,
    min: 2,
    stock: "Low",
    location: "Store Room A",
    componentId: "6.01.001"
  },
  {
    id: 7,
    partCode: "SP-ME-002",
    partName: "Cylinder Head Gasket",
    component: "Main Engine #1 (Wartsila 8L46F)",
    critical: "No",
    rob: 2,
    min: 1,
    stock: "",
    location: "Store Room B",
    componentId: "6.01.001"
  },
  {
    id: 8,
    partCode: "SP-ME-003",
    partName: "Piston Ring Set",
    component: "Main Engine #1 (Wartsila 8L46F)",
    critical: "No",
    rob: 2,
    min: 1,
    stock: "",
    location: "Store Room B",
    componentId: "6.01.001"
  },
  {
    id: 9,
    partCode: "SP-ME-004",
    partName: "Main Bearing",
    component: "Main Engine #1 (Wartsila 8L46F)",
    critical: "No",
    rob: 3,
    min: 1,
    stock: "",
    location: "Store Room C",
    componentId: "6.01.001"
  },
  {
    id: 10,
    partCode: "SP-COOL-001",
    partName: "Cooling Pump Seal",
    component: "Main Engine Cooling System",
    critical: "No",
    rob: 4,
    min: 2,
    stock: "",
    location: "Store Room D",
    componentId: "6"
  },
  {
    id: 11,
    partCode: "SP-ME-001",
    partName: "Fuel Injector",
    component: "Main Engine #1 (Wartsila 8L46F)",
    critical: "Critical",
    rob: 6,
    min: 2,
    stock: "",
    location: "Store Room A",
    componentId: "6.01.001"
  },
  {
    id: 12,
    partCode: "SP-ME-002",
    partName: "Cylinder Head Gasket",
    component: "Main Engine #1 (Wartsila 8L46F)",
    critical: "No",
    rob: 2,
    min: 10,
    stock: "Low",
    location: "Store Room B",
    componentId: "6.01.001"
  }
];

const Spares: React.FC = () => {
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(["6", "6.1", "6.1.1"]));
  const [searchTerm, setSearchTerm] = useState("");
  const [criticalityFilter, setCriticalityFilter] = useState("All");
  const [stockFilter, setStockFilter] = useState("All");

  const toggleNode = (nodeId: string) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  };

  // Select component from tree
  const selectComponent = (componentId: string) => {
    setSelectedComponentId(componentId);
  };

  // Calculate stock status
  const getStockStatus = (rob: number, min: number): string => {
    if (rob === min) return "Minimum";
    if (rob < min) return "Low";
    if (rob > min) return "OK";
    return "";
  };

  // Filter spares based on all criteria
  const filteredSpares = useMemo(() => {
    let filtered = sparesData;

    // Filter by selected component
    if (selectedComponentId) {
      filtered = filtered.filter(spare => spare.componentId === selectedComponentId);
    }

    // Filter by search term
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(spare => 
        spare.partCode.toLowerCase().includes(search) ||
        spare.partName.toLowerCase().includes(search) ||
        spare.component.toLowerCase().includes(search)
      );
    }

    // Filter by criticality
    if (criticalityFilter !== "All") {
      if (criticalityFilter === "Critical") {
        filtered = filtered.filter(spare => spare.critical === "Critical" || spare.critical === "Yes");
      } else if (criticalityFilter === "Non-Critical") {
        filtered = filtered.filter(spare => spare.critical !== "Critical" && spare.critical !== "Yes");
      }
    }

    // Filter by stock status
    if (stockFilter !== "All") {
      filtered = filtered.filter(spare => {
        const stockStatus = getStockStatus(spare.rob, spare.min);
        return stockStatus === stockFilter;
      });
    }

    return filtered;
  }, [selectedComponentId, searchTerm, criticalityFilter, stockFilter]);

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setCriticalityFilter("All");
    setStockFilter("All");
    setSelectedComponentId(null);
  };

  const renderComponentTree = (nodes: ComponentNode[], level: number = 0) => {
    return nodes.map((node) => {
      const hasChildren = node.children && node.children.length > 0;
      const isExpanded = expandedNodes.has(node.id);
      const isSelected = selectedComponentId === node.id;

      return (
        <div key={node.id}>
          <div
            className={`flex items-center px-3 py-2 cursor-pointer hover:bg-gray-50 border-b border-gray-100 ${
              isSelected ? "bg-[#52baf3] text-white" : ""
            }`}
            style={{ paddingLeft: `${level * 20 + 12}px` }}
            onClick={() => selectComponent(node.id)}
          >
            <button
              className="mr-2 flex-shrink-0"
              onClick={(e) => {
                e.stopPropagation();
                if (hasChildren) {
                  toggleNode(node.id);
                }
              }}
            >
              {hasChildren ? (
                isExpanded ? (
                  <ChevronDown className={`h-4 w-4 ${isSelected ? "text-white" : "text-gray-600"}`} />
                ) : (
                  <ChevronRight className={`h-4 w-4 ${isSelected ? "text-white" : "text-gray-600"}`} />
                )
              ) : (
                <ChevronRight className={`h-4 w-4 ${isSelected ? "text-white" : "text-gray-400"}`} />
              )}
            </button>
            <span className={`text-sm ${isSelected ? "text-white" : "text-gray-700"}`}>
              {node.code}. {node.name}
            </span>
          </div>
          {hasChildren && isExpanded && (
            <div>{renderComponentTree(node.children!, level + 1)}</div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="h-full p-6 bg-[#fafafa]">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">Spares Inventory</h1>
        
        {/* Navigation Tabs with Buttons */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-l">Inventory</button>
            <button className="px-4 py-2 bg-gray-200 text-gray-600 rounded-r">History</button>
          </div>
          <div className="flex gap-2">
            <Button className="bg-[#52baf3] hover:bg-[#40a8e0] text-white">+ Add Spare</Button>
            <Button className="bg-green-600 hover:bg-green-700 text-white">🔄 Bulk Update Spares</Button>
          </div>
        </div>
      </div>

      {/* Search and Filters - Single Row Layout */}
      <div className="flex gap-3 items-center mb-4">
        <Select>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Vessel" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="vessel1">Vessel 1</SelectItem>
            <SelectItem value="vessel2">Vessel 2</SelectItem>
          </SelectContent>
        </Select>

        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search parts or components.."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={criticalityFilter} onValueChange={setCriticalityFilter}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Criticality" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All</SelectItem>
            <SelectItem value="Critical">Critical</SelectItem>
            <SelectItem value="Non-Critical">Non-Critical</SelectItem>
          </SelectContent>
        </Select>

        <Select value={stockFilter} onValueChange={setStockFilter}>
          <SelectTrigger className="w-28">
            <SelectValue placeholder="Stock" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All</SelectItem>
            <SelectItem value="Minimum">Minimum</SelectItem>
            <SelectItem value="Low">Low</SelectItem>
            <SelectItem value="OK">OK</SelectItem>
          </SelectContent>
        </Select>

        <Button className="bg-green-600 hover:bg-green-700 text-white p-2">
          <FileSpreadsheet className="h-4 w-4" />
        </Button>

        <Button variant="outline" onClick={clearFilters}>
          Clear
        </Button>
      </div>

      <div className="flex gap-6 h-[calc(100vh-200px)]">
        {/* Left Panel - Component Tree */}
        <div className="w-[30%]">
          <div className="bg-white rounded-lg shadow-sm h-full flex flex-col">
            <div className="flex-1 overflow-auto">
              <div className="bg-[#52baf3] text-white px-4 py-2 font-semibold text-sm">
                COMPONENTS
              </div>
              <div>
                {renderComponentTree(componentsTree)}
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Spares Table */}
        <div className="w-[70%]">

          {/* Spares Table */}
          <div className="bg-white rounded-lg shadow-sm border">
            {/* Table Header */}
            <div className="bg-[#52baf3] text-white px-4 py-3 rounded-t-lg">
              <div className="grid grid-cols-9 gap-4 text-sm font-medium">
                <div>Part Code</div>
                <div>Part Name</div>
                <div>Component</div>
                <div>Critical</div>
                <div>ROB</div>
                <div>Min</div>
                <div>Stock</div>
                <div>Location</div>
                <div>Actions</div>
              </div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-200">
              {filteredSpares.map((spare) => {
                const stockStatus = getStockStatus(spare.rob, spare.min);
                const isCritical = spare.critical === "Critical" || spare.critical === "Yes";
                
                return (
                  <div key={spare.id} className="px-4 py-3">
                    <div className="grid grid-cols-9 gap-4 text-sm items-center">
                      <div className="text-gray-900">{spare.partCode}</div>
                      <div className="text-gray-900">{spare.partName}</div>
                      <div className="text-gray-700">{spare.component}</div>
                      <div>
                        {isCritical && (
                          <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">
                            Critical
                          </span>
                        )}
                      </div>
                      <div className="text-gray-700">{spare.rob}</div>
                      <div className="text-gray-700">{spare.min}</div>
                      <div>
                        {stockStatus === "Low" && (
                          <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">
                            Low
                          </span>
                        )}
                        {stockStatus === "OK" && (
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                            OK
                          </span>
                        )}
                      </div>
                      <div className="text-gray-700">{spare.location}</div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Clock className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Spares;