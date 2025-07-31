import React, { useState } from "react";
import { TopMenuBar } from "@/components/TopMenuBar";
import { SideMenuBar } from "@/components/SideMenuBar";

export const TechnicalModule: React.FC = () => {
  const [selectedSubModule, setSelectedSubModule] = useState("pms");
  const [selectedMenuItem, setSelectedMenuItem] = useState("dashboard");

  const handleSubModuleChange = (subModule: string) => {
    setSelectedSubModule(subModule);
    setSelectedMenuItem("dashboard"); // Reset to dashboard when changing submodule
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
          onItemSelect={setSelectedMenuItem}
        />
        
        {/* Main Content Area */}
        <div className="flex-1 p-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              {selectedSubModule.toUpperCase()} - {selectedMenuItem.replace(/-/g, ' ').toUpperCase()}
            </h2>
            <p className="text-gray-600">
              Content for {selectedSubModule} module, {selectedMenuItem} section will be displayed here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};