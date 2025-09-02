import { __assign } from "tslib";
import { useState } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
export function ComponentTreeSelector(_a) {
    var components = _a.components, selectedItem = _a.selectedItem, onSelect = _a.onSelect, searchQuery = _a.searchQuery, onSearchChange = _a.onSearchChange;
    var _b = useState(new Set(["6", "6.1", "6.1.1"])), expandedNodes = _b[0], setExpandedNodes = _b[1];
    var toggleNode = function (nodeId) {
        setExpandedNodes(function (prev) {
            var newSet = new Set(prev);
            if (newSet.has(nodeId)) {
                newSet.delete(nodeId);
            }
            else {
                newSet.add(nodeId);
            }
            return newSet;
        });
    };
    var filterComponents = function (nodes, query) {
        if (!query)
            return nodes;
        var lowerQuery = query.toLowerCase();
        return nodes.reduce(function (acc, node) {
            var matches = node.name.toLowerCase().includes(lowerQuery) ||
                node.code.toLowerCase().includes(lowerQuery);
            var filteredChildren = node.children ? filterComponents(node.children, query) : [];
            if (matches || filteredChildren.length > 0) {
                acc.push(__assign(__assign({}, node), { children: filteredChildren }));
            }
            return acc;
        }, []);
    };
    var renderComponentTree = function (nodes, level) {
        if (level === void 0) { level = 0; }
        return nodes.map(function (node) {
            var hasChildren = node.children && node.children.length > 0;
            var isExpanded = expandedNodes.has(node.id);
            var isSelected = (selectedItem === null || selectedItem === void 0 ? void 0 : selectedItem.id) === node.id;
            return (<div key={node.id}>
          <div className={"flex items-center px-3 py-2 cursor-pointer hover:bg-gray-50 border-b border-gray-100 ".concat(isSelected ? "bg-blue-50" : "")} style={{ paddingLeft: "".concat(level * 20 + 12, "px") }} onClick={function () { return onSelect(node); }}>
            <button className="mr-2 flex-shrink-0" onClick={function (e) {
                    e.stopPropagation();
                    if (hasChildren) {
                        toggleNode(node.id);
                    }
                }}>
              {hasChildren ? (isExpanded ? (<ChevronDown className="h-4 w-4 text-gray-600"/>) : (<ChevronRight className="h-4 w-4 text-gray-600"/>)) : (<span className="w-4 h-4 inline-block"/>)}
            </button>
            <span className="text-sm text-gray-700">
              {node.code} {node.name}
            </span>
          </div>
          {hasChildren && isExpanded && (<div>{renderComponentTree(node.children, level + 1)}</div>)}
        </div>);
        });
    };
    var filteredComponents = filterComponents(components, searchQuery);
    return (<div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4"/>
          <Input type="text" placeholder="Search components..." value={searchQuery} onChange={function (e) { return onSearchChange(e.target.value); }} className="pl-10"/>
        </div>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="pb-4">
          {filteredComponents.length > 0 ? (renderComponentTree(filteredComponents)) : (<div className="text-center text-gray-500 py-8">
              No components found
            </div>)}
        </div>
      </ScrollArea>
    </div>);
}
//# sourceMappingURL=ComponentTreeSelector.jsx.map