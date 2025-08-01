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
              <div className="p-4 border-b flex-shrink-0">
                <h3 className="text-lg font-semibold">
                  {selectedComponent.code}. {selectedComponent.name}
                </h3>
              </div>
              <div className="flex-1 overflow-auto p-4">
                <div className="space-y-2">
                  {formSections.map((section) => (
                    <Collapsible key={section.id}>
                      <CollapsibleTrigger className="w-full">
                        <Card className="cursor-pointer hover:bg-gray-100">
                          <CardHeader className="py-3">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-sm font-medium">
                                {section.id}. {section.title}
                              </CardTitle>
                              <ChevronRight className="h-4 w-4" />
                            </div>
                          </CardHeader>
                        </Card>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <Card className="mt-1">
                          <CardContent className="pt-4">
                            <p className="text-sm text-gray-500">
                              {section.title} content will be added here
                            </p>
                          </CardContent>
                        </Card>
                      </CollapsibleContent>
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