import React from "react";
import { cn } from "@/lib/utils";
import { useLocation } from "wouter";
import { LayoutDashboard, Package, ClipboardList, Clock, Archive, Store, FileText, Settings2, Settings, AlertTriangle, CheckCircle, Users, Shield, } from "lucide-react";
var menuConfigs = {
    pms: [
        { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
        { id: "components", label: "Components", icon: Package },
        { id: "work-orders", label: "Work Orders", icon: ClipboardList },
        { id: "running-hrs", label: "Running Hrs", icon: Clock },
        { id: "spares", label: "Spares", icon: Archive },
        { id: "stores", label: "Stores", icon: Store },
        { id: "reports", label: "Reports", icon: FileText },
        { id: "modify-pms", label: "Modify PMS", icon: Settings2 },
        { id: "admin", label: "Admin", icon: Settings },
    ],
    dashboard: [
        { id: "overview", label: "Overview", icon: LayoutDashboard },
        { id: "analytics", label: "Analytics", icon: FileText },
        { id: "reports", label: "Reports", icon: FileText },
    ],
    "cert-surveys": [
        { id: "certificates", label: "Certificates", icon: FileText },
        { id: "surveys", label: "Surveys", icon: ClipboardList },
        { id: "due-dates", label: "Due Dates", icon: Clock },
    ],
    defects: [
        { id: "active", label: "Active", icon: AlertTriangle },
        { id: "resolved", label: "Resolved", icon: CheckCircle },
        { id: "reports", label: "Reports", icon: FileText },
    ],
    admin: [
        { id: "alerts", label: "Alerts", icon: AlertTriangle },
        { id: "users", label: "Users", icon: Users },
        { id: "permissions", label: "Permissions", icon: Shield },
    ],
};
export var SideMenuBar = function (_a) {
    var _b = _a.selectedItem, selectedItem = _b === void 0 ? "dashboard" : _b, onItemSelect = _a.onItemSelect, subModule = _a.subModule;
    var _c = useLocation(), setLocation = _c[1];
    var menuItems = menuConfigs[subModule] || menuConfigs.pms;
    var handleItemClick = function (itemId) {
        // Use navigation for routing
        if (subModule === "pms") {
            if (itemId === "spares") {
                setLocation("/spares");
            }
            else if (itemId === "stores") {
                setLocation("/stores");
            }
            else {
                setLocation("/pms/".concat(itemId));
            }
        }
        else if (subModule === "admin") {
            setLocation("/admin/".concat(itemId));
        }
        // Still call the callback for state management if provided
        onItemSelect === null || onItemSelect === void 0 ? void 0 : onItemSelect(itemId);
    };
    return (<div className="w-20 min-h-screen flex flex-col items-center py-4 bg-[#16569e]">
      {menuItems.map(function (item) {
            var Icon = item.icon;
            var isSelected = item.id === selectedItem;
            return (<button key={item.id} onClick={function () { return handleItemClick(item.id); }} className={cn("w-full h-14 mb-4 flex flex-col items-center justify-center transition-all duration-200", isSelected ? "bg-[#52baf3]" : "hover:bg-[#1d4ed8]", "group relative")}>
            <Icon className={cn("h-6 w-6 mb-1", isSelected ? "text-white" : "text-blue-100")}/>
            <span className="text-[10px] text-white text-center leading-tight">
              {item.label}
            </span>
            
            {/* Tooltip on hover */}
            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
              {item.label}
            </div>
          </button>);
        })}
    </div>);
};
//# sourceMappingURL=SideMenuBar.jsx.map