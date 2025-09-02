import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Grid3X3, BarChart3 } from "lucide-react";
export function ModuleNavigator(_a) {
    var currentModule = _a.currentModule, onModuleChange = _a.onModuleChange;
    var _b = useState(false), showModuleDialog = _b[0], setShowModuleDialog = _b[1];
    var modules = [
        {
            id: "technical-pms",
            name: "Technical (PMS)",
            icon: <BarChart3 className="h-5 w-5"/>,
            description: "Planned Maintenance System",
            available: true
        },
        {
            id: "crewing",
            name: "Crewing",
            icon: <BarChart3 className="h-5 w-5"/>,
            description: "Crew management and appraisals",
            available: false
        }
    ];
    var handleModuleSelect = function (moduleId) {
        onModuleChange(moduleId);
        setShowModuleDialog(false);
    };
    return (<>
      <div className="flex flex-col items-center justify-center cursor-pointer" onClick={function () { return setShowModuleDialog(true); }}>
        <div className="w-6 h-6 mb-1">
          <Grid3X3 className="h-6 w-6 text-[#4f5863]"/>
        </div>
        <div className="text-[#4f5863] text-[10px] font-normal font-['Mulish',Helvetica]">
          Modules
        </div>
      </div>

      <Dialog open={showModuleDialog} onOpenChange={setShowModuleDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Select Module</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            {modules.map(function (module) { return (<Button key={module.id} variant={currentModule === module.id ? "default" : "ghost"} className="w-full justify-start h-auto p-4" onClick={function () { return handleModuleSelect(module.id); }} disabled={!module.available}>
                <div className="flex items-center gap-3">
                  {module.icon}
                  <div className="text-left">
                    <div className="font-medium">{module.name}</div>
                    {module.description && (<div className="text-sm text-muted-foreground">
                        {module.description}
                      </div>)}
                  </div>
                </div>
              </Button>); })}
          </div>
        </DialogContent>
      </Dialog>
    </>);
}
//# sourceMappingURL=ModuleNavigator.jsx.map