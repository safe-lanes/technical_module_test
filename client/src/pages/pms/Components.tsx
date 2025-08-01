import React, { useState } from "react";
import { Search, ChevronRight, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface ComponentNode {
  id: string;
  code: string;
  name: string;
  children?: ComponentNode[];
  isExpanded?: boolean;
}

const dummyComponents: ComponentNode[] = [
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

const ComponentInformationSection: React.FC = () => {
  const [showMoreDetails, setShowMoreDetails] = useState(false);

  // Sample component data - this would come from the selected component
  const componentData = {
    maker: "MAN Energy Solutions",
    model: "S50MC-C",
    serialNo: "D12F6748",
    drawingNo: "S50MC-C-1254",
    componentCode: "ABC-ME-001",
    eqptCategory: "Propulsion",
    location: "Engine room",
    critical: "No",
    installationDate: "Info",
    commissionedDate: "Info",
    rating: "Info",
    conditionBased: "Info",
    noOfUnits: "Info",
    eqptSystemDept: "Info",
    parentComponent: "Info",
    dimensionsSize: "Info",
    notes: "This equipment is associated with ...."
  };

  return (
    <div className="space-y-4">
      {/* Always visible first 2 rows */}
      <div className="grid grid-cols-4 gap-4">
        <div>
          <label className="text-xs font-medium text-blue-600 block mb-1">Maker</label>
          <div className="text-sm text-gray-900 p-2 bg-gray-50 rounded border">
            {componentData.maker}
          </div>
        </div>
        <div>
          <label className="text-xs font-medium text-blue-600 block mb-1">Model</label>
          <div className="text-sm text-gray-900 p-2 bg-gray-50 rounded border">
            {componentData.model}
          </div>
        </div>
        <div>
          <label className="text-xs font-medium text-blue-600 block mb-1">Serial No</label>
          <div className="text-sm text-gray-900 p-2 bg-gray-50 rounded border">
            {componentData.serialNo}
          </div>
        </div>
        <div>
          <label className="text-xs font-medium text-blue-600 block mb-1">Drawing No</label>
          <div className="text-sm text-gray-900 p-2 bg-gray-50 rounded border">
            {componentData.drawingNo}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div>
          <label className="text-xs font-medium text-blue-600 block mb-1">Component Code</label>
          <div className="text-sm text-gray-900 p-2 bg-gray-50 rounded border">
            {componentData.componentCode}
          </div>
        </div>
        <div>
          <label className="text-xs font-medium text-blue-600 block mb-1">Eqpt. Category</label>
          <div className="text-sm text-gray-900 p-2 bg-gray-50 rounded border">
            {componentData.eqptCategory}
          </div>
        </div>
        <div>
          <label className="text-xs font-medium text-blue-600 block mb-1">Location</label>
          <div className="text-sm text-gray-900 p-2 bg-gray-50 rounded border">
            {componentData.location}
          </div>
        </div>
        <div>
          <label className="text-xs font-medium text-blue-600 block mb-1">Critical</label>
          <div className="text-sm text-gray-900 p-2 bg-gray-50 rounded border">
            {componentData.critical}
          </div>
        </div>
      </div>

      {/* Expandable section toggle */}
      <button
        onClick={() => setShowMoreDetails(!showMoreDetails)}
        className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
      >
        {showMoreDetails ? (
          <>
            <ChevronDown className="h-4 w-4" />
            Show Less Details
          </>
        ) : (
          <>
            <ChevronRight className="h-4 w-4" />
            Show More Details
          </>
        )}
      </button>

      {/* Additional details - only visible when expanded */}
      {showMoreDetails && (
        <div className="space-y-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-medium text-blue-600 block mb-1">Installation Date</label>
              <div className="text-sm text-gray-900 p-2 bg-gray-50 rounded border">
                {componentData.installationDate}
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-blue-600 block mb-1">Commissioned Date</label>
              <div className="text-sm text-gray-900 p-2 bg-gray-50 rounded border">
                {componentData.commissionedDate}
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-blue-600 block mb-1">Rating</label>
              <div className="text-sm text-gray-900 p-2 bg-gray-50 rounded border">
                {componentData.rating}
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-blue-600 block mb-1">Condition Based</label>
              <div className="text-sm text-gray-900 p-2 bg-gray-50 rounded border">
                {componentData.conditionBased}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-medium text-blue-600 block mb-1">No of Units</label>
              <div className="text-sm text-gray-900 p-2 bg-gray-50 rounded border">
                {componentData.noOfUnits}
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-blue-600 block mb-1">Eqpt. System / Dept.</label>
              <div className="text-sm text-gray-900 p-2 bg-gray-50 rounded border">
                {componentData.eqptSystemDept}
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-blue-600 block mb-1">Parent Component</label>
              <div className="text-sm text-gray-900 p-2 bg-gray-50 rounded border">
                {componentData.parentComponent}
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-blue-600 block mb-1">Dimensions / Size</label>
              <div className="text-sm text-gray-900 p-2 bg-gray-50 rounded border">
                {componentData.dimensionsSize}
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-blue-600 block mb-1">Notes</label>
            <div className="text-sm text-gray-900 p-2 bg-gray-50 rounded border">
              {componentData.notes}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Components: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedComponent, setSelectedComponent] = useState<ComponentNode | null>(null);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(["6", "6.1", "6.1.1"]));

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

  const renderComponentTree = (nodes: ComponentNode[], level: number = 0) => {
    return nodes.map((node) => {
      const hasChildren = node.children && node.children.length > 0;
      const isExpanded = expandedNodes.has(node.id);
      const isSelected = selectedComponent?.id === node.id;

      return (
        <div key={node.id}>
          <div
            className={`flex items-center px-3 py-2 cursor-pointer hover:bg-gray-50 border-b border-gray-100 ${
              isSelected ? "bg-blue-50" : ""
            }`}
            style={{ paddingLeft: `${level * 20 + 12}px` }}
            onClick={() => setSelectedComponent(node)}
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
                  <ChevronDown className="h-4 w-4 text-gray-600" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-gray-600" />
                )
              ) : (
                <ChevronRight className="h-4 w-4 text-gray-400" />
              )}
            </button>
            <span className="text-sm text-gray-700">
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

  const formSections = [
    { id: "A", title: "Component Information" },
    { id: "B", title: "Running Hours & Condition Monitoring" },
    { id: "C", title: "Work Orders" },
    { id: "D", title: "Maintenance History" },
    { id: "E", title: "Spares" },
    { id: "F", title: "Drawings & Manuals" },
    { id: "G", title: "Classification & Regulatory Data" },
    { id: "H", title: "Requisitions" }
  ];

  return (
    <div className="h-full p-6 bg-[#fafafa]">
      {/* Header with SubModule Title */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold text-gray-800">Components</h1>
          <Button className="bg-[#52baf3] hover:bg-[#40a8e0] text-white">
            + Add Edit Component
          </Button>
        </div>
        
        {/* Filters Row */}
        <div className="flex gap-4 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-600">Vessel:</span>
            <Select defaultValue="all">
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Select vessel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Vessels</SelectItem>
                <SelectItem value="vessel1">Vessel 1</SelectItem>
                <SelectItem value="vessel2">Vessel 2</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-600">Critical Item:</span>
            <Select defaultValue="all">
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="All Items" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Items</SelectItem>
                <SelectItem value="critical">Critical Only</SelectItem>
                <SelectItem value="non-critical">Non-Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center gap-2 flex-1">
            <Input
              placeholder="Search Components..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
          </div>
        </div>
      </div>
      {/* Main Content Area */}
      <div className="flex gap-6 h-[calc(100vh-200px)]">
        {/* Left Panel - Component Tree (30%) */}
        <div className="w-[30%]">
          <div className="bg-white rounded-lg shadow-sm h-full flex flex-col">
            <div className="flex-1 overflow-auto">
              <div className="bg-[#52baf3] text-white px-4 py-2 font-semibold text-sm">
                COMPONENTS
              </div>
              <div>
                {renderComponentTree(dummyComponents)}
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Component Details Form (70%) */}
        <div className="w-[70%]">
          {selectedComponent ? (
            <div className="bg-white rounded-lg shadow-sm h-full flex flex-col">
              <div className="p-4 border-b-2 border-[#52baf3] flex-shrink-0">
                <h3 className="text-lg font-semibold text-[#15569e]">
                  {selectedComponent.code}. {selectedComponent.name}
                </h3>
              </div>
              <div className="flex-1 overflow-auto p-4">
                <div className="space-y-2">
                  {formSections.map((section) => (
                    <Collapsible key={section.id}>
                      <Card className="rounded-sm border border-gray-200">
                        <CollapsibleTrigger className="w-full">
                          <CardHeader className="py-3 cursor-pointer hover:bg-gray-50">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-sm font-medium text-[#16569e]">
                                {section.id}. {section.title}
                              </CardTitle>
                              <ChevronRight className="h-4 w-4" />
                            </div>
                          </CardHeader>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <CardContent className="pt-4 border-t border-gray-100">
                            {section.id === "A" ? (
                              <ComponentInformationSection />
                            ) : (
                              <p className="text-sm text-gray-500">
                                {section.title} content will be added here
                              </p>
                            )}
                          </CardContent>
                        </CollapsibleContent>
                      </Card>
                    </Collapsible>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm h-full flex items-center justify-center">
              <p className="text-gray-500">Select a component to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Components;