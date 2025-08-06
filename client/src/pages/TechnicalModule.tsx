import React, { useState } from "react";
import { TopMenuBar } from "@/components/TopMenuBar";
import { SideMenuBar } from "@/components/SideMenuBar";
import Components from "./pms/Components";
import WorkOrders from "./pms/WorkOrders";
import RunningHours from "./pms/RunningHours";
import Spares from "./spares/Spares";
import Stores from "./stores/Stores";
import ModifyPMS from "./modify-pms/ModifyPMS";

export const TechnicalModule: React.FC = () => {
  const [selectedSubModule, setSelectedSubModule] = useState("pms");
  const [selectedMenuItem, setSelectedMenuItem] = useState("dashboard");

  const handleSubModuleChange = (subModule: string) => {
    setSelectedSubModule(subModule);
    setSelectedMenuItem("dashboard"); // Reset to dashboard when changing submodule
  };

  const handleMenuItemSelect = (item: string) => {
    setSelectedMenuItem(item);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Menu Bar */}
      <TopMenuBar 
        selectedSubModule={selectedSubModule}
        onSubModuleChange={handleSubModuleChange}
      />
      
      <div className="flex">
        {/* Side Menu Bar */}
        <SideMenuBar 
          subModule={selectedSubModule}
          selectedItem={selectedMenuItem}
          onItemSelect={handleMenuItemSelect}
        />
        
        {/* Main Content Area */}
        <div className="flex-1">
          {selectedSubModule === "pms" && selectedMenuItem === "components" ? (
            <Components />
          ) : selectedSubModule === "pms" && selectedMenuItem === "work-orders" ? (
            <WorkOrders />
          ) : selectedSubModule === "pms" && selectedMenuItem === "running-hrs" ? (
            <RunningHours />
          ) : selectedSubModule === "pms" && selectedMenuItem === "spares" ? (
            <Spares />
          ) : selectedSubModule === "pms" && selectedMenuItem === "stores" ? (
            <Stores />
          ) : selectedSubModule === "pms" && selectedMenuItem === "modify-pms" ? (
            <ModifyPMS />
          ) : (
            <div className="p-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  {selectedSubModule.toUpperCase()} - {selectedMenuItem.replace(/-/g, ' ').toUpperCase()}
                </h2>
                <p className="text-gray-600">
                  Content for {selectedSubModule} module, {selectedMenuItem} section will be displayed here.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};